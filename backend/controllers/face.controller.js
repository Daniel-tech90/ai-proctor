const sharp = require("sharp");
const User = require("../models/User");

// Extract 128-value descriptor from base64 image using sharp
async function extractDescriptor(base64Image) {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const imgBuffer = Buffer.from(base64Data, "base64");

  // Resize to 64x64 grayscale, get raw pixels
  const { data } = await sharp(imgBuffer)
    .resize(64, 64)
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Sample 128 evenly spaced pixel values, normalize 0-1
  const descriptor = [];
  for (let i = 0; i < 128; i++) {
    const idx = Math.floor((i / 128) * data.length);
    descriptor.push(data[idx] / 255.0);
  }
  return descriptor;
}

function euclideanDistance(a, b) {
  return Math.sqrt(a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0));
}

exports.registerFace = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: "No image provided" });

    const descriptor = await extractDescriptor(image);
    await User.findByIdAndUpdate(req.user._id, { faceDescriptor: descriptor });
    res.json({ message: "Face registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyFace = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: "No image provided" });

    const user = await User.findById(req.user._id);
    if (!user.faceDescriptor?.length)
      return res.status(400).json({ message: "No face registered for this account" });

    const liveDescriptor = await extractDescriptor(image);
    const distance = euclideanDistance(liveDescriptor, user.faceDescriptor);

    if (distance > 0.35)
      return res.status(401).json({ message: "Face does not match. Please try again.", distance });

    res.json({ verified: true, distance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
