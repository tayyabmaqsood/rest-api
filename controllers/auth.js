const {validationResult} = require('express-validator/check')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


exports.signup = (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation failed!');
        error.statusCode =422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt.hash(password, 12)
        .then(hashedPassword =>{
            const user = new User({
                email: email,
                password: hashedPassword,
                name:  name
            });
            return user.save()
        })
            .then(result =>{
                res.status(201)
                    .json({
                        message: 'User created',
                        userId: result.id
                    })
            })
        .catch(err =>{
            if (!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.login = (req, res, next)=>{
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({where:{email:email}})
        .then(user =>{
            if (!user){
                const error = new Error('User with this email not found')
                error.statusCode = 401;
                throw error;
            }
            // if user enter correct email-address
            loadedUser = user;
            // bcrypt return promise
            return bcrypt.compare(password, user.password);
        })
            .then(isEqual =>{
                if(!isEqual){
                    const error = new Error('Wrong Password')
                    error.statusCode = 401;
                    throw error;
                }
                // if user enter correct password
                // jwt.sign() creates a new signature and packs it into web token
                // 1- we can add some data into token like email user_id
                // 2- secrate (private key) which is used for signing
                const token = jwt.sign(
                    {
                    email: loadedUser.email, 
                    userId: loadedUser.id.toString()
                    },
                    "secret",
                    {expiresIn: '1h'}
                );
                res.status(200).json({
                    token: token,
                    userId: loadedUser.id.toString()
                });
            })
            
        .catch(err =>{
            if (!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });
}