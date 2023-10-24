const { PermissionController } = require('../../http/controllers/admin/RBAC/permissionController')

const router = require('express').Router()

router.get('/list' , PermissionController.getAllPermissions)
router.post('/add' , PermissionController.createNewPermission)

module.exports = {
    AdminApiPermissionRouter : router
}