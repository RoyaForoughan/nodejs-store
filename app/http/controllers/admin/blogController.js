const Controller = require("../Controller")
const {createBlogShima} = require('../../validators/admin/blog.schema')
const path = require('path')
const createError = require('http-errors')
const { BlogModel } = require("../../../models/blogs")
const { deleteFileInPublic } = require("../../../utils/functions")
const {statusCodes : HttpStatus} = require('http-status-codes')

class BlogController extends Controller {
    async createBlog(req, res, next){
        try {
            const blogDataBody = await createBlogShima.validateAsync(req.body)
            req.body.image = path.join(blogDataBody.fileUploadPath , blogDataBody.filename) 
            req.body.image = req.body.image.replace(/\\/g , '/')
            const {title , text , short_text , tags , category} = blogDataBody
            const image = req.body.image
            const author = req.user._id
            const blog = await BlogModel.create({title , image, text , short_text , tags , category , author})
            return res.status(HttpStatus.CREATED).json({
                data:{
                    statusCode : HttpStatus.CREATED,
                    message: 'ایجاد بلاگ با موفقیت انجام شد'
                }
            })
        } catch (error) {
            deleteFileInPublic(req.body.image)
            next(error)
        }
    }

    async getListOfBlogs(req,res,next){
        try {
            const blogs = await BlogModel.aggregate([
                {$match:{}},
                {
                    $lookup:{
                        from:'users',
                        foreignField:'_id',
                        localField:'author',
                        as:'author'
                    }
                },
                {
                    $unwind : '$author'
                },
                {
                    $lookup:{
                        from:'categories',
                        foreignField:'_id',
                        localField:'category',
                        as:'category'
                    }
                },
                {
                    $unwind:'$category'
                },
                {
                    $project:{
                        'author.__v' : 0,
                        'category.__v' : 0,
                        'author.otp' : 0,
                        'author.Roles' : 0 , 
                        'author.discount' : 0,
                        'author.bills' : 0
                    }
                }

            ])
            return res.status(HttpStatus.OK).json({
                data:{
                    statusCode:HttpStatus.OK,
                    blogs
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async getOneBlogById(req,res,next){
        try {
            const {id} = req.params
            const blog = await this.findBlog(id)
            return res.status(HttpStatus.OK).json({
                data:{
                    statusCode:HttpStatus.OK,
                    blog
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteBlogById(req,res,next){
        try {
            const {id} = req.params
            await this.findBlog(id)
            const result = await BlogModel.deleteOne({_id : id})
            if(result.deletedCount == 0 ) throw createError.InternalServerError('حذف انجام نشد')
            return res.status(HttpStatus.OK).json({
                data:{
                    statusCode:HttpStatus.OK,
                    message:'حذف با موفقیت انجام شد'
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async findBlog(id){
        const blog = await BlogModel.findById(id).populate([{path : 'category' , select:['title']} , {path:'author' , select : ['mobile' , 'username' , 'lastname' , 'firstname']}])
        if(!blog) throw createError.NotFound("مقاله ای یافت نشد");
        delete blog.category.children
        return blog
    }

    async updateBlogById(req, res , next){
        try {
            const {id} = req.params
            await this.findBlog(id)
            if(req?.body?.fileUploadPath , req?.body?.filename){
                req.body.image = path.join(req.body.fileUploadPath , req.body.filename)
                req.body.image = req.body.image.replace(/\\/g , '/')
            }
            const data = req.body
            const nullishData = ['' , ' ' , 0 , null , undefined , '0']
            const blackList = ['bookmarks' , 'deslikes', 'comments' , 'likes' , 'author']
            Object.keys(data).forEach(key => {
                if(blackList.includes(key)) delete data[key]
                if(typeof data[key] == 'string') data[key] = data[key].trim()
                if(Array.isArray(data[key]) && data[key].length > 0) data[key] = data[key].map(item => item.trim())
                if(nullishData.includes(key)) delete data[key]
            })
            const updateResult = await BlogModel.updateOne({_id : id} , {$set : data})
            if(updateResult.modifiedCount == 0) throw createError.InternalServerError('به روز رسانی انجام نشد')
            return res.status(HttpStatus.OK).json({
                data:{
                    statusCode:HttpStatus.OK,
                    message:'به روز رسانی با موفقیت انجام شد'
                }    
            })
        } catch (error) {
            deleteFileInPublic(req.body.image)
            next(error)
        }
    }
}

 

module.exports = {
    AdminBlogController : new BlogController()
}