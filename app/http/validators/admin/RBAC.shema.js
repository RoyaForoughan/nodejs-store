const Joi = require('@hapi/joi')
const { MongoIDPattern } = require('../../../utils/constant')
const createError = require('http-errors');


const addRoleSchima = Joi.object({
    title : Joi.string().min(3).max(30).error(new Error('عنوان نقش صحیح نمباشد')),
   description : Joi.allow(),
    permissions : Joi.array().items(Joi.string().pattern(MongoIDPattern)).error(createError.BadRequest('دسترسی های ارسال شده صحیح نمیباشد'))
})
const addPermissionSchema = Joi.object({
    name : Joi.string().min(3).max(30).error(createError.BadRequest("اسم دسترسی صحیح نمیباشد")),
    description : Joi.string().min(0).max(100).error(createError.BadRequest("توضیحات دسترسی صحیح نمیباشد")),
});

module.exports = {
    addRoleSchima,
    addPermissionSchema
}