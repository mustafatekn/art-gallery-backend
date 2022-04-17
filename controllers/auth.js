const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const User = require("../models/User");
const { isEmpty, isMatched, isEmail, isAdmin } = require("../util/validate");

module.exports = {
  signUp: async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    const emptyErrors = isEmpty({ username, email, password, confirmPassword });
    const matchedErrors = isMatched({ password, confirmPassword });
    const emailErrors = isEmail(email);

    if (Object.keys(emptyErrors).length > 0)
      return res.status(400).json(emptyErrors);
    if (Object.keys(emailErrors).length > 0)
      return res.status(400).json(emailErrors);
    if (Object.keys(matchedErrors).length > 0)
      return res.status(400).json(matchedErrors);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: "member",
    });

    try {
      const userSignedUp = await user.save();
      return res.status(201).json(userSignedUp);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  signIn: async (req, res) => {
    const { username, password } = req.body;
    const emptyErrors = isEmpty({ username, password });

    if (Object.keys(emptyErrors).length > 0)
      return res.status(400).json(emptyErrors);

    const user = await User.findOne({ username });
    const correctPassword =
      user && (await bcrypt.compare(password, user.password));

    if (!user || !correctPassword)
      return res.status(404).json({ error: "Incorrect username or password" });

    const userId = user.get("id");
    const role = user.get("role");
    const token = jwt.sign({ userId, username, role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({ ...user.toJSON(), token });
  },

  createUser: async (req, res) => {
    const { username, email, password, role } = req.body;
    const token = req.get("Authorization");
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const userInfo = jwt_decode(token);
    const authorizationErrors = isAdmin(userInfo.role);
    const emptyErrors = isEmpty({ username, email, password, role });
    const emailErrors = isEmail(email);
    const userFromRequest = await User.findById(userInfo.userId);

    if (Object.keys(emptyErrors).length > 0)
      return res.status(400).json(emptyErrors);
    if (Object.keys(emailErrors).length > 0)
      return res.status(400).json(emailErrors);
    if (!userFromRequest)
      return res.status(401).json({ error: "Unauthorized" });
    if (Object.keys(authorizationErrors).length > 0)
      return res.status(401).json(authorizationErrors);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    try {
      const createdUser = await user.save();
      return res.status(201).json(createdUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;
    const token = req.get("Authorization");
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const userInfo = jwt_decode(token);
    const userFromRequest = await User.findById(userInfo.userId);
    const authorizationErrors = isAdmin(userInfo.role);

    if (Object.keys(authorizationErrors).length > 0)
      return res.status(401).json(authorizationErrors);
    if (!userFromRequest)
      return res.status(401).json({ error: "Unauthorized" });

    try {
      const deletedUser = await User.findByIdAndDelete();
      return res.status(200).json(deletedUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  updateUser: async (req, res) => {
    const { username, email, password, confirmPassword, role } = req.body;
    const { id } = req.params;
    const token = req.get("Authorization");
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const userInfo = jwt_decode(token);
    const userFromRequest = await User.findById(userInfo.userId);

    const emptyErrors = isEmpty({
      username,
      email,
      password,
      confirmPassword,
      role,
    });

    const matchedErrors = isMatched({ password, confirmPassword });

    if (Object.keys(emptyErrors).length > 0)
      return res.status(400).json(emptyErrors);
    if (Object.keys(matchedErrors).length > 0)
      return res.status(400).json(matchedErrors);
    if (!userFromRequest)
      return res.status(401).json({ error: "Unauthorized" });

    const authorizationErrors = isAdmin(userInfo.role);

    if (Object.keys(authorizationErrors).length > 0)
      return res.status(401).json(authorizationErrors);

    const userForUpdate = await User.findById(id);
    const hierarchyErrors = await isAdmin(userForUpdate);

    if (Object.keys(hierarchyErrors).length > 0)
      return res.status(401).json(hierarchyErrors);

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const updatedUser = await User.findByIdAndUpdate(id, {
        username,
        email,
        password: hashedPassword,
        role,
      });
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
