const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");

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

app.post("/api/posts", (req,res,next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  });
});

app.get("/api/posts", (req,res,next) => {
  Post.find()
  .then(documents => {
    console.log(documents);
    res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: documents
    });
  });
});

app.delete("/api/posts/:id",(req,res,next) => {
  console.log(req.params.id);
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({
      message: 'Post deleted!'
    });
  });
});

module.exports = app;
