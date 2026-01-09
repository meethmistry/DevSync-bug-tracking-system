const UserRole = require("../../models/access/user.role.model");

const createUserRole = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      throw { statusCode: 400, message: "Role name is required" };
    }

    const existing = await UserRole.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });

    if (existing) {
      throw { statusCode: 409, message: "Role already exists" };
    }

    await UserRole.create({ name: name.trim() });

    res.status(201).json({
      success: true,
      message: "Role created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getAllUserRoles = async (req, res, next) => {
  try {
    const roles = await UserRole.find()
      .sort({ createdAt: -1 })
      .select("_id name isActive createdAt");

    res.json({ success: true, data: roles });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const role = await UserRole.findById(id);
    if (!role) throw { statusCode: 404, message: "Role not found" };

    if (name) {
      const duplicate = await UserRole.findOne({
        _id: { $ne: id },
        name: { $regex: `^${name.trim()}$`, $options: "i" },
      });
      if (duplicate) {
        throw { statusCode: 409, message: "Role name already exists" };
      }
      role.name = name.trim();
    }

    if (typeof isActive === "boolean") {
      role.isActive = isActive;
    }

    await role.save();

    res.json({ success: true, message: "Role updated" });
  } catch (error) {
    next(error);
  }
};

const deactivateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    const role = await UserRole.findById(id);
    if (!role) throw { statusCode: 404, message: "Role not found" };

    if (!role.isActive) {
      throw { statusCode: 400, message: "Role already deactivated" };
    }

    role.isActive = false;
    await role.save();

    res.json({ success: true, message: "Role deactivated" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUserRole,
  getAllUserRoles,
  updateUserRole,
  deactivateUserRole,
};
