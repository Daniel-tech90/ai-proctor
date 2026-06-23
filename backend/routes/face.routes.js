const express = require("express");
const router = express.Router();
const { registerFace, verifyFace } = require("../controllers/face.controller");
const { protect } = require("../middleware/auth");

router.post("/register", protect, registerFace);
router.post("/verify", protect, verifyFace);

module.exports = router;
