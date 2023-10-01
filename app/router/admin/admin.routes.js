const { verifyAccessToken } = require('../../http/middelwares/verifyAccessToken')
const { BlogAdminApiRoutes } = require('./blog')
const { CategoryRoutes } = require('./category')

const router = require('express').Router()

router.use('/category' , CategoryRoutes)
router.use('/blogs' ,verifyAccessToken, BlogAdminApiRoutes)
module.exports = {
    AdminRoutes : router
}