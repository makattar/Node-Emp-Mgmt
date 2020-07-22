const express =require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
//Database
const db=require('../config/database')
//model
const User=require('../models/user')

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
    User.findAll()
        .then(users=>{
            console.log(users)
            res.sendStatus(200)
        })
        .catch(err=>{
            console.log("Error : ",err)
            res.sendStatus(400)
        })
})

router.post('/registerUser',async(req,res)=>{
    //console.log(req)
    const {department,username,password} =req.body
    /*const data={
        username:'lookat',
        password:'lookat',
        role:'Human Resource'
    }
    let {username,password,role}=data;*/
    //Insert into model
    const insertedUser =await User.create({
        username:username,
        password:password,
        role:department
    })
        .then(user=>{
            //res.redirect('/users')
            res.json({status:"Success"})
        })
        .catch(err=>{
            //console.log('Error:',err)
            //res.sendStatus(400)
            res.json({status:"Failed",Error:err.stack})
        })
})

//Login user
router.post('/loginUser',async(req,res)=>{
    const {email,password}=req.body;
    console.log(req.body)
    //const password='bc'
    await User.findAll({
        where:{
            username:email
        }
    })
        .then(user=>{
            //const usernew=JSON.stringify(user)
            //console.log(user.length)
            //console.log(user[0]['id'])
            if(user.length === 1){
                if(user[0]['password']===password){
                    let payload = {role: user[0]['role'],username:user[0]['username']}
                    let token = jwt.sign(payload, 'secretKey')
                    res.status(200).send({token})
                }
                else{res.status(400).json({status:"Failed",Error:"Invalid Password"})}
            }
            else{
                res.status(400).json({status:"Failed",Error:"Invalid Email or Username"})
            }
            
        })
        .catch(err=>{
            //console.log("Error",err)
            res.status(400).json({status:"Failed",Error:err.stack})
        })

})

//get all users
router.get('/allusers',async(req,res)=>{
    const users= await User.findAll();
    console.log(users.every(user=>user instanceof User));
    res.json(users);
})

module.exports=router;