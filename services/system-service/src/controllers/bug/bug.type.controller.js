const BugType = require("../../models/bug/bug.type.model");

// Create
const createBugType = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      throw { statusCode: 400, message: "Bug type name is required" };
    }

    const existing = await BugType.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });

    if (existing) {
      throw { statusCode: 409, message: "Bug type already exists" };
    }

    await BugType.create({ name: name.trim(), isActive: true });

    return res.status(201).json({ success: true, message: "Bug type created" });
  } catch (error) {
    next(error);
  }
};

// Get all
const getAllBugTypes = async (req, res, next) => {
  try {
    const data = await BugType.find().sort({ createdAt: -1 });
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Update
const updateBugType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const bugType = await BugType.findById(id);
    if (!bugType) throw { statusCode: 404, message: "Bug type not found" };

    if (name) {
      const duplicate = await BugType.findOne({
        _id: { $ne: id },
        name: { $regex: `^${name.trim()}$`, $options: "i" },
      });
      if (duplicate) throw { statusCode: 409, message: "Bug type already exists" };
      bugType.name = name.trim();
    }

    if (typeof isActive === "boolean") bugType.isActive = isActive;

    await bugType.save();
    return res.json({ success: true, message: "Bug type updated" });
  } catch (error) {
    next(error);
  }
};

// Deactivate
const deactivateBugType = async (req, res, next) => {
  try {
    const bugType = await BugType.findById(req.params.id);
    if (!bugType) throw { statusCode: 404, message: "Bug type not found" };
    if (!bugType.isActive) throw { statusCode: 400, message: "Already deactivated" };

    bugType.isActive = false;
    await bugType.save();

    return res.json({ success: true, message: "Bug type deactivated" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBugType, getAllBugTypes, updateBugType, deactivateBugType };
