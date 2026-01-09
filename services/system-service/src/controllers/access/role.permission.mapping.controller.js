const RolePermissionMapping = require("../../models/access/role.permission.mapping.model");

const createRolePermissionMapping = async (req, res, next) => {
  try {
    const { roleId, permissions } = req.body;

    if (!roleId || !Array.isArray(permissions) || permissions.length === 0) {
      throw {
        statusCode: 400,
        message: "Role and permissions are required",
      };
    }

    await RolePermissionMapping.create({
      roleId,
      permissions,
    });

    res.status(201).json({
      success: true,
      message: "Role permission mapping created",
    });
  } catch (error) {
    next(error);
  }
};

const getAllRolePermissionMappings = async (req, res, next) => {
  try {
    const mappings = await RolePermissionMapping.find()
      .populate("roleId", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: mappings });
  } catch (error) {
    next(error);
  }
};

const updateRolePermissionMapping = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { permissions, isActive } = req.body;

    const mapping = await RolePermissionMapping.findById(id);
    if (!mapping) {
      throw { statusCode: 404, message: "Mapping not found" };
    }

    if (permissions && Array.isArray(permissions)) {
      mapping.permissions = permissions;
    }

    if (typeof isActive === "boolean") {
      mapping.isActive = isActive;
    }

    await mapping.save();

    res.json({ success: true, message: "Mapping updated" });
  } catch (error) {
    next(error);
  }
};

const deactivateRolePermissionMapping = async (req, res, next) => {
  try {
    const { id } = req.params;

    const mapping = await RolePermissionMapping.findById(id);
    if (!mapping) {
      throw { statusCode: 404, message: "Mapping not found" };
    }

    mapping.isActive = false;
    await mapping.save();

    res.json({ success: true, message: "Mapping deactivated" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRolePermissionMapping,
  getAllRolePermissionMappings,
  updateRolePermissionMapping,
  deactivateRolePermissionMapping,
};
