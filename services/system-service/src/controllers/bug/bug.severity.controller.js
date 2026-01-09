const BugSeverity = require("../../models/bug/bug.severity.model");

const createBugSeverity = async (req, res, next) => {
  try {
    const { name, level } = req.body;

    if (!name || !level) {
      throw { statusCode: 400, message: "Name and level are required" };
    }

    const existing = await BugSeverity.findOne({
      $or: [{ name: new RegExp(`^${name}$`, "i") }, { level }],
    });

    if (existing) {
      throw { statusCode: 409, message: "Severity already exists" };
    }

    await BugSeverity.create({ name: name.trim(), level, isActive: true });

    return res.status(201).json({ success: true, message: "Bug severity created" });
  } catch (error) {
    next(error);
  }
};

const getAllBugSeverities = async (req, res, next) => {
  try {
    const data = await BugSeverity.find().sort({ level: 1 });
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const updateBugSeverity = async (req, res, next) => {
  try {
    const { name, level, isActive } = req.body;
    const severity = await BugSeverity.findById(req.params.id);
    if (!severity) throw { statusCode: 404, message: "Severity not found" };

    if (name) severity.name = name.trim();
    if (level) severity.level = level;
    if (typeof isActive === "boolean") severity.isActive = isActive;

    await severity.save();
    return res.json({ success: true, message: "Bug severity updated" });
  } catch (error) {
    next(error);
  }
};

const deactivateBugSeverity = async (req, res, next) => {
  try {
    const severity = await BugSeverity.findById(req.params.id);
    if (!severity) throw { statusCode: 404, message: "Severity not found" };

    severity.isActive = false;
    await severity.save();
    return res.json({ success: true, message: "Bug severity deactivated" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBugSeverity,
  getAllBugSeverities,
  updateBugSeverity,
  deactivateBugSeverity,
};
