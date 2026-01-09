const ProgrammingLanguage = require("../../models/project/language.model");

// Create Programming Language
const createProgrammingLanguage = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      throw { statusCode: 400, message: "Programming Language name is required" };
    }

    const existing = await ProgrammingLanguage.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });

    if (existing) {
      throw { statusCode: 409, message: "Programming Language already exists" };
    }

    await ProgrammingLanguage.create({ name: name.trim(), isActive: true });

    return res.status(201).json({
      success: true,
      message: "Programming Language created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get all Programming Languages
const getAllProgrammingLanguages = async (req, res, next) => {
  try {
    const languages = await ProgrammingLanguage.find()
      .sort({ createdAt: -1 })
      .select("_id name isActive createdAt");

    return res.json({ success: true, data: languages });
  } catch (error) {
    next(error);
  }
};

// Update Programming Language
const updateProgrammingLanguage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const language = await ProgrammingLanguage.findById(id);
    if (!language) throw { statusCode: 404, message: "Programming Language not found" };

    if (name) {
      const duplicate = await ProgrammingLanguage.findOne({
        _id: { $ne: id },
        name: { $regex: `^${name.trim()}$`, $options: "i" },
      });
      if (duplicate) throw { statusCode: 409, message: "Programming Language name already exists" };
      language.name = name.trim();
    }

    if (typeof isActive === "boolean") language.isActive = isActive;

    await language.save();

    return res.json({ success: true, message: "Programming Language updated" });
  } catch (error) {
    next(error);
  }
};

// Deactivate Programming Language
const deactivateProgrammingLanguage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const language = await ProgrammingLanguage.findById(id);
    if (!language) throw { statusCode: 404, message: "Programming Language not found" };
    if (!language.isActive) throw { statusCode: 400, message: "Programming Language already deactivated" };

    language.isActive = false;
    await language.save();

    return res.json({ success: true, message: "Programming Language deactivated" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProgrammingLanguage,
  getAllProgrammingLanguages,
  updateProgrammingLanguage,
  deactivateProgrammingLanguage,
};
