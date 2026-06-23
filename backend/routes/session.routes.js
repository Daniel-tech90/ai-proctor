const express = require("express");
const router = express.Router();
const { startSession, logAlert, submitSession, getSessionById } = require("../controllers/session.controller");
const { protect } = require("../middleware/auth");

router.post("/start", protect, startSession);
router.get("/:id", protect, getSessionById);
router.post("/:id/alert", protect, logAlert);
router.post("/:id/submit", protect, submitSession);

module.exports = router;
