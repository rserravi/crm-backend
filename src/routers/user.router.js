const express = require("express");
const { hashPassword } = require("../helpers/bcrypt.helpers");
const { insertUser } = require("../model/user/User.model");
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

module.exports = router;