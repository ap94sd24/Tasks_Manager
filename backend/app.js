const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');

const app = express();

mongoose.connect("mongodb+srv://adam:" + process.env.MONGO_ATLAS_PW + "@cluster0-bs20k.mongodb.net/todo-app?retryWrites=true" , { useNewUrlParser: true })
.then(() => {
  console.log('Connected to database!');
})
.catch((err) => {
  console.log('Connection failed: ' + err);
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
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
 *
 * mongo "mongodb+srv://cluster0-bs20k.mongodb.net/todo-app" --username adam
 *
 *
 */

 app.use("/api/posts", postsRoutes);
 app.use("/api/users", usersRoutes);


module.exports = app;
