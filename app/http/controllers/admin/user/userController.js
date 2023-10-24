const { UserModel } = require("../../../../models/users");
const Controller = require("../../Controller");
const {StatusCodes : HttpStatus} = require('http-status-codes')
const createError = require('http-errors');
const { deleteInvalidPropertyInObject } = require("../../../../utils/functions");

class UserController extends Controller{
    async getAllUsers(req,res,next){
        try {
            const {search} = req.query
            const databaseQuery = {}
            if(search) databaseQuery['$text'] = {$search : search}
            const user = await UserModel.find(databaseQuery)
            return res.status(HttpStatus.OK).json({
                StatusCode : HttpStatus.OK,
                data:{
                    user
                }
            })
        } catch (error) {
            
        }
    }

    async updateUserProfile(req,res,next){
        try {
            const userID = req.user._id
            const data = req.body
            const BlackListField = ["mobile", "otp", "bills", "discount", "Roles", "Courses"]
            deleteInvalidPropertyInObject(data , BlackListField)
            const profileUpdateResult = await UserModel.updateOne({_id : userID} , {$set : data})
            if(!profileUpdateResult.modifiedCount) throw new createError.InternalServerError('به روز رسانی انجام نشد')
            return res.status(HttpStatus.OK).json({
                StatusCode : HttpStatus.OK , 
                data:{
                    message : 'به روزرسانی پروفایل با موفقیت انجام شد'
                }
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    UserController : new UserController()
}