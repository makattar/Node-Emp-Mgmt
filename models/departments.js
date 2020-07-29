const Sequelize = require('sequelize');
const db=require('../config/database');


const Departments=db.define('departments',{
 
    deptname:{
        type:Sequelize.STRING
    }
})
module.exports=Departments;