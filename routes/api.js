const express =require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const fetch = require("node-fetch");
const {Client}=require('pg');

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
    res.send('From API route')
})
router.post('/enroll', (req, res)=> {
    console.log(req.body)
    res.status(200).send({"message": "Data received"});
  })
//Dummy Login 
/*router.post('/login',(req,res)=>{
      console.log(req.body)
      let userData=req.body
      if(userData.email==="admin" && userData.password==="admin"){
          //res.status(200).send(userData)
          let payload={subject:userData.email}
          let token=jwt.sign(payload,'secretKey')
          res.status(200).send({token})
      }else{
          res.status(401).send("Invalid Email and Password")
      }
})*/
//Database request to fetch all employees
router.get('/emp-list',verifyToken,async(req,res)=>{
    const client=new Client({
        user:'postgres',
        host:'localhost',
        database:'api',
        password:'makattar',
        port:5432,
    });
    await client.connect();
    const result=await client.query('SELECT * FROM employees ORDER BY id ASC',async(err,data)=>{
        await err ? res.json({status:"Failed",Error:err.stack}) : res.json(data.rows)
        await client.end()
    });
    
    //Dummy Data when Database is absent 
    let empList=[
        {
            "_id":"1",
            "name":'Ben',
            "email":"Ben@AB.COM",
            "DOB":new Date("2020-07-03"),
            "salary":55000,
            "contactNo":9191191919,
            "department":"Software Developement",
            "jobType":"part-time",
            "DOJ":new Date('2020-07-03')
        },
        {
            "_id":"2",
            "name":'Sara',
            "email":"Sara@AB.COM",
            "DOB":new Date("May 05,1970"),
            "salary":35000,
            "contactNo":9191196719,
            "department":"Networking",
            "jobType":"part-time",
            "DOJ":new Date("November 13, 1990")
        },
        {
            "_id":"3",
            "name":'Mark',
            "email":"Mark@AB.COM",
            "DOB":new Date("August 15,1974"),
            "salary":68000,
            "contactNo":9671196719,
            "department":"Security",
            "jobType":"full-time",
            "DOJ":new Date("November 1, 1989")
        },
        {
            "_id":"4",
            "name":'Pam',
            "email":"Pam@AB.COM",
            "DOB":new Date("December 30,1983"),
            "salary":70000,
            "contactNo":9678896719,
            "department":"Management",
            "jobType":"part-time",
            "DOJ":new Date("November 1, 1989")
        },
        {
            "_id":"5",
            "name":'Todd',
            "email":"todd@AB.COM",
            "DOB":new Date("October 27,1979"),
            "salary":53000,
            "contactNo":9698896719,
            "department":"Human Resource",
            "jobType":"part-time",
            "DOJ":new Date("November 1, 1990")
        }
    ]
    //res.json(result.rows)
})
//Database request to add a new employee
router.post('/addempToDatabase',verifyToken,async(req,res)=>{
    const { name, email,dob,salary,contactno,department,jobtype,doj } = req.body
    //departments=["Human Resource","Software Developement","Management","Networking","Security"];
    let departmentNo
    let jobTypeNo
    let numbercontactno

    numbercontactno=Number(contactno)
    switch(department){
        case "Human Resource":
            departmentNo=1
            break
        case "Software Developement":
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


    //console.log("Department no is : ",departmentNo)
    //console.log("JobType Variable Contains ",jobTypeNo)
    //console.log("Phone no is ",contactno)
    const client=new Client({
        user:'postgres',
        host:'localhost',
        database:'api',
        password:'makattar',
        port:5432,
    });
    await client.connect();
    await client.query('INSERT INTO employees (name,contactno,email,salary,jobtype,department,dob,doj) VALUES ($1, $2, $3, $4, $5, $6,$7,$8)',
     [name,numbercontactno, email,salary,jobTypeNo,departmentNo,dob,doj],async(err,data)=>{
         await err ? res.json({status:"Failed",Error:err.stack}) : res.json({status:"Success", RowsInserted:data.rowCount})
         await console.log(data)
         await client.end()
     });
    


    
}) 
//Update employee in database
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
        case "Software Developement":
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

    const client=new Client({
        user:'postgres',
        host:'localhost',
        database:'api',
        password:'makattar',
        port:5432,
    });
    await client.connect();
    await client.query('UPDATE employees SET name = $1, contactno = $2, email = $3, salary = $4, jobtype = $5, department = $6, dob = $7, doj = $8   WHERE id = $9 ',
     [name,numbercontactno, email,salary,jobTypeNo,departmentNo,dob,doj,id],async(err,data)=>{
         await err ? res.json({status:"Failed",Error:err.stack}) : res.json({status:"Success", RowsUpdated:data.rowCount})
         await console.log(data)
         await client.end()
     });
    


    
}) 
//Delete A employee
router.post('/delempFromDatabase',verifyToken,async(req,res)=>{
    const {id} = req.body
    const client=new Client({
        user:'postgres',
        host:'localhost',
        database:'api',
        password:'makattar',
        port:5432,
    });
    await client.connect();
    await client.query('DELETE FROM employees  WHERE id = $1 ',
     [id],async(err,data)=>{
         await err ? res.json({status:"Failed",Error:err.stack}) : res.json({status:"Success", RowsDeleted:data.rowCount})
         await console.log(data)
         await client.end()
     });
    


    
})
//Required Login Credentials
router.post('/loginUser',async(req,res)=>{
    console.log("In Login user section from server")
    let userData = req.body
    
    //User Info
    const client=new Client({
        user:'postgres',
        host:'localhost',
        database:'api',
        password:'makattar',
        port:5432,
    });
    //Connect with database
    await client.connect();
    //Querying
    await client.query('SELECT * FROM users WHERE email = $1 ',
     [userData.email],async(err,data)=>{
         if(err){
            res.json({status:"Failed",Error:err.stack})
            console.log("Error : check error")
            await client.end()
         }
         else{
         console.log(data)
         if(data.rowCount!==1){
            res.json({status:"Failed",Error:"Invalid Email"})
            console.log("In Invalid email")
            await client.end()
            }
        else{
            if( userData.password!==data.rows[0].password ){
                //console.log("Password in database : ",data.rows[0].password)
                res.json({status:"Failed",Error:"Invalid Password"})
                console.log("In Invalid Password")
                //console.log("Userdata : ",userData)
                await client.end()
            }
            else{
                let payload = {subject: data.id}
                let token = jwt.sign(payload, 'secretKey')
                res.status(200).send({token})
                await client.end()
            }
        }}
     });

})

module.exports=router