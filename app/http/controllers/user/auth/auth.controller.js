const { UserModel } = require("../../../../models/users")
const { ROLES } = require("../../../../utils/constant")
const { RandomNumberGenerator, signAccessToken, verifyRefreshToken, signRefreshToken } = require("../../../../utils/functions")
const { getOtpSchima , checkOtpSchima } = require("../../../validators/user/authSchima")
const createError = require('http-errors')
const {StatusCodes : HttpStatus} = require('http-status-codes')
const Controller = require("../../Controller")




class UserAuthController extends Controller {
    async getOtp(req,res,next){
        try {
            await getOtpSchima.validateAsync(req.body)
            const {mobile} = req.body
            const code = RandomNumberGenerator()
            const result = await this.saveUser(mobile , code)
            if(!result) throw createError.Unauthorized('ورود انجام نشد')
            return res.status(HttpStatus.OK).send({
                statusCode:HttpStatus.OK,
                data:{
                    message:'ورود شما با موفقیت انجام شد',
                    mobile,
                    code
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async checkOtp(req,res,next){
        try {
            await checkOtpSchima.validateAsync(req.body)
            const {mobile , code} = req.body
            const user = await UserModel.findOne({mobile})
            if(!user) throw createError.Unauthorized('کاربر یافت نشد')
            if(user.otp.code != code) throw createError.Unauthorized('کد ارسال شده صحیح نمباشد')
            const now = Date.now()
            if(+user.otp.expiresIn < now ) throw createError.Unauthorized('کد ارسال شده منقضی شده است')
            const accessToken = await signAccessToken(user._id)
            const refreshToken = await signRefreshToken(user._id)
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data:{
                    accessToken,
                    refreshToken
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async refreshToken(req,res,next){
        try {
            const {refreshToken} = req.body
            const mobile = await verifyRefreshToken(refreshToken) 
            const user = await UserModel.findOne({mobile})
            const accessToken = await signAccessToken(user._id)
            const newRefreshToken = await signRefreshToken(user._id)
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK ,
                data : {
                    accessToken , 
                    refreshToken : newRefreshToken
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async saveUser(mobile , code){
        let otp = {
            code ,
            expiresIn : (new Date().getTime() + 120000)
        }
        const result = await this.checkExistUser(mobile)
        if(result){
            return (await this.updateUser(mobile , {otp}))
        }
        return (await UserModel.create({
            mobile,
            otp,
            Roles:[ROLES.USER]
        }))
    }
    
    async checkExistUser(mobile){
        const user = await UserModel.findOne({mobile})
        return !!user
    }
    
    async updateUser(mobile , objectData = {}){
        Object.keys(objectData).forEach(key => {
            if(['' , ' ' , 0 , '0' , null , NaN, undefined].includes(objectData[key])) delete objectData[key]
        })
        const updateResult = await UserModel.updateOne({mobile} , {$set: objectData})
        return !!updateResult.modifiedCount
    }
}


module.exports = {
    UserAuthController : new UserAuthController()
}