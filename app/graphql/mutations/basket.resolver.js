const { ResponseType } = require("../typeDefs/public.type");
const { GraphQLString, GraphQLInt } = require("graphql");
const { verifyAccessTokenInGraphQl } = require("../../http/middelwares/verifyAccessToken");
const { checkExistProduct, checkExistCourse } = require("../utils");
const { UserModel } = require("../../models/users");
const { copyObject } = require("../../utils/functions");
const {StatusCodes:HttpStatus} = require('http-status-codes');
const createError = require("http-errors");


const AddProductToBasket = {
    type:ResponseType,
    args:{
        productID : {type : GraphQLString}
    },
    resolve : async (_,args , context) => {
        const {req} = context
        const user = await verifyAccessTokenInGraphQl(req)
        const {productID} = args
        await checkExistProduct(productID)
        const product = await findProductInBasket(user._id, productID)
        if(product){
            await UserModel.updateOne({
                _id : user._id,
                'basket.products.productID' : productID
            },{
                $inc:{
                    'basket.products.$.count' : 1
                }
            })
        }else{
            await UserModel.updateOne(
                {
                    _id : user._id           
            },{
                $push:{
                    'basket.products':{
                        productID,
                        count : 1
                    }
                }
            })
        }
        return {
            statusCode : HttpStatus.OK,
            data:{
                message : 'محصول به سبد خرید اضافه شد'
            }
        }
    }
}



const AddCourseToBasket = {
    type : ResponseType , 
    args : {
        courseID : {type : GraphQLString}
    },
    resolve: async (_ , args , context) => {
        const {req} = context 
        const user = await verifyAccessTokenInGraphQl(req)
        const {courseID} = args
        await checkExistCourse(courseID)
        const course = await findCourseInBasket(user._id , courseID)
        if(course){
            throw createError.BadRequest('این دوره قبلا به سبد خرید اضافه شده است')
        }else{
            await UserModel.updateOne(
                {
                    _id:user._id
                },{
                    $push:{
                        'basket.courses':{
                            courseID,
                            count : 1
                        }
                    }
                })
        }
        return{
            statusCode : HttpStatus.OK,
            data:{
                message : 'دوره به سبد خرید اضافه شد'
            }
        }
    }
}


const RemoveProductFromBasket = {
    type:ResponseType,
    args:{
        productID : {type : GraphQLString}
    },
    resolve : async (_,args , context) => {
        const {req} = context
        const user = await verifyAccessTokenInGraphQl(req)
        const {productID} = args
        await checkExistProduct(productID)
        const product = await findProductInBasket(user._id , productID)
        let message
        if(!product) throw createError.NotFound('محصول مورد نظر در سبد خرید یافت نشد')
        if(product.count > 1){
          await UserModel.updateOne(
                {
                    _id : user._id,
                    'basket.products.productID' : productID
                },
                {
                    $inc: {
                        'basket.products.$.count': -1
                    }
                }
            )
            message = 'یک عدد محصول از سبد خرید کم شد'
        }else{
            await UserModel.updateOne(
                {
                    _id : user._id,
                    'basket.products.productID' : productID
                },
                {
                    $pull:{
                        'basket.products':{
                            productID
                        }
                    }
                }
            )
            message = 'محصول از سبد خرید حذف شد'
        }
        return {
            statusCode : HttpStatus.OK,
            data:{
                message
            }
        }
    }
}

const RemoveCourseFromBasket = {
    type : ResponseType , 
    args : {
        courseID : {type : GraphQLString}
    },
    resolve: async (_ , args , context) => {
        const {req} = context 
        const user = await verifyAccessTokenInGraphQl(req)
        const {courseID} = args
        await checkExistCourse(courseID)
        console.log('courseID');
        console.log(courseID);
        const userCourse = await UserModel.findOne({_id: user._id , Courses : courseID})
        if(userCourse) throw createError.BadRequest('شما این دوره را قبلا خریداری کرده اید')
        const course = await findCourseInBasket(user._id , courseID)
    console.log('course');
    console.log(course);
        if(!course) throw createError.NotFound('دوره مورد نظر در داخل سبد خرید یافت نشد')
        if(course.count > 1){
            await UserModel.updateOne(
                {
                    _id:user._id,
                    'basket.courses.courseID': courseID
                },{
                    $inc:{
                        'basket.courses.$.count': -1
                    }
                }
            )
            message = 'یک عدد از دوره داخل سبد کم شد'
        }else{
            await UserModel.updateOne(
                {
                    _id : user._id,
                    'basket.courses.courseID' : courseID
                },{
                    $pull:{
                        'basket.courses':{
                            courseID
                        }
                    }
                }
            )
            message = 'دوره از داخل سبد خرید حذف شد'
        }
        return{
            statusCode:HttpStatus.OK,
            data:{
                message
            }
        }
    }
}

async function findProductInBasket(userID, productID){
    const findResult = await UserModel.findOne({_id : userID, 'basket.products.productID' : productID} , {'basket.products.$' : 1} )
    const userDetail = copyObject(findResult)    
    return userDetail?.basket?.products?.[0]
}

async function findCourseInBasket(userID ,courseID){
    const findResult = await UserModel.findOne({_id: userID , 'basket.courses.courseID' : courseID } , {'basket.courses.$' : 1})
    const userDetail = copyObject(findResult)
    return userDetail?.basket?.courses?.[0]
}


module.exports = {
    AddCourseToBasket,
    AddProductToBasket,
    RemoveCourseFromBasket,
    RemoveProductFromBasket
}