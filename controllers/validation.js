const { check, validationResult } = require("express-validator");

const userSignupValidator = [
  check("email", "Please enter a valid e-mail address.").isEmail(),
  check("password", "Password must be between 8-32 characters long.").isLength({
    min: 8,
    max: 32,
  }),
];

module.exports = {
  userSignupValidator,
  validationResult,
};
