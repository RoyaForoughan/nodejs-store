const Joi = require('@hapi/joi')


const addRoleSchima = Joi.object({
    title : Joi.string().min(3).max(30).error(new Error('عنوان نقش صحیح نمباشد')),
   description : Joi.allow(),
    permissions : Joi.allow()
})


module.exports = {
    addRoleSchima
}