const { GraphQLObjectType, GraphQLSchema} = require("graphql");
const { BlogResolver } = require("./queries/blog.resolver");
const { ProductResolver } = require("./queries/product.resolver");
const { CategoriesResolver, CategoryChildResolver } = require("./queries/category.resolver");

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields : {
        blogs: BlogResolver,
        products:ProductResolver,
        categories : CategoriesResolver,
        childOfCategory : CategoryChildResolver
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