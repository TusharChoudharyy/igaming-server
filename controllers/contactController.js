const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new contact
    const contact = new Contact({
      name,
      email,
      company: req.body.company || '',
      phone: req.body.phone || '',
      subject,
      message
    });

    // Save to database
    await contact.save();

    // Send response
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: contact
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ 
      error: 'Failed to submit contact form',
      details: error.message 
    });
  }
});
router.get('/get-contact', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); // optional: sort newest first
    res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({
      error: 'Failed to fetch contact submissions',
      details: error.message
    });
  }
});

module.exports = router;