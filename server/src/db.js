import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';
import { initialCategories, initialMaterials, initialProjects } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '..', 'kitchencraft.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite kitchencraft.db');
  }
});

// Promisified helper queries
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export async function initDatabase() {
  db.serialize(async () => {
    // 1. Users table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        phone TEXT,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Categories table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT
      )
    `);

    // 3. Materials table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        category_id TEXT NOT NULL,
        finish TEXT,
        material_type TEXT,
        thickness TEXT,
        colors TEXT,
        quality_grade TEXT DEFAULT 'Standard',
        durability TEXT,
        maintenance TEXT,
        warranty TEXT,
        price_inr REAL NOT NULL,
        unit TEXT DEFAULT 'sq.ft',
        image_url TEXT,
        description TEXT,
        is_active INTEGER DEFAULT 1,
        texture_color TEXT,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      )
    `);

    // 4. Kitchen Projects table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS kitchen_projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT NOT NULL,
        layout_type TEXT DEFAULT 'L-Shaped',
        dimensions_json TEXT,
        selections_json TEXT,
        uploaded_image_url TEXT,
        transformed_image_url TEXT,
        estimated_cost_inr REAL DEFAULT 0,
        status TEXT DEFAULT 'Draft',
        share_token TEXT UNIQUE,
        version INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // 5. Consultations table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS consultations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        project_id INTEGER,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        preferred_date TEXT NOT NULL,
        preferred_time TEXT NOT NULL,
        notes TEXT,
        assigned_designer TEXT DEFAULT 'Senior Design Architect',
        status TEXT DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (project_id) REFERENCES kitchen_projects (id)
      )
    `);

    // Check and seed users
    const adminCheck = await dbGet('SELECT * FROM users WHERE email = ?', ['admin@kitchencraft.com']);
    if (!adminCheck) {
      const adminHash = await bcrypt.hash('admin123', 10);
      await dbRun(
        'INSERT INTO users (email, password_hash, full_name, phone, role) VALUES (?, ?, ?, ?, ?)',
        ['admin@kitchencraft.com', adminHash, 'KITCHENcraft Principal Architect', '+91 98765 43210', 'admin']
      );
      console.log('Admin user seeded: admin@kitchencraft.com / admin123');
    }

    const userCheck = await dbGet('SELECT * FROM users WHERE email = ?', ['sarah@example.com']);
    if (!userCheck) {
      const userHash = await bcrypt.hash('user123', 10);
      await dbRun(
        'INSERT INTO users (email, password_hash, full_name, phone, role) VALUES (?, ?, ?, ?, ?)',
        ['sarah@example.com', userHash, 'Sarah Sharma', '+91 91234 56789', 'user']
      );
      console.log('Demo user seeded: sarah@example.com / user123');
    }

    // Check and seed categories
    const catCount = await dbGet('SELECT COUNT(*) as count FROM categories');
    if (catCount.count === 0) {
      for (const cat of initialCategories) {
        await dbRun('INSERT INTO categories (id, slug, name, description) VALUES (?, ?, ?, ?)', [
          cat.id,
          cat.slug,
          cat.name,
          cat.description
        ]);
      }
      console.log('Categories seeded.');
    }

    // Check and seed materials (and sync any newly added materials)
    for (const mat of initialMaterials) {
      const existing = await dbGet('SELECT id FROM materials WHERE name = ?', [mat.name]);
      if (!existing) {
        await dbRun(`
          INSERT INTO materials (
            name, brand, category_id, finish, material_type, thickness,
            colors, quality_grade, durability, maintenance, warranty,
            price_inr, unit, image_url, description, is_active, texture_color
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        `, [
          mat.name, mat.brand, mat.category_id, mat.finish, mat.material_type, mat.thickness,
          mat.colors, mat.quality_grade, mat.durability, mat.maintenance, mat.warranty,
          mat.price_inr, mat.unit, mat.image_url, mat.description, mat.texture_color
        ]);
      }
    }
    console.log(`Verified & synced materials in database (${initialMaterials.length} total).`);

    // Check and seed sample projects
    const projCount = await dbGet('SELECT COUNT(*) as count FROM kitchen_projects');
    if (projCount.count === 0) {
      const demoUser = await dbGet('SELECT id FROM users WHERE email = ?', ['sarah@example.com']);
      const userId = demoUser ? demoUser.id : 1;
      for (const p of initialProjects) {
        await dbRun(`
          INSERT INTO kitchen_projects (
            user_id, title, layout_type, dimensions_json, selections_json,
            estimated_cost_inr, status, share_token
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          userId, p.title, p.layout_type, p.dimensions_json, p.selections_json,
          p.estimated_cost_inr, p.status, p.share_token
        ]);
      }
      console.log('Sample projects seeded.');
    }
  });
}
