const ChatSession = require('../models/chatSession.model.js');
const Message = require('../models/message.model.js');

/**
 * Create a brand new, empty chat session (New Chat Genesis)
 */
async function createChat(req, res){
  try {
    const { userId, title } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is mandatory.' });
    }

    const newSession = await ChatSession.create({
      userId,
      title: title || 'New Conversation'
    });

    res.status(201).json({ success: true, data: newSession });
  } catch (error) {
    console.error('Error in createSession controller:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 *  Fetch all chat sessions for a specific user (Sidebar List Aggregator)
 */
async function userChats(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, 
        message: 'User ID parameters are missing.' });
    }

    const sessions = await ChatSession.find({ userId }).sort({ updatedAt: -1 });

    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    console.error('Error in getUserSessions controller:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * Load full message log for an active open conversation (Chronological Thread Fetcher)
 */
async function getSessionMessages(req, res) {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID parameter is required.' });
    }

    const messages = await Message.find({ sessionId })
      .sort({ createdAt: 1 })
      .select('role content reasoningContent thinkingTime createdAt');

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('Error in getSessionMessages controller:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * Delete an entire conversation thread cleanly (Cascading Deletion Hook)
 */
async function deleteChats(req, res) {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID target is missing.' });
    }


      await ChatSession.findByIdAndDelete(sessionId),
      await Message.deleteMany({ sessionId })

    res.status(200).json({ success: true, message: 'Chat workspace session deleted cleanly.' });
  } catch (error) {
    console.error('Error in deleteSession controller:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = {
  createChat,
  userChats,
  getSessionMessages,
  deleteChats
};