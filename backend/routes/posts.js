const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let err = new Error('Invalid mime_type');
    if (isValid) {
      err = null;
    }
    cb(err, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post("",
 checkAuth,
 multer({
  storage: storage
}).single("imagePath"), (req, res, next) => {
  let imagePath = '';
  if (!!req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  console.log('userId: ' + req.userData.userId);
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
});

router.get("", (req, res, next) => {
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
});

router.get("/:id", (req, res, next) => {
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
});

router.delete("/:id", checkAuth, (req, res, next) => {
  console.log(req.params.id);
  let filepath = '';
  let filename = '';

  Post.findById(req.params.id).then(post => {
    if (post) {
      let url_arr = post.imagePath.split('/');
      let host = url_arr[2];
      if (host === 'localhost:3000') {
        filename = url_arr[url_arr.length - 1];
        filepath = 'backend/images/' + filename;
        // delete image file
        fs.unlink(filepath, (err) => {
          if (err) throw err;
          console.log('Image deleted for post!');
        });
      }
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
});

router.put("/:id", checkAuth, multer({
  storage: storage
}).single("imagePath"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (!!req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({
    _id: req.params.id,
    creator: req.userData.userId
  }, post).then(
    result => {
      console.log(result);
      if (result.nModified > 0) {
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
});

module.exports = router;
