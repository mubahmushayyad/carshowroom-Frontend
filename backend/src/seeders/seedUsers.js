const bcrypt = require('bcrypt');
const { User } = require('../models');

// Mirrors server/db.json + src/utils/constants.js DEMO_USERS on the frontend,
// so the real backend starts with the same accounts the mock API had.
const demoUsers = [
  { id: 'USR-001', name: 'System Admin', email: 'admin@udevs.com', role: 'Admin', status: 'Active', password: 'Admin@123' },
  { id: 'USR-002', name: 'Sales Manager', email: 'sales@udevs.com', role: 'Sales Manager', status: 'Active', password: 'Sales@123' },
  { id: 'USR-003', name: 'Inventory Manager', email: 'inventory@udevs.com', role: 'Inventory Manager', status: 'Active', password: 'Inventory@123' },
  { id: 'USR-004', name: 'Demo Customer', email: 'customer@udevs.com', role: 'Customer', status: 'Active', password: 'Customer@123' },
];

async function seedUsers() {
  for (const u of demoUsers) {
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      password: hashed,
    });
  }
}

// Allow running directly: npm run seed
if (require.main === module) {
  require('dotenv').config();
  const { sequelize } = require('../models');
  (async () => {
    await sequelize.authenticate();
    await sequelize.sync();
    const count = await User.count();
    if (count > 0) {
      console.log('Users table is not empty - skipping seed.');
      process.exit(0);
    }
    await seedUsers();
    console.log('Seeded demo users.');
    process.exit(0);
  })().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = seedUsers;
