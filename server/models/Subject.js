const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  totalLectures: { type: Number, required: true },
  maxLeaves: { type: Number, required: true },
  order: { type: Number, default: 0 },
});

module.exports = mongoose.model("Subject", subjectSchema);