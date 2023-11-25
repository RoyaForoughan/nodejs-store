const { PaymentController } = require('../../http/controllers/api/payment.controller')
const { verifyAccessToken } = require('../../http/middelwares/verifyAccessToken')

const router = require('express').Router()

router.post('/payment' , verifyAccessToken , PaymentController.PaymentGateway )
router.get('/verify' , )

module.exports = {
    ApiPayment : router
}

