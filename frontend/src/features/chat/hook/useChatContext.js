import { useContext, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { apiService } from '../services/api.service.js';
//import socketService from '../services/socket.service';
import {ChatContext}  from '../chat.context.js';

export const useChatEngine  = () => {
  
  const context = useContext(ChatContext)
  const {
    sessions,
    setSessions,
    currentSessionId,
    setCurrentSessionId,
    messages,
    setMessages,
    liveThinking,
    setLiveThinking,
    liveAnswer,
    setLiveAnswer,
    isGenerating,
    setIsGenerating
  } = context;
  // 1. Read the active sessionId directly from the URL bar via React Router
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  // A persistent ref keeps our websocket connection stable across re-renders
  const socketRef = useRef(null);

  // 2. Consume our central global context store

  // Static user ID matching your backend database configuration
  const userId = '65f1a2b3c4d5e6f7a8b9c0d1';

  /**
   * Action: Fetches all historical sessions for the sidebar list.
   * Wrapped in useCallback to prevent infinite component update loops.
   */
  const loadSidebarData = useCallback(async () => {
    try {
      const res = await apiService.getUserSessions(userId);
      if (res.success) {
        setSessions(res.data);
      }
    } catch (err) {
      console.error('❌ Hook Layer Error [loadSidebarData]:', err.message);
    }
  }, [userId, setSessions]);

  /**
   * Action: Syncs the URL param with context and loads existing conversation records.
   */
  useEffect(() => {
    setCurrentSessionId(sessionId || null);

    if (sessionId) {
      // If switching into a valid conversation route, download its message thread
      apiService.getSessionMessages(sessionId)
        .then((res) => {
          if (res.success) {
            setMessages(res.data);
          }
        })
        .catch((err) => {
          console.error('❌ Hook Layer Error [getSessionMessages]:', err.message);
        });
    } else {
      // Clear canvas if on the root path
      setMessages([]);
    }
  }, [sessionId, setCurrentSessionId, setMessages]);

  /**
   * Action: Orchestrates the real-time Socket.io state machine and event channels.
   */
  useEffect(() => {
    loadSidebarData(); // Initial sidebar list render pass

    // Establish or retrieve our singular open socket connection line
    const socket = socketService.connect();
    socketRef.current = socket;

    // A. Listen for incoming live analytical reasoning streams
    socket.on('thinking_chunk', (chunk) => {
      setLiveThinking((prev) => prev + chunk);
    });

    // B. Listen for incoming live final answer fragments
    socket.on('answer_chunk', (chunk) => {
      setLiveAnswer((prev) => prev + chunk);
    });

    // C. Listen for the completion signal from our backend gateway
    socket.on('stream_done', () => {
      setIsGenerating(false);

      // Perform a background sync to fetch the officially stamped conversation timeline from MongoDB
      if (sessionId) {
        apiService.getSessionMessages(sessionId)
          .then((res) => {
            if (res.success) setMessages(res.data);
          })
          .catch((err) => console.error('❌ Post-Stream history reload crash:', err.message))
          .finally(() => {
            // Flush the streaming string buffers clean for the next interaction turn
            setLiveThinking('');
            setLiveAnswer('');
          });
      } else {
        setLiveThinking('');
        setLiveAnswer('');
      }
    });

    // D. Listen for stream execution failures
    socket.on('stream_error', (err) => {
      console.error('❌ Core socket line exception caught:', err.message);
      setIsGenerating(false);
    });

    // E. STRICT UNMOUNT CLEANUP: Tear down active event channels to stop memory leaks
    return () => {
      socket.off('thinking_chunk');
      socket.off('answer_chunk');
      socket.off('stream_done');
      socket.off('stream_error');
    };
  }, [loadSidebarData, sessionId, setLiveThinking, setLiveAnswer, setIsGenerating, setMessages]);

  /**
   * Action: Creates an empty conversation workspace node and pushes the router forward.
   */
  const createNewWorkspace = async () => {
    try {
      const res = await apiService.createSession(userId, 'New Conversation');
      if (res.success) {
        await loadSidebarData(); // Instantly update sidebar mapping array
        navigate(`/chat/${res.data._id}`); // Adjust the URL path seamlessly via React Router
      }
    } catch (err) {
      console.error('❌ Hook Layer Error [createNewWorkspace]:', err.message);
    }
  };

  /**
   * Action: Cascade deletes a session out of both context and database.
   */
  const purgeWorkspace = async (targetSessionId) => {
    try {
      const res = await apiService.deleteSession(targetSessionId);
      if (res.success) {
        await loadSidebarData(); // Re-index the sidebar collection array
        
        // If the deleted session was currently open on screen, kick the user back to the root path
        if (sessionId === targetSessionId) {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('❌ Hook Layer Error [purgeWorkspace]:', err.message);
    }
  };

  /**
   * Action: Optimistically updates the UI timeline and dispatches payloads over WebSockets.
   */
  const dispatchPrompt = (promptText) => {
    if (!promptText.trim() || isGenerating) return;

    setLiveThinking('');
    setLiveAnswer('');
    setIsGenerating(true);

    const newUserMessageObject = { role: 'user', content: promptText };

    // OPTIMISTIC UI UPDATE: Force instant render of the user's question block
    const optimisticMessageTimeline = [...messages, newUserMessageObject];
    setMessages(optimisticMessageTimeline);

    // Emit the context snapshot over our open TCP WebSocket channel
    socketRef.current.emit('sendMessage', {
      sessionId: currentSessionId || null,
      messages: optimisticMessageTimeline
    });
  };

  return {
    sessions,
    currentSessionId,
    messages,
    liveThinking,
    liveAnswer,
    isGenerating,
    createNewWorkspace,
    purgeWorkspace,
    dispatchPrompt
  };
}