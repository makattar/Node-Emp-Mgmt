const Sequelize = require('sequelize');
const db=require('../config/database');


const DeletedEmployee=db.define('employee',{
 
    name:{
        type:Sequelize.STRING
    },
    email:{
        type:Sequelize.STRING
    },
    department:{
        type:Sequelize.STRING
    },
    joindate:{
        type:Sequelize.DATE
    },
    leavedate:{
        type:Sequelize.DATE
    }
},
{
    tableName:'deletedemployees'
});
module.exports=DeletedEmployee;