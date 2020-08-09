const express =require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const sequelize = require('sequelize');
const {Op}=require('sequelize');
const moment=require('moment');
//Database
const db=require('../config/database')
//model
const Employee=require('../models/employee')
const Imgdata=require('../models/image');
const DeletedEmployee = require('../models/deletedemployee');
const Jobtype=require('../models/jobtype');
const Departments=require('../models/departments');
const EmployeeJoining=require('../models/employeejoining');


//Token Verification
function verifyToken(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request')
    }
    let token =req.headers.authorization.split(' ')[1]
    if(token==="null"){
        return res.status(401).send('Unauthorized request')
    }
    let payload=jwt.verify(token,'secretKey')
    if(!payload){
        return res.status(401).send("Unauthorized request")
    }
    req.userName=payload.subject
    next()
}


router.get('/',(req,res)=>{
    res.json("Hello from dashboard")
})

router.get('/delete-emp-stat',verifyToken,async(req,res)=>{

        //await DeletedEmployee.findAll({attributes:[[sequelize.literal(`DATE("joindate")`),'date'],[sequelize.literal(`COUNT(*)`),'count']],group:['joindate']}).then(data=>{console.log(data)}).catch(err=>{console.log(err)})
        await DeletedEmployee.findAll({
            attributes:[[sequelize.fn('COUNT',sequelize.col('leavedate')),'no_date'],'leavedate'],
            where:{
                leavedate:{
                    [Op.gte]:moment().subtract(6,'months').toDate()
                }
            },
            order:[['leavedate','ASC']],
            group:'leavedate'
        }).then(data=>{
            xs=[]
            ys=[]
            //console.log(data)
            for (let i=0;i<data.length;i++){
                //console.log(data[i]["joindate"])
                //console.log(data[i].dataValues["no_date"])
                xs.push(data[i].dataValues["leavedate"])
                ys.push(data[i].dataValues["no_date"])
            }
            console.log(xs,"  ",ys);
            res.json({status:"Success",xpoints:xs,ypoints:ys})
        }).catch(err=>{
            res.json({status:"Failed",Error:err.stack})
        })
    })

router.get('/dept-wise-emp',verifyToken,async(req,res)=>{

        await Employee.findAll({
            attributes:[[sequelize.fn('COUNT',sequelize.col('department')),'no_dept'],'department'],
            group:'department'
        }).then(data=>{
            tempxs=[]
            xs=[]
            ys=[]
            //console.log(data)
            for (let i=0;i<data.length;i++){
                //console.log(data[i]["joindate"])
                //console.log(data[i].dataValues["no_date"])
                tempxs.push(data[i].dataValues["department"])
                ys.push(parseInt(data[i].dataValues["no_dept"]))
            }
            //console.log(tempxs,"  ",ys);
            let departmentsArray=["No dept","Human Resource","Software Development","Management","Networking","Security"]
            for(let j=0;j<tempxs.length;j++){
                xs.push(departmentsArray[tempxs[j]]);
            }
            console.log(xs," ",ys)
            res.json({status:"Success",xpoints:xs,ypoints:ys})
        }).catch(err=>{
            res.json({status:"Failed",Error:err.stack})
        })
        
})
router.get('/join-emp-stat',verifyToken,async(req,res)=>{
    await EmployeeJoining.findAll({
        attributes:[[sequelize.fn('COUNT',sequelize.col('joindate')),'no_doj'],'joindate'],
        where:{
            joindate:{
                [Op.gte]:moment().subtract(6,'months').toDate()
            }
        },
        order:[['joindate','ASC']],
        group:'joindate'
    }).then(data=>{
        xs=[]
        ys=[]
        //console.log(data)
        for (let i=0;i<data.length;i++){
            //console.log(data[i]["joindate"])
            //console.log(data[i].dataValues["no_date"])
            xs.push(data[i].dataValues["joindate"])
            ys.push(data[i].dataValues["no_doj"])
        }
        console.log(xs,"  ",ys);
        res.json({status:"Success",xpoints:xs,ypoints:ys})
    }).catch(err=>{
        res.json({status:"Failed",Error:err.stack})
    })
    
})

module.exports=router;