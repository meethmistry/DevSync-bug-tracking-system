const ProjectType = require("../../models/project/project.types.model");

// Create Project Type
const createProjectType = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      throw { statusCode: 400, message: "Project Type name is required" };
    }

    const existing = await ProjectType.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });

    if (existing) {
      throw { statusCode: 409, message: "Project Type already exists" };
    }

    await ProjectType.create({ name: name.trim(), isActive: true });

    return res.status(201).json({
      success: true,
      message: "Project Type created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get all Project Types
const getAllProjectTypes = async (req, res, next) => {
  try {
    const projectTypes = await ProjectType.find()
      .sort({ createdAt: -1 })
      .select("_id name isActive createdAt");

    return res.json({ success: true, data: projectTypes });
  } catch (error) {
    next(error);
  }
};

// Update Project Type
const updateProjectType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const projectType = await ProjectType.findById(id);
    if (!projectType) throw { statusCode: 404, message: "Project Type not found" };

    if (name) {
      const duplicate = await ProjectType.findOne({
        _id: { $ne: id },
        name: { $regex: `^${name.trim()}$`, $options: "i" },
      });
      if (duplicate) throw { statusCode: 409, message: "Project Type name already exists" };
      projectType.name = name.trim();
    }

    if (typeof isActive === "boolean") projectType.isActive = isActive;

    await projectType.save();

    return res.json({ success: true, message: "Project Type updated" });
  } catch (error) {
    next(error);
  }
};

// Deactivate Project Type
const deactivateProjectType = async (req, res, next) => {
  try {
    const { id } = req.params;

    const projectType = await ProjectType.findById(id);
    if (!projectType) throw { statusCode: 404, message: "Project Type not found" };
    if (!projectType.isActive) throw { statusCode: 400, message: "Project Type already deactivated" };

    projectType.isActive = false;
    await projectType.save();

    return res.json({ success: true, message: "Project Type deactivated" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProjectType,
  getAllProjectTypes,
  updateProjectType,
  deactivateProjectType,
};
