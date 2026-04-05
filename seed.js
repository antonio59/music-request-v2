import { createUser } from './server/database.js';

console.log('Seeding database with PIN-based auth...');

try {
  // Create parent account
  createUser('parent', '9999', 'parent', null, 'Parent', '👨‍👩‍👧‍👦');
  console.log('✅ Parent: username=parent, PIN=9999');

  // Create Cristina's Yoto account
  createUser('cristina', '1234', 'child', 'yoto', 'Cristina', '👧');
  console.log('✅ Cristina (Yoto): username=cristina, PIN=1234');

  // Create Isabella's iPod account
  createUser('isabella', '5678', 'child', 'ipod', 'Isabella', '👩');
  console.log('✅ Isabella (iPod): username=isabella, PIN=5678');

  console.log('\n🎉 Database seeded successfully!');
} catch (error) {
  console.error('Seed error (accounts may already exist):', error.message);
}
