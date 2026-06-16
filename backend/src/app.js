const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require("cookie-parser")
const chatRouter = require('./routes/chat.routes.js');
const authRouter = require('./routes/auth.routes.js');
const errMiddleware = require('./middlewares/error.middleware.js');


const app = express();




app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({
  origin:"http://localhost:5173",
}));

app.use("/api/v1/user",authRouter);
app.use("/api/v1",chatRouter);



app.use(errMiddleware);

module.exports = app;