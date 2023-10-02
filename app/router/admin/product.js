const { ProductController } = require('../../http/controllers/admin/productController')
const { stringToArray } = require('../../http/middelwares/stringToArray')
const { uploadFile } = require('../../utils/multer')

const router = require('express').Router()

router.post('/add' , uploadFile.single('image') , stringToArray("tags"), ProductController.addProduct)
router.get('/all' , ProductController.getAllProducts)
module.exports = {
    AdminApiProductRoutes : router
}