const BugStatus = require("../../models/bug/bug.status.model");

const createBugStatus = async (req, res, next) => {
  try {
    const { name, isFinal } = req.body;

    if (!name) throw { statusCode: 400, message: "Status name required" };

    const existing = await BugStatus.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });

    if (existing) throw { statusCode: 409, message: "Status already exists" };

    await BugStatus.create({ name: name.trim(), isFinal: !!isFinal });

    return res.status(201).json({ success: true, message: "Bug status created" });
  } catch (error) {
    next(error);
  }
};

const getAllBugStatuses = async (req, res, next) => {
  try {
    const data = await BugStatus.find();
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const updateBugStatus = async (req, res, next) => {
  try {
    const status = await BugStatus.findById(req.params.id);
    if (!status) throw { statusCode: 404, message: "Status not found" };

    const { name, isFinal, isActive } = req.body;
    if (name) status.name = name.trim();
    if (typeof isFinal === "boolean") status.isFinal = isFinal;
    if (typeof isActive === "boolean") status.isActive = isActive;

    await status.save();
    return res.json({ success: true, message: "Bug status updated" });
  } catch (error) {
    next(error);
  }
};

const deactivateBugStatus = async (req, res, next) => {
  try {
    const status = await BugStatus.findById(req.params.id);
    if (!status) throw { statusCode: 404, message: "Status not found" };

    status.isActive = false;
    await status.save();
    return res.json({ success: true, message: "Bug status deactivated" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBugStatus,
  getAllBugStatuses,
  updateBugStatus,
  deactivateBugStatus,
};
