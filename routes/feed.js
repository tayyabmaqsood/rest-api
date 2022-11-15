const express = require('express');
const feedController = require('../controllers/feed');

const router = express.Router();

//  GET /feed/posts
// show all post
router.get('/posts', feedController.getPost);

// POST /feed/post
// adding new post
router.post('/post', feedController.createPost);

module.exports = router;
