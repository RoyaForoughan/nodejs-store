const redisDB = require('redis')
//const redisClient = redisDB.createClient()
const redisClient = redisDB.createClient({
    host: 'localhost',
    port: 6379,
    legacyMode:false //********New Addition - set legacy mode to true.*******
})
redisClient.connect()
redisClient.on('connect' ,() => console.log('connect to redis'))
redisClient.on('ready' ,() => console.log('Connected to Redis and ready to use...'))
redisClient.on('error' , (err) => console.log('RedisError : ' + err.message))
redisClient.on('end' ,() => console.log('disconnected to redis...'))

module.exports = redisClient