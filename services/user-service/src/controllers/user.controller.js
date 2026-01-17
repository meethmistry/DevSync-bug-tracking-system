const userProfile = require("../models/user.profile.model");
const userPreference = require("../models/user.preference.model");
const userPresence = require("../models/user.presence.model");

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            throw {
                statusCode: 400,
                message: "User ID is required",
            };
        }

        const profile = await userProfile.findOne({ userId: userId });

        if (!profile) {
            throw {
                statusCode: 404,
                message: "User profile not found",
            };
        }
        res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

const updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { username, phone, about } = req.body;

        const profile = await userProfile.findOne({ userId });

        if (!profile) {
            throw {
                statusCode: 404,
                message: "User profile not found",
            };
        }

        if (username && username !== profile.username) {
            const existingUsername = await userProfile.findOne({
                username,
                userId: { $ne: userId },
            });

            if (existingUsername) {
                throw {
                    statusCode: 409,
                    message: "Username already exists",
                };
            }

            profile.username = username;
        }

        if (phone !== undefined) profile.phone = phone;
        if (about !== undefined) profile.about = about;

        if (req.file) {
            profile.profileImage = `/uploads/profiles/${req.file.filename}`;
        }

        await profile.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: profile,
        });
    } catch (error) {
        next(error);
    }
};


const changeTheme = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { theme } = req.body;

        if (!["light", "dark"].includes(theme)) {
            throw {
                statusCode: 400,
                message: "Invalid theme value",
            };
        }

        const preference = await userPreference.findOneAndUpdate(
            { userId },
            { theme },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: "Theme updated successfully",
            data: preference,
        });
    } catch (error) {
        next(error);
    }
};


const toggleEmailNotifications = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { enabled } = req.body;

        if (typeof enabled !== "boolean") {
            throw {
                statusCode: 400,
                message: "enabled must be boolean",
            };
        }

        const preference = await userPreference.findOneAndUpdate(
            { userId },
            { "notifications.email": enabled },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: "Email notification preference updated",
            data: preference.notifications,
        });
    } catch (error) {
        next(error);
    }
};

const toggleAppNotifications = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { enabled } = req.body;

        if (typeof enabled !== "boolean") {
            throw {
                statusCode: 400,
                message: "enabled must be boolean",
            };
        }

        const preference = await userPreference.findOneAndUpdate(
            { userId },
            { "notifications.push": enabled },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: "App notification preference updated",
            data: preference.notifications,
        });
    } catch (error) {
        next(error);
    }
};


const toggleLastSeenVisibility = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { enabled } = req.body;

        if (typeof enabled !== "boolean") {
            throw {
                statusCode: 400,
                message: "enabled must be boolean",
            };
        }

        const preference = await userPreference.findOneAndUpdate(
            { userId },
            { "privacy.showLastSeen": enabled },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: "Last seen visibility updated",
            data: preference.privacy,
        });
    } catch (error) {
        next(error);
    }
};

const toggleOnlineStatusVisibility = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { enabled } = req.body;

        if (typeof enabled !== "boolean") {
            throw {
                statusCode: 400,
                message: "enabled must be boolean",
            };
        }

        const preference = await userPreference.findOneAndUpdate(
            { userId },
            { "privacy.showOnlineStatus": enabled },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: "Online status visibility updated",
            data: preference.privacy,
        });
    } catch (error) {
        next(error);
    }
};


const updatePresence = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { isOnline } = req.body;
        const presence = await userPresence.findOneAndUpdate(
            { userId },
            {
                isOnline: Boolean(isOnline),
                lastSeen: isOnline ? null : new Date(),
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: "User presence updated",
            data: presence,
        });
    } catch (error) {
        next(error);
    }
};



module.exports = {
    getUserProfile,
    updateUserProfile,
    changeTheme,
    toggleEmailNotifications,
    toggleAppNotifications,
    toggleLastSeenVisibility,
    toggleOnlineStatusVisibility,
    updatePresence,
};