const { GraphQLList, GraphQLString } = require("graphql");
const { categoryType, CategoryType } = require("../typeDefs/category.type");
const { CategoryModel } = require("../../models/categories");

const CategoriesResolver = {
    type : new GraphQLList(CategoryType),
    args:{
        field : {type : GraphQLString},
        authorizationToken : {type : GraphQLString}
    },
    resolve : async () => {
        const categories = await CategoryModel.find({parent : undefined})
        return categories
    }
}
const CategoryChildResolver = {
    type : new GraphQLList(CategoryType),
    args:{
        parent:{type : GraphQLString}
    },
    resolve : async (_,args) => {
        console.log(args);
        const {parent} = args 
        const categories = await CategoryModel.find({parent})
        return categories
    }
}

module.exports = {
    CategoriesResolver,
    CategoryChildResolver
}