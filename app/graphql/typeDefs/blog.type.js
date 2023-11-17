const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");
const { AuthorType, PublicCategoryType } = require("./public.type");

const BlogType = new GraphQLObjectType({
    name:'blogType',
    fields:{
        id : {type : GraphQLString},
        author : {type : AuthorType },
        title : {type : GraphQLString},
        short_text : {type : GraphQLString},
        text : {type : GraphQLString},
        image : {type : GraphQLString},
        tags : {type : new GraphQLList(GraphQLString)},
        category : {type : PublicCategoryType},
    }
})

module.exports = {
    BlogType
}