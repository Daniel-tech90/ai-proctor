const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/exams", require("./routes/exam.routes"));
app.use("/api/sessions", require("./routes/session.routes"));
app.use("/api/reports", require("./routes/report.routes"));

// Health check
app.get("/api/health", (req, res) => res.json({ status: "OK", message: "AI Proctor API running" }));

// MongoDB connection + server start
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000, family: 4 })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("DB connection error:", err));
