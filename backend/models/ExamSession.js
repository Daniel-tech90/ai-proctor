const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  type: { type: String, enum: ["face", "eye", "object", "audio", "browser", "multiple_person"] },
  message: String,
  severity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  timestamp: { type: Date, default: Date.now },
  snapshot: String, // base64 or URL
});

const sessionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: Date,
    status: { type: String, enum: ["active", "completed", "terminated"], default: "active" },
    answers: [{ questionIndex: Number, selectedOption: Number }],
    alerts: [alertSchema],
    aiConfidenceScore: { type: Number, default: 100 },
    integrityScore: { type: Number, default: 100 },
    score: Number,
    tabSwitches: { type: Number, default: 0 },
    fullscreenExits: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExamSession", sessionSchema);
