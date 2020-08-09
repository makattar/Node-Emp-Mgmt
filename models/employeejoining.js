const Sequelize = require('sequelize');
const db=require('../config/database');


const EmployeeJoining=db.define('employeejoining',{

    joindate:{
        type:Sequelize.DATE
    }
},
{
    tableName:'employeejoining'
});
module.exports=EmployeeJoining;