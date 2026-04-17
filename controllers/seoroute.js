const express = require("express");
const SeoSettings = require("../models/SEOSettings");

const router = express.Router();

const ALLOWED_SELECTIONS = ["seoigaming", "seogamingsms"];

function getValidSelection(req) {
  const selection = String(
    req.body?.selection || req.query?.selection || ""
  )
    .trim()
    .toLowerCase();

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
    console.error("GET SEO settings error:", err);
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
    console.error("POST SEO settings error:", err);
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
    console.error("PUT SEO settings error:", err);
    return res.status(500).json({ message: "Failed to update SEO settings" });
  }
});

// DELETE /api/admin/seo-settings?selection=seoigaming
// DELETE single keyword /api/admin/seo-settings/keyword?selection=seoigaming&keyword=casino
router.delete("/admin/seo-settings/keyword", async (req, res) => {
  try {
    const selection = getValidSelection(req);
    const keyword = String(req.query?.keyword || req.body?.keyword || "").trim();

    if (!selection) {
      return res.status(400).json({
        message: "Valid selection is required",
        allowedSelections: ALLOWED_SELECTIONS,
      });
    }

    if (!keyword) {
      return res.status(400).json({
        message: "Keyword is required",
      });
    }

    const doc = await SeoSettings.findOne({ selection });

    if (!doc) {
      return res.status(404).json({
        message: `SEO settings not found for selection: ${selection}`,
      });
    }

    const existingKeywords = Array.isArray(doc.keywordsArray)
      ? doc.keywordsArray.map((item) => String(item).trim()).filter(Boolean)
      : String(doc.commaSeparatedKeywords || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

    const filteredKeywords = existingKeywords.filter(
      (item) => item.toLowerCase() !== keyword.toLowerCase()
    );

    if (filteredKeywords.length === existingKeywords.length) {
      return res.status(404).json({
        message: `Keyword not found: ${keyword}`,
      });
    }

    doc.keywordsArray = filteredKeywords;
    doc.commaSeparatedKeywords = filteredKeywords.join(", ");
    await doc.save();

    return res.json({
      message: `Keyword deleted successfully: ${keyword}`,
      doc,
    });
  } catch (err) {
    console.error("DELETE single keyword error:", err);
    return res.status(500).json({ message: "Failed to delete keyword" });
  }
});

module.exports = router;
