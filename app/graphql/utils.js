const { Kind } = require("graphql")
const { ProductModel } = require("../models/products");
const { CourseModel } = require("../models/course");
const { BlogModel } = require("../models/blogs");
        

function parseObject(valueNode){
    const value = Object.create(null)
    valueNode.fields.forEach(field => {
        value[field.name.value] = parseValueNode(field.value)
    })
}

function parseValueNode(valueNode){
    switch(valueNode.kind){
        case Kind.STRING:
        case Kind.BOOLEAN:
            return valueNode.value
        case Kind.INT:
        case Kind.FLOAT:
            return Number(valueNode.value)        
        case Kind.OBJECT:
            return parseObject(valueNode.value)
        case Kind.LIST:
            return valueNode.values.map(parseValueNode)
        default:
            return null
    }
}

function parseLiteral(valueNode){
    switch(valueNode.kind){
        case Kind.STRING:
            return valueNode.value.charAt(0) === '{' ? JSON.parse(valueNode.value) : valueNode.value
        case Kind.INT:
        case Kind.FLOAT:
            return Number(valueNode.value)
        case Kind.OBJECT:
    }
}

function toObject(value){
    if(typeof value === 'object'){
        return value
    }
    if(typeof value === 'string' && value.charAt(0) === '{'){
        return JSON.parse(value)
    }

    return null
}


async function checkExistBlog(id){
    const blog = await BlogModel.findById(id)
    if(!blog) throw new createError.NotFound('بلاگی با این مشخصات یافت نشد')
    return blog
}

async function checkExistProduct(id){
    const product = await ProductModel.findById(id)
    if(!product) throw new createError.NotFound('محصولی با این مشخصات یافت نشد')
    return product
}
async function checkExistCourse(id){
    const course = await CourseModel.findById(id)
    if(!course)  throw new createError.NotFound('دوره ای با این مشخصات یافت نشد')
    return course
}

module.exports = {
    toObject,
    parseLiteral,
    parseValueNode,
    parseObject,
    checkExistBlog,
    checkExistCourse,
    checkExistProduct
}