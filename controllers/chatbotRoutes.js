// routes/chatbotRoutes.js
const express = require("express");
const router = express.Router();
const ChatbotLead = require("../models/ChatbotLead");

// -----------------------------------------
// POST: Save chatbot user data
// -----------------------------------------
router.post("/save", async (req, res) => {
  try {
    const { name, email, phone, topic, detail } = req.body;
    if (!name || !email || !phone || !topic)
      return res.status(400).json({ message: "Missing required fields" });

    const newLead = new ChatbotLead({ name, email, phone, topic, detail });
    await newLead.save();

    res.status(201).json({ message: "Chatbot lead saved successfully" });
  } catch (err) {
    console.error("Error saving chatbot data:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------
// GET: Fetch all chatbot leads
// -----------------------------------------
router.get("/leads", async (req, res) => {
  try {
    // Fetch all leads, newest first
    const leads = await ChatbotLead.find().sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (err) {
    console.error("Error fetching chatbot leads:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------
// GET: Fetch a single lead by ID
// -----------------------------------------
router.get("/lead/:id", async (req, res) => {
  try {
    const lead = await ChatbotLead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json(lead);
  } catch (err) {
    console.error("Error fetching chatbot lead:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
