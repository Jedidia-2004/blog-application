const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Comment is required."],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1,000 characters."],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters."],
    },
    content: {
      type: String,
      required: [true, "Content is required."],
      trim: true,
      maxlength: [50000, "Content cannot exceed 50,000 characters."],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
