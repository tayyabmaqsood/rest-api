const express = require('express');
const feedRouter = require('./routes/feed')
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const Post = require("./models/post"); 


const app = express()

app.use(bodyParser.json()); //application/json


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

sequelize
    .sync()
    .then(result => {
        console.log(result)
        app.listen(8080);
    })
    .catch(err => console.log(err))
