const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = mongoose.model(
  "User",
  new Schema({
    email: {
      type: String,
      required: [true, "E-mail address missing."],
    },
    password: {
      type: String,
      required: [true, "Password missing."],
      min: [8, "Password must be at lest 8 characters long."],
      max: [32, "Password can be at most 32 characters long."],
    },
    verified: {
      type: Boolean,
      required: false,
    },
  }),
  "user"
);

module.exports = {
  User,
};
