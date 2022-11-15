const express = require('express');
const feedRouter = require('./routes/feed')

const app = express()

// GET /feed/posts
// every request starts with /feed, forward towards the feedRoute
app.use('/feed', feedRouter);


app.listen(8080);
