const express = require("express");

const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getPosts).post(protect, createPost);
router.post("/:id/comments", protect, addComment);
router
  .route("/:id")
  .get(getPost)
  .put(protect, updatePost)
  .patch(protect, updatePost)
  .delete(protect, deletePost);

module.exports = router;
