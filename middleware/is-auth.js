const jwt = require('jsonwebtoken');
const { ValidationErrorItemType } = require('sequelize');
module.exports = (req, res, next) =>{
    const authHeader = req.get('Authorization')
    if(!authHeader){
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }

    // req.get method return headers
    const token = authHeader.split(' ')[1];
    try{
        decodedToken = jwt.verify(token, 'secret');
    }catch(err){
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken){
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }  
    // we have valid token
    // extracting userId from the token
    req.userId = decodedToken.userId;
    next();
};