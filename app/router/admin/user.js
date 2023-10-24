const { UserController } = require('../../http/controllers/admin/user/userController')

const router = require('express').Router()

router.get('/list' , UserController.getAllUsers)
router.patch('/update-profile' , UserController.updateUserProfile)
module.exports = {
    AdminApiUserRouter : router
}