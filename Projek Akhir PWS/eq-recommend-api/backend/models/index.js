const sequelize = require("../config/database");
const User = require("./User");
const EQProfile = require("./EQProfile");

// relasi
User.hasMany(EQProfile, { foreignKey: "userId" });
EQProfile.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  sequelize,
  User,
  EQProfile,
};
