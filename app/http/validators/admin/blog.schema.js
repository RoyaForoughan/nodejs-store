const Joi = require('@hapi/joi')
const { MongoIDPattern } = require('../../../utils/constant')
const createError = require('http-errors')


const createBlogShima = Joi.object({
    title : Joi.string().min(3).max(30).error(createError.BadRequest('عنوان دسنه بندی صحی نمباشد')),
    text: Joi.string().error(createError.BadRequest('متن ارسال شده صحیح نمباشد')),
    short_text : Joi.string().error(createError.BadRequest('متن ارسال شده صحیح نمیباشد')),
    filename : Joi.string().pattern(/(\.png|\.jpg|\.webp|\.jpeg|\.gif)$/).error(createError.BadRequest('تصویر ارسال شده صحیح نمباشد')),
    tags : Joi.array().min(0).max(20).error(createError.BadRequest('بر چسب ها نمیتواند بیشتر 20 آیتم باشد')),
    category: Joi.string().pattern(MongoIDPattern).error(createError.BadRequest('دسته بندی مورد نظر یافت نشد')),
    fileUploadPath : Joi.allow()
})
const updateCategorySchema = Joi.object({
    title : Joi.string().min(3).max(30).error(createError.BadRequest("عنوان دسته بندی صحیح نمیباشد")),
});
module.exports = {
    createBlogShima,
    updateCategorySchema
}