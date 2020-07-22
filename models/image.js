const Sequelize = require('sequelize');
const db=require('../config/database');


const Imgdata=db.define('imagetable',{
 
    imgname:{
        type:Sequelize.TEXT
    },
    img:{
        type:Sequelize.BLOB('long')
    },
    empid:{
        type:Sequelize.INTEGER
    }
},{
    tableName:'imagetable'
})
module.exports=Imgdata;