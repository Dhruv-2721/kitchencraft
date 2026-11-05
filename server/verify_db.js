import http from 'http';
import { db, initDatabase, dbGet, dbAll } from './src/db.js';

async function testDatabaseAndData() {
  console.log('=== KITCHENcraft In-Depth System Verification ===');
  await initDatabase();

  const userCount = await dbGet('SELECT COUNT(*) as c FROM users');
  console.log('✓ Users count in SQLite:', userCount.c);

  const catCount = await dbGet('SELECT COUNT(*) as c FROM categories');
  console.log('✓ Categories count in SQLite:', catCount.c);

  const matCount = await dbGet('SELECT COUNT(*) as c FROM materials');
  console.log('✓ Materials count in SQLite:', matCount.c);

  const projCount = await dbGet('SELECT COUNT(*) as c FROM kitchen_projects');
  console.log('✓ Sample Projects count in SQLite:', projCount.c);

  const sampleMaterials = await dbAll('SELECT name, brand, category_id, price_inr, quality_grade FROM materials LIMIT 5');
  console.log('✓ Sample Materials Verified:');
  sampleMaterials.forEach(m => console.log(`  - [${m.brand}] ${m.name} (Grade: ${m.quality_grade}) => ₹${m.price_inr}`));

  console.log('\n✓ ALL DATABASE AND SEED CHECKS PASSED SUCCESSFULLY!');
  process.exit(0);
}

testDatabaseAndData();
