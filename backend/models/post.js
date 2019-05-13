const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  date: { type: Date, required: true },
  username: {type: String, required: true},
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: {type: String, required: false},
  community: {type: String, required: false},
  votes: {type: Number, required: false},
  link: {type: String, required: false},
  updatedDate: {type: Date, required: false},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports = mongoose.model('Post', postSchema);

