const ExamCode = require("../models/ExamCode");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Admin creates exam code
exports.createExamCode = async (req, res) => {
  try {
    const { code, password, examId, maxUsers } = req.body;
    const existing = await ExamCode.findOne({ code });
    if (existing) return res.status(400).json({ message: "Code already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const examCode = await ExamCode.create({ code, password: hashed, examId, maxUsers: maxUsers || 8 });
    res.status(201).json(examCode);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Student login with exam code
exports.loginWithCode = async (req, res) => {
  try {
    const { code, password } = req.body;
    const examCode = await ExamCode.findOne({ code }).populate("examId");
    if (!examCode) return res.status(404).json({ message: "Invalid exam code" });
    if (!examCode.isActive) return res.status(403).json({ message: "This exam code is no longer active" });

    const match = await bcrypt.compare(password, examCode.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    if (examCode.activeLogins >= examCode.maxUsers)
      return res.status(403).json({ message: `Maximum ${examCode.maxUsers} users already logged in` });

    const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket?.remoteAddress || "Unknown";
    const sessionToken = jwt.sign({ codeId: examCode._id, ip }, process.env.JWT_SECRET, { expiresIn: "3h" });

    examCode.activeLogins += 1;
    examCode.sessions.push({ sessionToken, ip, active: true });
    await examCode.save();

    res.json({
      token: sessionToken,
      exam: examCode.examId,
      slot: examCode.activeLogins,
      maxUsers: examCode.maxUsers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Student logout — free up slot
exports.logoutCode = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const examCode = await ExamCode.findById(decoded.codeId);
    if (!examCode) return res.status(404).json({ message: "Not found" });

    const session = examCode.sessions.find((s) => s.sessionToken === token);
    if (session && session.active) {
      session.active = false;
      examCode.activeLogins = Math.max(0, examCode.activeLogins - 1);
      await examCode.save();
    }
    res.json({ message: "Logged out" });
  } catch {
    res.json({ message: "Logged out" });
  }
};

// Admin: get all exam codes
exports.getAllCodes = async (req, res) => {
  try {
    const codes = await ExamCode.find().populate("examId", "title subject").sort({ createdAt: -1 });
    res.json(codes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: delete exam code
exports.deleteCode = async (req, res) => {
  try {
    await ExamCode.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
