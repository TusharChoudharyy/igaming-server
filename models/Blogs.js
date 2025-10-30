const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  description: String,
  featuredImage: String,
  bannerImage: String,
  bannerDesc: String,
  bannerLink: String,
  tags: [String],
  category: String,
  content: String,
  website: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
