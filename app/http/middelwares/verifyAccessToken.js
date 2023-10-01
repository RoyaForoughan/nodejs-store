const createError = require('http-errors')
const Jwt = require('jsonwebtoken')
const { ACCESS_TOKEN_SECRET_KEY } = require('../../utils/constant')
const { UserModel } = require('../../models/users')

 function getToken(headers){
    const [bearer , token] = headers?.['authorization']?.split(' ') || []
    if(token && ['Bearer' , 'bearer'].includes(bearer)) return token
    throw createError.Unauthorized('حساب کاربری شناسایی نشد وارد حساب کاربری خود شوید')
 }

function verifyAccessToken(req,res,next){
   try {
    const token = getToken(req.headers)
        Jwt.verify(token ,ACCESS_TOKEN_SECRET_KEY ,async (err , payload) => {
            try {
                if(err) throw createError.Unauthorized('وارد حساب کاربری خود شوید')
                const {mobile} = payload || {}
                const user = await UserModel.findOne({mobile} , {otp:0 , password:0})
                if(!user) throw createError.Unauthorized('کاربر یافت نشد')
                req.user = user
                return next()
            } catch (error) {
                next(error)
            }
        } )
   } catch (error) {
        next(error)
   }
}

function checkRole(role){
    return function(req,res,next){
        try {
            const user = req.user
            console.log('===========');
            console.log(user);
            if(user.Role.includes(role)) return next()
            console.log('+++++++++++');
            console.log(user.Roles.includes(role));
            throw createError.Forbidden('شما به این قسمت دسترسی ندارید')
            
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    verifyAccessToken,
    checkRole
}