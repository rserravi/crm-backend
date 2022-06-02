const express = require("express");
const req = require("express/lib/request");
const { json } = require("express/lib/response");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helpers");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helpers");
const { insertUser, getUserbyEmail, getUserbyId, updatePassword } = require("../model/user/User.model");
const { route}  = require("./ticket.router");
const router = express.Router();
const { userAuthorization} = require("../middleware/authorization.middleware");
const { setPasswordResetPin, getPinbyEmailPin, deletePin } = require("../model/restPin/RestPin.model");
const { emailProcessor } = require("../helpers/email.helpers");
 
 
router.all("/", (req, res, next) =>{
   //res.json({message: "return form user router"});
   next();
});

//Get user profile router
router.get("/", userAuthorization, async(req,res)=>{
    const _id = req.userId;
    const userProf = await getUserbyId(_id);
    res.json ({user: userProf});
})

 
//Create new user router
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

//Reset password 
router.post("/reset-password", async (req, res)=>{

    //A - Create and send password reset pin number
    //1- receive email
    const {email} = req.body;

    //2- check user exists for the email
    const user = await getUserbyEmail(email);

    if (user && user._id){
        //3- create unique 6 digit pin
        //4- save pin and email in database         
       const setPin = await setPasswordResetPin(email);
        //5 - email the pìn
       const result = await emailProcessor(email, setPin.pin, "request new password");

       console.log(result);

       if (result && result.messageId){
        res.json({status: "success", message:"If the email exists in our databes, the password reset pin will be send shortly"});
       }

       return res.json(setPin);
    }
    res.json({status: "error", message:"unable to process your request at the moment - Try again later"});

    res.json({status: "error", message:"If the email exists in our databes, the password reset pin will be send shortly"});
});

//Update password in DB
router.patch("/reset-password", async (req, res)=>{
    // 1- receive email, pin and new password
    const {email, pin, newPassword} = req.body;
    // 2- validate pin
    const getPin = await getPinbyEmailPin(email,pin);
    if (getPin._id){
        const dbDate = getPin.addedAt;
        const expiresIn = 1
        let expDate = dbDate.setDate(dbDate.getDate() + expiresIn);
        const today = new Date();
        if (today > expDate){
            return res.json({status: "error", message: "Invalid or expired pin"});
        }

        //3- encrypt new password
        const hashedPass = await hashPassword(newPassword);
        console.log( newPassword, + " "+ hashedPass);
        //4- update password in DB
        const user = await updatePassword(email,hashedPass);
        if (user._id) {
            // 5- send email notification
            const result = await emailProcessor(email, "", "password update success");
             if (result && result.messageId){
                res.json({status: "success", message:"Confirmation email sent. Check your inbox"});
             }
             //6- delete pins from database
            deletePin(email,pin);
            return res.json({status: "success", message:"Your password has been updated"})
        }
    }   
    res.json({status: "error", message:"Unable to update your password. Please, try again later."});
});

module.exports = router;