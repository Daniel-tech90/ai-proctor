const express = require("express");
const router = express.Router();
const { register, login, getMe, getAllUsers, createUser, deleteUser } = require("../controllers/auth.controller");
const { protect, authorize } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/users", protect, authorize("admin"), getAllUsers);
router.post("/users", protect, authorize("admin"), createUser);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
