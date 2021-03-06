const express =require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const fetch = require("node-fetch");
const {Client}=require('pg');
const Sequelize = require('sequelize');
const path = require('path')
require('dotenv').config();
//Testing ORM
/*module.exports = new Sequelize('api', 'postgres', 'makattar', {
    host: 'localhost',
    dialect: 'postgres',
  
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
  });*/


//Testing ORM

module.exports = new Sequelize(process.env.DATABASE_URL,
{
  dialect: 'postgres',
  protocol: 'postgres'
});
