const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check')

const User = require('../models/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

router.put('/signup',
    [
        body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req })=>{
            return User.findOne({where:{email: value}})
                    .then(userDoc =>{
                        if(userDoc){
                            return Promise.reject("Email address already exists");
                        }
                    })
        })
        .normalizeEmail(),
        body('password')
            .trim()
            .isLength({min:5}),
        body('name')
            .trim()
            .not()
            .isEmpty()
    ],
    authController.signup
);

router.post('/login', authController.login);

// getting current user status
router.get('/status', isAuth, authController.getUserStatus);

// updating user status
router.put('/status', isAuth,
    body('status')
    .trim()
    .not()
    .isEmpty(),
    authController.updateUserStatus);

module.exports = router;
