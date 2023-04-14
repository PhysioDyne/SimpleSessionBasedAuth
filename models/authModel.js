const { DataTypes } = require("sequelize");
const sequelize = require("../data/database");
const bcrypt = require("bcrypt");
const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notContains: {
        args: " ",
        msg: "Username shouldn't have space character",
      },
      len: {
        args: [3, 15],
        msg: "Your username should be in between of 3 and 15 character",
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: "Your input isn't email type",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  loginToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  loginTokenExp: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  resetToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetTokenExp: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = User;
