const jwt = require("jsonwebtoken");

const createAccessJWT = (payload) =>{
    const accessJTW = jwt.sign({payload}, 
        process.env.JWT_ACCESS_SECRET,
        {expiresIn:"15m"}
        );

    return Promise.resolve(accessJTW);
}

const createRefreshJWT = (payload) =>{
    const refreshJWT = jwt.sign({payload}, 
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: "30d"},
        );

    return Promise.resolve(refreshJWT);
}

module.exports = {
    createAccessJWT,
    createRefreshJWT,
}