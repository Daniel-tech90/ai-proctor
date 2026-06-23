const ExamSession = require("../models/ExamSession");

exports.getReport = async (req, res) => {
  try {
    const session = await ExamSession.findById(req.params.sessionId)
      .populate("student", "name email")
      .populate("exam", "title subject duration totalMarks");

    if (!session) return res.status(404).json({ message: "Session not found" });

    const alertSummary = session.alerts.reduce((acc, a) => {
      acc[a.type] = (acc[a.type] || 0) + 1;
      return acc;
    }, {});

    res.json({
      student: session.student,
      exam: session.exam,
      score: session.score,
      totalQuestions: session.exam?.questions?.length,
      integrityScore: session.integrityScore,
      aiConfidenceScore: session.aiConfidenceScore,
      duration: session.endedAt
        ? Math.round((new Date(session.endedAt) - new Date(session.startedAt)) / 60000)
        : null,
      alertCount: session.alerts.length,
      alertSummary,
      alerts: session.alerts,
      status: session.status,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const sessions = await ExamSession.find({ status: "completed" })
      .populate("student", "name email")
      .populate("exam", "title subject")
      .select("-answers -alerts");
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
