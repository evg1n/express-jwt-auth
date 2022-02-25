const { reject } = require("bcrypt/promises");
const jwt = require("jsonwebtoken");
const {
  JWT_ACCESS_TOKEN_TTL,
  JWT_REFRESH_TOKEN_TTL,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
} = process.env;
const { jwtErrors } = require("../lib/errors.js");

const generateToken = (payload, type) => {
  let SECRET = "";
  let TTL = 0;
  if (type === "access") {
    SECRET = JWT_ACCESS_SECRET;
    TTL = parseInt(JWT_ACCESS_TOKEN_TTL);
  } else if (type === "refresh") {
    SECRET = JWT_REFRESH_SECRET;
    TTL = parseInt(JWT_REFRESH_TOKEN_TTL);
  } else {
    return new Error("Invalid Token Type");
  }
  return new Promise(async (resolve, reject) => {
    jwt.sign(payload, SECRET, { expiresIn: TTL }, (err, token) => {
      if (err) {
        console.error(jwtErrors.signError);
        reject(err);
      }
      resolve(token);
    });
  });
};

const verifyToken = (token, type) => {
  let SECRET = "";
  if (type === "access") {
    SECRET = JWT_ACCESS_SECRET;
  } else if (type === "refresh") {
    SECRET = JWT_REFRESH_SECRET;
  } else {
    return new Error("Invalid Token Type");
  }
  return new Promise(async (resolve, reject) => {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

module.exports = {
  generateToken,
  verifyToken,
};
