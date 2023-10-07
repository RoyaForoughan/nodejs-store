
const { AdminApiBlogRouter } = require('./blog')
const { AdminApiCategoryRouter } = require('./category')
const { AdminApiCourseRouter } = require('./course')
const { AdminApiProductRouter } = require('./product')

const router = require('express').Router()

router.use('/category' , AdminApiCategoryRouter)
router.use('/blogs' , AdminApiBlogRouter)
router.use('/products' , AdminApiProductRouter)
router.use('/courses' , AdminApiCourseRouter)
module.exports = {
    AdminRoutes : router
}