const { getBasketOfUser, invoiceNumberGenerator } = require("../../../utils/functions");
const Controller = require("../Controller");
const createError = require('http-errors')
const { default: axios, HttpStatusCode } = require("axios");
const { PaymentModel } = require("../../../models/payments");
const moment = require("moment-jalali");
const {StatusCodes : HttpStatus} = require('http-status-codes');
const { UserModel } = require("../../../models/users");

class PaymentController extends Controller{
    async PaymentGateway(req,res,next){
        try {
            const user = req.user
            if(user.basket.courses.length == 0 && user.basket.products.length) throw createError.BadRequest('سبد شما خالی میباشد')
            const basket = (await getBasketOfUser(user._id , discount))?.[0] 
            if(!basket?.payDetail?.paymentAmount) throw createError.BadRequest('مشخصات پرداخت یافت نشد')
            const zarinpal_request_url = "https://api.zarinpal.com/pg/v4/payment/request.json";
            const zarinpalGatewayURL = "https://www.zarinpal.com/pg/StartPay"
            const description = 'بابت خرید دوره یا محصولات' , amount = basket?.payDetail?.paymentAmount
            const zapripal_options = {
                merchant_id: process.env.ZARINPAL_MERCHANTID,
                amount,
                description,
                metadata:{
                    email:user?.email || 'example@domin.com',
                    mobile:user.mobile
                },
                callback_url: "http://localhost:5000/verify"
            }
            const RequestResult = await axios.post(zarinpal_request_url,zapripal_options).then(result => result.data)
            const {authority , code} = RequestResult.data
            await PaymentModel.create({
                    invoiceNumber: invoiceNumberGenerator(),
                    paymentDate : moment().format('jYYYYjMMjDDHHmmss'),
                    amount,
                    user : user._id,
                    description,
                    authority,
                    verify:false,
                    basket
                })
                if(code == 100 && authority){
                    return res.status(HttpStatus.OK).json({
                        statusCode : HttpStatus.OK ,
                        data:{
                            code ,
                            basket,
                            gatwayURL : `${zarinpalGatewayURL} / ${authority}`

                        }
                    })
            }
            throw createError.BadRequest('پارامترهای ارسال شده صحیح نمی باشد')
        } catch (error) {
            next(error)
        }
    }

    async verifyPayment(req,res,next){
        try {
            const {Authority : authority} = req.query
            const verifyURL = "https://api.zarinpal.com/pg/v4/payment/verify.json";
            const payment = await PaymentModel.findOne({authority})
            if(!payment) throw createError.NotFound('تراکنش در انتظار پرداخت یافت نشد')
            if(payment.verify) throw createError.BadRequest('تراکنش مورد نظر قبلا پرداخت شده است')
            const verifyBody = JSON.stringify({
                authority,
                amount: payment.amount,
                merchant_id : process.env.ZARINPAL_MERCHANTID
            })
            const verifyResult = await fetch(verifyURL , {
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: verifyBody
            }).then(result => result.json())
            if(verifyResult.data.code == 100){
                await PaymentModel.updateOne({authority} , {
                    $set:{
                        refID:verifyResult.data.ref_id,
                        cardHash:verifyResult.data.cardHash,
                        verify:true
                    }
                })
                const user = await UserModel.findById(payment.user)
                await UserModel.updateOne({_id:payment.user} , {
                    $set:{
                        Courses:[...payment?.basket?.payDetail?.courseIds || [] , ...user.Courses],
                        Products:[...payment?.basket?.payDetail?.productIds || [] , ...user.Products],
                        basket:{
                            courses:[],
                            products:[]
                        }
                    }
                })
                return  res.status(HttpStatus.OK).json({
                    statusCode:HttpStatus.OK , 
                    data:{
                        message : 'پرداخت شما با موفقیت انجام شد'
                    }
                })
            }
            throw createError.BadRequest("پرداخت انجام نشد در صورت کسر وجه طی ۷۲ ساعت به حساب شما بازمیگردد")
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    PaymentController : new PaymentController()
}