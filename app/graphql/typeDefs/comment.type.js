const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList } = require("graphql");
const { UserType } = require("./public.type");

const CommentAnswerType = new GraphQLObjectType({
    name : 'CommentAnswerType',
    fields:{
        _id:{type:GraphQLString},
        user:{type:UserType},
        comment:{type: GraphQLString},
        createdAt:{type : GraphQLString},
        show:{type:GraphQLBoolean},
    }
})
const CommentType = new GraphQLObjectType({
    name:'commentType',
    fields:{
        _id:{type:GraphQLString},
        user: {type: UserType},
        answers : {type: new GraphQLList(CommentAnswerType)},
        comment: {type: GraphQLString},
        show: {type: GraphQLBoolean},
        openToComment: {type: GraphQLBoolean},
        createdAt:{type: GraphQLString}
    }
})

module.exports = {
    CommentType
}