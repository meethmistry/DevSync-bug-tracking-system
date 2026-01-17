require("dotenv").config();
const bcrypt = require("bcrypt");
const axios = require("axios");
const User = require("../models/user.model");
const UserSecurity = require("../models/user.security.model");
const UserProfile = require("../models/user.profile.model");
const UserPreference = require("../models/user.preference.model");
const UserPresence = require("../models/user.presence.model");
const { hashPin, comparePin } = require("../../../../shared/utils/pin.util");

const { generateTokens } = require("../../../../shared/utils/jwt.util");

const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL;


const sendEmail = async (req, res, next) => {
    try {
        const { email, type } = req.body;

        if (!email || !type) {
            throw {
                statusCode: 400,
                message: "Email and type are required",
            };
        }

        if (!["VERIFY_EMAIL", "FORGOT_PASSWORD", "RECOVER_ACCOUNT"].includes(type)) {
            throw {
                statusCode: 400,
                message: "Invalid email type",
            };
        }

        if (type === "VERIFY_EMAIL") {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw {
                    statusCode: 409,
                    message: "Email already registered",
                };
            }
        }

        if (["FORGOT_PASSWORD", "RECOVER_ACCOUNT"].includes(type)) {
            const user = await User.findOne({ email });
            if (!user) {
                throw {
                    statusCode: 404,
                    message: "Account not found",
                };
            }
        }

        await axios.post(`${EMAIL_SERVICE_URL}/auth/send-otp`, {
            email,
            type,
        });

        let message = "OTP sent successfully";

        if (type === "VERIFY_EMAIL") {
            message = "Verification OTP sent";
        } else if (type === "FORGOT_PASSWORD") {
            message = "Password reset OTP sent";
        } else if (type === "RECOVER_ACCOUNT") {
            message = "Account recovery OTP sent";
        }

        return res.status(200).json({
            success: true,
            message,
        });
    } catch (error) {
        next(error);
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            throw { statusCode: 400, message: "Email and OTP are required" };
        }

        await axios.post(`${EMAIL_SERVICE_URL}/auth/verify-otp`, { email, otp });

        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
        });
    } catch (error) {
        next(error);
    }
};


const createAccount = async (req, res, next) => {
    let user = null;

    try {
        const { email, password, username, deviceId, phone } = req.body;

        if (!email || !password || !username || !deviceId || !phone) {
            throw {
                statusCode: 400,
                message: "Email, password, username, deviceId, and phone are required"
            };
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw {
                statusCode: 409,
                message: "Email already registered"
            };
        }

        const existingProfile = await UserProfile.findOne({ username });
        if (existingProfile) {
            throw {
                statusCode: 409,
                message: "Username already taken"
            };
        }

        const passwordHash = await bcrypt.hash(password, parseInt(process.env.PASSWORD_SALT_ROUNDS));
        user = new User({
            email,
            passwordHash,
            lastPasswordChange: new Date()
        });

        await user.save();


        // Create user profile
        const userProfile = new UserProfile({
            userId: user._id,
            username,
            phone
        });

        await userProfile.save();

        const userSecurity = new UserSecurity({
            userId: user._id
        });

        await userSecurity.save();

        const userPreference = new UserPreference({
            userId: user._id
        });
        await userPreference.save();

        const userPresence = new UserPresence({
            userId: user._id,
            lastSeen: new Date()
        });
        await userPresence.save();

        const tokens = generateTokens(user._id, deviceId);

        userSecurity.tokens.push({
            token: tokens.refreshToken,
            deviceId,
            loggedInAt: new Date()
        });
        await userSecurity.save();

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: {
                userId: user._id,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: {
                    email: user.email,
                    username
                }
            }
        });
    } catch (error) {
        if (user && user._id) {
            await cleanupPartialUser(user._id);
        }
        next(error);
    }
};

const cleanupPartialUser = async (userId) => {
    try {
        await Promise.allSettled([
            User.findByIdAndDelete(userId),
            UserProfile.findOneAndDelete({ userId }),
            UserSecurity.findOneAndDelete({ userId }),
            UserPreference.findOneAndDelete({ userId }),
            UserPresence.findOneAndDelete({ userId })
        ]);
        console.log("Cleaned up partial user data for:", userId);
    } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
    }
};


const login = async (req, res, next) => {
    try {
        const { email, password, deviceId } = req.body;

        if (!email || !password || !deviceId) {
            throw { statusCode: 400, message: "Missing credentials" };
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw { statusCode: 401, message: "Invalid credentials" };
        }

        if (!user.isActive) {
            throw {
                statusCode: 403,
                message: "Account is deactivated",
                data: {
                    canRecover: true,
                    deletionScheduledAt: user.deletionScheduledAt,
                },
            };
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            throw { statusCode: 401, message: "Invalid credentials" };
        }

        const tokens = generateTokens(user._id, deviceId);

        let userSecurity = await UserSecurity.findOne({ userId: user._id });
        if (!userSecurity) {
            userSecurity = new UserSecurity({ userId: user._id });
        }

        userSecurity.tokens = userSecurity.tokens.filter(
            token => token.deviceId !== deviceId
        );

        userSecurity.tokens.push({
            token: tokens.refreshToken,
            deviceId,
            loggedInAt: new Date()
        });

        userSecurity.lastLogin = new Date();
        userSecurity.loginAttempts = 0;
        await userSecurity.save();

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                userId: user._id,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: {
                    email: user.email,
                    username: await getUserUsername(user._id)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

const getUserUsername = async (userId) => {
    try {
        const profile = await UserProfile.findOne({ userId });
        return profile ? profile.username : null;
    } catch (error) {
        return null;
    }
};


const setNewPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            throw { statusCode: 400, message: "Missing fields" };
        }

        const saltRounds = Number(process.env.PASSWORD_SALT_ROUNDS);

        if (!saltRounds) {
            throw { statusCode: 500, message: "Invalid salt rounds configuration" };
        }

        const passwordHash = await bcrypt.hash(newPassword, saltRounds);

        await User.findOneAndUpdate(
            { email },
            {
                passwordHash,
                lastPasswordChange: new Date(),
            }
        );

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        next(error);
    }
};


const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const currentDeviceId = req.user.deviceId;
        let userId = req.user.userId;

        if (userId === "[object Object]") {
            throw {
                statusCode: 401,
                message: "Invalid authentication. Please login again."
            };
        }

        if (typeof userId === "object" && userId.userId) {
            userId = userId.userId;
        }

        if (typeof userId === "object" && userId._id) {
            userId = userId._id;
        }


        if (!oldPassword || !newPassword) {
            throw { statusCode: 400, message: "Old and new password are required" };
        }

        if (oldPassword === newPassword) {
            throw {
                statusCode: 400,
                message: "New password must be different from old password",
            };
        }

        const user = await User.findById(userId);
        if (!user) {
            throw { statusCode: 404, message: "User not found" };
        }

        const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isValid) {
            throw { statusCode: 401, message: "Old password is incorrect" };
        }

        // Update password
        const saltRounds = Number(process.env.PASSWORD_SALT_ROUNDS);
        user.passwordHash = await bcrypt.hash(newPassword, saltRounds);
        user.lastPasswordChange = new Date();
        await user.save();

        // Find security record
        let userSecurity = await UserSecurity.findOne({ userId });
        if (!userSecurity) {
            userSecurity = new UserSecurity({ userId });
        }

        const newTokens = generateTokens(userId, currentDeviceId);

        // Find the existing token for this device
        const existingTokenIndex = userSecurity.tokens.findIndex(
            token => token.deviceId === currentDeviceId
        );

        if (existingTokenIndex >= 0) {
            userSecurity.tokens[existingTokenIndex].token = newTokens.refreshToken;
        } else {
            userSecurity.tokens.push({
                token: newTokens.refreshToken,
                deviceId: currentDeviceId,
                loggedInAt: new Date()
            });
        }

        userSecurity.tokens = userSecurity.tokens.filter(
            token => token.deviceId === currentDeviceId
        );

        await userSecurity.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully. You have been logged out from all other devices.",
            data: {
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
                logoutFromOtherDevices: true
            }
        });
    } catch (error) {
        next(error);
    }
};

const deleteAccount = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) {
            throw { statusCode: 404, message: "User not found" };
        }

        if (!user.isActive) {
            throw { statusCode: 400, message: "Account already deactivated" };
        }

        const now = new Date();
        const deleteAfter60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

        user.isActive = false;
        user.deletedAt = now;
        user.deletionScheduledAt = deleteAfter60Days;
        await user.save();

        await UserSecurity.findOneAndUpdate(
            { userId },
            {
                $set: {
                    tokens: [],
                    isActive: false,
                },
            }
        );

        await UserPresence.findOneAndUpdate(
            { userId },
            {
                $set: {
                    isOnline: false,
                    lastSeen: now,
                },
            }
        );

        res.status(200).json({
            success: true,
            message:
                "Account deactivated. Your data will be permanently deleted after 60 days.",
            data: {
                deletionScheduledAt: deleteAfter60Days,
            },
        });
    } catch (error) {
        next(error);
    }
};


const recoverAccount = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw { statusCode: 400, message: "Email is required" };
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw { statusCode: 404, message: "User not found" };
        }

        if (user.isActive) {
            throw {
                statusCode: 400,
                message: "Account is already active",
            };
        }

        if (user.deletionScheduledAt && new Date() > user.deletionScheduledAt) {
            throw {
                statusCode: 410,
                message: "Account permanently deleted. Recovery period expired.",
            };
        }

        user.isActive = true;
        user.deletedAt = null;
        user.deletionScheduledAt = null;
        await user.save();

        await UserSecurity.findOneAndUpdate(
            { userId: user._id },
            { $set: { isActive: true } }
        );

        res.status(200).json({
            success: true,
            message: "Account recovered successfully. Please login again.",
        });
    } catch (error) {
        next(error);
    }
};


const setPin = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { pin } = req.body;

    if (!pin || pin.length !== 4) {
      throw { statusCode: 400, message: "PIN must be 4 digits" };
    }

    const security = await UserSecurity.findOne({ userId });

    if (!security) {
      throw { statusCode: 404, message: "User security record not found" };
    }

    if (security.pinEnabled) {
      throw {
        statusCode: 409,
        message: "PIN already set. Use update PIN instead",
      };
    }

    const pinHash = await hashPin(pin);

    security.pinHash = pinHash;
    security.pinEnabled = true;

    await security.save();

    res.status(200).json({
      success: true,
      message: "PIN set successfully",
    });
  } catch (error) {
    next(error);
  }
};


const updatePin = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { oldPin, newPin } = req.body;

    if (!oldPin || !newPin) {
      throw {
        statusCode: 400,
        message: "Old PIN and new PIN are required",
      };
    }

    if (newPin.length !== 4) {
      throw { statusCode: 400, message: "New PIN must be 4 digits" };
    }

    const security = await UserSecurity.findOne({ userId });

    if (!security || !security.pinEnabled) {
      throw {
        statusCode: 400,
        message: "PIN not enabled for this account",
      };
    }

    const isValid = await comparePin(oldPin, security.pinHash);

    if (!isValid) {
      throw { statusCode: 401, message: "Invalid old PIN" };
    }

    security.pinHash = await hashPin(newPin);
    await security.save();

    res.status(200).json({
      success: true,
      message: "PIN updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const removePin = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { pin } = req.body;

    if (!pin) {
      throw { statusCode: 400, message: "PIN is required" };
    }

    const security = await UserSecurity.findOne({ userId });

    if (!security || !security.pinEnabled) {
      throw {
        statusCode: 400,
        message: "PIN is not enabled",
      };
    }

    const isValid = await comparePin(pin, security.pinHash);

    if (!isValid) {
      throw { statusCode: 401, message: "Invalid PIN" };
    }

    security.pinEnabled = false;
    security.pinHash = null;

    await security.save();

    res.status(200).json({
      success: true,
      message: "PIN removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

const verifyPin = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { pin } = req.body;

    if (!pin) {
      throw {
        statusCode: 400,
        message: "PIN is required",
      };
    }

    const security = await UserSecurity.findOne({ userId });

    if (!security || !security.pinEnabled) {
      throw {
        statusCode: 400,
        message: "PIN is not enabled for this account",
      };
    }

    const isValid = await comparePin(pin, security.pinHash);

    if (!isValid) {
      throw {
        statusCode: 401,
        message: "Invalid PIN",
      };
    }

    res.status(200).json({
      success: true,
      message: "PIN verified successfully",
      data: {
        verified: true,
      },
    });
  } catch (error) {
    next(error);
  }
};



module.exports = {
    sendEmail,
    verifyEmail,
    createAccount,
    login,
    setNewPassword,
    changePassword,
    deleteAccount,
    recoverAccount,
    setPin,
    updatePin,
    removePin,
    verifyPin
};