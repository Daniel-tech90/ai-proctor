const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [String],
  answer: { type: Number, required: true }, // index of correct option
});

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    totalMarks: { type: Number, required: true },
    questions: [questionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    scheduledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
