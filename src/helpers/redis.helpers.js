
const redis = require("redis");
const client = redis.createClient({legacyMode: true}, process.env.REDIS_URL);


const setJWT = (key, value) =>{

    return new Promise(async(resolve, reject)=>{
  
        try {
            await checkRedis();
            client.set(key, value, (err, res)=>{
                if(err) reject(err);
                resolve(res);
            });
            client.quit;

        } catch (error) {
            reject(error);
        }
    })
 } 

const getJWT =  (key) =>{
    return new Promise(async(resolve, reject)=>{

        try {
            await checkRedis();

            client.get(key, (err, res)=>{
                if(err) reject(err)
                resolve(res)
            });


        } catch (error) {
            reject(error);
        }
    })
}

const checkRedis = async() => {
    let ready = false;
    client.on("ready", function (error){
        ready = true;
        console.log("Redis is ready");
    })
    if (!ready){
        console.log("Attempting to connect redis")
        try {
            await client.connect();
            ready = true;

        } catch (error) {
            console.log("Redis already connected...");
            ready = true;
        }    
    }
    return ready;
}

const deleteJWT = async key => {
    try {
        await checkRedis();
        client.del(key)
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    setJWT,
    getJWT,
    deleteJWT,
}