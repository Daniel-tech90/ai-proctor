const express = require("express");
const router = express.Router();
const { register, login, logout, getMe, getAllUsers } = require("../controllers/auth.controller");
const { protect, authorize } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.get("/users", protect, authorize("admin"), getAllUsers);

module.exports = router;
