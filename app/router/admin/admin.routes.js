
const { AdminApiBlogRoutes } = require('./blog')
const { AdminApiCategoryRoutes } = require('./category')
const { AdminApiProductRoutes } = require('./product')

const router = require('express').Router()

router.use('/category' , AdminApiCategoryRoutes)
router.use('/blogs' , AdminApiBlogRoutes)
router.use('/products' , AdminApiProductRoutes)
module.exports = {
    AdminRoutes : router
}