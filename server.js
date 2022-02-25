require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;
const auth = require("./controllers/auth.js");

// MIDDLEWARE

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// ROUTES
const signup = require("./routes/signup.js");
const signin = require("./routes/signin.js");
app.use("/signup", signup);
app.use("/signin", signin);

app.get("/", (req, res) => {
  res.send("Express Auth API");
});

app.listen(PORT, () => {
  console.log("Auth API listening on port: ", PORT);
});
