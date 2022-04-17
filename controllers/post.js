const User = require("../models/User");
const jwt_decode = require("jwt-decode");
const { isEmpty, isAdmin } = require("../util/validate");
const Post = require("../models/Post");

module.exports = {
  createPost: async (req, res) => {
    const { title, text, url, imageUrl } = req.body;
    const token = req.get("Authorization");
    const userInfo = jwt_decode(token);
    const emptyErrors = isEmpty({ title, text, url, imageUrl });
    const authorizationErrors = isAdmin(userInfo.role);

    if (Object.keys(emptyErrors).length > 0)
      return res.status(400).json(emptyErrors);
    if (Object.keys(authorizationErrors).length > 0)
      return res.status(401).json(authorizationErrors);

    const userFromRequest = await User.findById(userInfo.userId);

    if (!userFromRequest)
      return res.status(401).json({ error: "Unauthorized" });

    const post = new Post({
      title,
      text,
      url,
      imageUrl,
      user: {
        id: userInfo.userId,
        username: userInfo.username,
        role: userInfo.role,
      },
    });

    post
      .save()
      .then((result) => {
        return res.status(201).json(result);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  },
};
