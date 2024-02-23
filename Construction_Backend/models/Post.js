const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    postUrl: {
      type: String,
      required: true,
      trim: true,
    },
    postDescription: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
