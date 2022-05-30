const {verifyAccessJWT} = require("../helpers/jwt.helpers");
const {getJWT} = require("../helpers/redis.helpers");
const userAuthorization =  async (req, res, next) => {
    const {authorization} = req.headers;
    console.log (authorization);
    
    //1. verify is jwt is valid
    const decoded = await verifyAccessJWT(authorization);
    if(decoded.email){
        //2. check if jwt exist in redis
  
        const userId = await getJWT(authorization);

        console.log(userId);

        if (!userId){
            return res.status(303).json({message: "forbidden"});
        }

        req.userId = userId;
        return next();
    }
    
    //3. extract user id
    //4. get user profile based on user id.

    res.status(403).json({message: "forbidden"});
}

module.exports = {
    userAuthorization,
}