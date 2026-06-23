const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("MongoDB connected");

  const existing = await User.findOne({ email: "admin@test.com" });
  if (existing) {
    console.log("User already exists!");
    console.log("Email: admin@test.com");
    console.log("Password: 123456");
    process.exit();
  }

  await User.create({ name: "Admin User", email: "admin@test.com", password: "123456", role: "student" });
  console.log("✅ User created!");
  console.log("Email: admin@test.com");
  console.log("Password: 123456");
  process.exit();
}).catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
