const mongoose = require("mongoose");
const { AUTH_DB_URI } = process.env;

try {
  console.log("Connecting to MongoDB instance.");
  mongoose
    .connect(AUTH_DB_URI)
    .then(() =>
      console.log("Connected to MongoDB instance: ", mongoose.connection.host)
    )
    .catch((e) => console.error("Mongoose Error:", Date.now(), e));
} catch (err) {
  console.error("Caught Mongoose Error: ", err);
}
