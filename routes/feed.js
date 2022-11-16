const express = require('express');
const feedController = require('../controllers/feed');
const { body } = require('express-validator')

const router = express.Router();

//  GET /feed/posts
// show all post
router.get('/posts', feedController.getAllPosts);

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

    // GET /post/postId
    router.get('/post/:postId', feedController.getPost);

    // PUT /post/:postId 
    // used to edit post
    router.put('/post/:postId',
    [
        body('title')
            .trim()
            .isLength({min:5}),
        body('content')
            .trim()
            .isLength({min:5})
    ],
    feedController.updatePost);
module.exports = router;
