const { validationResult } = require('express-validator/check');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');

const post  = require('../routes/feed');
const User = require('../models/user');

// we can access this post by type direct url in the browser
exports.getAllPosts = async(req, res, next)=>{
const currentPage = req.query.page || 1;
const perPage = 2;
const totalItems = await Post.count();
    try{
    const posts = await Post.findAll({
            limit: perPage,
            offset:((currentPage - 1) * perPage)
        });
        
        res.status(200).json({
            message:"Fetched Posts successfully", 
            posts: posts,
            totalItems: totalItems
        });
    }
    catch(err){
            if (!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        }
};


exports.createPost = (req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        const error= new Error('Validation failed, enter data is in correct format');
        error.statusCode = 422;
        throw error;
    }
    if(!req.file){
        const error= new Error("No image attached");
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;
    let creator, result;
    const post = new Post({
        title:title, 
        content: content,
        creator:  'Muhammad Tayyab',
        imageUrl: imageUrl,
        userId: req.userId
    })
   
    post
        .save()
        .then(result => {
            result = result;
            return User.findByPk(req.userId);
        })
            .then(user =>{
                creator = user;
                res.status(201).json({
                    message:'POST created successfully',
                    post: result,
                    creator: {_id: creator.id, name: creator.name}
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
    
};

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
};

exports.updatePost = (req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        const error= new Error('Validation failed, enter data is in correct format');
        error.statusCode = 422;
        throw error;
    }

    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;

    // adding validations
    if (req.file){
        imageUrl = req.file.path;
    }

    Post.findByPk(postId)
        .then(post =>{
            if (!post){
                const error= new Error("Unable to find post. (error: updatePost)");
                error.statusCode = 404;
                throw error;
            }
            // check either correct user request to edit the post or not
            if(post.userId.toString() !== req.userId){
                const error= new Error("Not authorized (error: updatePost)");
                error.statusCode = 403;
                throw error;
            }

            // if user upload new image
            if(imageUrl != post.imageUrl){
                // deleting the old image
                clearImage(post.imageUrl);
            }

            if(!imageUrl)
                imageUrl = post.imageUrl;

            post.title = title;
            post.content = content;
            post.imageUrl = imageUrl;
            return post.save();
        })
        .then(result =>{
            res.status(200).json({message:'Post updated!', post: result})  
        })
        .catch(err =>{
            if (!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
};


exports.deletePost = async(req, res, next)=>{

    const postId = req.params.postId;
   try{
        const post = await Post.findByPk(postId)
        // check either correct user request to delete the post or not
        if(post.userId.toString() !== req.userId){
            const error= new Error("Not authorized (error: deletePost)");
            error.statusCode = 403;
            throw error;
        }

        // check loggedIn user
        if (post.imageUrl)
            clearImage(post.imageUrl);
        const result = await post.destroy();
        res.status(200).json({message:'Post deleted!', post: result})  

    }
    catch(err){
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}


const clearImage = filePath =>{
    filePath = path.join(__dirname, '..', filePath);
    if(fs.existsSync(filePath))
        fs.unlink(filePath, err => console.log(err))   
}