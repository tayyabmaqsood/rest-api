// we can access this post by type direct url in the browser
exports.getPost = (req, res, next)=>{
    res.status(200).json({
        posts:[{title: 'First Post', content: 'This is first post!'}]
    });
};


exports.createPost = (req, res, next)=>{
    const title = req.body.title;
    const content = req.body.content;
    // creating post in database
    // 201 status code means success and resource is created
    res.status(201).json({
        message:'POST created successfully',
        post: {id: new Date().toISOString(), title:title, content: content},

    });
};