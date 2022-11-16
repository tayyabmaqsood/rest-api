const Sequelize = require('sequelize');

const sequelize = new Sequelize('rest-api', 'root', '123456',{
    dialect: 'mysql',
    host:'localhost'
});

module.exports = sequelize;

