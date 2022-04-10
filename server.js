const express = require("express");
const cors = require("cors");
const app = express();
const moongose = require("mongoose");
const { signUp, signIn, createUser, deleteUser } = require("./controllers/auth");
require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post('/auth/signup', signUp);
app.get('/auth/signin',signIn);
app.post('/auth/createuser',createUser);
app.delete('/auth/deleteuser/:username', deleteUser);

const mongodbConnection = process.env.MONGODB_CONNECTION_STRING;

moongose
  .connect(
    mongodbConnection,
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  )
  .then((res) => {
    app.listen(5000);
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
