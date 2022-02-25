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
const { signupErrors, jwtErrors } = require("../lib/errors.js");

const { BCRYPT_SALT } = process.env;

router.post("/", userSignupValidator, async (req, res) => {
  try {
    console.log("HIT /signup");

    // Validate request
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }
    const { email, password } = req.body;

    // Check if user already exists
    console.log("Checking if user already exists: ", email);

    let user = await User.findOne({ email: email });

    if (user) {
      console.error("This e-mail adress is already registered.");
      return res
        .status(signupErrors.userAlreadyExists.status)
        .json(signupErrors.userAlreadyExists.message);
    }

    // Create a new user
    user = new User({ email, password, verified: false });

    // Hash user password

    const salt = await bcrypt.genSalt(parseInt(BCRYPT_SALT));

    user.password = await bcrypt.hash(password, salt);

    // Save user information to database
    console.log("Saving user information to database.");
    await user.save();

    // Generate JWT payload
    const payload = {
      user: {
        id: user._id,
      },
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
        console.error("SIGNUP ERROR:", err);
        return res.status(500).json(signupErrors.genericError);
      });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json(signupErrors.genericError);
  }
});

module.exports = router;
