const { validationResult } = require('express-validator/check');
const Post = require('../models/post');

// we can access this post by type direct url in the browser
exports.getPost = (req, res, next)=>{
    res.status(200).json({
        posts:[
            {
                _id: '1',
                title: 'First Post', 
                content: 'This is first post!', 
                imageUrl:"images/apple.jpg",
                creator: {
                    name: "Muhammad Tayyab",
                },
                createdAt: new Date()
            
            },

        ]
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


    // creating post in database
    // 201 status code means success and resource is created
    
};