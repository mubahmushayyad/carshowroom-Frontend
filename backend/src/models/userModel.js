const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Matches the shape the frontend's Redux User module already expects
// (see src/services/userApi.js and src/utils/constants.js -> ROLES/STATUS):
//   { id, name, email, role, status, createdAt }
const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: { notEmpty: { msg: 'Name is required' } },
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: { msg: 'This email is already registered' },
      validate: { isEmail: { msg: 'Invalid email' } },
    },
    // Only used by the optional /api/auth routes. The Users CRUD screen
    // (Admin -> Users) never sends or displays this field.
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('Admin', 'Sales Manager', 'Inventory Manager', 'Customer'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active',
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    updatedAt: false, // frontend/mock db only exposes createdAt
    hooks: {
      // Generates ids like "USR-001", "USR-002", ... to match the existing
      // mock API / seed data instead of relying on Postgres identity columns.
      beforeValidate: async (user) => {
        if (user.id) return;
        const last = await User.findOne({
          order: [['createdAt', 'DESC']],
          paranoid: false,
        });
        let nextNumber = 1;
        if (last && /^USR-(\d+)$/.test(last.id)) {
          nextNumber = parseInt(last.id.split('-')[1], 10) + 1;
        } else {
          const count = await User.count();
          nextNumber = count + 1;
        }
        user.id = `USR-${String(nextNumber).padStart(3, '0')}`;
      },
    },
  }
);

module.exports = User;
