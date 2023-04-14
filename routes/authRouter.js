const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/register", authController.get_register);
router.post("/register", authController.post_register);
router.get("/login", authController.get_login);
router.post("/login", authController.post_login);
router.get("/confirm", authController.login_validation);
router.get("/reset-password", authController.get_reset_password);
router.post("/reset-password", authController.post_reset_password);
router.get("/new-password/:token", authController.get_new_password);
router.post("/new-password/:token", authController.post_new_password);
router.get("/logout", authController.get_logout);

module.exports = router;
