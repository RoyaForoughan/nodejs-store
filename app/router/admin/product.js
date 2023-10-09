const { ProductController } = require('../../http/controllers/admin/product/productController')
const { stringToArray } = require('../../http/middelwares/stringToArray')
const { uploadFile } = require('../../utils/multer')

const router = require('express').Router()

router.post('/add' , uploadFile.array('images', 10) , stringToArray("tags"), ProductController.addProduct)
router.get('/all' , ProductController.getAllProducts)
router.get('/:id', ProductController.getOneProduct)
router.delete('/remove/:id', ProductController.removeProductById)
router.patch('/edit/:id',uploadFile.array("images", 10), stringToArray("tags", "colors"), ProductController.editProduct)
module.exports = {
    AdminApiProductRouter : router
}