const mongoose = require("mongoose");

const ALLOWED_SELECTIONS = ["seoigaming", "seogamingsms"];

const SeoSettingsSchema = new mongoose.Schema(
  {
    // 🔑 Which platform this SEO config belongs to
    selection: {
      type: String,
      required: true,
      enum: ALLOWED_SELECTIONS,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    // 🧠 Raw comma-separated keywords (for meta tags etc.)
    commaSeparatedKeywords: {
      type: String,
      default: "",
      trim: true,
    },

    // 🚀 Structured keywords array (future use: search, analytics, filters)
    keywordsArray: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// 🔄 Auto-sync keywordsArray from commaSeparatedKeywords
SeoSettingsSchema.pre("save", function (next) {
  if (this.isModified("commaSeparatedKeywords")) {
    this.keywordsArray = this.commaSeparatedKeywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
  }
  next();
});

// ⚡ Ensure only 1 doc per selection (extra safety)
SeoSettingsSchema.index({ selection: 1 }, { unique: true });

module.exports = mongoose.model("SeoSettings", SeoSettingsSchema);