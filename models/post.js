const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Post = sequelize.define('post',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull: false,
        primaryKey: true
    },
    title:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    imageUrl:{
        type: Sequelize.STRING,
        allowNull: false
    },
    content:{
        type: String,
        allowNull:false
    },
    creator:{
        type: String,
        allowNull:false
    }
})

module.exports = Post;