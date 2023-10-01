const Jwt = require('jsonwebtoken')
const {  ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = require('./constant')
const createError = require('http-errors')
const { UserModel } = require('../models/users')
const redisClient = require('./init_redis')
const path = require('path')
const fs = require('fs')

function RandomNumberGenerator(){
    return Math.floor((Math.random() * 90000) + 10000)
}
function signAccessToken(userId){
    return new Promise(async(resolve , reject)=>{
        const user = await UserModel.findById(userId)
        const payload = {
            mobile : user.mobile,          
        }        
        const options = {
            expiresIn : '1h'
        }
        Jwt.sign(payload , ACCESS_TOKEN_SECRET_KEY , options , (err , token) => {
            if(err)  reject(createError.InternalServerError('خطای سرور'))
            resolve(token)
        })
    })
}
function signRefreshToken(userId){
    return new Promise(async(resolve , reject) => {
        const user = await UserModel.findById(userId)
        const payload = {
            mobile : user.mobile
        }
        const options ={
            expiresIn : '1y'
        }
        Jwt.sign(payload , REFRESH_TOKEN_SECRET_KEY , options ,async (err, token)=>{
            if(err) reject(createError.InternalServerError('خطای سرور'))
            await redisClient.SETEX(String(userId) , (365*24*60*60) , token)
            resolve(token)
        })
    })
}

function verifyRefreshToken(token){
    return new Promise((resolve , reject) =>{
        Jwt.verify(token , REFRESH_TOKEN_SECRET_KEY , async (err , payload)=>{
            if(err) reject(createError.Unauthorized('وارد حساب کاربری خود شوید'))
            const {mobile} = payload || {}
            const user = await UserModel.findOne({mobile} , {otp:0 , password:0})
            if(!user) reject(createError.Unauthorized('کاربری یافت نشد'))
            const refreshToken = await redisClient.get(String(user?._id))
            if(token === refreshToken) return  resolve(mobile)       
            reject(createError.Unauthorized('ورود مجدد به حساب کاربری انجام نشد'))
        })
    })
}

function deleteFileInPublic(fileAddress){
    if(fileAddress){
        const pathFile = path.join(__dirname , '..' , '..' , 'public' , fileAddress)
        if(fs.existsSync(pathFile)) fs.unlinkSync(pathFile)
    }
}

module.exports = {
    RandomNumberGenerator,
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    deleteFileInPublic
}