const jwt = require("jsonwebtoken");

const generateToken = (payload, expiresIn = "24h") => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload must be a plain object');
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
};

const generateTokens = (userId, deviceId) => {
  const userIdStr = userId.toString ? userId.toString() : userId;
  
  const accessToken = generateToken(
    { userId: userIdStr, deviceId, type: 'access' },
    '15m'
  );
  
  const refreshToken = generateToken(
    { userId: userIdStr, deviceId, type: 'refresh' },
    '7d'
  );

  return { accessToken, refreshToken };
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  generateTokens, 
  verifyToken,
};