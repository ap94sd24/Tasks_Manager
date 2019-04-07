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
    req.status(201).json({
      message: 'Comment added successfully',
      comment: {
        ...newComment,
        id: newComment._id
      }
    });
  })
  .catch(err => {
    res.status(500).json({
      message: 'Creating a comment failed'
    });
  });
}
