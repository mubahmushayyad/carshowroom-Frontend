require('dotenv').config();
const app = require('./app');
const { sequelize, User } = require('./models');
const seedUsers = require('./seeders/seedUsers');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected');

    // sync() is fine for this assignment; use real migrations in production.
    await sequelize.sync();
    console.log('Models synced');

    const count = await User.count();
    if (count === 0) {
      await seedUsers();
      console.log('Seeded demo users');
    }

    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Startup failed:', error);
    process.exit(1);
  }
})();
