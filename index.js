require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Schema
const personSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  sem: Number
});

// Model
const Person = mongoose.model("Person", personSchema);

// Test route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// GET all persons
app.get("/users", async (req, res) => {
  try {
    const users = await Person.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new person
app.post("/user", async (req, res) => {
  try {
    const user = await Person.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for Vercel
module.exports = app;
