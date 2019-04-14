const Comment = require('../models/comment');

exports.createComment = (req, res, next) => {
  const comment = new Comment({
    date: Date.now(),
    username: req.body.username,
    comment: req.body.comment,
    postId: req.body.postId,
    creator: req.userData.userId
  });
  comment.save()
  .then(newComment => {
    res.status(201).json({
      message: 'Comment added successfully',
      comment: {
        ...newComment,
        id: newComment._id
      }
    });
  })
  .catch(err => {
    console.log('err: ' + err);
    res.status(500).json({
      message: 'Creating a comment failed'
    });
  });
}

exports.getCommentsForPost = (req, res, next) => {
  Comment.find({"postId": req.params.postId})
    .then(documents => {
      res.status(200).json({
        message: 'Comments for post fetched successfully!',
        comments: documents
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Fetching commments failed!'
      });
    });
}
