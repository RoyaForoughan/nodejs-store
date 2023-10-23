const { CourseController } = require('../../http/controllers/admin/course/courseController')
const { stringToArray } = require('../../http/middelwares/stringToArray')
const { uploadFile } = require('../../utils/multer')

const router = require('express').Router()

router.get('/list' , CourseController.getListOfCourse)
router.get('/:id' , CourseController.getCourseById)
router.post('/add' ,uploadFile.single("image"), stringToArray("tags"), CourseController.addCourse)
router.patch('/update/:id' ,uploadFile.single("image"), CourseController.updateCourseById)
module.exports = {
    AdminApiCourseRouter : router
}