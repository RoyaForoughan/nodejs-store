const { GraphQLObjectType, GraphQLSchema} = require("graphql");
const { blogResolver } = require("./queries/blog.resolver");
const { ProductResolver } = require("./queries/product.resolver");
const { CategoriesResolver } = require("./queries/category.resolver");

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields : {
        blogs: blogResolver,
        products:ProductResolver,
        categories : CategoriesResolver
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