const { GraphQLList } = require("graphql");
const { CourseType } = require("../typeDefs/course.type");
const { CourseModel } = require("../../models/course");

const CourseResolver = {
    type : GraphQLList(CourseType),
    resolve : async() => {
        return await CourseModel.find({}).populate([{path:'teacher'} , {path:'category'}])
    }
}

module.exports = {
    CourseResolver
}