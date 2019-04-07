const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  date: { type: Date, required: true },
  username: { type: String, required: true },
  comment: { type: String, required: true },
  postId: {type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports = mongoose.model('Comment', commentSchema);
