const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");
const authMiddleware = require("../middleware/authMiddleware");

// ================= CREATE LEAVE =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { subjectName, date, reason } = req.body;

    if (!subjectName || !date || !reason) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const leave = await Leave.create({
      userId: req.user.id,   // 🔥 IMPORTANT FIX
      subjectName,
      date,
      reason,
    });

    res.json(leave);
  } catch (error) {
    console.error("LEAVE ERROR:", error);
    res.status(500).json({ message: "Error creating leave" });
  }
});

// ================= GET LEAVES =================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const leaves = await Leave.find({
      userId: req.user.id,   // 🔥 USER FILTER
    });

    res.json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching leaves" });
  }
});

// ================= DELETE LEAVE =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Leave.deleteOne({
      _id: req.params.id,
      userId: req.user.id,   // 🔥 USER SAFE DELETE
    });

    res.json({ message: "Leave deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting leave" });
  }
});

module.exports = router;