const Joi = require('@hapi/joi')
const { MongoIDPattern } = require('../../../utils/constant')

const addCategorySchima = Joi.object({
    title : Joi.string().min(3).max(30).error(new Error('عنوان دسته بندی صحیح نمباشد')),
    parent : Joi.string().allow('').pattern(MongoIDPattern).allow("").error(new Error('والد انتخاب شده صحیح نمیباشد'))
})
const updateCategorySchima = Joi.object({
    title : Joi.string().min(3).max(30).error(new Error('عنوان دسته بندی صحیح نمباشد'))
})

module.exports = {
    addCategorySchima,
    updateCategorySchima
}