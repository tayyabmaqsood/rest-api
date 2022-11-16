const express = require('express');
const feedRouter = require('./routes/feed')
const bodyParser = require('body-parser');
const path = require('path');

const sequelize = require('./util/database');
const Post = require("./models/post"); 


const app = express()

app.use(bodyParser.json()); //application/json

// adding  images folder as static
app.use('/images', express.static(path.join(__dirname, 'images'))); 

// every response we sent have the following headers
app.use((req, res, next)=>{

    // we set header that allow domain to access the server.
    // we can add server address instead of * , i.e codepen.io
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// GET /feed/posts
// every request starts with /feed, forward towards the feedRoute
app.use('/feed', feedRouter);

// adding error handling middleware
app.use((error, req, res, next) => {
    console.log(error)
    const statusCode = error.statusCode || 500;
    const message = error.message;
    res.status(statusCode)
        .json({
            message: message
        });
});

sequelize
    .sync()
    .then(result => {
        console.log(result)
        app.listen(8080);
    })
    .catch(err => console.log(err))
