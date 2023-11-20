const { GraphQLString } = require("graphql");
const { BlogModel } = require("../../models/blogs");
const createError = require('http-errors');
const { default: mongoose } = require("mongoose");
const { verifyAccessTokenInGraphQl } = require("../../http/middelwares/verifyAccessToken");
const {StatusCodes:HttpStatus} = require('http-status-codes');
const { ResponseType } = require("../typeDefs/public.type");
const { copyObject } = require("../../utils/functions");
const { ProductModel } = require("../../models/products");
const { CourseModel } = require("../../models/course");
const { checkExistCourse, checkExistProduct, checkExistBlog } = require("../utils");
const CreateCommentForBlog = {
    type: ResponseType,
    args:{
        comment:{type: GraphQLString},
        blogID:{type : GraphQLString},
        parent:{type:GraphQLString}
    },
    resolve: async(_,args,context) =>{
        const {req} = context
        const user = await verifyAccessTokenInGraphQl(req)
        const {comment , blogID , parent} = args
        if(!mongoose.isValidObjectId(blogID)) throw createError.BadRequest('شناسه بلاگ ارسال شده صحیح نمباشد')
        await checkExistBlog(blogID)
        if(parent && mongoose.isValidObjectId(parent)){
             const commentDocument = await getComment(BlogModel , parent)
             if(commentDocument && !commentDocument?.openToComment) throw createError.BadRequest('ثبت پاسخ مجاز نیست')
             const createAnswerResult = await BlogModel.updateOne({
                'comments._id': parent
            },{
                $push:{
                    'comments.$.answers':{
                        comment , 
                        user: user._id,
                        show:false,
                        openToComment:false
                    }
                }
            })
            if(!createAnswerResult.modifiedCount){
                throw createError.InternalServerError('ثبت پاسخ انجام نشد')
            }
            return {
                statusCode:HttpStatus.CREATED,
                data:{
                    message : 'پاسخ شما با موفقیت ثبت شد'
                }
            }
        }
        else {
            await BlogModel.updateOne({_id:blogID} , {
                $push:{comments:{
                    comment,
                    user : user._id,
                    show : false,
                    openToComment : true ,
                  
                }}
            })
        
        }
        return {
            statusCode:HttpStatus.CREATED,
            data: {
                message : 'ثبت نظر با موفقیت انجام شد پس از تایید در وبسایت قرار میگیرد'
            }
        }
    }
}

const CreateCommentForProduct = {
   type:ResponseType ,
   args:{
        comment:{type: GraphQLString},
        productID:{type: GraphQLString},
        parent:{type: GraphQLString},
   },
   resolve : async (_ , args , context) => {
        const {req} = context
        const user = await verifyAccessTokenInGraphQl(req)
        const {comment , productID , parent} = args
        if(!mongoose.isValidObjectId(productID)) throw createError.BadRequest('شناسه ارسال شده صحیح نمباشد')
        await checkExistProduct(productID)
        if(parent && mongoose.isValidObjectId(parent)){
            const commentDocument = await getComment(ProductModel , parent)
            if(commentDocument && !commentDocument.openToComment)
                throw createError.BadRequest('ثبت پاسخ مجاز نیست')
            const createAnswerResult = await ProductModel.updateOne({
                _id:productID,
                'comments._id':parent
            },{
                $push:{
                    'comments.$.answers':{
                        comment,
                        user : user._id,
                        show : false,
                        openToComment:false
                    }
                }
            })
            if(!createAnswerResult.matchedCount && !createAnswerResult.modifiedCount){
                throw createError.InternalServerError('ثبت پاسخ انجام نشد')
            }
            return {
                statusCode : HttpStatus.CREATED,
                data:{
                    message:'پاسخ شما با موفقیت ثبت شد'
                }
            }
        }
        else{
            await ProductModel.updateOne({_id:productID} , {
                $push:{comments:{
                    comment,
                    user : user._id,
                    show : false,
                    openToComment:true
                }

                }
            })
        }
        return{
            statusCode: HttpStatus.CREATED,
            data:{
                message:'ثبت نظر با موفقیت انجام شد پس از تایید در وبسایت قرار میگیرد'
            }
        }
   }
}

const CreateCommentForCourse = {
    type:ResponseType,
    args:{
        comment:{type:GraphQLString},
        courseID:{type:GraphQLString},
        parent:{type:GraphQLString},
    },
    resolve:async(_ , args , context) => {
        const {req} = context
        const user = await verifyAccessTokenInGraphQl(req)
        const {comment , courseID , parent} = args
        if(!mongoose.isValidObjectId(courseID))
                 throw createError.BadRequest('شناسه ارسال شده صحیح نمیباشد')
        await checkExistCourse(courseID)
        if(parent && mongoose.isValidObjectId(parent)){
            const commentDocument = await getComment(CourseModel , parent)
            if(commentDocument && !commentDocument?.openToComment) 
                throw createError.BadRequest('ثبت پاسخ مجار نیست')
            const createAnswerResult = await CourseModel.updateOne({
                'comments._id':parent
            }, {
                $push:{
                    'comments.$.answers':{
                        comment,
                        user : user._id,
                        show : false,
                        openToComment:false
                    }
                }
            })
            if(!createAnswerResult.matchedCount &&!createAnswerResult.modifiedCount) {

                throw createError.InternalServerError('ثبت پاسخ انجام نشد')
            }
            return{
                statusCode:HttpStatus.CREATED,
                data:{
                    message:'پاسخ شما با موفقیت ثبت شد'
                }
            }
        }
        else{
            await CourseModel.updateOne({_id:courseID},{
                $push:{ comments: {
                    comment,
                    user : user._id,
                    show : false,
                    openToComment:true
                }}
            })
        }
        return {
            statusCode : HttpStatus.CREATED,
            data:{
                message:'ثبت نظر با موفقیت انجام شد پس از تایید در وبسایت قرار میگیرد'
            }
        }
    }
}



async function getComment(model , id){
    const findComment = await model.findOne({'comments._id': id} , {'comments.$' : 1})
    const comment = copyObject(findComment)
    if(!comment?.comments?.[0]) throw createError.NotFound('کامنتی با این مشخصات یافت نشد')
    return comment?.comments?.[0]
}


module.exports = {
    CreateCommentForBlog,
    CreateCommentForProduct,
    CreateCommentForCourse
}