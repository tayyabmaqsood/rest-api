const express = require('express');
const feedController = require('../controllers/feed');
const { body } = require('express-validator')

const isAuth = require('../middleware/is-auth');

const router = express.Router();

//  GET /feed/posts
// show all post
router.get('/posts', isAuth, feedController.getAllPosts);

// POST /feed/post
// adding new post
router.post('/post', isAuth,
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
    router.get('/post/:postId', isAuth, feedController.getPost);

    // PUT /post/:postId 
    // used to edit post
    router.put('/post/:postId', isAuth,
    [
        body('title')
            .trim()
            .isLength({min:5}),
        body('content')
            .trim()
            .isLength({min:5})
    ],
    feedController.updatePost);

    // Delete /post/id
    router.delete('/post/:postId', isAuth, feedController.deletePost);
module.exports = router;
