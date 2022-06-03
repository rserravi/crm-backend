const express = require("express");
const { insertTicket } = require("../model/ticket/ticket.model");
const router = express.Router();

router.all("/", (req, res, next) =>{
    //res.json({message: "return form ticket router"});
    next();
});

// Create new ticket
router.post("/", async (req,res)=>{
    try {
        //receive new ticket data
        const {subject, sender, message} = req.body;
    
        //insert in mongodb
        const ticketObj = {
            clientId: "6290f58ce0a8a43c68266246", //TEMPORAL, luego vendrá de token
            subject,
            conversation:[
                {
                    sender,
                    message,
                },
            ],
        }

        const result = await insertTicket(ticketObj);
        if (result._id){
            return res.json({status:"success", message:"New ticket has been created"});
        };
    } catch (error) {
        res.json({status:"error", message:error.message});
    }   
})

module.exports = router;
