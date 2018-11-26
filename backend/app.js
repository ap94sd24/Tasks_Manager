const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");

const app = express();

mongoose.connect("mongodb+srv://adam:JBZzMWxxJCxns62Q@cluster0-bs20k.mongodb.net/todo-app?retryWrites=true" , { useNewUrlParser: true })
.then(() => {
  console.log('Connected to database!');
})
.catch(() => {
  console.log('Connection failed!');
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
 */

app.post("/api/posts", (req,res,next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.get("/api/posts", (req,res,next) => {
  const posts = [
    {
      id: "fadfadsff123",
      title: "TEST TITLE1",
      content: "Test content!!"
    },
    {
      id: "faddfwfadsff123",
      title: "TEST TITLE2",
      content: "Test content2!!"
    }
  ];
  res.status(200).json({
    message: 'Posts fetched successfully!',
    posts: posts
  });
});

module.exports = app;
