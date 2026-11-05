import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { db, dbRun, dbGet, dbAll, initDatabase } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = join(__dirname, '..', 'uploads');
const distDir = join(__dirname, '..', '..', 'dist');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'kitchencraft-super-secret-key-2026';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(uploadsDir));

// Serve built frontend if dist exists
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `kitchen-${uniqueSuffix}.${ext}`);
  }
});
const upload = multer({ storage });

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Admin access required' });
    }
  });
};

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, full_name, phone } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Please provide email, password, and full name' });
    }

    const existing = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ error: 'Account with this email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await dbRun(
      'INSERT INTO users (email, password_hash, full_name, phone, role) VALUES (?, ?, ?, ?, ?)',
      [email, hash, full_name, phone || '', 'user']
    );

    const user = { id: result.lastID, email, full_name, phone, role: 'user' };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'User registered successfully', token, user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register account' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password' });
    }

    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: tokenPayload
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await dbGet('SELECT id, email, full_name, phone, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// ==========================================
// 2. MATERIAL CATALOGUE ROUTES
// ==========================================

app.get('/api/materials/categories', async (req, res) => {
  try {
    const categories = await dbAll('SELECT * FROM categories');
    const counts = await dbAll('SELECT category_id, COUNT(*) as count FROM materials WHERE is_active = 1 GROUP BY category_id');
    const countMap = {};
    counts.forEach(c => { countMap[c.category_id] = c.count; });

    const categoriesWithCount = categories.map(cat => ({
      ...cat,
      itemCount: countMap[cat.id] || 0
    }));

    res.json({ categories: categoriesWithCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/materials', async (req, res) => {
  try {
    const { category, search, quality, minPrice, maxPrice, sort } = req.query;
    let query = 'SELECT * FROM materials WHERE is_active = 1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category_id = ?';
      params.push(category);
    }
    if (quality && quality !== 'all') {
      query += ' AND quality_grade = ?';
      params.push(quality);
    }
    if (search) {
      query += ' AND (name LIKE ? OR brand LIKE ? OR finish LIKE ? OR description LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    if (minPrice) {
      query += ' AND price_inr >= ?';
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      query += ' AND price_inr <= ?';
      params.push(Number(maxPrice));
    }

    if (sort === 'price_asc') query += ' ORDER BY price_inr ASC';
    else if (sort === 'price_desc') query += ' ORDER BY price_inr DESC';
    else if (sort === 'name_asc') query += ' ORDER BY name ASC';
    else query += ' ORDER BY id ASC';

    const materials = await dbAll(query, params);
    res.json({ materials, total: materials.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

app.get('/api/materials/:id', async (req, res) => {
  try {
    const material = await dbGet('SELECT * FROM materials WHERE id = ?', [req.params.id]);
    if (!material) return res.status(404).json({ error: 'Material not found' });
    res.json({ material });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch material' });
  }
});

// Admin Material Management
app.post('/api/materials', requireAdmin, async (req, res) => {
  try {
    const {
      name, brand, category_id, finish, material_type, thickness,
      colors, quality_grade, durability, maintenance, warranty,
      price_inr, unit, image_url, description, texture_color
    } = req.body;

    const result = await dbRun(`
      INSERT INTO materials (
        name, brand, category_id, finish, material_type, thickness,
        colors, quality_grade, durability, maintenance, warranty,
        price_inr, unit, image_url, description, is_active, texture_color
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `, [
      name, brand, category_id, finish || '', material_type || '', thickness || '',
      colors || '', quality_grade || 'Standard', durability || '', maintenance || '', warranty || '',
      price_inr, unit || 'sq.ft', image_url || '', description || '', texture_color || '#B69A65'
    ]);

    const newMaterial = await dbGet('SELECT * FROM materials WHERE id = ?', [result.lastID]);
    res.status(201).json({ message: 'Material created successfully', material: newMaterial });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create material' });
  }
});

app.put('/api/materials/:id', requireAdmin, async (req, res) => {
  try {
    const {
      name, brand, category_id, finish, material_type, thickness,
      colors, quality_grade, durability, maintenance, warranty,
      price_inr, unit, image_url, description, is_active, texture_color
    } = req.body;

    await dbRun(`
      UPDATE materials SET
        name = ?, brand = ?, category_id = ?, finish = ?, material_type = ?, thickness = ?,
        colors = ?, quality_grade = ?, durability = ?, maintenance = ?, warranty = ?,
        price_inr = ?, unit = ?, image_url = ?, description = ?, is_active = ?, texture_color = ?
      WHERE id = ?
    `, [
      name, brand, category_id, finish, material_type, thickness,
      colors, quality_grade, durability, maintenance, warranty,
      price_inr, unit, image_url, description, is_active ?? 1, texture_color,
      req.params.id
    ]);

    const updated = await dbGet('SELECT * FROM materials WHERE id = ?', [req.params.id]);
    res.json({ message: 'Material updated successfully', material: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update material' });
  }
});

app.delete('/api/materials/:id', requireAdmin, async (req, res) => {
  try {
    await dbRun('UPDATE materials SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Material archived successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to archive material' });
  }
});

// ==========================================
// 3. KITCHEN PROJECTS & DESIGNS
// ==========================================

app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    let query = 'SELECT * FROM kitchen_projects WHERE user_id = ? ORDER BY updated_at DESC';
    let params = [req.user.id];

    if (req.user.role === 'admin' && req.query.all === 'true') {
      query = `
        SELECT p.*, u.full_name as author_name, u.email as author_email
        FROM kitchen_projects p
        LEFT JOIN users u ON p.user_id = u.id
        ORDER BY p.updated_at DESC
      `;
      params = [];
    }

    const projects = await dbAll(query, params);
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await dbGet('SELECT * FROM kitchen_projects WHERE id = ?', [req.params.id]);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

app.get('/api/projects/share/:token', async (req, res) => {
  try {
    const project = await dbGet('SELECT * FROM kitchen_projects WHERE share_token = ?', [req.params.token]);
    if (!project) return res.status(404).json({ error: 'Shared design link not found or expired' });
    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shared design' });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const {
      title, layout_type, dimensions, selections,
      uploaded_image_url, transformed_image_url, estimated_cost_inr, status
    } = req.body;

    const share_token = 'kc-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);

    const result = await dbRun(`
      INSERT INTO kitchen_projects (
        user_id, title, layout_type, dimensions_json, selections_json,
        uploaded_image_url, transformed_image_url, estimated_cost_inr, status, share_token, version
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      req.user.id,
      title || 'My Dream Modular Kitchen',
      layout_type || 'L-Shaped',
      JSON.stringify(dimensions || { length: 12, width: 10, ceilingHeight: 9.5, counterHeight: 2.8, cabinetDepth: 2 }),
      JSON.stringify(selections || {}),
      uploaded_image_url || '',
      transformed_image_url || '',
      estimated_cost_inr || 0,
      status || 'Draft',
      share_token
    ]);

    const newProject = await dbGet('SELECT * FROM kitchen_projects WHERE id = ?', [result.lastID]);
    res.status(201).json({ message: 'Kitchen project saved', project: newProject });
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ error: 'Failed to save project' });
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const existing = await dbGet('SELECT * FROM kitchen_projects WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Project not found' });
    if (existing.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to modify this project' });
    }

    const {
      title, layout_type, dimensions, selections,
      uploaded_image_url, transformed_image_url, estimated_cost_inr, status
    } = req.body;

    const newVersion = (existing.version || 1) + 1;

    await dbRun(`
      UPDATE kitchen_projects SET
        title = ?, layout_type = ?, dimensions_json = ?, selections_json = ?,
        uploaded_image_url = ?, transformed_image_url = ?, estimated_cost_inr = ?,
        status = ?, version = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      title ?? existing.title,
      layout_type ?? existing.layout_type,
      dimensions ? JSON.stringify(dimensions) : existing.dimensions_json,
      selections ? JSON.stringify(selections) : existing.selections_json,
      uploaded_image_url ?? existing.uploaded_image_url,
      transformed_image_url ?? existing.transformed_image_url,
      estimated_cost_inr ?? existing.estimated_cost_inr,
      status ?? existing.status,
      newVersion,
      req.params.id
    ]);

    const updated = await dbGet('SELECT * FROM kitchen_projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Project updated successfully', project: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const existing = await dbGet('SELECT * FROM kitchen_projects WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Project not found' });
    if (existing.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await dbRun('DELETE FROM kitchen_projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

app.post('/api/projects/:id/duplicate', authenticateToken, async (req, res) => {
  try {
    const existing = await dbGet('SELECT * FROM kitchen_projects WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Project not found' });

    const share_token = 'kc-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
    const newTitle = `${existing.title} (Copy)`;

    const result = await dbRun(`
      INSERT INTO kitchen_projects (
        user_id, title, layout_type, dimensions_json, selections_json,
        uploaded_image_url, transformed_image_url, estimated_cost_inr, status, share_token, version
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Draft', ?, 1)
    `, [
      req.user.id,
      newTitle,
      existing.layout_type,
      existing.dimensions_json,
      existing.selections_json,
      existing.uploaded_image_url,
      existing.transformed_image_url,
      existing.estimated_cost_inr,
      share_token
    ]);

    const duplicated = await dbGet('SELECT * FROM kitchen_projects WHERE id = ?', [result.lastID]);
    res.status(201).json({ message: 'Project duplicated', project: duplicated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to duplicate project' });
  }
});

// ==========================================
// 4. IMAGE UPLOAD & AI TRANSFORMATION
// ==========================================

app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl, filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ error: 'Image upload failed' });
  }
});

// AI Kitchen Transformation Engine
app.post('/api/ai/transform', async (req, res) => {
  try {
    const {
      imageUrl,
      designStyle,
      cabinetColor,
      cabinetFinish,
      countertop,
      backsplash,
      flooring,
      overheadCabinets,
      lighting,
      dimensions
    } = req.body;

    // Architectural styles curated photorealistic concepts with strict structural preservation
    const styleConcepts = {
      'Modern Minimalist': {
        transformedUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85',
        palette: ['#52634A', '#F8F5EF', '#FFFFFF', '#D9C8AE'],
        aestheticNotes: 'Sleek handleless J-pull cabinets, concealed LED task lighting, ultra-clean quartz counters and minimalist symmetry.'
      },
      'Luxury European': {
        transformedUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
        palette: ['#292929', '#B69A65', '#FFFFFF', '#E6DECE'],
        aestheticNotes: 'Polished brass Gola profiles, Calacatta Gold bookmatched stone, smoked glass display cabinets and integrated German appliances.'
      },
      'Scandinavian': {
        transformedUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
        palette: ['#D9C8AE', '#F8F5EF', '#5A3825', '#FFFFFF'],
        aestheticNotes: 'Natural warm oak veneers, soft cream matte shutters, artisan ceramic zellige tiles and airy daylight enhancement.'
      },
      'Contemporary': {
        transformedUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
        palette: ['#52634A', '#3E4B38', '#DDD7CC', '#F5F5F0'],
        aestheticNotes: 'Olive green two-tone cabinetry with fluted glass backsplash, anti-fingerprint acrylic shutters and modern waterfall island.'
      },
      'Traditional Indian': {
        transformedUrl: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=85',
        palette: ['#5A3825', '#B69A65', '#222222', '#F8F5EF'],
        aestheticNotes: 'Deep teak wood accents, heavy-duty black granite countertops, brass hardware handles and brass spice rack storage.'
      },
      'Industrial': {
        transformedUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=85',
        palette: ['#1E1E1E', '#777777', '#C29B72', '#FFFFFF'],
        aestheticNotes: 'Matte black aluminum framed fluted glass, exposed concrete-look sintered surfaces, matte black faucets and track spotlights.'
      },
      'Rustic': {
        transformedUrl: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1200&q=85',
        palette: ['#C29B72', '#D9C8AE', '#F4F2EC', '#292929'],
        aestheticNotes: 'Distressed shaker style cabinetry, apron-front farmhouse sink, butcher block elements and warm pendant lights.'
      },
      'Modern Luxury': {
        transformedUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
        palette: ['#111111', '#B69A65', '#F5F5F0', '#343330'],
        aestheticNotes: 'Deep obsidian cabinets, integrated backlit under-counter LED profiles, waterfall sintered stone island and concealed smart appliances.'
      }
    };

    const chosenStyle = styleConcepts[designStyle] || styleConcepts['Modern Minimalist'];

    // Simulated structural analysis result
    const transformationResult = {
      originalImage: imageUrl || 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1200&q=80',
      transformedImage: chosenStyle.transformedUrl,
      designStyle: designStyle || 'Modern Minimalist',
      appliedCustomizations: {
        cabinetColor: cabinetColor || '#52634A',
        cabinetFinish: cabinetFinish || 'Super Matte Acrylic',
        countertop: countertop || 'Calacatta Gold Quartz Slab',
        backsplash: backsplash || 'Handcrafted Zellige Glazed Tiles',
        flooring: flooring || 'Large Format Vitrified Porcelain',
        overheadCabinets: overheadCabinets ?? true,
        lighting: lighting || 'Warm 3000K LED Profile Lighting'
      },
      aiAnalysis: {
        detectedRoomLayout: dimensions?.layout || 'L-Shaped Kitchen Layout',
        estimatedFloorArea: `${dimensions?.length || 12} x ${dimensions?.width || 10} ft (${((dimensions?.length || 12) * (dimensions?.width || 10))} sq.ft)`,
        naturalLightCondition: 'Ample North-facing daylight window detected on right elevation',
        structuralPreservation: [
          'Window aperture and plumb lines locked in position',
          'Primary plumbing drainage point preserved beneath sink zone',
          'Exhaust ducting aligned with high-power 1500 m3/h auto-clean chimney location',
          'Work triangle (Hob - Sink - Refrigerator) optimized to 5.2 feet ergonomic radius'
        ],
        aestheticNotes: chosenStyle.aestheticNotes
      }
    };

    res.json({
      success: true,
      message: 'AI Kitchen Transformation Generated Successfully',
      data: transformationResult
    });
  } catch (error) {
    console.error('AI Transformation error:', error);
    res.status(500).json({ error: 'AI Transformation failed' });
  }
});

// ==========================================
// 5. CONSULTATIONS
// ==========================================

app.post('/api/consultations', async (req, res) => {
  try {
    const { user_id, project_id, name, email, phone, preferred_date, preferred_time, notes } = req.body;
    if (!name || !email || !phone || !preferred_date || !preferred_time) {
      return res.status(400).json({ error: 'Please provide all required consultation details' });
    }

    const result = await dbRun(`
      INSERT INTO consultations (
        user_id, project_id, name, email, phone, preferred_date, preferred_time, notes, assigned_designer, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Ar. Vikramaditya (Senior Kitchen Architect)', 'Pending')
    `, [user_id || null, project_id || null, name, email, phone, preferred_date, preferred_time, notes || '']);

    const newConsultation = await dbGet('SELECT * FROM consultations WHERE id = ?', [result.lastID]);
    res.status(201).json({ message: 'Consultation booked successfully', consultation: newConsultation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book consultation' });
  }
});

app.get('/api/consultations', authenticateToken, async (req, res) => {
  try {
    let query = 'SELECT * FROM consultations WHERE user_id = ? ORDER BY created_at DESC';
    let params = [req.user.id];

    if (req.user.role === 'admin') {
      query = `
        SELECT c.*, p.title as project_title, p.layout_type
        FROM consultations c
        LEFT JOIN kitchen_projects p ON c.project_id = p.id
        ORDER BY c.created_at DESC
      `;
      params = [];
    }

    const consultations = await dbAll(query, params);
    res.json({ consultations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch consultations' });
  }
});

app.put('/api/consultations/:id', requireAdmin, async (req, res) => {
  try {
    const { status, assigned_designer } = req.body;
    await dbRun(`
      UPDATE consultations SET
        status = COALESCE(?, status),
        assigned_designer = COALESCE(?, assigned_designer)
      WHERE id = ?
    `, [status, assigned_designer, req.params.id]);

    const updated = await dbGet('SELECT * FROM consultations WHERE id = ?', [req.params.id]);
    res.json({ message: 'Consultation updated successfully', consultation: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update consultation' });
  }
});

// ==========================================
// 6. ADMIN DASHBOARD & ANALYTICS
// ==========================================

app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const usersCount = await dbGet('SELECT COUNT(*) as count FROM users');
    const projectsCount = await dbGet('SELECT COUNT(*) as count FROM kitchen_projects');
    const consultationsCount = await dbGet('SELECT COUNT(*) as count FROM consultations');
    const materialsCount = await dbGet('SELECT COUNT(*) as count FROM materials WHERE is_active = 1');

    const layoutsPopularity = await dbAll(`
      SELECT layout_type, COUNT(*) as count
      FROM kitchen_projects
      GROUP BY layout_type
      ORDER BY count DESC
    `);

    const recentConsultations = await dbAll(`
      SELECT c.*, p.title as project_title
      FROM consultations c
      LEFT JOIN kitchen_projects p ON c.project_id = p.id
      ORDER BY c.created_at DESC LIMIT 5
    `);

    const recentUsers = await dbAll(`
      SELECT id, email, full_name, phone, role, created_at
      FROM users
      ORDER BY created_at DESC LIMIT 6
    `);

    res.json({
      metrics: {
        totalUsers: usersCount.count,
        totalProjects: projectsCount.count,
        totalConsultations: consultationsCount.count,
        totalMaterials: materialsCount.count,
        totalRevenuePipelineINR: 4850000
      },
      layoutsPopularity,
      recentConsultations,
      recentUsers
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// Catch-all SPA route
if (fs.existsSync(distDir)) {
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(join(distDir, 'index.html'));
    } else {
      next();
    }
  });
}

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(` KITCHENcraft Full-Stack Backend Server running on http://localhost:${PORT}`);
    console.log(` REST APIs & Database ready`);
    console.log(` Admin account: admin@kitchencraft.com / admin123`);
    console.log(` Demo account:  sarah@example.com / user123`);
    console.log(`======================================================\n`);
  });
}).catch(err => {
  console.error('Database initialization failed:', err);
});
