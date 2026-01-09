const Permission = require("../../models/access/permission.model");

const createPermission = async (req, res, next) => {
  try {
    const { key, description } = req.body;

    if (!key || !description) {
      throw { statusCode: 400, message: "Key and description are required" };
    }

    const existing = await Permission.findOne({ key: key.trim().toUpperCase() });
    if (existing) {
      throw { statusCode: 409, message: "Permission already exists" };
    }

    await Permission.create({
      key: key.trim().toUpperCase(),
      description: description.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Permission created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getAllPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.find()
      .sort({ createdAt: -1 })
      .select("_id key description isActive createdAt");

    res.json({ success: true, data: permissions });
  } catch (error) {
    next(error);
  }
};

const updatePermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description, isActive } = req.body;

    const permission = await Permission.findById(id);
    if (!permission) throw { statusCode: 404, message: "Permission not found" };

    if (description) permission.description = description.trim();
    if (typeof isActive === "boolean") permission.isActive = isActive;

    await permission.save();

    res.json({ success: true, message: "Permission updated" });
  } catch (error) {
    next(error);
  }
};

const deactivatePermission = async (req, res, next) => {
  try {
    const { id } = req.params;

    const permission = await Permission.findById(id);
    if (!permission) throw { statusCode: 404, message: "Permission not found" };

    if (!permission.isActive) {
      throw { statusCode: 400, message: "Permission already deactivated" };
    }

    permission.isActive = false;
    await permission.save();

    res.json({ success: true, message: "Permission deactivated" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPermission,
  getAllPermissions,
  updatePermission,
  deactivatePermission,
};
