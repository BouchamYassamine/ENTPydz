import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.model.js';
import Material from './material.model.js';

const Transfer = sequelize.define('Transfer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sourceService: {
    type: DataTypes.STRING,
    allowNull: false
  },
  destinationService: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('En attente', 'Approuvé', 'Refusé', 'Complété'),
    defaultValue: 'En attente',
    allowNull: false
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  requestedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

// Associations
Transfer.belongsTo(Material, { foreignKey: 'materialId', as: 'material' });
Transfer.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });
Transfer.belongsTo(User, { foreignKey: 'approverId', as: 'approver' });

export default Transfer;
