const mongoose = require("mongoose")
const UserSchema = mongoose.Schema ({
    name: {
        type: String,
        maxLenght: 50,
        required: true
    },
    company: {
        type: String,
        maxLenght: 50,
        required: true
    },
    address: {
        type: String,
        maxLenght: 100
    },
    phone: {
        type: Number,
        maxLenght: 11
    },
    email: {
        type: String,
        maxLenght: 50,
        required: true
    },
    password: {
        type: String,
        minLength: 8,
        maxLenght: 100,
        required: true
    }
});

module.exports ={
    UserSchema: mongoose.model('user', UserSchema)
}