const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");

dotenv.config();
const app = express();
const authRoutes = require("./routes/auth");

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login.html");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch {
    return res.redirect("/login.html");
  }
};

app.use("/auth", authRoutes);

app.get("/", (req, res) => res.redirect("/login.html"));

app.get("/dashboard", authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`)
);
