const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const helpers = require("./helpers/initAdmin");
const authenticationController = require("./controllers/auth.controller");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authenticationController.isAuth);
require(path.resolve("./routes/user.route"))(app);
require(path.resolve("./routes/prod.route"))(app);

const option = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(process.env.DB_URL, option)
  .then(() => {
    const server = app.listen(process.env.PORT, () => {
      console.log("Listening on " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(`Could not connect to the database. Exiting now...\n${err}`);
    process.exit();
  });

helpers.initAdmin();

module.exports = app;
