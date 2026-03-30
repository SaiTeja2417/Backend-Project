const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.send("No token");

  try {
    const data = jwt.verify(token, "secret123");
    req.user = data;
    next();
  } catch {
    res.send("Invalid token");
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.send("Admin only");
  }
  next();
};

module.exports = { auth, adminOnly };