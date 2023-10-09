const { default: mongoose } = require("mongoose");
const Controller = require("../../Controller");
const { CourseModel } = require("../../../../models/course");
const createError = require('http-errors')
const {StatusCodes : HttpStatus} = require('http-status-codes');
const { CourseController } = require("./courseController");
const { deleteInvalidPropertyInObject } = require("../../../../utils/functions");

class ChapterController extends Controller{
    async addChapter(req,res,next){
        try {
            const {id ,title , text } = req.body
            await CourseController.FindCourseById(id)
            const saveChapterResult = await CourseModel.updateOne({_id : id} , {$push : {
                chapters :{title , text , episodes:[] } 
            }})
            if(saveChapterResult.modifiedCount == 0) throw createError.InternalServerError('فصلی اضافه نشد')
            return res.status(HttpStatus.CREATED).json({
                StatusCode :  HttpStatus.CREATED , 
                data :{
                    message : 'فصل با موفقیت ایجاد شد'
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async chaptersOfCourse(req,res,next){
        try {
            const {courseID} = req.params
            const course = await this.getChapterOfCourse(courseID)
            return res.status(HttpStatus.OK).json({
                StatusCode:HttpStatus.OK,
                data:{
                    course
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async removeChapterById(req,res,next){
        try {
            const {chapterID} = req.params
            const chapter =   await this.getOneChapter(chapterID)
            console.log(chapter);
            const removeChapterResult = await CourseModel.updateOne({'chapters._id' : chapterID} , {
                $pull : {
                    chapters : {
                        _id : chapterID
                    }
                }
            })
            if(removeChapterResult.deletedCount == 0) throw new createError.InternalServerError('حذف انجام نشد')
            return res.status(HttpStatus.OK).json({
                StatusCode : HttpStatus.OK,
                data : {
                    message : 'حذف با موفقیت انجام شد'
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async updateChapterById(req,res,next){
        try {
            const {chapterID} = req.params
            await this.getOneChapter(chapterID)       
            const data = req.body   
            deleteInvalidPropertyInObject(data , ['_id'])
            const updateChapterResult = await CourseModel.updateOne(
                {'chapters._id' : chapterID},
                {$set:{'chapters.$' : data}
            })
            if(updateChapterResult.modifiedCount == 0) throw new createError.InternalServerError('به روز رسانی انجام نشد')
            return res.status(HttpStatus.OK).json({
                StatusCode : HttpStatus.OK,
                data:{
                    message : 'به روز رسانی با موفقیت انجام شد'
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async getChapterOfCourse(id){
        const chapter = await CourseModel.findOne({_id:id} , {chapters:1})
        if(!chapter) throw createError.NotFound('دوره ای با این شناسه یافت نشد')
        return chapter
    }

    async getOneChapter(id){
        const chapter = await CourseModel.findOne({'chapters._id':id} , {'chapters.$':1})
        if(!chapter) throw createError.NotFound('فصلی با این شناسه یافت نشد')
        return chapter
    }
}

module.exports = {
    ChapterController : new ChapterController()
}