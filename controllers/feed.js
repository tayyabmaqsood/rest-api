const { validationResult } = require('express-validator/check');
const Post = require('../models/post');

// we can access this post by type direct url in the browser
exports.getPost = (req, res, next)=>{

    Post.findAll()
        .then(posts =>{
            res.status(200).json({
                message:"Fetched Posts successfully", 
                posts: posts
            })
        })
        .catch(err =>  {
            // we are inside the promise chain just `throw` error will not work
            // we have to use next function to send error to next middleware
            if (!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });

};


exports.createPost = (req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        const error= new Error('Validation failed, enter data is in correct format');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title:title, 
        content: content,
        creator:  'Muhammad Tayyab',
        imageUrl: 'images/apple.jpg'
    })
   
    post
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message:'POST created successfully',
                post: result
            });
        })
        .catch(err =>  {
            // we are inside the promise chain just `throw` error will not work
            // we have to use next function to send error to next middleware
            if (!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })

    // get single post based on postId
    exports.getPost = (req, res, next)=>{
        const postId = req.params.postId;
        Post
            .findByPk(postId)
            .then(post =>{

                // if I throw error in then block, then this error catched by next catch block
                if (!post){
                    const error= new Error("Unable to find post.");
                    error.statusCode = 404;
                    throw error;
                }
                res.status(200).json({
                    message:'Post Fetched',
                    post: post
                });
            })
            .catch(err =>{
                if (!err.statusCode){
                    err.statusCode = 500;
                }
                next(err);
            })
    }
    
};