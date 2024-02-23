const Post = require("../models/Post");
const express = require("express");
const router = express.Router();

router.get("/feed", async (req, res, next) => {
  try {
    const posts = await Post.find();

    res.status(200).json({ success: true, userFeed: posts });
  } catch (error) {
    console.error("Error fetching feed:", error);
    next(error);
  }
});

module.exports = router;
