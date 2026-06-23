const ExamSession = require("../models/ExamSession");

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await ExamSession.find({ status: "completed" })
      .populate("student", "name email")
      .populate("exam", "title subject")
      .sort({ endedAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await ExamSession.find({ status: "completed" })
      .populate("student", "name email")
      .populate("exam", "title subject")
      .sort({ endedAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.startSession = async (req, res) => {
  try {
    const existing = await ExamSession.findOne({ student: req.user._id, exam: req.body.examId, status: "active" });
    if (existing) return res.json(existing);

    const session = await ExamSession.create({ student: req.user._id, exam: req.body.examId });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logAlert = async (req, res) => {
  try {
    const session = await ExamSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    session.alerts.push(req.body);
    // Deduct integrity score per alert severity
    const deduct = { low: 2, medium: 5, high: 10 };
    session.integrityScore = Math.max(0, session.integrityScore - (deduct[req.body.severity] || 5));
    await session.save();

    res.json({ integrityScore: session.integrityScore, alerts: session.alerts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitSession = async (req, res) => {
  try {
    const session = await ExamSession.findById(req.params.id).populate("exam");
    if (!session) return res.status(404).json({ message: "Session not found" });

    session.answers = req.body.answers;
    session.endedAt = new Date();
    session.status = "completed";
    session.tabSwitches = req.body.tabSwitches || 0;
    session.fullscreenExits = req.body.fullscreenExits || 0;

    // Auto-grade
    let score = 0;
    req.body.answers.forEach(({ questionIndex, selectedOption }) => {
      if (session.exam.questions[questionIndex]?.answer === selectedOption) score++;
    });
    session.score = score;
    await session.save();

    res.json({ score, total: session.exam.questions.length, integrityScore: session.integrityScore });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await ExamSession.findById(req.params.id).populate("student", "name email").populate("exam", "title subject");
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
