const mongoose = require("mongoose");

const ChatbotLeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    topic: { type: String, required: true },
    detail: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatbotLead", ChatbotLeadSchema);
