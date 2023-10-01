const { verifyAccessToken, checkRole } = require('../http/middelwares/verifyAccessToken')
const redisClient = require('../utils/init_redis')
const { AdminRoutes } = require('./admin/admin.routes')
const { HomeRoutes } = require('./api')
const { DeveloperRoutes } = require('./developer.routes')
const { usreAuthRoutes } = require('./user/auth')
const router = require('express').Router()


redisClient.set('key', 'value', (err, reply) => {
    if (err) throw err;
    console.log(reply);

    redisClient.get('key', (err, value) => {
        if (err) throw err;
        console.log(value);
    });
})






// redisClient.set('key' , 'value' , (err,reply)=>{
    //     if(err) console.log(err.message);
    //     console.log(reply);
    // })
    // redisClient.get('key' , (err , value)=>{
        //     if(err) console.log(err.message);
        //     console.log(value);
        // })
        
        
        
        // function getCacheById(key) {
        //     return new Promise((resv, rej) => {
        //       redisClient.set(key , (err, reply) => {
        //         if(err) rej(console.log(err.message))
        //         resv(reply);
        //       });
        //       redisClient.get(key, (err, value) => {
        //         if(err) rej(console.log(err.message))
        //         resv(value);
        //       });
        //     })
            
        //   }
        
        //   getCacheById()
       
       
       
        // (async() => {
//     await redisClient.set('key' , 'value')
//     const value = redisClient.get('key')
//     console.log(value);
// })()

router.use('/user' , usreAuthRoutes)
router.use('/developer' , DeveloperRoutes)
router.use('/Admin' , verifyAccessToken , AdminRoutes)
router.use('/' , HomeRoutes)
module.exports = {
    AllRoutes: router
}