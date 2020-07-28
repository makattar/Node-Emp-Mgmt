const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Sequelize = require('sequelize');
const path = require('path');
const multiparty=require('multiparty');
const Imgdata=require('./models/image')
//Api routes
const api=require('./routes/api');
const PORT = process.env.PORT || 3000;
const app = express();
const multer = require('multer');
require('dotenv').config();
//console.log(process.env);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors())
app.use('/api',api)
//Set storage engine
/*const storage =multer.diskStorage({
  destination:'./uploads/',
  filename:function(req,file,cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});*/

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
//Database
const db=require('./config/database')
//authenticate database
db.authenticate()
  .then(()=>console.log("Databse Connected..."))
  .catch(err=>console.log('Error: '+err))

app.get('/', function(req, res) {
	res.send('<h1>Hello from server</h1>')
})
//User routes
app.use('/users',require('./routes/user'));
//employees routes
app.use('/employees',require('./routes/employee'));
/*app.post('/upload',(req,res)=>{
  console.log("In upload section")
  let form = new multiparty.Form();
  form.parse(req,function(err,fields,files){
    console.log('fields are : ',fields)
    console.log("Files are : ",files)
    Object.keys(fields).forEach(function(name){
      console.log('got field named :'+name)
    });
  });
  
  //console.log(req.body)
  res.json({status:"Success"})
})*/
//testing /Checking retrieve image
/*app.post('/getimage',async(req,res)=>{
  var idOfemp=3
  let form = new multiparty.Form();
  //Parse form data
  await form.parse(req,async (err,fields,files)=>{
    //console.log("Fields are : ",fields)
    //console.log(fields['id'])
    //let {id}=fields;
    idOfemp=await Number(fields['id']);
    await console.log("Inside parse function : ",idOfemp);
    await databaseCall();
  //console.log(id)
  });
  //Databse Call 
  async function databaseCall(){
    console.log("Outside of function : ",idOfemp);
    await Imgdata.findAll(
    {
      attributes:['img'],
      where:{
        id:idOfemp
      }
    }
  ).then(data=>{
    console.log(data[0]['img'])
    res.json({'ImageData':data[0]['img']})
  })
  .catch(err=>{
    console.log(err.stack)
  });
}//Databse call function end

})//End of get image
//testing /checking upload image using multer
app.post('/upload',upload.single('img'),async(req,res,next)=>{
  const file =req.file
  //console.log("Request body : ",req.body)
  console.log("Request files : ",req.file)
  let name=req.body.name
  console.log("Name",req.body.name)
  console.log("Email",req.body.email)
  console.log("dob",Date(req.body.dob))
  console.log("Salary",Number(req.body.salary))
  console.log("Contact no",Number(req.body.contactno))
  console.log("Department",req.body.department)
  console.log("Jobtype",req.body.jobtype)
  console.log("Doj",Date(req.body.doj))
  if(!file){
    const error = new Error("No image")
    error.httpStatusCode = 400
    return next(error)
  }  
  await Imgdata.create({
    //imgname:req.file.originalname,
    imgname:name,
    img:req.file.buffer
  }).then(data=>{
    //console.log(JSON.stringify(data))
    res.json({status:"Success"})
})
.catch(err=>{
    res.json({status:"Failed",Error:err.stack})
})
  //console.log(req.body)
  //res.json({status:"Success"})
})*/
//app.post('/enroll', function(req, res) {
//  console.log(req.body)
//  res.status(200).send({"message": "Data received"});
//})



app.listen(PORT, function(){
  console.log("Server running on localhost:" + PORT);
});
