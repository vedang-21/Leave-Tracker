const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  },
  subjectName: { type: String, required: true },
  date: { type: Date, required: true },
  reason: { type: String, required: true },
});

module.exports = mongoose.model("Leave", leaveSchema);