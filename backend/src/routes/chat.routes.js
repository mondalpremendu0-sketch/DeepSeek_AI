const express = require('express');
const chatRouter = express.Router();
const chatController = require('../controllers/chat.controller.js');
const isLogedIn = require('../middlewares/auth.middleware.js')




// Route to spawn a session layout
chatRouter.post('/session',isLogedIn, chatController.createChat);

// Route to fetch a user's entire sidebar chat list
chatRouter.get('/user/:userId', isLogedIn,chatController.userChats);

// Route to fill the UI chat canvas with historical logs
chatRouter.get('/session/:sessionId', isLogedIn,chatController.getSessionMessages);

// Route to execute an administrative cascading cleanup
chatRouter.delete('/session/:sessionId', isLogedIn,chatController.deleteChats);

module.exports = chatRouter;