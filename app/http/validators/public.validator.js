const Joi = require('@hapi/joi')
const createError = require('http-errors')
const { MongoIDPattern } = require('../../utils/constant')
const ObjectIdValidator = Joi.object({
    id : Joi.string().pattern(MongoIDPattern).error(createError.BadRequest('شناسه ارسال شده صحیح نمی باشد'))
})

module.exports = {
    ObjectIdValidator
}