const BugPriority = require("../../models/bug/bug.priority.model");

const createBugPriority = async (req, res, next) => {
  try {
    const { name, level } = req.body;

    if (!name || !level) {
      throw { statusCode: 400, message: "Name and level are required" };
    }

    const existing = await BugPriority.findOne({
      $or: [{ name: new RegExp(`^${name}$`, "i") }, { level }],
    });

    if (existing) {
      throw { statusCode: 409, message: "Priority already exists" };
    }

    await BugPriority.create({ name: name.trim(), level, isActive: true });

    return res.status(201).json({ success: true, message: "Bug priority created" });
  } catch (error) {
    next(error);
  }
};

const getAllBugPriorities = async (req, res, next) => {
  try {
    const data = await BugPriority.find().sort({ level: 1 });
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const updateBugPriority = async (req, res, next) => {
  try {
    const priority = await BugPriority.findById(req.params.id);
    if (!priority) throw { statusCode: 404, message: "Priority not found" };

    const { name, level, isActive } = req.body;
    if (name) priority.name = name.trim();
    if (level) priority.level = level;
    if (typeof isActive === "boolean") priority.isActive = isActive;

    await priority.save();
    return res.json({ success: true, message: "Bug priority updated" });
  } catch (error) {
    next(error);
  }
};

const deactivateBugPriority = async (req, res, next) => {
  try {
    const priority = await BugPriority.findById(req.params.id);
    if (!priority) throw { statusCode: 404, message: "Priority not found" };

    priority.isActive = false;
    await priority.save();
    return res.json({ success: true, message: "Bug priority deactivated" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBugPriority,
  getAllBugPriorities,
  updateBugPriority,
  deactivateBugPriority,
};
