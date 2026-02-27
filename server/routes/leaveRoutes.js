const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");
const Subject = require("../models/Subject"); // 🔥 Needed for maxLeaves
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

    // 🔥 Find subject for this user
    const subject = await Subject.findOne({
      name: subjectName,
      userId: req.user.id,
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    // 🔥 Count existing leaves for this subject (USER SAFE)
    const leavesCount = await Leave.countDocuments({
      subjectName,
      userId: req.user.id,
    });

    // 🔥 BLOCK if limit reached
    if (leavesCount >= subject.maxLeaves) {
      return res.status(400).json({
        message: "Leave limit reached for this subject",
      });
    }

    const leave = await Leave.create({
      userId: req.user.id,
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
      userId: req.user.id,
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
      userId: req.user.id,
    });

    res.json({ message: "Leave deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting leave" });
  }
});

module.exports = router;