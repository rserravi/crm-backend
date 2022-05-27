const redis = require("redis");
const client = redis.createClient({legacyMode: true}, process.env.REDIS_URL);

const setJWT = (key, value) =>{

    return new Promise((resolve, reject)=>{
  
        try {
            if (!client.connected) {client.connect();}
            client.on("error", function (error){
                console.error(error);
            });
            client.set(key, value, (err, res)=>{
                if(err) reject(err);
                resolve(res);
            });
        } catch (error) {
            reject(error);
        }
    })
 } 

const getJWT = (key) =>{
    return new Promise((resolve, reject)=>{

        try {
            if (!client.connected) {client.connect();}
            client.on("error", function (error){
                console.error(error);
            });
            client.get(key, (err, res)=>{
                if(err) reject(err)
                resolve(res)
            });
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    setJWT,
    getJWT,
}