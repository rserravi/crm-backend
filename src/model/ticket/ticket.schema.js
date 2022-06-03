const mongoose = require("mongoose")
const TicketSchema = mongoose.Schema ({

    clientId:{
        type: mongoose.Schema.Types.ObjectId
    },
    subject: {
        type: String,
        maxLenght: 100,
        required: true,
        default: ""
    },

    openAt: {
        type: Date,
        required: true,
        default: Date.now()
    },

    status: {
        type: String,
        maxLenght: 50,
        required: true,
        default: "Pending operator response"
    },

    conversation: [
        {
            sender: {
                type: String,
                maxLenght: 50,
                required: true,
                default: ""
            },
            message: {
                type: String,
                maxLenght: 100,
                required: true,
                default: ""
            },
            msgAt: {
                type: Date,
                required: true,
                default: Date.now()
            }
        }
    ]
});

module.exports ={
    TicketSchema: mongoose.model('ticket', TicketSchema)
}