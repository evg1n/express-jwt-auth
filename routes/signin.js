// Libraries
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Controllers
const {
  userSignupValidator,
  validationResult,
} = require("../controllers/validation.js");
const { generateToken, verifyToken } = require("../controllers/token.js");

// Mongoose Schema
require("../controllers/mongoose.js");
const { User } = require("../models/user.js");

// Constants
const { signinErrors, jwtErrors } = require("../lib/errors.js");

const { JWT_SECRET, JWT_ACCESS_TOKEN_TTL, BCRYPT_SALT } = process.env;

router.post("/", userSignupValidator, async (req, res) => {
  try {
    console.log("HIT /signin");

    // Validate request
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const { email, password } = req.body;
    const { cookies } = req;

    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(signinErrors.userNotFound.status)
        .json(signinErrors.userNotFound.message);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid Credentials!");
      return res
        .status(signinErrors.invalidCredentials.status)
        .json(signinErrors.invalidCredentials.message);
    }

    const payload = {
      user: { id: user._id },
    };
    // Sign JWT
    console.log("Signing JWT access token");
    let accessToken = "";
    let refreshToken = "";

    // Create Access Token
    console.log("Creating Access Token");
    const accessTokenPromise = generateToken(payload, "access")
      .then((result) => {
        accessToken = result;
        console.log("access_token", accessToken);
      })
      .catch((err) => console.error("SIGN TOKEN ERR:", err));

    // Create Refresh Token
    console.log("Creating Refresh Token");
    const refreshTokenPromise = generateToken(payload, "refresh")
      .then((result) => {
        refreshToken = result;
        console.log("refresh_token", refreshToken);
      })
      .catch((err) => console.error("REFRESH TOKEN ERR: ", err));

    return Promise.all([accessTokenPromise, refreshTokenPromise])
      .then(() => {
        res
          .status(200)
          .cookie("access_token", accessToken, {
            secure: process.env.NODE_ENV !== "development",
            expires: new Date(Date.now() + 900000),
            httpOnly: true,
          })
          .cookie("refresh_token", refreshToken, {
            secure: process.env.NODE_ENV !== "development",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
          })
          .json({
            user: user._id,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
      })
      .catch((err) => {
        console.error("SIGNIN ERROR:", err);
        return res.status(500).json(signinErrors.genericError);
      });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json(signinErrors.genericError);
  }
});

module.exports = router;
