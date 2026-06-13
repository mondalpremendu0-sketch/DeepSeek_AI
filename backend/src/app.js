const express = require('express');
const chatRouter = require('./routes/chat.routes.js');
const errMiddleware = require('./middlewares/error.middleware.js');


const app = express();




app.use(express.json());
app.use("/api/v1",chatRouter);



app.use(errMiddleware);

module.exports = app;