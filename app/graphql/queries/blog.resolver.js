const { GraphQLList, GraphQLString } = require("graphql");
const { BlogType } = require("../typeDefs/blog.type");
const { BlogModel } = require("../../models/blogs");
const { verifyAccessTokenInGraphQl } = require("../../http/middelwares/verifyAccessToken");

const BlogResolver = {
    type : new GraphQLList(BlogType),
    args:{
        category: {type : GraphQLString}
    },
    resolve : async (_ , args) => {
        const {category} = args
        const findQuery = category ? {category} : {}
        return await BlogModel.find(findQuery).populate([{path:'author'} , {path : 'category'}])
    }
}

module.exports = {
    BlogResolver
}