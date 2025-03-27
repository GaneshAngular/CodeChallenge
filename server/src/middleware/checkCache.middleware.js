import redisClient from "../config/redis.config.js"



const checkCache = async(req, res, next) => {
    if(req.method!=='GET'){     
        const allKeys = await redisClient.keys('*');
        const url=req.originalUrl.split('?')
         const matchKeys=allKeys.filter(key=>key.match(new RegExp(url.length>0?url[0]:originalUrl)))
         if(matchKeys.length>0) await redisClient.del(matchKeys)
        return next()
    }
    
    const cacheKey = req.originalUrl
     const cachedResponse= await   redisClient.get(cacheKey)
        if (cachedResponse) {
            console.log("Fetching data from cache:", cacheKey)  // Log cache hit for debugging purposes
            res.json(JSON.parse(cachedResponse))
        } else {
            next()
        }
    
}

export default checkCache