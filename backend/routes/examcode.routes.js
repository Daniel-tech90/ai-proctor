const express = require("express");
const router = express.Router();
const { createExamCode, loginWithCode, logoutCode, getAllCodes, deleteCode } = require("../controllers/examcode.controller");
const { protect, authorize } = require("../middleware/auth");

router.post("/login", loginWithCode);
router.post("/logout", logoutCode);
router.get("/", protect, authorize("admin", "proctor"), getAllCodes);
router.post("/", protect, authorize("admin"), createExamCode);
router.delete("/:id", protect, authorize("admin"), deleteCode);

module.exports = router;
