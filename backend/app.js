const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const path = require("path");

mongoose.connect("mongodb://test-user:test-password@localhost:27017/QUEST?authSource=test&readPreference=primary&appname=mean-angular-backend&ssl=false")
  .then(() => {
    console.log("Connected");
  }, error => {
    console.log("Connection failed");
  });

const app = express();
app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-type, Accept, auth");
  response.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.json());
app.use("/api/posts", postsRoutes);
app.use("/api/auth", authRoutes);
app.use("/images", express.static(path.join("backend/images")))

module.exports = app;
