//Main Modules
const express = require("express");
const app = express();
require("dotenv").config();
//Auth Modules
const session = require("express-session");
const sequelize = require("./data/database");
const cookieParser = require("cookie-parser");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
//Database Models
const User = require("./models/authModel");
const Role = require("./models/roleModel");
//Routers
const authRouter = require("./routes/authRouter");
const testRouter = require("./routes/authTestRouter");
//Middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "Hello World",
    store: new SequelizeStore({
      db: sequelize,
    }),
    saveUninitialized: false,
    checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
    expiration: 2 * 60 * 60 * 1000, // The maximum age (in milliseconds) of a valid session.
    resave: false, // we support the touch method so per the express-session docs this should be set to false
  })
);

//Database Synchronizations & Relations
Role.hasMany(User);
User.belongsTo(Role);
(async (req, res) => {
  await sequelize.sync({ force: true });
  await Role.bulkCreate([{ rolename: "Admin" }, { rolename: "User" }]);
})();
//routes
app.use("/account", authRouter);
app.use(testRouter);
app.use("*", (req, res) => {
  return res.status(404).send({ message: "Page could not found :(" });
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Something went wrong :/" });
  next();
});

app.listen(process.env.port, (req, res) => {
  console.log(`Server listening on http://localhost:${process.env.port}`);
});
