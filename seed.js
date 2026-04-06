import { createUser } from './server/database.js';

console.log('Seeding database with PIN-based auth...');

try {
  // Create parent account
  createUser('parent', '999999', 'parent', null, 'Parent', '👨‍👩‍👧‍👦');
  console.log('✅ Parent: username=parent, PIN=999999');

  // Create Cristina's Yoto account
  createUser('cristina', '123456', 'child', 'yoto', 'Cristina', '👧');
  console.log('✅ Cristina (Yoto): username=cristina, PIN=123456');

  // Create Isabella's iPod account
  createUser('isabella', '654321', 'child', 'ipod', 'Isabella', '👩');
  console.log('✅ Isabella (iPod): username=isabella, PIN=654321');

  console.log('\n🎉 Database seeded successfully!');
} catch (error) {
  console.error('Seed error (accounts may already exist):', error.message);
}
