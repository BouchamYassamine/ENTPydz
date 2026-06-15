import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Material = sequelize.define('Material', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  barcode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  currentService: {
    type: DataTypes.STRING, // Service qui possède actuellement le matériel (Forage, Maintenance, etc.)
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Disponible', 'En Transfert', 'En Maintenance', 'Déclassé'),
    defaultValue: 'Disponible',
    allowNull: false
  }
});

export default Material;
