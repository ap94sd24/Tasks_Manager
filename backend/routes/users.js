const express = require('express');
const router = express.Router();

const UserController = require('../controllers/users');
/**
 * POST: signup users
 */
router.post('/signup', UserController.createUser);

router.post('/login',  UserController.userLogin);

router.get('/:id', UserController.getUserInfos);


module.exports = router;
