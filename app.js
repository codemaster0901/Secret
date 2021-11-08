require("dotenv").config()
const express =require("express");
const bodyParser=require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");

const app = express();
const encrypt = require("mongoose-encryption") ;
var secret = "this is my secret";
// userSchema.plugin(encrypt, { secret: secret });
 app.use(express.static("public"));
 app.set('view engine','ejs');
 app.use(bodyParser.urlencoded({
   extended:true
 }));
 mongoose.connect("mongodb://localhost:27017/usersDB");
const userSchema = new mongoose.Schema({
  email:String,
  password:String
});
userSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields: ['password'] });
const user = mongoose.model("User",userSchema);
app.get('/',(req,res)=>{
  res.render("home");
})
app.get('/login',(req,res)=>{
  res.render("login");
})
app.get('/register',(req,res)=>{
  res.render("register");
})
app.post('/register',(req,res)=>{
  const new_user= new user({
    email:req.body.username,
    password:req.body.password

  });
  new_user.save((err)=>{
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  })

})
app.post("/login",(req,res)=>{
  const username = req.body.username;
  const password =req.body.password;
  user.findOne({email:username},(err,result)=>{
    if(err){
      console.log(err);
    }else{
      if(result){
        if(result.password === password){
          res.render("secrets");
        }
      }
    }
  });;
});


app.listen('3000',()=>{
  console.log("your server is tuned in 3000 port");
})
