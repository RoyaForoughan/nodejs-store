const { verifyAccessToken } = require('../http/middelwares/verifyAccessToken')
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





router.use('/user' , usreAuthRoutes)
router.use('/developer' , DeveloperRoutes)
router.use('/Admin' , verifyAccessToken , AdminRoutes)
router.use('/' , HomeRoutes)
module.exports = {
    AllRoutes: router
}