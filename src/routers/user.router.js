const express = require("express");
const req = require("express/lib/request");
const { json } = require("express/lib/response");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helpers");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helpers");
const { insertUser, getUserbyEmail } = require("../model/user/User.model");
const { route}  = require("./ticket.router");
const router = express.Router();
 
 
router.all("/", (req, res, next) =>{
   //res.json({message: "return form user router"});
   next();
});
 
router.post("/", async(req, res) => {
   const {name, company, address, phone, email, password } = req.body;
   try {
       //hash password
       const hashedPass = await hashPassword(password);
 
       const newUserObj = {
           name,
           company,
           address,
           phone,
           email,
           password:hashedPass,
       }
       const result = await insertUser(newUserObj);
       console.log(result);
       res.json({message: "New user created", result});
   } catch(err){
       res.json({message: "Error en insertUser o user.router:", err});
   }
});
 
//User sign in Router
router.post("/login", async (req,res) =>{
   const {email, password} = req.body;
 
   ///hash password and compare with the one in db
 
   if (!email || !password){
       res.json({status: "error", message:"invalid form submission"});
 
   }
 
   try {
       const user = await getUserbyEmail(email);
       console.log(user);
       const passFromDb = user && user.id ? user.password : null;
      
       if(!passFromDb)
           return res.json({status: "error", message: "Invalid email or password"
       });
     
       const result = await comparePassword(password, passFromDb);
       console.log(result);
      
       if (!result) {
           return res.json({status: "error", message: "Incorrect Password"});
       }
       const accessJWT = await createAccessJWT(user.email, `${user._id}`);
       const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);
       return res.json({
           status:"success",
           message: "Login Successful",
           accessJWT,
           refreshJWT,
       });
 
   } catch (error) {
       console.log(error);
   } 
});

module.exports = router;