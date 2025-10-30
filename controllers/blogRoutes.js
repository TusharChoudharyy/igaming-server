const express = require("express");
const router = express.Router();
const getMulterUploader = require("../middleware/upload");
const Blog = require("../models/Blogs");

// Multer setup
const upload = getMulterUploader("uploads/blogs");
const cpUpload = upload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
]);

// CREATE BLOG
router.post("/create", cpUpload, async (req, res) => {
  try {
    const {
      title,
      description,
      bannerDesc,
      bannerLink,
      tags,
      category,
      content,
    } = req.body;

    const featuredImage = req.files?.featuredImage?.[0]?.filename || null;
    const bannerImage = req.files?.bannerImage?.[0]?.filename || null;

    const newBlog = new Blog({
      title,
      description,
      featuredImage,
      bannerImage,
      bannerDesc,
      bannerLink,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      category,
      content,
      website: JSON.parse(req.body.website || "[]"), // ✅ store array
    });

    await newBlog.save();
    res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET ALL BLOGS
router.get("/get-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// GET BLOGS BY CATEGORY
router.get("/get-blogs/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const blogs = await Blog.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching category blogs:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET SINGLE BLOG
router.get("/get-blog/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// UPDATE BLOG
router.put("/update-blog/:id", cpUpload, async (req, res) => {
  try {
    const {
      title,
      description,
      bannerDesc,
      bannerLink,
      tags,
      category,
      content,
    } = req.body;
    const featuredImage = req.files?.featuredImage?.[0]?.filename;
    const bannerImage = req.files?.bannerImage?.[0]?.filename;

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    blog.title = title;
    blog.description = description;
    blog.bannerDesc = bannerDesc;
    blog.bannerLink = bannerLink;
    blog.tags = tags ? tags.split(",").map((t) => t.trim()) : [];
    blog.category = category;
    blog.content = content;
    blog.website = JSON.parse(req.body.website || "[]"); // ✅ update field

    if (featuredImage) blog.featuredImage = featuredImage;
    if (bannerImage) blog.bannerImage = bannerImage;

    await blog.save();
    res.status(200).json({ message: "Blog updated", blog });
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete-blog/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting blog" });
  }
});

module.exports = router;
