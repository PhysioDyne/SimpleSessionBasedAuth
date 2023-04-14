const { Sequelize } = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize("authentication", "root", "sb552003", {
  host: process.env.host,
  dialect: "mysql",
  define: {
    timestamps: false,
  },
  storage: "./session.mysql",
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
