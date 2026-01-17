const OTP_EXPIRY_MS = 150000;
const otpStore = {};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const isExpired = (timestamp) => Date.now() - timestamp > OTP_EXPIRY_MS;

module.exports = { generateOTP, isExpired, OTP_EXPIRY_MS, otpStore };
