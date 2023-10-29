const { UserController } = require('../../http/controllers/admin/user/userController')
const { checkPermission } = require('../../http/middelwares/permission.guard')
const { PERMISSIONS } = require('../../utils/constant')

const router = require('express').Router()

router.get('/list', checkPermission([PERMISSIONS.ADMIN]) , UserController.getAllUsers)
router.patch('/update-profile' , UserController.updateUserProfile)
router.get('/profile' ,checkPermission([]) , UserController.userProfile)
module.exports = {
    AdminApiUserRouter : router
}