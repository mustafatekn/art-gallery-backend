const express = require("express");
const {
  signUp,
  signIn,
  createUser,
  deleteUser,
  updateUser,
} = require("../controllers/auth");
const { createPost, deletePost } = require("../controllers/post");

const router = express.Router();

//Auth Routes
router.post("/auth/signup", signUp);
router.get("/auth/signin", signIn);
router.post("/auth/createuser", createUser);
router.delete("/auth/user/:id", deleteUser);
router.put("/auth/user/:id", updateUser);
router.post('/post/createPost',createPost);
router.delete('/post/:id', deletePost);
module.exports = router;
