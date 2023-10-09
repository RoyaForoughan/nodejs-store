
const { AdminApiBlogRouter } = require('./blog')
const { AdminApiCategoryRouter } = require('./category')
const { AdminApiChapterRouter } = require('./chapter')
const { AdminApiCourseRouter } = require('./course')
const { AdminApiProductRouter } = require('./product')

const router = require('express').Router()

router.use('/category' , AdminApiCategoryRouter)
router.use('/blogs' , AdminApiBlogRouter)
router.use('/products' , AdminApiProductRouter)
router.use('/courses' , AdminApiCourseRouter)
router.use('/chapter' , AdminApiChapterRouter)
module.exports = {
    AdminRoutes : router
}