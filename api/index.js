import express from 'express';
import cors from 'cors';
import { initialCategories, initialMaterials, initialProjects } from '../server/src/seedData.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-memory runtime state for serverless execution
let runtimeProjects = [...initialProjects.map((p, idx) => ({
  id: idx + 1,
  ...p,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}))];

let runtimeConsultations = [
  {
    id: 1,
    name: 'Sarah Sharma',
    email: 'sarah@example.com',
    phone: '+91 91234 56789',
    preferred_date: '2026-11-12',
    preferred_time: '11:30 AM - 12:30 PM',
    project_title: 'The Malabar Emerald Modular Kitchen',
    status: 'Confirmed',
    assigned_designer: 'Ar. Vikramaditya (Principal Architect)'
  }
];

let runtimeMaterials = [...initialMaterials.map((m, idx) => ({ id: idx + 1, ...m }))];

// 1. Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@kitchencraft.com' && password === 'admin123') {
    return res.json({
      message: 'Login successful',
      token: 'vercel-admin-jwt-token',
      user: { id: 1, email, full_name: 'Principal Architect Admin', role: 'admin', phone: '+91 98765 43210' }
    });
  }
  return res.json({
    message: 'Login successful',
    token: 'vercel-user-jwt-token',
    user: { id: 2, email: email || 'sarah@example.com', full_name: 'Sarah Sharma (Homeowner)', role: 'user', phone: '+91 91234 56789' }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, full_name, phone } = req.body;
  const newUser = { id: Date.now(), email, full_name: full_name || 'Homeowner', phone: phone || '', role: 'user' };
  return res.status(201).json({
    message: 'Registration successful',
    token: 'vercel-new-user-token',
    user: newUser
  });
});

// 2. Categories
app.get('/api/materials/categories', (req, res) => {
  const categoriesWithCount = initialCategories.map(cat => ({
    ...cat,
    itemCount: runtimeMaterials.filter(m => m.category_id === cat.id).length
  }));
  res.json({ categories: categoriesWithCount });
});

// 3. Materials
app.get('/api/materials', (req, res) => {
  const { category, search, quality, sort } = req.query;
  let items = [...runtimeMaterials];
  if (category && category !== 'all') items = items.filter(m => m.category_id === category);
  if (quality && quality !== 'all') items = items.filter(m => m.quality_grade === quality);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.brand.toLowerCase().includes(q) ||
      (m.description || '').toLowerCase().includes(q)
    );
  }
  if (sort === 'price_asc') items.sort((a, b) => a.price_inr - b.price_inr);
  else if (sort === 'price_desc') items.sort((a, b) => b.price_inr - a.price_inr);
  else if (sort === 'name_asc') items.sort((a, b) => a.name.localeCompare(b.name));

  res.json({ materials: items, total: items.length });
});

app.get('/api/materials/:id', (req, res) => {
  const item = runtimeMaterials.find(m => m.id === Number(req.params.id) || m.name === req.params.id);
  if (!item) return res.status(404).json({ error: 'Material not found' });
  res.json({ material: item });
});

// 4. Projects
app.get('/api/projects', (req, res) => {
  res.json({ projects: runtimeProjects });
});

app.get('/api/projects/:id', (req, res) => {
  const proj = runtimeProjects.find(p => p.id === Number(req.params.id) || p.share_token === req.params.id);
  if (!proj) return res.status(404).json({ error: 'Project not found' });
  res.json({ project: proj });
});

app.post('/api/projects', (req, res) => {
  const { title, layout_type, dimensions, selections, estimated_cost_inr } = req.body;
  const newProj = {
    id: Date.now(),
    title: title || 'My Dream Modular Kitchen',
    layout_type: layout_type || 'L-Shaped',
    dimensions_json: JSON.stringify(dimensions || {}),
    selections_json: JSON.stringify(selections || {}),
    estimated_cost_inr: estimated_cost_inr || 485000,
    status: 'Ready',
    share_token: 'kc-' + Math.random().toString(36).substring(2, 9),
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  runtimeProjects.unshift(newProj);
  res.status(201).json({ message: 'Project saved', project: newProj });
});

// 5. AI Transform
app.post('/api/ai/transform', (req, res) => {
  const { designStyle, dimensions, cabinetColor } = req.body;
  const styleConcepts = {
    'Modern Minimalist': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85',
    'Luxury European': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    'Scandinavian': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    'Contemporary': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
    'Traditional Indian': 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=85',
    'Industrial': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=85',
    'Rustic': 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1200&q=85',
    'Modern Luxury': 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85'
  };

  res.json({
    success: true,
    data: {
      transformedImage: styleConcepts[designStyle] || styleConcepts['Modern Minimalist'],
      designStyle: designStyle || 'Modern Minimalist',
      aiAnalysis: {
        detectedRoomLayout: dimensions?.layout || 'L-Shaped Kitchen Layout',
        estimatedFloorArea: `${dimensions?.length || 12} x ${dimensions?.width || 10} ft (${((dimensions?.length || 12) * (dimensions?.width || 10))} sq.ft)`,
        structuralPreservation: [
          'Window aperture and plumb lines locked in position',
          'Primary plumbing drainage point preserved beneath sink zone',
          'Exhaust ducting aligned with high-power 1500 m3/h auto-clean chimney location',
          'Golden work triangle optimized to 5.2 feet ergonomic radius'
        ],
        aestheticNotes: 'Sleek handleless J-pull cabinets, concealed LED task lighting, ultra-clean quartz counters and minimalist symmetry.'
      }
    }
  });
});

// 6. Consultations
app.get('/api/consultations', (req, res) => {
  res.json({ consultations: runtimeConsultations });
});

app.post('/api/consultations', (req, res) => {
  const newC = {
    id: Date.now(),
    ...req.body,
    status: 'Confirmed',
    assigned_designer: 'Ar. Vikramaditya (Principal Architect)',
    created_at: new Date().toISOString()
  };
  runtimeConsultations.unshift(newC);
  res.status(201).json({ message: 'Consultation confirmed', consultation: newC });
});

// 7. Admin Stats
app.get('/api/admin/stats', (req, res) => {
  res.json({
    metrics: {
      totalUsers: 3,
      totalProjects: runtimeProjects.length,
      totalConsultations: runtimeConsultations.length,
      totalMaterials: runtimeMaterials.length,
      totalRevenuePipelineINR: 4850000
    },
    layoutsPopularity: [
      { layout_type: 'L-Shaped', count: 20 },
      { layout_type: 'Island', count: 11 },
      { layout_type: 'Parallel', count: 6 }
    ],
    recentConsultations: runtimeConsultations
  });
});

export default app;
