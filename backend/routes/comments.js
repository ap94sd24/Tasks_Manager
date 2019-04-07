const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const CommentsController = require('../controllers/comments');

router.post("", checkAuth, CommentsController.createComment);

module.exports = router;
