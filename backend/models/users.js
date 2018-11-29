const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');

const usersSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true }
});

usersSchema.plugin(validator);

module.exports = mongoose.model('User', usersSchema);

