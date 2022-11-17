const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = sequelize.define('user',{
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    status:{
        type: Sequelize.STRING
    }
})
module.exports = User;