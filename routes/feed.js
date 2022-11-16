const express = require('express');
const feedController = require('../controllers/feed');
const { body } = require('express-validator')

const router = express.Router();

//  GET /feed/posts
// show all post
router.get('/posts', feedController.getPost);

// POST /feed/post
// adding new post
router.post('/post', 
    [
        body('title')
            .trim()
            .isLength({min:5}),
        body('content')
            .trim()
            .isLength({min:5})
    ],
    feedController.createPost);

module.exports = router;
