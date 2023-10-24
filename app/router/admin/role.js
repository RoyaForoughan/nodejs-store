const { RoleController } = require('../../http/controllers/admin/RBAC/roleController')
const { stringToArray } = require('../../http/middelwares/stringToArray')

const router = require('express').Router()

router.get('/list' , RoleController.getAllRoles)
router.post('/add' ,stringToArray('permissions') ,  RoleController.createNewRole)
router.delete('/remove/:field' ,  RoleController.removeRole)
module.exports = {
    AdminApiRoleRouter : router
}