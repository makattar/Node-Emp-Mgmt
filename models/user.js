const Sequelize = require('sequelize');
const db=require('../config/database');


const User=db.define('user',{
 
    username:{
        type:Sequelize.STRING
    },
    password:{
        type:Sequelize.STRING
    },
    role:{
        type:Sequelize.STRING
    }
})
module.exports=User;