const { PermissionModel } = require("../../../../models/permission");
const Controller = require("../../Controller");
const {StatusCodes : HttpStatus} = require('http-status-codes')
const createError = require('http-errors');
const { addPermissionSchema } = require("../../../validators/admin/RBAC.shema");
class PermissionController extends Controller{
    async getAllPermissions(req,res,next){
        try {
            const permissions = await PermissionModel.find({})
            return res.status(HttpStatus.OK).json({
                statusCode:HttpStatus.OK,
                data:{
                    permissions
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async createNewPermission(req,res,next){
        try {
            const {name , description} = await addPermissionSchema.validateAsync(req.body)
            await this.findPermissionWithName(name)
            const permission = await PermissionModel.create({name , description})
            if(!permission) throw new createError.InternalServerError('دسترسی ایجاد نشد')
            return res.status(HttpStatus.CREATED).json({
                    statusCode:HttpStatus.CREATED,
                    data:{
                        message:'دسترسی با موفقیت ایجاد شد'
                    }
                })
        } catch (error) {
            next(error)
        }
    }

    async findPermissionWithName(name){
        const permission = await PermissionModel.findOne({name})
        if(permission) throw new createError.NotFound('دسترسی قبلا ثبت شده است')
    }
}

module.exports = {
    PermissionController : new PermissionController()
}