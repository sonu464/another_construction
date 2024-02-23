const express = require("express");
const Post = require("../models/Post");
const { isValidText, isValidImageUrl } = require("../util/validation");

const router = express.Router();

router.post("/post", async (req, res, next) => {
  const postUrl = req.body.postUrl;
  const postDescription = req.body.postDescription;

  let errors = {};

  if (!isValidText(postUrl)) {
    errors.postUrl = "Invalid file ";
  }

  if (!isValidText(postDescription)) {
    errors.postDescription = "Invalid Post Description ";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Uploading post failed due to validation errors.",
      errors,
    });
  }

  try {
    const userPost = new Post({
      postUrl,
      postDescription,
    });

    await userPost.save();
    // Respond with a JSON object indicating success
    res.status(200).json({ success: true, message: "Post Created" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
