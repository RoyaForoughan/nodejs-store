const { verifyAccessTokenInGraphQl } = require("../../http/middelwares/verifyAccessToken");
const { ResponseType } = require("../typeDefs/public.type");
const { GraphQLString } = require("graphql");
const { checkExistProduct, checkExistCourse, checkExistBlog } = require("../utils");
const { ProductModel } = require("../../models/products");
const {StatusCodes:HttpStatus} = require('http-status-codes');
const { CourseModel } = require("../../models/course");
const { BlogModel } = require("../../models/blogs");

const BookmarkProduct = {
    type:ResponseType,
    args:{
        productID : {type : GraphQLString}
    },
    resolve : async(_ , args , context) =>{
        const {req} = context
        const user = await verifyAccessTokenInGraphQl(req)
        const {productID} = args
        await checkExistProduct(productID)
        let BookmarkedProduct = await ProductModel.findOne({
            _id : productID , 
            bookmarks : user._id
        })
        const updateQuery = BookmarkedProduct ? {$pull : {bookmarks : user._id}} : {$push : {bookmarks : user._id}}
        await ProductModel.updateOne({_id : productID} , updateQuery)
        let message
        if(!BookmarkedProduct) {
            message = "محصول به لیست علاقه مند های شما اضافه شد"
        } else message = "محصول از لیست علاقه مندی های شما حذف شد"
        return {
            statusCode : HttpStatus.OK,
            data:{
                message
            }
        }
    }
    

}

const BookmarkCourse = {
    type:ResponseType,
    args:{
        courseID : {type : GraphQLString}
    },
    resolve : async(_ , args , context) =>{
        const {req} = context
        const user = await verifyAccessTokenInGraphQl(req)
        const {courseID} = args
        await checkExistCourse(courseID)
        let BookmarkedCourse = await CourseModel.findOne({
            _id : courseID , 
            bookmarks : user._id
        })
        const updateQuery = BookmarkedCourse ? {$pull : {bookmarks : user._id}} : {$push : {bookmarks : user._id}}
        await CourseModel.updateOne({_id : courseID} , updateQuery)
        let message
        if(!BookmarkedCourse) {
            message = "دوره به لیست علاقه مند های شما اضافه شد"
        } else message = "دوره از لیست علاقه مندی های شما حذف شد"
        return {
            statusCode : HttpStatus.OK,
            data:{
                message
            }
        }
    }   

}
const BookmarkBlog = {
    type:ResponseType,
    args:{
        blogID : {type : GraphQLString}
    },
    resolve : async(_ , args , context) =>{
        const {req} = context
        const user = await verifyAccessTokenInGraphQl(req)
        const {blogID} = args
        await checkExistBlog(blogID)
        let BookmarkedBlog = await BlogModel.findOne({
            _id : blogID , 
            bookmarks : user._id
        })
        const updateQuery = BookmarkedBlog ? {$pull : {bookmarks : user._id}} : {$push : {bookmarks : user._id}}
        await BlogModel.updateOne({_id : blogID} , updateQuery)
        let message
        if(!BookmarkedBlog) {
            message = "دوره به لیست علاقه مند های شما اضافه شد"
        } else message = "دوره از لیست علاقه مندی های شما حذف شد"
        return {
            statusCode : HttpStatus.OK,
            data:{
                message
            }
        }
    }   

}

module.exports = {
    BookmarkProduct,
    BookmarkCourse,
    BookmarkBlog
}