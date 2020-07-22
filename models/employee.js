const Sequelize = require('sequelize');
const db=require('../config/database');


const Employee=db.define('employee',{
 
    name:{
        type:Sequelize.STRING
    },
    contactno:{
        type:Sequelize.TEXT
    },
    email:{
        type:Sequelize.CITEXT
    },
    dob:{
        type:Sequelize.DATE
    },
    salary:{
        type:Sequelize.INTEGER
    },
    jobtype:{
        type:Sequelize.INTEGER
    },
    department:{
        type:Sequelize.INTEGER
    },
    doj:{
        type:Sequelize.DATE
    }
},
{
    tableName:'employees'
});
module.exports=Employee;