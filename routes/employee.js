const express =require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const multiparty=require('multiparty');
const multer = require('multer');
//Database
const db=require('../config/database')
//model
const Employee=require('../models/employee')
const Imgdata=require('../models/image')
//Multer config
const storage = multer.memoryStorage()
const upload =multer({
  storage : storage,
  fileFilter:(req,file,cb)=>{
    if(file.mimetype=="image/png"||file.mimetype=="image/jpg"||file.mimetype=="image/jpeg"){
      cb(null,true);
    }else{
      cb(null,false);
      return cb(new Error("Only images allowed").httpStatusCode=400);
    }
  }
});

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
    Employee.findAll()
        .then(employees=>{
            console.log(JSON.stringify(employees))
            res.sendStatus(200)
        })
        .catch(err=>{
            console.log("Error : ",err)
            res.sendStatus(400)
        })
})
//Get employee list
router.get('/emp-list',verifyToken,async(req,res)=>{
    await Employee.findAll()
        .then(employees=>{
            res.json(employees)
        })
        .catch(err=>{
            console.log('Error',err.stack)
            res.json({status:"Failed",Error:err.stack})
        })
})

//Add employee data as well as profile pic
router.post('/addempToDatabase',upload.single('img'),verifyToken,async(req,res,next)=>{
    const file =req.file
    var insertedemployeeid
    const { name, email,dob,salary,contactno,department,jobtype,doj} = req.body
    //departments=["Human Resource","Software Development","Management","Networking","Security"];
    let departmentNo
    let jobTypeNo
    let numbercontactno
    numbercontactno=Number(contactno)
    switch(department){
        case "Human Resource":
            departmentNo=1
            break
        case "Software Development":
            departmentNo=2
            break
        case "Management":
            departmentNo=3
            break
        case "Networking":
            departmentNo=4
            break
        case "Security":
            departmentNo=5
            break
    }
    switch(jobtype){
        case "part-time":
            jobTypeNo=1
            break
        case "full-time":
            jobTypeNo=2
            break
    }
    console.log(req.body)
    await Employee.create({
        name:name,
        contactno:numbercontactno,
        email:email,
        dob:dob,
        salary:salary,
        jobtype:jobTypeNo,
        department:departmentNo,
        doj:doj
    })
        .then(employee=>{
            //console.log("Employee id is")
            //console.log(employee.id)
            insertedemployeeid=employee.id
            res.json({status:"Success"})
        })
        .catch(err=>{
            res.json({status:"Failed",Error:err.stack})
        })
    console.log("Outside of function : ",insertedemployeeid)
    if(!file){
    const error = new Error("No image")
    error.httpStatusCode = 400
    return next(error)
    //console.log("In error file is empty")
  }  
  //Image insertion

  await Imgdata.create({
    imgname:req.file.originalname,
    //imgname:name,
    img:req.file.buffer,
    empid:insertedemployeeid
  }).then(data=>{
    //console.log(JSON.stringify(data))
    console.log("Success image inserted")
    })
    .catch(err=>{
    //res.json({status:"Failed",Error:err.stack})
    console.log("Something wrong image insertion ",err.stack)
    
    })
  
})
//Delete employee profile pic and data
router.post('/delempFromDatabase',verifyToken,async(req,res)=>{
    const {id} = req.body
    //Delete image Of employee first
    await Imgdata.destroy({
        where:{
            empid:id
        }
    }).then(data=>{console.log("Deleted Image successfull")})
        .catch(err=>{console.log("Delete image error")})
    //Delete employee data second
    await Employee.destroy({
        where:{
            id:id
        }
    })
    .then(employee=>{
        console.log(employee)
        res.json({status:"Success",RowsDeleted:employee})
    })
    .catch(err=>{
        res.json({status:"Failed",Error:err.stack})
    })
})
//update employee data only
router.post('/updateempToDatabase',verifyToken,async(req,res)=>{
    const { id,name, email,dob,salary,contactno,department,jobtype,doj } = req.body
    //departments=["Human Resource","Software Developement","Management","Networking","Security"];
    let departmentNo
    let jobTypeNo
    let numbercontactno
     numbercontactno=Number(contactno)
    switch(department){
        case "Human Resource":
            departmentNo=1
            break
        case "Software Development":
            departmentNo=2
            break
        case "Management":
            departmentNo=3
            break
        case "Networking":
            departmentNo=4
            break
        case "Security":
            departmentNo=5
            break
    }
    switch(jobtype){
        case "part-time":
            jobTypeNo=1
            break
        case "full-time":
            jobTypeNo=2
            break
    }
    await Employee.update({
        name:name,
        contactno:numbercontactno,
        email:email,
        dob:dob,
        salary:salary,
        jobtype:jobTypeNo,
        department:departmentNo,
        doj:doj
    },
        {
            where:{
                id:id
            }
        })
        .then(employee=>{
            res.json({status:"Success", RowsUpdated:employee.length})
        })
        .catch(err=>{
            res.json({status:"Failed",Error:err.stack})
        })

})
//Fetch employee image
router.post('/getEmpImg',verifyToken,async(req,res)=>{
    const {id}=req.body
    await Imgdata.findAll({
        attributes:['img'],
        where:{
            empid:id
        }
    }).then(image=>{
        console.log(image)
        res.json({'ImageData':image[0]['img']})
    })
    .catch(err=>{
        console.log(err.stack)
        res.json({status:"Failed",Error:err.stack})
    })
    //console.log(req.body)
    //res.json({'status':"Success"})
})
module.exports=router;