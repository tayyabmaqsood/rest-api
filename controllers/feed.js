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
        return res.status(422).json({
            message:'Validation failed, enter data is in correct format',
            errors: errors.array()
        })
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
        .catch(err =>  console.log(err))


    // creating post in database
    // 201 status code means success and resource is created
    
};