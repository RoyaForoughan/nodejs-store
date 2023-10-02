const { AdminBlogController } = require('../../http/controllers/admin/blogController')
const { stringToArray } = require('../../http/middelwares/stringToArray')
const { uploadFile } = require('../../utils/multer')


const router = require('express').Router()

router.get('/' , AdminBlogController.getListOfBlogs)
router.post('/add' ,uploadFile.single('image'),stringToArray('tags'), AdminBlogController.createBlog)
router.patch('/edit/:id' ,uploadFile.single('image'),stringToArray('tags'), AdminBlogController.updateBlogById)
router.delete('/:id' , AdminBlogController.deleteBlogById)
router.get('/:id' , AdminBlogController.getOneBlogById)

module.exports = {
    AdminApiBlogRoutes : router
}