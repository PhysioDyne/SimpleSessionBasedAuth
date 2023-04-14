const { DataTypes } = require("sequelize");
const sequelize = require("../data/database");
const bcrypt = require("bcrypt");
const Role = sequelize.define("role", {
  rolename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Role;
