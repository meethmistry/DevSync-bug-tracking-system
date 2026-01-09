const Industry = require("../../models/project/Industry.model");

// Create Industry
const createIndustry = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      throw { statusCode: 400, message: "Industry name is required" };
    }

    const existing = await Industry.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });

    if (existing) {
      throw { statusCode: 409, message: "Industry already exists" };
    }

    await Industry.create({ name: name.trim(), isActive: true });

    return res.status(201).json({
      success: true,
      message: "Industry created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get all industries
const getAllIndustries = async (req, res, next) => {
  try {
    const industries = await Industry.find()
      .sort({ createdAt: -1 })
      .select("_id name isActive createdAt");

    return res.json({ success: true, data: industries });
  } catch (error) {
    next(error);
  }
};

// Update Industry
const updateIndustry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const industry = await Industry.findById(id);
    if (!industry) throw { statusCode: 404, message: "Industry not found" };

    if (name) {
      const duplicate = await Industry.findOne({
        _id: { $ne: id },
        name: { $regex: `^${name.trim()}$`, $options: "i" },
      });
      if (duplicate) throw { statusCode: 409, message: "Industry name already exists" };
      industry.name = name.trim();
    }

    if (typeof isActive === "boolean") industry.isActive = isActive;

    await industry.save();

    return res.json({ success: true, message: "Industry updated" });
  } catch (error) {
    next(error);
  }
};

// Deactivate Industry
const deactivateIndustry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const industry = await Industry.findById(id);
    if (!industry) throw { statusCode: 404, message: "Industry not found" };
    if (!industry.isActive) throw { statusCode: 400, message: "Industry already deactivated" };

    industry.isActive = false;
    await industry.save();

    return res.json({ success: true, message: "Industry deactivated" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createIndustry,
  getAllIndustries,
  updateIndustry,
  deactivateIndustry,
};
