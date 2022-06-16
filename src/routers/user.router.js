const express = require("express");
const req = require("express/lib/request");
const { json } = require("express/lib/response");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helpers");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helpers");
const { insertUser, getUserbyEmail, getUserbyId, updatePassword, storeUserRefreshJWT, verifyUser } = require("../model/user/User.model");
const { route}  = require("./ticket.router");
const router = express.Router();
const { userAuthorization} = require("../middleware/authorization.middleware");
const { setPasswordResetPin, getPinbyEmailPin, deletePin } = require("../model/restPin/RestPin.model");
const { emailProcessor } = require("../helpers/email.helpers");
const { resetPassReqValidation, updatePassValidation, newUserValidation } = require("../middleware/formValidadtion.middleware");
const { deleteJWT } = require("../helpers/redis.helpers");
const { randomCrypto } = require("../helpers/crypto.helpers");
const verificationURL = process.env.VERIFICATION_URL;
 
 
router.all("/", (req, res, next) =>{
   //res.json({message: "return form user router"});
   next();
});

//Get user profile router
router.get("/", userAuthorization, async(req,res)=>{
    const _id = req.userId;
    console.log("¿Es el mismo user id?");
    console.log(_id);
    const userProf = await getUserbyId(_id);
    console.log("Getting user PROFILE");
    console.log(userProf);
    const {name, email} = userProf;
    res.json ({
        user: {
            _id,
            name,
            email,
        },
    });
})
 
//Create new user router
router.post("/", newUserValidation, async(req, res) => {
   const {name, company, address, phone, email, password } = req.body;
   try {
       //hash password
       const hashedPass = await hashPassword(password);
       const randomID = randomCrypto();
       const newUserObj = {
           name,
           company,
           address,
           phone,
           email,
           password:hashedPass,
           randomURL:randomID,
       }
       const result = await insertUser(newUserObj);
       console.log(result);

       //Send confirmation email
      
       await emailProcessor(email, "", "new user confirmation",verificationURL + "/" + randomID+ "/" + email);
 
       res.json({status:"success", message: "New user created", result});
   } catch(err){
    let message = "Unable to create new user at the moment. Please contact administrator"
    if (err.message.includes("duplicate key")){
        message = "This email already has an account"
    }
       res.json({status:"error", message});
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
       console.log("getting user in BACKEND")
       console.log(user);
       console.log("Email :" + user.email + ". Pass = " + user.password);
       const passFromDb = user && user.id ? user.password : null;

       if (!user.isVerified){
        return res.json({status: "error", message: "Please check your email to verify your account"})
       }

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
       console.log("EL ERROR SE HA PRODUCIRO EN LA RUTA user.router.js")
       console.log(error);
   } 
});

//Reset password 
router.post("/reset-password", resetPassReqValidation, async (req, res)=>{

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

    res.json({status: "error", message:"If the email exists in ourAdde databes, the password reset pin will be send shortly"});
});

//Update password in DB
router.patch("/reset-password", updatePassValidation, async (req, res)=>{
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

//Log out and clear tokens
router.delete("/logout", userAuthorization, async(req,res)=>{
    //1 - get jwt and verify // DONE by Middleware

    const {authorization} = req.headers;
    const _id = req.userId;
    //2 - delete accessJWT form redis database
    deleteJWT({authorization});
    //3 - delete refreshJWT from mongodb
    const result = await storeUserRefreshJWT(_id, "");
    if (result._id){
        return res.json({status:"success", message:"Logged out"});
    }
    res.json({status:"error", message:"Unable to log you out. Try again later"});

})

//Verify user after signup
router.patch("/verify", async(req,res)=>{
    try {
        randomURL = req.body.randomUrl;
        email = req.body.email;
        //update user database
        const result =  await verifyUser(randomURL,email);
        if (!result){
            return res.json({status: "error", message: "Invalid request"})
        }
        if(result._id) {
            return res.json({status: "success", message: "Your account has been activated. You may sing in now"})
        }
        return res.json({status: "error", message: "Invalid request"})
    } catch (error) {
        console.log(error)
        return res.json({status: "error", message: error.message})

    }
  
})



module.exports = router;