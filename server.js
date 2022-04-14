const express = require("express");
const cors = require("cors");
const app = express();
const moongose = require("mongoose");
const router = require("./routes");

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/", router);

const mongodbConnection = process.env.MONGODB_CONNECTION_STRING;

moongose
  .connect(
    mongodbConnection,
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  )
  .then((res) => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
