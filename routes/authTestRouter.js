const express = require("express");
const router = express.Router();
const Middlewares = require("../middlewares/middlewares");
router.get("/", (req, res) => {
  return res.send({
    title: "User",
  });
});
router.get("/user", Middlewares.authProtection, (req, res) => {
  return res.send({
    title: "User",
  });
});
router.get("/admin", Middlewares.adminProtection, (req, res) => {
  return res.send({
    title: "Admin",
  });
});
module.exports = router;
