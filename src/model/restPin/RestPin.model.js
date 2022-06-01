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

module.exports = {
    setPasswordResetPin,
}