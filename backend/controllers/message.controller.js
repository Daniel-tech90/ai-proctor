const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const { text, examTitle } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: "Message cannot be empty" });
    const msg = await Message.create({
      student: req.user._id,
      studentName: req.user.name,
      examTitle: examTitle || "Unknown Exam",
      text: text.trim(),
    });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
