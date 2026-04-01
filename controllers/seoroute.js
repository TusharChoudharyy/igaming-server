const express = require("express");
const SeoSettings = require("../models/SeoSettings");

const router = express.Router();

const ALLOWED_SELECTIONS = ["seoigaming", "seogamingsms"];

function getValidSelection(req) {
  const selection = String(req.body?.selection || req.query?.selection || "").trim().toLowerCase();
  return ALLOWED_SELECTIONS.includes(selection) ? selection : null;
}

// GET /api/admin/seo-settings?selection=seoigaming
router.get("/admin/seo-settings", async (req, res) => {
  try {
    const selection = getValidSelection(req);

    if (!selection) {
      return res.status(400).json({
        message: "Valid selection is required",
        allowedSelections: ALLOWED_SELECTIONS,
      });
    }

    let doc = await SeoSettings.findOne({ selection });

    if (!doc) {
      doc = await SeoSettings.create({
        selection,
        commaSeparatedKeywords: "",
      });
    }

    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch SEO settings" });
  }
});

// POST /api/admin/seo-settings
router.post("/admin/seo-settings", async (req, res) => {
  try {
    const selection = getValidSelection(req);
    const { commaSeparatedKeywords = "" } = req.body || {};

    if (!selection) {
      return res.status(400).json({
        message: "Valid selection is required",
        allowedSelections: ALLOWED_SELECTIONS,
      });
    }

    const value = String(commaSeparatedKeywords).trim();

    const existingDoc = await SeoSettings.findOne({ selection });
    if (existingDoc) {
      return res.status(400).json({
        message: `SEO settings already exist for selection: ${selection}. Use PUT to update.`,
      });
    }

    const doc = await SeoSettings.create({
      selection,
      commaSeparatedKeywords: value,
    });

    return res.status(201).json(doc);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create SEO settings" });
  }
});

// PUT /api/admin/seo-settings
router.put("/admin/seo-settings", async (req, res) => {
  try {
    const selection = getValidSelection(req);
    const { commaSeparatedKeywords = "" } = req.body || {};

    if (!selection) {
      return res.status(400).json({
        message: "Valid selection is required",
        allowedSelections: ALLOWED_SELECTIONS,
      });
    }

    const value = String(commaSeparatedKeywords).trim();

    let doc = await SeoSettings.findOne({ selection });

    if (!doc) {
      doc = await SeoSettings.create({
        selection,
        commaSeparatedKeywords: value,
      });
    } else {
      doc.commaSeparatedKeywords = value;
      await doc.save();
    }

    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update SEO settings" });
  }
});

// DELETE /api/admin/seo-settings?selection=seoigaming
router.delete("/admin/seo-settings", async (req, res) => {
  try {
    const selection = getValidSelection(req);

    if (!selection) {
      return res.status(400).json({
        message: "Valid selection is required",
        allowedSelections: ALLOWED_SELECTIONS,
      });
    }

    const doc = await SeoSettings.findOne({ selection });

    if (!doc) {
      return res.status(404).json({
        message: `SEO settings not found for selection: ${selection}`,
      });
    }

    await SeoSettings.deleteOne({ _id: doc._id });

    return res.json({
      message: `SEO settings deleted successfully for selection: ${selection}`,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete SEO settings" });
  }
});

module.exports = router;