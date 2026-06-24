const express = require("express");
const router = express.Router();
const { sendMessage, getMessages, markRead } = require("../controllers/message.controller");
const { protect, authorize } = require("../middleware/auth");

router.post("/", protect, sendMessage);
router.get("/", protect, authorize("admin", "proctor"), getMessages);
router.patch("/:id/read", protect, authorize("admin", "proctor"), markRead);

module.exports = router;
