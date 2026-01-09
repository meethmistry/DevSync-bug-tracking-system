const Admin = require("../models/admin.model");
const { hashPin, comparePin } = require("../../../../shared/utils/pin.util");
const { generateToken } = require("../../../../shared/utils/jwt.util");
const constants = require("../../../../shared/constants/admin.constants");

// Defualt Pin
const ensureAdminExists = async () => {
  let admin = await Admin.findById(constants.DEFAULT_ADMIN_ID);

  if (!admin) {
    const defaultPinHash = await hashPin(constants.DEFAULT_PIN);

    admin = await Admin.create({
      _id: constants.DEFAULT_ADMIN_ID,
      pinHash: defaultPinHash,
      failedAttempts: 0,
      isLocked: false,
      lockUntil: null,
      tokens: [],
      pinLastChangedAt: new Date(),
    });
  }

  return admin;
};

// Login
const login = async (req, res, next) => {
  try {
    const body = req.body || {};
    const { pin, deviceId } = body;

    if (!pin || !deviceId) {
      throw {
        statusCode: 400,
        message: "PIN and deviceId required",
      };
    }

    const admin = await ensureAdminExists();

    // Check lock
    if (admin.isLocked && admin.lockUntil > new Date()) {
      throw {
        statusCode: 403,
        message: "Admin account is locked. Try later.",
      }
    }

    const isCorrect = await comparePin(pin, admin.pinHash);

    if (!isCorrect) {
      admin.failedAttempts += 1;

      if (admin.failedAttempts >= constants.MAX_FAILED_ATTEMPTS) {
        admin.isLocked = true;
        admin.lockUntil = new Date(Date.now() + constants.LOCK_TIME_MINUTES * 60 * 1000); // 30 min
      }

      await admin.save();
      throw {
        statusCode: 401,
        message: "Incorrect PIN",
      };
    }

    // SUCCESS
    admin.failedAttempts = 0;
    admin.isLocked = false;
    admin.lockUntil = null;

    const token = generateToken({ adminId: constants.DEFAULT_ADMIN_ID }, constants.TOKEN_EXPIRY);

    admin.tokens.push({
      token,
      deviceId,
      loggedInAt: new Date(),
    });

    await admin.save();

    return res.status(200).json({
      success: true,
      token,
      expiresIn: constants.TOKEN_EXPIRY,
      isDefaultPin: pin === constants.DEFAULT_PIN,
    });
  } catch (error) {
    next(error);
  }
};

// Logout
const logout = async (req, res, next) => {
  try {
    const admin = req.admin;
    const token = req.token;

    admin.tokens = admin.tokens.filter((t) => t.token !== token);
    await admin.save();

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error)
  }
};


// Change Pin
const changePin = async (req, res, next) => {
  try {
    const admin = req.admin;
    const { oldPin, newPin, confirmNewPin } = req.body;

    if (!oldPin || !newPin || !confirmNewPin) {
      throw {
        statusCode: 400,
        message: "All PIN fields are required",
      };
    }

    if (!/^\d{4}$/.test(newPin)) {
      throw {
        statusCode: 400,
        message: "PIN must be exactly 4 digits",
      };
    }

    if (newPin !== confirmNewPin) {
      throw {
        statusCode: 400,
        message: "PINs do not match",
      };
    }

    const isOldCorrect = await comparePin(oldPin, admin.pinHash);
    if (!isOldCorrect) {
      throw {
        statusCode: 401,
        message: "Old PIN incorrect",
      };
    }

    admin.pinHash = await hashPin(newPin);
    admin.pinLastChangedAt = new Date();
    admin.failedAttempts = 0;

    await admin.save();

    return res.json({
      success: true,
      message: "PIN changed successfully",
    });
  } catch (error) {
    next(error)
  }
};

// Check Settion 
const me = async (req, res, next) => {
  try {
    const admin = req.admin;
    return res.json({
      success: true,
      admin: {
        id: admin._id,
        pinLastChangedAt: admin.pinLastChangedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};


// Logout From All Devices
const logoutAll = async (req, res, next) => {
  try {
    const admin = req.admin;

    admin.tokens = [];
    await admin.save();

    return res.json({
      success: true,
      message: "Logged out from all devices",
    });
  } catch (error) {
    next(error);
  }
};



module.exports = {
  login,
  logout,
  changePin,
  me,
  logoutAll,
};
