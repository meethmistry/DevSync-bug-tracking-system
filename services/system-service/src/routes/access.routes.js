const express = require("express");
const router = express.Router();
const { tokenAuth } = require("../../../../shared/middlewares/auth.middleware");
const userRoleController = require("../controllers/access/user.role.controller");
const permissionController = require("../controllers/access/permission.controller");
const rolePermissionController = require("../controllers/access/role.permission.mapping.controller");

////////////////////////////////////////////////////////////////////////
//////////////////////// User Roles Routes ///////////////////////////  
////////////////////////////////////////////////////////////////////////
router.post("/roles", tokenAuth, userRoleController.createUserRole);
router.get("/roles", tokenAuth, userRoleController.getAllUserRoles);
router.post("/roles/:id", tokenAuth, userRoleController.updateUserRole);
router.delete("/roles/:id", tokenAuth, userRoleController.deactivateUserRole);

////////////////////////////////////////////////////////////////////////
////////////////////////// Permissions Routes ///////////////////////////    
////////////////////////////////////////////////////////////////////////
router.post("/permissions", tokenAuth, permissionController.createPermission);
router.get("/permissions", tokenAuth, permissionController.getAllPermissions); 
router.post("/permissions/:id", tokenAuth, permissionController.updatePermission);
router.delete("/permissions/:id", tokenAuth, permissionController.deactivatePermission);

////////////////////////////////////////////////////////////////////////
//////////////////// Role Permissions Routes ///////////////////////////
////////////////////////////////////////////////////////////////////////
router.post("/role-permissions", tokenAuth, rolePermissionController.createRolePermissionMapping);
router.get("/role-permissions", tokenAuth, rolePermissionController.getAllRolePermissionMappings);
router.post("/role-permissions/:id", tokenAuth, rolePermissionController.updateRolePermissionMapping);
router.delete("/role-permissions/:id", tokenAuth, rolePermissionController.deactivateRolePermissionMapping);


module.exports = router;
