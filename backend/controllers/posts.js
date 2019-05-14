const fs = require('fs');

const Post = require('../models/post');


exports.createPost = (req, res, next) => {
 let imagePath = '';
 if (!!req.file) {
   const url = req.protocol + '://' + req.get('host');
   imagePath = url + '/images/' + req.file.filename;
 }
 const post = new Post({
   date: Date.now(),
   username: req.body.username,
   title: req.body.title,
   content: req.body.content,
   imagePath: imagePath,
   community: null,
   votes: 0,
   commentsNumber: 0,
   link: null,
   creator: req.userData.userId
 });
 post.save().then(createdPost => {
   res.status(201).json({
     message: 'Post added successfully',
     post: {
       ...createdPost,
       id: createdPost._id
     }
   });
 })
 .catch(err => {
   res.status(500).json({
     message: 'Creating a post failed!'
   });
 });
}

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currPage = req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (!!pageSize && !!currPage) {
    postQuery
      .skip(pageSize * (currPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
     })
     .then(count => {
       res.status(200).json({
         message: 'Posts fetched successfully!',
         posts: fetchedPosts,
         maxPosts: count
       });
     })
     .catch(err => {
       res.status(500).json({
         message: 'Fetching posts failed!'
       });
     });
}

exports.getOnePost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found!'
      });
    }
  })
  .catch(err => {
    res.status(500).json({
      message: 'Fetching post failed!'
    });
  });
}

exports.deletePost =  (req, res, next) => {
  console.log(req.params.id);
  let filepath = '';
  let filename = '';
  const image_path = process.env.ROOT ? process.env.ROOT + 'images/': 'images/';

  Post.findById(req.params.id).then(post => {
    if (post && !!post.imagePath) {
      let url_arr = post.imagePath.split('/');
      filename = url_arr[url_arr.length - 1];
      filepath =  image_path + filename;
        // delete image file
      fs.unlink(filepath, (err) => {
        if (err) throw err;
         console.log('Image deleted for post!');
       });
    }
    Post.deleteOne({
      _id: req.params.id,
      creator: req.userData.userId
    }).then(result => {
      console.log('result is: ' + JSON.stringify(result));
      if (result.n > 0) {
        res.status(200).json({
          message: 'Post deleted!'
        });
      } else {
        res.status(401).json({
          message: 'Not authorized to delete!'
        });
      }
    });
  })
  .catch(err => {
    res.status(500).json({
      message: 'Deleting post failed!'
    });
  });
}

exports.editPost = (req, res, next) => {
  let votes;
  let comments;
  let imagePath = req.body.imagePath;
  if (!!req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }

  if (typeof(req.body.votes) === 'number') {
     votes = req.body.votes;
  } else {
    votes = parseInt(req.body.votes);
  }

  if (typeof(req.body.commentsNumber) === 'number') {
    comments = req.body.commentsNumber;
  } else {
    comments = parseInt(req.body.commentsNumber);
  }

  const post = new Post({
    _id: req.body.id,
    date: req.body.date,
    username: req.body.username,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    community: req.body.community,
    votes: votes,
    commentsNumber: comments,
    link: req.body.link,
    updatedDate: Date.now(),
    creator: req.userData.userId
  });
  console.log('post: ' + JSON.stringify(post));
  Post.updateOne({
    _id: req.params.id,
    creator: req.userData.userId
  }, post).then(
    result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({
          message: 'Update successful!'
        });
      } else {
        res.status(401).json({
          message: 'Not authorized to edit!'
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'Could not update post!'
      });
    });
}

