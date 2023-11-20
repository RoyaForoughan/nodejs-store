const { GraphQLObjectType, GraphQLSchema} = require("graphql");
const { BlogResolver } = require("./queries/blog.resolver");
const { ProductResolver } = require("./queries/product.resolver");
const { CategoriesResolver, CategoryChildResolver } = require("./queries/category.resolver");
const { CourseResolver } = require("./queries/course.resolver");
const {CreateCommentForBlog, CreateCommentForCourse, CreateCommentForProduct} = require('./mutations/comment.resolver')
const { LikeProduct, LikeBlog, LikeCourse } = require("./mutations/likes.resolver");
const { DisLikeBlog, DisLikeCourse, DisLikeProduct } = require("./mutations/dislikes.resolver");
const { BookmarkProduct , BookmarkCourse , BookmarkBlog } = require("./mutations/bookmarks.resolver");
const { getUserBookmarkedBlogs , getUserBookmarkedCourse , getUserBookmarkedProducs } = require("./queries/user-profile.resolver");

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields : {
        blogs: BlogResolver,
        products:ProductResolver,
        categories : CategoriesResolver,
        childOfCategory : CategoryChildResolver,
        courses : CourseResolver,
        getUserBookmarkedBlogs,
        getUserBookmarkedCourse,
        getUserBookmarkedProducs
    }
})

const RootMutation = new GraphQLObjectType({
    name:'Mutation',
    fields  : {
        CreateCommentForBlog,
        CreateCommentForCourse,
        CreateCommentForProduct,
        LikeProduct,
        LikeCourse,
        LikeBlog,
        DisLikeProduct,
        DisLikeBlog,
        DisLikeCourse,
        BookmarkProduct,
        BookmarkCourse,
        BookmarkBlog
    }
})

const graphQlSchema = new GraphQLSchema({
    query: RootQuery , 
    mutation: RootMutation
})

module.exports = {
    graphQlSchema
}