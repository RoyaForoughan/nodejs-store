const createError = require('http-errors')
const Jwt = require('jsonwebtoken')
const { ACCESS_TOKEN_SECRET_KEY } = require('../../utils/constant')
const { UserModel } = require('../../models/users')
function verifyAccessToken(req,res,next){
    const headers = req.headers
    const [bearer , token] = headers?.['authorization']?.split(' ') || []
    if(token && ['Bearer' , 'bearer'].includes(bearer)){
        Jwt.verify(token ,ACCESS_TOKEN_SECRET_KEY ,async (err , payload) => {
            if(err) next(createError.Unauthorized('وارد حساب کاربری خود شوید'))
            const {mobile} = payload || {}
        const user = await UserModel.findOne({mobile} , {otp:0 , password:0})
        if(!user) next(createError.Unauthorized('کاربر یافت نشد'))
            req.user = user
            return next()
        } )
    }
    else return  next(createError.Unauthorized('وارد حساب کاربری خود شوید'))
}

module.exports = {
    verifyAccessToken
}