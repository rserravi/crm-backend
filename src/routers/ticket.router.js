const express = require("express");
const { userAuthorization } = require("../middleware/authorization.middleware");
const { insertTicket, getTickets, getTicketById } = require("../model/ticket/ticket.model");
const router = express.Router();

router.all("/", (req, res, next) =>{
    //res.json({message: "return form ticket router"});
    next();
});

// Create new ticket
router.post("/", userAuthorization, async (req,res)=>{
    try {
        //receive new ticket data
        const {subject, sender, message} = req.body;
    
        //insert in mongodb
        const userId = req.userId;
        const ticketObj = {
            clientId: userId,
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
});

// Get all tickets for a specific user
router.get("/", userAuthorization, async (req,res)=>{
    try {
        const userId = req.userId;
        const result = await getTickets(userId);
       
        return res.json({status:"success", result});

    } catch (error) {
        res.json({status:"error", message:error.message});
    }   
});

// Get a specific ticket for a specific user
router.get("/:_id", userAuthorization, async (req,res)=>{
    try {
        const {_id} = req.params;
        const clientId = req.userId;
        const result = await getTicketById(_id, clientId);
       
        return res.json({status:"success", result});

    } catch (error) {
        res.json({status:"error", message:error.message});
    }   
});


module.exports = router;
