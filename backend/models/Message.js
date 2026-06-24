const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentName: String,
    examTitle: String,
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
