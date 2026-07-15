const jwt = require("jsonwebtoken");
const redis = require("../../config/redis");

module.exports = async(req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const storeToken = await redis.get(`session:${token}`);

    if(!storeToken){
      return res.status(401).json({
        message:"Session expired. Please login again."
      });
      }

      req.user = {
          id: decoded.id,
          roleId: decoded.roleId,
      };

      next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};