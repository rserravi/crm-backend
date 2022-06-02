const { reject } = require("bcrypt/promises");
const randomGenerator = require("../../utils/randomGenerator");
const { ResetPinSchema } = require("./RestPin.schema");

const setPasswordResetPin = (email) =>{
    const randPin = randomGenerator(6);
    const resetObj = {
        email,
        pin : randPin,
    }
    return new Promise((resolve,reject) => {
        ResetPinSchema(resetObj)
            .save()
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getPinbyEmailPin = (email, pin) =>{
    return new Promise((resolve, reject)=>{
        try {
            ResetPinSchema.findOne({email, pin}, (error, data)=>{
                if (error){
                    console.log(error);
                    resolve(false);
                }

                resolve(data);
            })
        
        } catch (error) {
            reject(error);
            console.log(error);
        }
    });
}

const deletePin = (email, pin) =>{
    try {
        ResetPinSchema.findOneAndDelete({email, pin}, (error, data)=>{
            if (error){
                console.log(error);
            }
        })
    
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    setPasswordResetPin,
    getPinbyEmailPin,
    deletePin,
}