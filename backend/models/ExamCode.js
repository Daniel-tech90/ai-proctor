const mongoose = require("mongoose");

const examCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  maxUsers: { type: Number, default: 8 },
  activeLogins: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  sessions: [
    {
      sessionToken: String,
      loginAt: { type: Date, default: Date.now },
      ip: String,
      active: { type: Boolean, default: true },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("ExamCode", examCodeSchema);
