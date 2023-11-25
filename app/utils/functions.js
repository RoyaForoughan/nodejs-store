const Jwt = require('jsonwebtoken')
const {  ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = require('./constant')
const createError = require('http-errors')
const { UserModel } = require('../models/users')
const redisClient = require('./init_redis')
const path = require('path')
const fs = require('fs')
const moment = require("moment-jalali");


function RandomNumberGenerator(){
    return Math.floor((Math.random() * 90000) + 10000)
}
function signAccessToken(userId){
    return new Promise(async(resolve , reject)=>{
        const user = await UserModel.findById(userId)
        const payload = {
            mobile : user.mobile,          
        }        
        const options = {
            expiresIn : '1h'
        }
        Jwt.sign(payload , ACCESS_TOKEN_SECRET_KEY , options , (err , token) => {
            if(err)  reject(createError.InternalServerError('خطای سرور'))
            resolve(token)
        })
    })
}
function signRefreshToken(userId){
    return new Promise(async(resolve , reject) => {
        const user = await UserModel.findById(userId)
        const payload = {
            mobile : user.mobile
        }
        const options ={
            expiresIn : '1y'
        }
        Jwt.sign(payload , REFRESH_TOKEN_SECRET_KEY , options ,async (err, token)=>{
            if(err) reject(createError.InternalServerError('خطای سرور'))
            await redisClient.SETEX(String(userId) , (365*24*60*60) , token)
            resolve(token)
        })
    })
}

function verifyRefreshToken(token){
    return new Promise((resolve , reject) =>{
        Jwt.verify(token , REFRESH_TOKEN_SECRET_KEY , async (err , payload)=>{
            if(err) reject(createError.Unauthorized('وارد حساب کاربری خود شوید'))
            const {mobile} = payload || {}
            const user = await UserModel.findOne({mobile} , {otp:0 , password:0})
            if(!user) reject(createError.Unauthorized('کاربری یافت نشد'))
            const refreshToken = await redisClient.get(String(user?._id))
            if(token === refreshToken) return  resolve(mobile)       
            reject(createError.Unauthorized('ورود مجدد به حساب کاربری انجام نشد'))
        })
    })
}

function deleteFileInPublic(fileAddress){
    if(fileAddress){
        const pathFile = path.join(__dirname , '..' , '..' , 'public' , fileAddress)
        if(fs.existsSync(pathFile)) fs.unlinkSync(pathFile)
    }
}

function ListOfImagesFromRequest(files , fileUploadPath){
    if(files?.length > 0){
        return ((files.map(file => path.join(fileUploadPath , file.filename))).map(item => item.replace(/\\/g , '/')))
    }else {
        return []
    }
}
function setFeatures(body){
    const {colors , width , length , height , weight} = body
    let features = {} ,type = 'physical'
    features.colors = colors

    if(isNaN(+width) || isNaN(+height) || isNaN(+length) || isNaN(+weight) ){

        if(!width) features.width = 0
        else features.width = +width
        if(!height) features.height = 0
        else features.height = +height
        if(!length) features.length = 0
        else features.length = +length
        if(!weight) features.weight = 0
        else features.weight = +weight
    }else{
        type = 'virtual'
    }
}

function copyObject(object){
    return JSON.parse(JSON.stringify(object))
}

function deleteInvalidPropertyInObject(data={}, blackListFeild = []){
    const nullishData = ['' , ' ' , 0 , null , undefined , '0']

    Object.keys(data).forEach(key => {
        if(blackListFeild.includes(key)) delete data[key]
        if(typeof data[key] == 'string') data[key] = data[key].trim()
        if(Array.isArray(data[key] && data[key].length > 0)) data[key] = data[key].map(item => item.trim())
        if(Array.isArray(data[key] && data[key].length == 0)) delete data[key] 
        if(nullishData.includes(data[key])) delete data[key]
   })
}

function getTime(seconds) {
    let total = Math.round(seconds) / 60;
    let [minutes, percent] = String(total).split(".");
    let second = Math.round((percent * 60) / 100).toString().substring(0, 2);
    let houre = 0;
    if (minutes > 60) {
        total = minutes / 60
         let [h1, percent] = String(total).split(".");
         houre = h1,
         minutes = Math.round((percent * 60) / 100).toString().substring(0, 2);
    }
    if(String(houre).length ==1) houre = `0${houre}`
    if(String(minutes).length ==1) minutes = `0${minutes}`
    if(String(second).length ==1) second = `0${second}`
    
    return (houre + ":" + minutes + ":" +second)
}

function getTimeOfCourse(chapters = []){
    let time , hour , minute , second = 0
    for (const chapter of chapters){
        if(Array.isArray(chapter?.episodes)){
            for (const episode of chapter.episodes){
                if(episode?.time) time = episode.time.split(':')
                else time = '00:00:00'.split(':')
                if(time.length == 3 ){
                    second += Number(time[0]) * 3600 //convert hour to second
                    second += Number(time[1]) * 60 //convert minute to second
                    second += Number(time[2])  
                }else if(time.length == 2) { // 5 : 23
                    second += Number(time[0]) * 60 //convert minute to second
                    second += Number(time[1])  
                }
            }
        }
    }
    hour = Math.floor(second / 3600) // convert secound to hour
    minute = Math.floor(second / 60) % 60 // convert secound to minute
    second = Math.floor(second % 60) // convert secound to second


    if(String(hour).length ==1) hour = `0${hour}`
    if(String(minute).length ==1) minute = `0${minute}`
    if(String(second).length ==1) second = `0${second}`
    
    return (hour + ":" + minute + ":" +second)
}

async function getBasketOfUser(userID){
    const userDetail = await UserModel.aggregate([
        {
            $match:{_id: userID}
        },
        {
            $project:{basket : 1}
        },
        {
            $lookup:{
                from:'products',
                localField:'basket.products.productID',
                foreignField:'_id',
                as:'productDetail'
            }
        },{
            $lookup:{
                from:'courses',
                localField:'basket.courses.courseID',
                foreignField:'_id',
                as:'courseDetail'
            }
        },
        {
            $addFields:{
                'productDetail':{
                    $function:{
                        body: function(productDetail , products){
                            return productDetail.map(function(product){
                                const count = products.find(item => item.productID.valueOf() == product._id.valueOf()).count
                                const totalPrice = count * product.price
                                return{
                                    ...product,
                                    basketCount:count,
                                    totalPrice,
                                    finalPrice: totalPrice - ((product.discount / 100)  * totalPrice)
                                }
                            })
                        },
                        args:['$productDetail' , '$basket.products'],
                        lang:'js'
                    }
                },
                'courseDetail':{
                    $function:{
                        body:function(courseDetail){
                            return courseDetail.map(function(course){
                                return {
                                    ...course,
                                    finalPrice: course.price - ((course.discount / 100) * course.price)
                                }
                            })
                        },
                        args:['$courseDetail'],
                        lang:'js'
                    }
                },
                'payDetail':{
                    $function:{
                        body: function(courseDetail , productDetail , products){
                            const courseAmount = courseDetail.reduce(function(total , course){
                                return total + (course.price - ((course.discount / 100) * course.price))
                            },0)
                            const productAmount = productDetail.reduce(function(total , product){
                                const count = products.find(item => item.productID.valueOf() == product._id.valueOf()).count
                                const totalPrice = count * product.price
                                return total + (totalPrice - ((product.discount / 100) * totalPrice))
                            },0)
                            const courseIds = courseDetail.map(course => course._id.valueOf())
                            const productIds = productDetail.map(product => product._id.valueOf())
                            return {
                                courseAmount,
                                productAmount,
                                paymentAmount: courseAmount + productAmount,
                                courseIds,
                                productIds
                            }
                        },
                        args: ['$courseDetail' , '$productDetail' , '$basket.products'],
                        lang : 'js'
                    }
                }
            },
         
        },
        {
            $project:{
                basket:0
            }
        }
    ])
    return copyObject(userDetail)
}

function invoiceNumberGenerator(){
    return moment().format('jYYYYjMMjDDHHmmssSS') + String(proccess.hrtime()[1]).padStart(9,0)
}

module.exports = {
    RandomNumberGenerator,
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    deleteFileInPublic,
    ListOfImagesFromRequest,
    copyObject,
    setFeatures,
    deleteInvalidPropertyInObject,
    getTime,
    getTimeOfCourse,
    getBasketOfUser,
    invoiceNumberGenerator
}