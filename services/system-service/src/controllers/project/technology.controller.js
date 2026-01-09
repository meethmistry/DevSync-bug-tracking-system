const Technology = require("../../models/project/technology.model");


const createTechnology = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      throw {
        statusCode: 400,
        message: "Technology name is required",
      };
    }

    const existing = await Technology.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });

    if (existing) {
      throw {
        statusCode: 409,
        message: "Technology already exists",
      };
    }

    await Technology.create({
      name: name.trim(),
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Technology created successfully",
    });
  } catch (error) {
    next(error);
  }
};


const getAllTechnologies = async (req, res, next) => {
  try {
    const technologies = await Technology.find()
      .sort({ createdAt: -1 })
      .select("_id name isActive createdAt");

    return res.json({
      success: true,
      data: technologies,
    });
  } catch (error) {
    next(error);
  }
};


const updateTechnology = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const technology = await Technology.findById(id);

    if (!technology) {
      throw {
        statusCode: 404,
        message: "Technology not found",
      };
    }

    if (name) {
      const duplicate = await Technology.findOne({
        _id: { $ne: id },
        name: { $regex: `^${name.trim()}$`, $options: "i" },
      });

      if (duplicate) {
        throw {
          statusCode: 409,
          message: "Technology name already exists",
        };
      }

      technology.name = name.trim();
    }

    if (typeof isActive === "boolean") {
      technology.isActive = isActive;
    }

    await technology.save();

    return res.json({
      success: true,
      message: "Technology updated",
    });
  } catch (error) {
    next(error);
  }
};

const deactivateTechnology = async (req, res, next) => {
  try {
    const { id } = req.params;

    const technology = await Technology.findById(id);

    if (!technology) {
      throw {
        statusCode: 404,
        message: "Technology not found",
      };
    }

    if (!technology.isActive) {
      throw {
        statusCode: 400,
        message: "Technology already deactivated",
      };
    }

    technology.isActive = false;
    await technology.save();

    return res.json({
      success: true,
      message: "Technology deactivated",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTechnology,
  getAllTechnologies,
  updateTechnology,
  deactivateTechnology,
};
