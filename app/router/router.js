//const redisClient = require('../utils/init_redis')
const { HomeRoutes } = require('./api')
const { usreAuthRoutes } = require('./user/auth')
const router = require('express').Router()
// (async() => {
//     await redisClient.set('key' , 'value')
//     const value = redisClient.get('key')
//     console.log(value);
// })

router.use('/user' , usreAuthRoutes)
router.use('/' , HomeRoutes)
module.exports = {
    AllRoutes: router
}