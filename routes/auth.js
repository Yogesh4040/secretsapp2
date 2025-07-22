const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isPasswordStrong = (pass) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(pass);

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!isEmailValid(email) || !isPasswordStrong(password)) {
    return res.status(400).json({ message: "Invalid email or password format." });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) throw new Error("User exists");

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "Registered successfully." });
  } catch {
    res.status(400).json({ message: "User already exists." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

  res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      secure: false,
    })
    .json({ message: "Login successful" });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

module.exports = router;
