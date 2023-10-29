const { PermissionModel } = require("../../../../models/permission");
const Controller = require("../../Controller");
const {StatusCodes : HttpStatus} = require('http-status-codes')
const createError = require('http-errors');
const { addPermissionSchema } = require("../../../validators/admin/RBAC.shema");
const { copyObject, deleteInvalidPropertyInObject } = require("../../../../utils/functions");
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

    async removePermission(req,res,next){
        try {
            const {id} = req.params
            await this.findPermissionById(id)
            const removePermissionResult = await PermissionModel.deleteOne({_id:id})
            if(!removePermissionResult.deletedCount) throw new createError.InternalServerError('دسترسی حذف نشد')
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data:{
                    message:'حذف دسترسی با موفقیت انجام شد'
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async updatePermissionById(req,res,next){
        try {
            const {id} = req.params
            await this.findPermissionById(id)
            const data = copyObject(req.body)
            deleteInvalidPropertyInObject(data, [])
            const updatePermissionResult = await PermissionModel.updateOne({_id : id} , {
                $set : data
            })
            if(!updatePermissionResult.modifiedCount)
            throw new createError.InternalServerError('ویرایش نقش انجام نشد')
            return res.status(HttpStatus.OK).json({
                statusCode:HttpStatus.OK,
                data:{
                    message:'ویرایش نقش با موفقیت انجام شد'
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

    async findPermissionById(_id){
        const permission = await PermissionModel.findOne({_id})
        if(!permission) throw new createError.NotFound('دسترسی یافت نشد')
        return permission
    }
}

module.exports = {
    PermissionController : new PermissionController()
}