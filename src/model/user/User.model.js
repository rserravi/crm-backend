const { reject } = require("bcrypt/promises");
const {UserSchema} = require("./User.schema");

const insertUser = userObj => {
    return new Promise((resolve, reject)=>{
        UserSchema(userObj)
        .save()
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
};

const getUserbyEmail = email =>{
    return new Promise((resolve,reject)=>{
        if((!email)) return false;
        try{ 
            UserSchema.findOne({email}, (error, data)=>{
            if(error){
                resolve(error);
            }
            resolve(data);
            })
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    insertUser,
    getUserbyEmail,
};