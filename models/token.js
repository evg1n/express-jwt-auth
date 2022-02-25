const mongoose = require("mongoose");
const { Schema } = mongoose;

const Token = mongoose.model(
  "Token",
  new Schema({
    token: {
      type: {
        required: true,
        type: String,
      },
    },
  })
);

module.exports = {
  Token: Token,
};
