const { RoleModel } = require("../../../../models/role");
const Controller = require("../../Controller");
const {StatusCodes : HttpStatus} = require('http-status-codes')
const createError = require('http-errors');
const { addRoleSchima } = require("../../../validators/admin/RBAC.shema");

class RoleController extends Controller{
    async getAllRoles(req,res,next){
        try {
            const roles = await RoleModel.findOne({})
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data:{
                    statusCode : HttpStatus.OK,
                    data:{
                        roles
                    }
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async createNewRole(req,res,next){
        try {
            const {title , permissions} = await addRoleSchima.validateAsync(req.body)
            await this.findRoleWithTitle(title)
            const role = await RoleModel.create({title , permissions})
            if(!role) throw new createError.InternalServerError('نقش ایجاد نشد')
            return res.status(HttpStatus.CREATED).json({
                statusCode : HttpStatus.CREATED,
                data : {
                    message : 'نقش با موفقیت ایجاد شد'
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async findRoleWithTitle(title){
        const role = await RoleModel.findOne({title})
        if(role) throw new createError.NotFound('نقش قبلا ثبت شده است')
    }
}

module.exports = {
    RoleController : new RoleController()
}