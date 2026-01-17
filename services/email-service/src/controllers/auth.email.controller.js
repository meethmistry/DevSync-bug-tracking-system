const {
    sendVerifyEmail,
    sendForgotPasswordEmail,
    sendAccountRecoveryEmail,
} = require("../services/auth.email.service");
const { generateOTP, otpStore, isExpired } = require("../utils/otp.util");

// SEND OTP
const sendOTP = async (req, res, next) => {
    try {
        const body = req.body || {};
        const { email, type } = body;

        if (!email || !type) {
            throw {
                statusCode: 400,
                message: "Email and type required",
            };
        }

        const otp = generateOTP();

        otpStore[email] = {
            otp,
            createdAt: Date.now(),
            type,
        };

        if (type === "VERIFY_EMAIL") {
            await sendVerifyEmail(email, otp);

        } else if (type === "FORGOT_PASSWORD") {
            await sendForgotPasswordEmail(email, otp);

        } else if (type === "RECOVER_ACCOUNT") {
            await sendAccountRecoveryEmail(email, otp);

        } else {
            throw {
                statusCode: 400,
                message: "Invalid OTP type",
            };
        }

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        next(error);
    }
};

// VERIFY OTP
const verifyOTP = async (req, res, next) => {
    try {
        const body = req.body || {};
        const { email, otp } = body;

        if (!email || !otp) {
            throw {
                statusCode: 400,
                message: "Email and OTP required",
            };
        }

        const record = otpStore[email];

        if (!record) {
            throw {
                statusCode: 404,
                message: "OTP not found",
            };
        }

        if (isExpired(record.createdAt)) {
            delete otpStore[email];
            throw {
                statusCode: 400,
                message: "OTP expired",
            };
        }

        if (record.otp !== otp) {
            throw {
                statusCode: 400,
                message: "Invalid OTP",
            };
        }

        delete otpStore[email];

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            type: record.type, // useful for frontend flow
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendOTP,
    verifyOTP,
};
