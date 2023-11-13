const { GraphQLList } = require("graphql");
const { categoryType } = require("../typeDefs/category.type");
const { CategoryModel } = require("../../models/categories");

const CategoriesResolver = {
    type : new GraphQLList(categoryType),
    resolve : async () => {
        const categories = await CategoryModel.find({parent : undefined})
        return categories
    }
}

module.exports = {
    CategoriesResolver
}