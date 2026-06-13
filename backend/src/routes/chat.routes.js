const express = require('express');
const msgController = require('../controllers/msg.controller.js');

const chatRouter = express.Router();


chatRouter.post("/stream",msgController);


module.exports = chatRouter;