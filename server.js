
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

/* middlewares */
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* MongoDB connection */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) =>
    console.error("MongoDB connection error:", err.message)
  );

/* Schema */
const customerSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  phone: String,
  address: String,
  membership: String,
  totalSpent: Number,
  joinDate: String,
  lastPurchase: String,
});

/* Model */
const Customer = mongoose.model("Customer", customerSchema);

/* Home route */
app.get("/", (req, res) => {
  res.send("Server is running");
});

/* Import customers.json to MongoDB */
app.get("/import-customers", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "customers.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    await Customer.insertMany(data.customers);
    res.send("Customers imported successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* Get all customers */
app.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Add single customer */
app.post("/customer", async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* Server start */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

