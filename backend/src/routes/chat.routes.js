const express = require('express');
const chatRouter = express.Router();
const chatController = require('../controllers/chat.controller.js');

// Route to spawn a session layout
chatRouter.post('/session', chatController.createChat);

// Route to fetch a user's entire sidebar chat list
chatRouter.get('/user/:userId', chatController.userChats);

// Route to fill the UI chat canvas with historical logs
chatRouter.get('/session/:sessionId', chatController.getSessionMessages);

// Route to execute an administrative cascading cleanup
chatRouter.delete('/session/:sessionId', chatController.deleteChats);

module.exports = chatRouter;