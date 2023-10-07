const { CategoryController } = require('../../http/controllers/admin/CategoryController')

const router = require('express').Router()

router.post('/add' , CategoryController.addCategory)
router.get('/parents' , CategoryController.getAllParents)
router.get('/children/:parent' , CategoryController.getChildOfParents)
router.get('/all' , CategoryController.getAllCategory)
router.delete('/remove/:id' , CategoryController.removeCategory)
router.get('/listOfAll' , CategoryController.getAllCategoryWhitoutPopulate)
router.get('/:id' , CategoryController.getCategoryById)
router.patch('/update/:id' , CategoryController.editCategoryTitle)

module.exports = {
    AdminApiCategoryRouter : router
}