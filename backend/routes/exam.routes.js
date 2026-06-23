const express = require("express");
const router = express.Router();
const { getAllExams, getExamById, createExam, deleteExam } = require("../controllers/exam.controller");
const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, getAllExams);
router.get("/:id", protect, getExamById);
router.post("/", protect, authorize("admin", "proctor"), createExam);
router.delete("/:id", protect, authorize("admin"), deleteExam);

module.exports = router;
