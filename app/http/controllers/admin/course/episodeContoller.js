const { default: getVideoDurationInSeconds } = require("get-video-duration");
const { createEpisodeSchema } = require("../../../validators/admin/course.schima");
const Controller = require("../../Controller");
const path = require('path');
const createError = require('http-errors')
const {StatusCodes : HttpStatus} = require('http-status-codes')
const { getTime, deleteInvalidPropertyInObject, copyObject } = require("../../../../utils/functions");
const { CourseModel } = require("../../../../models/course");
const { ObjectIdValidator } = require("../../../validators/public.validator");
class EpisodeController extends Controller{
    async addNewEpisode(req,res,next){
        try {
            const {
                title ,
                 text ,
                 type,
                 chapterID,
                 courseID,
                filename,
                fileUploadPath
                } = await createEpisodeSchema.validateAsync(req.body)
            const fileAddress = path.join(fileUploadPath , filename) 
            const videoAddress = fileAddress.replace(/\\/g , '/')
            const videoURL = `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${videoAddress}`
            const secondes = await getVideoDurationInSeconds(videoURL)
            const time = getTime(secondes)
            const episode = {
                title,
                text,
                type,
                time,
                videoAddress
            }
            const createEpisodeResult = await CourseModel.updateOne({
                _id : courseID,
                'chapters._id' : chapterID
            },{
                $push:{
                    'chapters.$.episodes' : episode
                }
            })
       
            if(createEpisodeResult.modifiedCount == 0)
            throw new createError.InternalServerError('افزودن اپیزود انجام نشد')
            return res.status(HttpStatus.CREATED).json({
                StatusCode : HttpStatus.CREATED,
                data:{
                    message : 'افزودن اپیزود با موفقیت انجام شد'
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async removeEpisode(req,res,next){
        try {
            const {id : episodeID} = await ObjectIdValidator.validateAsync({id : req.params.episodeID})
            const removeEpisodeResult = await CourseModel.updateOne({
                'chapters.episodes._id' : episodeID
            },{
                $pull:{
                    'chapters.$.episodes':{
                        _id : episodeID 
                    }
                }
            })
            if(removeEpisodeResult.modifiedCount == 0) 
            throw new createError.InternalServerError('حذف اپیزود انجام نشد')
            return res.status(HttpStatus.OK).json({
                StatusCode:HttpStatus.OK,
                data:{
                    message:'حذف اپیزود با موفقیت انجام شد'
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async updateEpisode(req, res, next) {
        try {
             const {episodeID} = req.params
            const episode = await this.getOneEpisode(episodeID)
            const { filename, fileUploadPath } = req.body
            let blackListFields = ["_id"]
            if(filename && fileUploadPath){
                const fileAddress = path.join(fileUploadPath, filename)
                req.body.videoAddress = fileAddress.replace(/\\/g, "/");
                const videoURL = `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${req.body.videoAddress}`
                const seconds = await getVideoDurationInSeconds(videoURL);
                req.body.time = getTime(seconds);
                blackListFields.push("filename")
                blackListFields.push("fileUploadPath")
            }else{
                blackListFields.push("time")
                blackListFields.push("videoAddress")
            }
            const data = req.body;
            deleteInvalidPropertyInObject(data, blackListFields)
            const newEpisode = {
                ...episode,
                ...data
            }
            const editEpisodeResult = await CourseModel.updateOne({
                "chapters.episodes._id": episodeID
            }, {
                $set: {
                    "chapters.$.episodes": newEpisode
                }
            })
            if (!editEpisodeResult.modifiedCount)
                throw new createError.InternalServerError("ویرایش اپیزود انجام نشد")
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    message: "ویرایش اپیزود با موفقیت انجام شد"
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async getOneEpisode(episodeID){
        const courses = await CourseModel.findOne({"chapters.episodes._id": episodeID}, {
            "chapters.episodes.$": 1
        })
       
        if(!courses) throw new createError.NotFound("اپیزودی یافت نشد")
        const episode = await courses?.chapters?.[0]?.episodes?.[0]
        if(!episode) throw new createError.NotFound("اپیزودی یافت نشد")
        return copyObject(episode)
    }
}

module.exports = {
    EpisodeController : new EpisodeController()
}