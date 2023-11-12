const { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLInt, GraphQLString } = require("graphql");
const { blogResolver } = require("./queries/blog.resolver");

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields : {
        blogs: blogResolver
    }
})

const RootMutation = new GraphQLObjectType({
    name:'Mutation',
    fields  : {

    }
})

const graphQlSchema = new GraphQLSchema({
    query: RootQuery , 
   // mutation: RootMutation
})

module.exports = {
    graphQlSchema
}