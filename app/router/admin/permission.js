const { PermissionController } = require('../../http/controllers/admin/RBAC/permissionController')

const router = require('express').Router()

router.get('/list' , PermissionController.getAllPermissions)
router.post('/add' , PermissionController.createNewPermission)
router.delete('/remove/:id' , PermissionController.removePermission)
router.patch('/update/:id' , PermissionController.updatePermissionById)

module.exports = {
    AdminApiPermissionRouter : router
}