const express = require('express');
const feedRouter = require('./routes/feed')
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');

const sequelize = require('./util/database');

const Post = require("./models/post"); 
const User = require("./models/user");

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');


const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, res, cb)=>{
        cb(null, './images');
    },
    filename:(req, file, cb) =>{
        cb(null,  new Date().getTime() + '-' + file.originalname);
    }
})

const fileFilter = (req, file, cb) =>{
    if(
        file.mimetype === 'image/png' ||
        file.minetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg')
        {
            cb(null, true);

        }
        else{
            cb(null, false);
        }
}

app.use(bodyParser.json()); //application/json

// register multer for file storage
app.use(multer({
    storage: fileStorage,
    fileFilter: fileFilter
    }).single('image')
);

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
app.use('/feed', feedRoutes);
app.use('/auth',authRoutes);

// adding error handling middleware
app.use((error, req, res, next) => {
    console.log(error)
    const statusCode = error.statusCode || 500;
    const message = error.message;
    // error.data is array of error
    const data = error.data;
    res.status(statusCode)
        .json({
            message: message,
            data: data
        });
});

Post.belongsTo(User, {constraints: true, onDelete:'CASCADE'});
User.hasMany(Post);


sequelize
    // .sync({force:true})
    .sync()
    .then(result => {
        console.log(result)
        app.listen(8080);
    })
    .catch(err => console.log(err))
