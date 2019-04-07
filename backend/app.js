const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const usersRoutes = require('./routes/users');

const app = express();

// dynamically set image path for local & production
/**
 * mongodb://adam-pan:<PASSWORD>@backend-server-shard-00-00-rgblz.mongodb.net:27017,backend-server-shard-00-01-rgblz.mongodb.net:27017,backend-server-shard-00-02-rgblz.mongodb.net:27017/test?ssl=true&replicaSet=Backend-server-shard-0&authSource=admin&retryWrites=true
 * "mongodb+srv://adam:" + process.env.MONGO_ATLAS_PW + "@cluster0-bs20k.mongodb.net/todo-app?retryWrites=true"
 */
const imagePath = process.env.ROOT ? process.env.ROOT + "images": "images";

mongoose.connect("mongodb://adam-pan:" + process.env.MONGO_ATLAS_PW+ "@backend-server-shard-00-00-rgblz.mongodb.net:27017,backend-server-shard-00-01-rgblz.mongodb.net:27017,backend-server-shard-00-02-rgblz.mongodb.net:27017/backend-server?ssl=true&replicaSet=Backend-server-shard-0&authSource=admin&retryWrites=true" , { useNewUrlParser: true })
.then(() => {
  console.log('Connected to database!');
})
.catch((err) => {
  console.log('Connection failed: ' + err);
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(imagePath)));

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

 app.use("/api/comments", commentsRoutes);
 app.use("/api/posts", postsRoutes);
 app.use("/api/users", usersRoutes);


module.exports = app;
