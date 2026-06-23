const express = require("express");
const router = express.Router();
const { getReport, getAllReports } = require("../controllers/report.controller");
const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, authorize("admin", "proctor"), getAllReports);
router.get("/:sessionId", protect, getReport);

module.exports = router;
