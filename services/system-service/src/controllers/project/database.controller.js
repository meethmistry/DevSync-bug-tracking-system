const Database = require("../../models/project/database.model");

// Create a new database
const createDatabase = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      throw {
        statusCode: 400,
        message: "Database name is required",
      };
    }

    const existing = await Database.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });

    if (existing) {
      throw {
        statusCode: 409,
        message: "Database already exists",
      };
    }

    await Database.create({
      name: name.trim(),
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Database created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get all databases
const getAllDatabases = async (req, res, next) => {
  try {
    const databases = await Database.find()
      .sort({ createdAt: -1 })
      .select("_id name isActive createdAt");

    return res.json({
      success: true,
      data: databases,
    });
  } catch (error) {
    next(error);
  }
};

// Update database
const updateDatabase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const database = await Database.findById(id);

    if (!database) {
      throw {
        statusCode: 404,
        message: "Database not found",
      };
    }

    if (name) {
      const duplicate = await Database.findOne({
        _id: { $ne: id },
        name: { $regex: `^${name.trim()}$`, $options: "i" },
      });

      if (duplicate) {
        throw {
          statusCode: 409,
          message: "Database name already exists",
        };
      }

      database.name = name.trim();
    }

    if (typeof isActive === "boolean") {
      database.isActive = isActive;
    }

    await database.save();

    return res.json({
      success: true,
      message: "Database updated",
    });
  } catch (error) {
    next(error);
  }
};

// Deactivate database
const deactivateDatabase = async (req, res, next) => {
  try {
    const { id } = req.params;

    const database = await Database.findById(id);

    if (!database) {
      throw {
        statusCode: 404,
        message: "Database not found",
      };
    }

    if (!database.isActive) {
      throw {
        statusCode: 400,
        message: "Database already deactivated",
      };
    }

    database.isActive = false;
    await database.save();

    return res.json({
      success: true,
      message: "Database deactivated",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDatabase,
  getAllDatabases,
  updateDatabase,
  deactivateDatabase,
};
