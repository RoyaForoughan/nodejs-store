const { verifyAccessTokenInGraphQl } = require("../../http/middelwares/verifyAccessToken");
const { ResponseType } = require("../typeDefs/public.type");
const { GraphQLString } = require("graphql");
const { checkExistProduct, checkExistCourse, checkExistBlog } = require("../utils");
const { ProductModel } = require("../../models/products");
const {StatusCodes:HttpStatus} = require('http-status-codes');
const { CourseModel } = require("../../models/course");
const { BlogModel } = require("../../models/blogs");

const DisLikeProduct = {
    type:ResponseType,
    args:{
        productID:{type: GraphQLString}
    },
    resolve : async(_ , args , context) => {
        const {req} = context
        const user = await verifyAccessTokenInGraphQl(req)
        const {productID} = args
        await checkExistProduct(productID)
        let likedProduct = await ProductModel.findOne({
            _id : productID,
            likes : user._id
        })

        let disLikedProduct = await ProductModel.findOne({
            _id : productID,
            dislikes : user._id
        })

        const updateQuery = disLikedProduct ? {$pull : {dislikes : user._id}} : {$push : {dislikes : user._id}}
        await ProductModel.updateOne({_id : productID} , updateQuery)
        let message
        if(!disLikedProduct){
            if(likedProduct) await ProductModel.updateOne({_id:productID} , {$pull : {likes : user._id}})
        message = 'نپسندیدن محصول با موفقیت انجام شد'
    }else message = 'نپسندیدن محصول لغو شد'
         return {
            statusCode:HttpStatus.CREATED,
            data:{
                message
            }
         }   
    }
}

const DisLikeCourse = {
    type: ResponseType,
    args : {
        courseID : {type : GraphQLString}
    },
    resolve : async (_ , args , context) => {
        const {req} = context
        const user = await verifyAccessTokenInGraphQl(req)
        const {courseID} = args
        await checkExistCourse(courseID)
        let LikedCourse = await CourseModel.findOne({
            _id : courseID , 
            likes : user._id
        })
        let DisLikedCourse = await CourseModel.findOne({
            _id:courseID,
            dislikes:user._id
        })
        const updateQuery = DisLikedCourse ? {$pull: {dislikes : user._id}} : {$push : {dislikes : user._id}}
        await CourseModel.updateOne({_id : courseID} , updateQuery)
        let message
        if(!DisLikedCourse){
            if(LikedCourse) await CourseModel.updateOne({_id : courseID} , {$pull : {likes : user._id}})
            message = 'نپسندیدن دوره با موفقیت انجام شد'
        }else message = 'نپسندیدن دوره لغو شد'
        return {
            statusCode : HttpStatus.CREATED,
            data:{
                message
            }
        }
    }
}

const DisLikeBlog = {
    type: ResponseType,
    args:{
        blogID:{type : GraphQLString}
    },
    resolve : async(_, args , context) => {
        const {req} = context
        const user = await verifyAccessTokenInGraphQl(req)
        const {blogID} = args
        await checkExistBlog(blogID)
        let LikedBlog = await BlogModel.findOne({
            _id : blogID,
            likes : user._id
        })
        let DisLikedBlog = await BlogModel.findOne({
            _id : blogID,
            dislikes : user._id
        })
        const updateQuery = DisLikedBlog ? {$pull : {dislikes : user._id}} : {$push : {dislikes : user._id}}
        await BlogModel.updateOne({_id : blogID} , updateQuery)
        let message
        if(!DisLikedBlog){
            if(LikedBlog) await BlogModel.updateOne({_id : blogID} , {$pull : {likes : user._id}})
            message = 'نپسندیدن مقاله با موفقیت انجام شد'
        }else message = 'نپسندیدن مقاله لغو شد'
        return {
            statusCode : HttpStatus.CREATED,
            data : {
                message
            }
        }
    }
}


module.exports = {
    DisLikeProduct,
    DisLikeBlog,
    DisLikeCourse
}