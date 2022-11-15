const express = require('express');
const feedRouter = require('./routes/feed')
const bodyParser = require('body-parser');

const app = express()

app.use(bodyParser.json()); //application/json

// GET /feed/posts
// every request starts with /feed, forward towards the feedRoute
app.use('/feed', feedRouter);


app.listen(8080);
