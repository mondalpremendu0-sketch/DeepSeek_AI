const express = require('express');
const chatRouter = require('./routes/chat.routes.js');
const app = express();




app.use(express.json());
app.use("/api/v1",chatRouter);


module.exports = app;