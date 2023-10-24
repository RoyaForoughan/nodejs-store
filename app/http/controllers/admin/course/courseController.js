const { CourseModel } = require("../../../../models/course");
const { createCourseSchema } = require("../../../validators/admin/course.schima");
const Controller = require("../../Controller");
const {StatusCodes : HttpStatus} = require('http-status-codes')
const createError = require('http-errors')
const path = require('path');
const { default: mongoose } = require("mongoose");
const { copyObject, deleteFileInPublic, deleteInvalidPropertyInObject } = require("../../../../utils/functions");
class CourseController extends Controller{
    async getListOfCourse(req,res,next){
        try {
           
            const {search} = req.query
            let courses 
            if(search) courses = await CourseModel
            .find({$text : {$search : search}})
            .populate([
                {path : 'category' , select : {children:0 , parent : 0}},
                {path : 'teacher' , select : {first_name : 1 , last_name : 1 , mobile : 1 , email : 1} }
            ])
            .sort({_id: -1})
            else courses = await CourseModel
            .find({})
            .populate([
                {path : 'category' , select : {children:0 , parent : 0}},
                {path : 'teacher' , select : {first_name : 1 , last_name : 1 , mobile : 1 , email : 1} }
            ])
            .sort({_id : -1})
            return res.status(HttpStatus.OK).json({
                StatusCode : HttpStatus.OK,
                data:{
                    courses
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async addCourse(req,res ,next){
        try {
            await createCourseSchema.validateAsync(req.body)
            const teacher = req.user._id
            const {fileUploadPath , filename} = req.body
            const image = path.join(fileUploadPath , filename).replace(/\\/g , '/')
            let {title , text , short_text , tags ,category , price , discount , type} = req.body
            if(Number(price) > 0 && type == 'free') throw createError.BadRequest('برای دوره رایگان نمیتوان قیمت ثبت کرد')
            const course = await CourseModel.create({
                title , 
                text , 
                short_text , 
                tags ,
                category , 
                price , 
                discount,
                image,
                teacher,
                type,
                status:'notStarted'
            })
            if(!course._id) throw createError.InternalServerError('دوره ثبت نشد')
            return res.status(HttpStatus.CREATED).json({
                StatusCode:HttpStatus.CREATED,
                data:{
                    message: 'دوره با موفقیت ایجاد شد'
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async getCourseById(req,res,next){
        try {
            const {id} = req.params
            const course = await CourseModel.findById(id)
            if(!course) throw createError.InternalServerError('دوره ای یافت نشد')
            return res.status(HttpStatus.OK).json({
                StatusCode: HttpStatus.OK,
                data : {
                    course
                }
                })
        } catch (error) {
            next(error)
        }
    }

    
    async updateCourseById(req,res,next){
        try {
            const {id} = req.params
            const course = await this.FindCourseById(id)
            const data = copyObject(req.body)
            const {fileUploadPath , filename} = req.body
            const blackListFields = ["time", "chapters", "episodes", "students", "bookmarks", "likes", "dislikes", "comments", "fileUploadPath", "filename"]
            deleteInvalidPropertyInObject(data, blackListFields)
            if(req.file){
                data.image = path.join(fileUploadPath , filename)
                deleteFileInPublic(course.image)
            }
            const updateCourseResult = await CourseModel.updateOne({_id:id} , {
                $set: data
            })
            if(!updateCourseResult.modifiedCount) throw createError.InternalServerError('به روز رسانی انجام نشد')
            return res.status(HttpStatus.OK).json({
                StatusCode : HttpStatus.OK,
                data:{
                    message : 'به روزرسانی با موفقیت انجام شد'
                }
            })

        } catch (error) {
            next(error)
        }
    }


    async FindCourseById(id){
        if(!mongoose.isValidObjectId(id)) throw createError.BadRequest('شناسه ارسال شده صحیح نمباشد')
        const course = await CourseModel.findById(id)
        if(!course) throw createError.NotFound('دوره ای یافت نشد')
        return course
    }
}

module.exports = {
    CourseController : new CourseController()
}