const { GraphQLList } = require("graphql");
const { BlogType } = require("../typeDefs/blog.type");
const { CourseType } = require("../typeDefs/course.type");
const { ProductType } = require("../typeDefs/product.type");
const { verifyAccessTokenInGraphQl } = require("../../http/middelwares/verifyAccessToken");
const { BlogModel } = require("../../models/blogs");
const { CourseModel } = require("../../models/course");
const { ProductModel } = require("../../models/products");
const { AnyType } = require("../typeDefs/public.type");
const { UserModel } = require("../../models/users");
const { copyObject, getBasketOfUser } = require("../../utils/functions");

const getUserBookmarkedBlogs = {
    type : new GraphQLList(BlogType),
    resolve : async(_ , args , context) => {
        const {req} = context
        const user = await verifyAccessTokenInGraphQl(req)
        const blog = BlogModel.find({bookmarks : user._id}).populate([
            {path : 'author'}, 
            {path: "category"}, 
            {path: "comments.user"}, 
            {path: "comments.answers.user"},
            {path: "likes"},
            {path: "dislikes"},
            {path: "bookmarks"},
        ])
        return blog
    }
}

const getUserBookmarkedCourse = {
    type : new GraphQLList(CourseType),
    resolve : async(_ , args , context)=>{
        const {req} = context
        const user = await verifyAccessTokenInGraphQl(req)
        const course = await CourseModel.find({bookmarks : user._id}).populate([
            {path : 'teacher'}, 
            {path: "category"},
            {path: "comments.user"},
            {path: "likes"},
            {path: "dislikes"},
            {path: "bookmarks"},
        ])
        return course
    }
}

const getUserBookmarkedProducs = {
    type: new GraphQLList(ProductType),
    resolve : async(_ , args , context) => {
        const {req} = context
        const user = await verifyAccessTokenInGraphQl(req)
        const product = await ProductModel.find({bookmarks : user._id}).populate([
            {path : 'supplier'}, 
            {path: "category"},
            {path: "comments.user"},
            {path: "comments.answers.user"},
            {path: "likes"},
            {path: "dislikes"},
            {path: "bookmarks"},
        ])
        return product
    }
}

const getUserBasket = {
    type : AnyType,
    resolve : async(_,args , context) => {
        const {req} = context
        const user = await verifyAccessTokenInGraphQl(req)
        const userDetail = await getBasketOfUser(user._id)
        return userDetail
    }
}

module.exports = {
    getUserBookmarkedBlogs,
    getUserBookmarkedCourse,
    getUserBookmarkedProducs,
    getUserBasket
}