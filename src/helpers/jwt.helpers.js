const jwt = require("jsonwebtoken");
const { storeUserRefreshJWT } = require("../model/user/User.model");
const { setJWT } = require("./redis.helpers");
 
const createAccessJWT = async(email, _id) =>{
try {
   const accessJTW = jwt.sign({email},
       process.env.JWT_ACCESS_SECRET,
       {expiresIn:"15m"}
       );
    
    await setJWT(accessJTW, _id);
    return Promise.resolve(accessJTW);
           
    } catch (error) {
        return Promise.reject(error);
      }
};
 
const createRefreshJWT = async (payload, _id) =>{
try {
   const refreshJWT = jwt.sign({payload},
       process.env.JWT_REFRESH_SECRET,
       {expiresIn: "30d"},
       );
    
    await storeUserRefreshJWT(_id, refreshJWT);
    return Promise.resolve(refreshJWT);
    } catch (error) {
        return Promise.reject(error);
    }
}
 
module.exports = {
   createAccessJWT,
   createRefreshJWT,
}
