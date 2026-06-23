const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
app.set("trust proxy", true);

// Middleware
app.use(cors({ origin: ["http://localhost:3000", "https://dinesh.vercel.app", "https://ai-dinesh.vercel.app"], credentials: true }));
app.use(express.json({ limit: "2mb" }));

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/exams", require("./routes/exam.routes"));
app.use("/api/sessions", require("./routes/session.routes"));
app.use("/api/reports", require("./routes/report.routes"));
app.use("/api/face", require("./routes/face.routes"));

// Health check
app.get("/api/health", (req, res) => res.json({ status: "OK", message: "AI Proctor API running" }));

// MongoDB connection + server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    // Reset all stale isLoggedIn flags on server restart
    await require("./models/User").updateMany({}, { isLoggedIn: false, faceDescriptor: null });
    console.log("Cleared stale login sessions and old face descriptors");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("DB connection error:", err));
