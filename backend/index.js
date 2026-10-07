require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Email = require("./models/Email");

const app = express();

app.use(cors());
app.use(express.json());

// ---------- MongoDB ----------
async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected successfully");
}

// ---------- Mail ----------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// ---------- Auth ----------
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// ---------- Routes ----------
app.get("/", async (req, res) => {
  try {
    await connectDB();
    res.json({ success: true, message: "Bulk Mail Backend Running & Connected to DB" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email and password are required" });

  if (
    email.trim() === process.env.ADMIN_EMAIL?.trim() &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ email: email.trim() }, process.env.JWT_SECRET, { expiresIn: "2h" });
    return res.json({ success: true, message: "Login successful", token });
  }
  res.status(401).json({ success: false, message: "Invalid email or password" });
});

app.post("/sendmail", authMiddleware, async (req, res) => {
  const { recipients, subject, body } = req.body;
  try {
    await connectDB();
    if (!Array.isArray(recipients) || recipients.length === 0)
      return res.status(400).json({ success: false, message: "At least one recipient is required" });
    if (!subject?.trim()) return res.status(400).json({ success: false, message: "Subject is required" });
    if (!body?.trim()) return res.status(400).json({ success: false, message: "Message is required" });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipients.join(","),
      subject,
      text: body,
    });
    await Email.create({ subject, body, recipients, status: "success" });
    res.json({ success: true, message: "Email sent successfully", messageId: info.messageId });
  } catch (error) {
    try {
      if (recipients) await Email.create({ subject: subject || "", body: body || "", recipients, status: "failed" });
    } catch (e) { console.error("Failed to save history:", e.message); }
    res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
  }
});

app.get("/emails", authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const emails = await Email.find().sort({ sentAt: -1 });
    res.json({ success: true, emails });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch email history", error: error.message });
  }
});

// ---------- Start (local only; Vercel uses the export) ----------
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}

module.exports = app;