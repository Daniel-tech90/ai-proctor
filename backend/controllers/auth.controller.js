const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

exports.register = async (req, res) => {
  return res.status(403).json({ message: "Registration is disabled. Contact admin." });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim()
      || req.headers["x-real-ip"]
      || req.connection?.remoteAddress
      || req.socket?.remoteAddress
      || "Unknown";
    user.lastLoginAt = new Date();
    user.lastLoginIp = ip;
    user.isLoggedIn = true;
    // Clear stale face descriptors (old format had different length)
    if (user.faceDescriptor?.length && user.faceDescriptor.length !== 128) {
      user.faceDescriptor = null;
    }
    await user.save();

    res.json({ token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role, hasFace: user.faceDescriptor?.length === 128 } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isLoggedIn: false });
    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.registerFace = async (req, res) => {
  try {
    const { faceDescriptor } = req.body;
    if (!faceDescriptor || !Array.isArray(faceDescriptor))
      return res.status(400).json({ message: "No face descriptor provided" });
    await User.findByIdAndUpdate(req.user._id, { faceDescriptor });
    res.json({ message: "Face registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyFace = async (req, res) => {
  try {
    const { faceDescriptor } = req.body;
    const user = await User.findById(req.user._id);
    if (!user.faceDescriptor?.length)
      return res.status(400).json({ message: "No face registered for this account" });

    const stored = new Float32Array(user.faceDescriptor);
    const incoming = new Float32Array(faceDescriptor);
    let sum = 0;
    for (let i = 0; i < stored.length; i++) sum += (stored[i] - incoming[i]) ** 2;
    const distance = Math.sqrt(sum);

    if (distance > 0.5)
      return res.status(401).json({ message: "Face verification failed. Please try again.", distance });

    res.json({ message: "Face verified", distance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already registered" });
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -faceDescriptor").sort({ lastLoginAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};
