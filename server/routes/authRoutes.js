const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Resend } = require("resend");

const User = require("../models/User");

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, rollNo, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      rollNo,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      name: user.name,
      userId: user._id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
});


// ================= FORGOT PASSWORD =================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Email received:", email);

    const user = await User.findOne({ email });
    console.log("User found:", user);
    
    if (!user) {
      return res.json({ message: "If email exists, reset link sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // 👇 ADD THESE TWO LINES HERE
    console.log("Sending email via Resend...");
    console.log("RESEND API KEY:", process.env.RESEND_API_KEY);

const result = await resend.emails.send({
  from: "onboarding@resend.dev",
  to: "vedangmane77@gmail.com",
  subject: "Password Reset Request",
  html: `
    <h2>Password Reset</h2>
    <a href="${resetURL}">${resetURL}</a>
  `,
});

console.log("Resend response:", result);
    res.json({ message: "Reset link sent successfully." });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Error sending reset email" });
  }
});

// ================= RESET PASSWORD =================
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    // Hash token from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Password reset failed" });
  }
});

module.exports = router;