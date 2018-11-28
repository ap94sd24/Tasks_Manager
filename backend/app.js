const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require('./routes/posts');

const app = express();

mongoose.connect("mongodb+srv://adam:JBZzMWxxJCxns62Q@cluster0-bs20k.mongodb.net/todo-app?retryWrites=true" , { useNewUrlParser: true })
.then(() => {
  console.log('Connected to database!');
})
.catch((err) => {
  console.log('Connection failed: ' + err);
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
     );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
  next();
});

/**
 *  MongoDB Atlas user: adam
 *  password: JBZzMWxxJCxns62Q
 * mongo "mongodb+srv://cluster0-bs20k.mongodb.net/test" --username adam
 *
 */

 app.use("/api/posts", postsRoutes);


module.exports = app;
