const express = require("express");
const { userAuthorization } = require("../middleware/authorization.middleware");
const { createNewTicketValidation, replayTicketMessageValidation } = require("../middleware/formValidadtion.middleware");
const { insertTicket, getTickets, getTicketById, updateClientReply, updateStatusClose, deleteTicket } = require("../model/ticket/ticket.model");
const router = express.Router();

router.all("/", (req, res, next) =>{
    //res.json({message: "return form ticket router"});
    next();
});

// Create new ticket
router.post("/", createNewTicketValidation, userAuthorization, async (req,res)=>{
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
        const result = await getTicketById(_id, clientId);
       
        return res.json({status:"success", result});

    } catch (error) {
        res.json({status:"error", message:error.message});
    }   
});

// Update ticket details ie. reply message 
router.put("/:_id", replayTicketMessageValidation, userAuthorization, async (req,res)=>{
    try {
        const {message, sender} = req.body;
        const {_id} = req.params;
        const result = await updateClientReply({_id, message, sender});
        if (result._id){
            return res.json({status:"success", message:"message updated"});
        }
       
        res.json({status:"error", message:"unable to update message. Please try again later"});

    } catch (error) {
        res.json({status:"error", message:error.message});
    }   
});

// Update ticket status to close
router.patch("/close-ticket/:_id", userAuthorization, async (req,res)=>{
    try {
        const {_id} = req.params;
        const clientId = req.userId;
        const result = await updateStatusClose({_id, clientId});
        if (result._id){
            return res.json({status:"success", message:"Ticket closed"});
        }
       
        res.json({status:"error", message:"unable to close the ticket. Please try again later"});

    } catch (error) {
        res.json({status:"error", message:error.message});
    }   
});

// Delete a ticket 
router.delete("/:_id", userAuthorization, async (req,res)=>{
    try {
        const {_id} = req.params;
        const clientId = req.userId;
        const result = await deleteTicket({_id, clientId});
        console.log(result);
        return res.json({status:"success", message:"ticket deleted"});

    } catch (error) {
        res.json({status:"error", message:error.message});
    }   
});

module.exports = router;
