const Jwt = require('jsonwebtoken')
const { SECRET_KEY, ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = require('./constant')
const createError = require('http-errors')
const { UserModel } = require('../models/users')

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
        Jwt.sign(payload , REFRESH_TOKEN_SECRET_KEY , options , (err, token)=>{
            if(err) reject(createError.InternalServerError('خطای سرور'))
            resolve(token)
        })
    })
}

function verifyRefreshToken(token){
    return new Promise((resolve , reject) =>{
        Jwt.verify(token , REFRESH_TOKEN_SECRET_KEY , async (err , payload)=>{
            console.log('+++ Token ++++');
            console.log(token);
            console.log(err);
            if(err) reject(createError.Unauthorized('وارد حساب کاربری خود شوید'))
            const {mobile} = payload || {}
            console.log('(((Mobile)))');
            console.log({mobile});
            const user = await UserModel.findOne({mobile} , {otp:0 , password:0})
            if(!user) reject(createError.Unauthorized('کاربری یافت نشد'))
            resolve(mobile)
        
        })
    })
}

module.exports = {
    RandomNumberGenerator,
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken
}