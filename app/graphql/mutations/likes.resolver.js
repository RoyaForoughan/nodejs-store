const { verifyAccessTokenInGraphQl } = require("../../http/middelwares/verifyAccessToken");
const { ResponseType } = require("../typeDefs/public.type");
const { GraphQLString } = require("graphql");
const { checkExistProduct, checkExistCourse, checkExistBlog } = require("../utils");
const { ProductModel } = require("../../models/products");
const {StatusCodes:HttpStatus} = require('http-status-codes');
const { CourseModel } = require("../../models/course");
const { BlogModel } = require("../../models/blogs");

const LikeProduct = {
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

        const updateQuery = likedProduct? {$pull : {likes : user._id}} : {$push : {likes : user._id}}
        await ProductModel.updateOne({_id : productID} , updateQuery)
        let message
        if(!likedProduct){
            if(disLikedProduct) await ProductModel.updateOne({_id:productID} , {$pull : {dislikes : user._id}})
        message = 'پسندیدن محصول با موفقیت انجام شد'
    }else message = 'پسندیدن محصول لغو شد'
         return {
            statusCode:HttpStatus.CREATED,
            data:{
                message
            }
         }   
    }
}

const LikeCourse = {
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
        const updateQuery = LikedCourse ? {$pull: {likes : user._id}} : {$push : {likes : user._id}}
        await CourseModel.updateOne({_id : courseID} , updateQuery)
        let message
        if(!LikedCourse){
            if(DisLikedCourse) await CourseModel.updateOne({_id : courseID} , {$pull : {dislikes : user._id}})
            message = 'پسندیدن دوره با موفقیت انجام شد'
        }else message = 'پسندیدن دوره لغو شد'
        return {
            statusCode : HttpStatus.CREATED,
            data:{
                message
            }
        }
    }
}

const LikeBlog = {
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
        const updateQuery = LikedBlog ? {$pull : {likes : user._id}} : {$push : {likes : user._id}}
        await BlogModel.updateOne({_id : blogID} , updateQuery)
        let message
        if(!LikedBlog){
            if(DisLikedBlog) await BlogModel.updateOne({_id : blogID} , {$pull : {dislikes : user._id}})
            message = 'پسندیدن مقاله با موفقیت انجام شد'
        }else message = 'پسندیدن مقاله لغو شد'
        return {
            statusCode : HttpStatus.CREATED,
            data : {
                message
            }
        }
    }
}


module.exports = {
    LikeProduct,
    LikeCourse,
    LikeBlog
}