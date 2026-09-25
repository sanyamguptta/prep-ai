const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');

const app = express();

// for reading data from the req.body
app.use(express.json());
// for cookies
app.use(cookieParser());
// for handling cross-origin request
app.use(cors({
    origin: 'http://localhost:5173',
    // for handling data with cookies
    credentials: true,
}));



/* require all the routes here */
const authRouter = require('./routes/auth.routes.js');
const interviewRouter = require('./routes/interview.routes.js')


/* using all the routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);




module.exports = app;
