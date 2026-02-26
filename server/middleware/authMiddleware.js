const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = { id: decoded.id };

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};