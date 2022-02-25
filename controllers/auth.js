const jwt = require("jsonwebtoken"),
  { authErrors, jwtErrors } = require("../lib/errors.js"),
  { noToken, invalidToken, expiredToken } = jwtErrors,
  { JWT_SECRET } = process.env;

// TODO: handle expired token, redirect to refresh token

module.exports = function (req, res, next) {
  try {
    const token = req
      .header("authorization")
      .split("Bearer ")[1]
      .replace(/["']/g, "")
      .trim();
    if (!token) return res.status(noToken.status).json(noToken.message);
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error("JWT ERROR", req.header("authorization"), Object.entries(e));
    res.status(500).json(invalidToken);
  }
};
