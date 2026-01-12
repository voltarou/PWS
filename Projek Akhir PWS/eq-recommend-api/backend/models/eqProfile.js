const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EQProfile = sequelize.define(
  "EQProfile",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    genre: { type: DataTypes.STRING, allowNull: true },
    eqValues: { type: DataTypes.JSON, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "eq_profiles",
    timestamps: false,
  }
);

module.exports = EQProfile;
