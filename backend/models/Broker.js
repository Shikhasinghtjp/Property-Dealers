import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Broker = sequelize.define('Broker', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true,
    validate: {
      len: [10, 15],
      isNumeric: true,
    },
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  Status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Contacted', 'NotContacted', 'Unreachable'),
    allowNull: false,
    defaultValue: 'NotContacted',
  },
  Followup: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null, 
  },
}, {
  tableName: 'Broker',
  timestamps: false,
});

export default Broker;