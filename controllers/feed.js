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
    const title = req.body.title;
    const content = req.body.content;
    // creating post in database
    // 201 status code means success and resource is created
    res.status(201).json({
        message:'POST created successfully',
        post: {
            _id: new Date().toISOString(), 
            title:title, 
            content: content,
            creator: {
                name: 'Muhammad Tayyab'
            },
            createdAt: new Date()
        },

    });
};