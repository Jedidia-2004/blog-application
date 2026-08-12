const Post = require("../models/Post");
const asyncHandler = require("../utils/asyncHandler");

function validatePostInput(body, requireAllFields = true) {
  const errors = [];

  if (requireAllFields || Object.hasOwn(body, "title")) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      errors.push("Title is required and must be a non-empty string.");
    }
  }

  if (requireAllFields || Object.hasOwn(body, "content")) {
    if (typeof body.content !== "string" || !body.content.trim()) {
      errors.push("Content is required and must be a non-empty string.");
    }
  }

  return errors;
}

const getPosts = asyncHandler(async (request, response) => {
  const posts = await Post.find()
    .populate("author", "username")
    .sort({ createdAt: -1 });

  response.status(200).json({
    success: true,
    count: posts.length,
    posts,
  });
});

const getPost = asyncHandler(async (request, response) => {
  const post = await Post.findById(request.params.id)
    .populate("author", "username")
    .populate("comments.author", "username");

  if (!post) {
    return response.status(404).json({
      success: false,
      message: "Post not found.",
    });
  }

  response.status(200).json({ success: true, post });
});

const addComment = asyncHandler(async (request, response) => {
  const post = await Post.findById(request.params.id);

  if (!post) {
    return response.status(404).json({
      success: false,
      message: "Post not found.",
    });
  }

  const content = request.body?.content;

  if (typeof content !== "string" || !content.trim()) {
    return response.status(400).json({
      success: false,
      message: "Comment is required.",
    });
  }

  if (content.trim().length > 1000) {
    return response.status(400).json({
      success: false,
      message: "Comment cannot exceed 1,000 characters.",
    });
  }

  post.comments.push({
    content: content.trim(),
    author: request.user._id,
  });

  await post.save();
  await post.populate("comments.author", "username");

  const comment = post.comments[post.comments.length - 1];

  response.status(201).json({
    success: true,
    message: "Comment posted successfully.",
    comment,
  });
});

const createPost = asyncHandler(async (request, response) => {
  const body = request.body || {};
  const errors = validatePostInput(body);

  if (errors.length) {
    return response.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  const post = await Post.create({
    title: body.title.trim(),
    content: body.content.trim(),
    author: request.user._id,
  });
  await post.populate("author", "username");

  response.status(201).json({
    success: true,
    message: "Post created successfully.",
    post,
  });
});

const updatePost = asyncHandler(async (request, response) => {
  const post = await Post.findById(request.params.id);

  if (!post) {
    return response.status(404).json({
      success: false,
      message: "Post not found.",
    });
  }

  if (post.author.toString() !== request.user._id.toString()) {
    return response.status(403).json({
      success: false,
      message: "You can update only your own posts.",
    });
  }

  const body = request.body || {};
  const hasTitle = Object.hasOwn(body, "title");
  const hasContent = Object.hasOwn(body, "content");

  if (!hasTitle && !hasContent) {
    return response.status(400).json({
      success: false,
      message: "Provide a title or content to update.",
    });
  }

  const errors = validatePostInput(body, false);
  if (errors.length) {
    return response.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  if (hasTitle) {
    post.title = body.title.trim();
  }

  if (hasContent) {
    post.content = body.content.trim();
  }

  await post.save();
  await post.populate("author", "username");

  response.status(200).json({
    success: true,
    message: "Post updated successfully.",
    post,
  });
});

const deletePost = asyncHandler(async (request, response) => {
  const post = await Post.findById(request.params.id);

  if (!post) {
    return response.status(404).json({
      success: false,
      message: "Post not found.",
    });
  }

  const isOwner = post.author.toString() === request.user._id.toString();
  const isAdmin = request.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return response.status(403).json({
      success: false,
      message: "You can delete only your own posts.",
    });
  }

  await post.deleteOne();

  response.status(200).json({
    success: true,
    message: "Post deleted successfully.",
  });
});

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
};
