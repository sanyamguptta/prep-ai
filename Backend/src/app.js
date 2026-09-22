const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

// for reading data from the req.body
app.use(express.json());
// for cookies
app.use(cookieParser());



/* require all the routes here */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");



/* using all the routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;
