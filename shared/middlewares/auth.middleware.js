const Admin = require("../../services/admin-service/src/models/admin.model");
const { verifyToken } = require("../utils/jwt.util");

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    verifyToken(token);

    const admin = await Admin.findById("SINGLE_ADMIN");
    if (admin) {
      const tokenExists = admin.tokens.some(t => t.token === token);

      if (!tokenExists) {
        return res.status(401).json({ success: false, message: "Session expired" });
      }

      req.admin = admin;
      req.token = token;
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};


const tokenAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};



module.exports = { adminAuth, tokenAuth };
