const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
  signUp: async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password:hashedPassword,
      role: "member",
    });

    user
      .save()
      .then((result) => {
        res.send(result);
        return res.status(201).json(result);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  },
};
