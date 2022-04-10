const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const User = require("../models/User");
const { isEmpty, isMatched, isEmail } = require("../util/validate");

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

    user
      .save()
      .then((result) => {
        return res.status(201).json(result);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  },

  signIn: async (req, res) => {
    const { username, password } = req.body;
    const emptyErrors = isEmpty({ username, password });

    if (Object.keys(emptyErrors).length > 0)
      return res.status(400).json(emptyErrors);

    const user = await User.findOne({ where: { username, password } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const role = user.get("role");

    const token = jwt.sign({ username, role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({ ...user.toJSON(), token });
  },

  createUser: async (req, res) => {
    const { username, email, password, role } = req.body;
    const emptyErrors = isEmpty({ username, email, password, role });
    const emailErrors = isEmail(email);

    if (Object.keys(emptyErrors).length > 0)
      return res.status(400).json(emptyErrors);
    if (Object.keys(emailErrors).length > 0)
      return res.status(400).json(emailErrors);

    const token = req.get("Authorization");
    const userInfo = jwt_decode(token);

    if (userInfo.role !== "admin")
      return res.status(401).json({ error: "You are not authorized." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    user
      .save()
      .then((result) => {
        return res.status(201).json(result);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  },
};
