const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const Leave = require("../models/Leave");
const authMiddleware = require("../middleware/authMiddleware");

// ================= CREATE SUBJECT =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, totalLectures, maxLeaves } = req.body;

    const subject = await Subject.create({
      userId: req.user.id,
      name,
      totalLectures,
      maxLeaves,
    });

    res.json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating subject" });
  }
});

// ================= GET SUBJECTS (USER FILTERED) =================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const subjects = await Subject.find({
      userId: req.user.id,
    }).sort({ order: 1 });

    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching subjects" });
  }
});

// ================= DELETE SUBJECT (USER SAFE) =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Subject.deleteOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    await Leave.deleteMany({
      subjectId: req.params.id,
      userId: req.user.id,
    });

    res.json({ message: "Subject deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting subject" });
  }
});

// ================= REORDER SUBJECTS (USER SAFE) =================
router.put("/reorder", authMiddleware, async (req, res) => {
  try {
    const { orderedIds } = req.body;

    for (let i = 0; i < orderedIds.length; i++) {
      await Subject.updateOne(
        { _id: orderedIds[i], userId: req.user.id },
        { order: i }
      );
    }

    res.json({ message: "Reordered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error reordering subjects" });
  }
});

module.exports = router;