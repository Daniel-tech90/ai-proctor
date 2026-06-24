const express = require("express");
const router = express.Router();
const { startSession, logAlert, submitSession, getSessionById, getAllSessions, getMySessions } = require("../controllers/session.controller");
const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, authorize("admin", "proctor"), getAllSessions);
router.get("/my", protect, getMySessions);
router.post("/start", protect, startSession);
router.get("/:id", protect, getSessionById);
router.post("/:id/alert", protect, logAlert);
router.post("/:id/submit", protect, submitSession);

module.exports = router;
