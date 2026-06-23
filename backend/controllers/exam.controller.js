const Exam = require("../models/Exam");

exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find({ isActive: true }).select("-questions.answer");
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).select("-questions.answer");
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createExam = async (req, res) => {
  try {
    const exam = await Exam.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    await Exam.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Exam deactivated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
