const Sequelize = require('sequelize');
const db=require('../config/database');


const Jobtype=db.define('jobtype',{
 
    jobtype:{
        type:Sequelize.STRING
    }
},
{
    tableName:'jobtype'
})
module.exports=Jobtype;
