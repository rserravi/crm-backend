const Joi = require("joi");
const { deleteTicket } = require("../model/ticket/ticket.model");

const email= Joi.string()
        .email({ minDomainSegments: 2, 
        tlds: { allow: ['com', 'net'] } 
                })
const pin= Joi.number().min(100000).max(999999).required();
const newPassword = Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required();

const shortStr = Joi.string().min(2).max(50);
const longStr = Joi.string().min(2).max(1000);
const dt = Joi.date();
                

const resetPassReqValidation = (req, res, next) =>{
        const schema = Joi.object({email});
        const value = schema.validate(req.body);
        if(value.error){
                res.json({status: "error", message: value.error.message});
        }
        next();
}

const updatePassValidation = (req, res, next) =>{
        console.log(req.body);
        const schema = Joi.object({email, pin, newPassword});

        const value = schema.validate(req.body);
        if(value.error){
                res.json({status: "error", message: value.error.message});
        }
        next();
}

const createNewTicketValidation = (req, res,next)=>{
       const schema = Joi.object({
        subject: shortStr.required(),
        sender: shortStr.required(),
        message: longStr.required(),
        issueDate: dt.required(),
       })
       
       const value = schema.validate(req.body);
       if(value.error){
               return res.json({status: "error", message: value.error.message});
        }
        next();
}

const replayTicketMessageValidation = (req, res,next)=>{
        const schema = Joi.object({
         sender: shortStr.required(),
         message: longStr.required()
        })
        
        const value = schema.validate(req.body);
        if(value.error){
                return res.json({status: "error", message: value.error.message});
         }
         next();
 }

module.exports = {
        resetPassReqValidation,
        updatePassValidation,
        createNewTicketValidation,
        replayTicketMessageValidation
}