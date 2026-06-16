// src/hooks/useChatEngine.js
import { useContext, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { createSession, getUserSessions, getSessionMessages, deleteSession } from '../services/api.service.js';
import socketService from '../services/socket.service.js';
import { ChatContext } from '../chat.context.jsx';

export const useChatEngine = () => {
  const context = useContext(ChatContext);
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

  const { sessionId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  // Use mutable refs to track live streams across async socket closures instantly
  const liveThinkingRef = useRef('');
  const liveAnswerRef = useRef('');

  const userId = '65f1a2b3c4d5e6f7a8b9c0d1';

  // Continuously map current context string states into mutable reference pointers
  useEffect(() => {
    liveThinkingRef.current = liveThinking;
  }, [liveThinking]);

  useEffect(() => {
    liveAnswerRef.current = liveAnswer;
  }, [liveAnswer]);

  /**
   * Action: Fetches all historical sessions for the sidebar list.
   */
  const loadSidebarData = useCallback(async () => {
    try {
      const res = await getUserSessions(userId);
      if (res.success) {
        setSessions(res.data);
      }
    } catch (err) {
      console.error('❌ Hook Layer Error [loadSidebarData]:', err.message);
    }
  }, [userId, setSessions]);

  /**
   * Action: Syncs the URL param with context and loads existing conversation records.
   * FIXED: Replaced async hook layout with an internal self-invoking function execution block.
   */
  useEffect(() => {
    setCurrentSessionId(sessionId || null);

    const loadThreadData = async () => {
      if (sessionId) {
        try {
          const res = await getSessionMessages(sessionId);
          if (res.success) {
            setMessages(res.data);
          }
        } catch (err) {
          console.error('❌ Hook Layer Error [getSessionMessages]:', err.message);
        }
      } else {
        setMessages([]);
      }
    };

    loadThreadData();
  }, [sessionId, setCurrentSessionId, setMessages]);

  /**
   * Action: Orchestrates the real-time Socket.io state machine and event channels.
   */
  // Inside src/hooks/useChatEngine.js

useEffect(() => {
  loadSidebarData(); 

  const socket = socketService.connect();
  socketRef.current = socket;

  // INTERNAL STREAM BUFFERING QUEUES
  const answerQueue = [];
  let throttleInterval = null;

  // Function to smoothly drain text out of the queue array into React state
  const startThrottlingEngine = () => {
    if (throttleInterval) return; // Already running

    throttleInterval = setInterval(() => {
      if (answerQueue.length > 0) {
        const nextCharOrWord = answerQueue.shift();
        setLiveAnswer((prev) => prev + nextCharOrWord);
      } else {
        // If queue empties, pause the interval loop temporarily
        clearInterval(throttleInterval);
        throttleInterval = null;
      }
    }, 25); // 25ms per token output gives an incredibly smooth, natural reading speed
  };

  // A. Listen for incoming live analytical reasoning streams (Rendered instantly)
  socket.on('thinking_chunk', (chunk) => {
    setLiveThinking((prev) => prev + chunk);
  });

  // B. FIXED: Push text chunks into the queue buffer instead of updating state instantly
  socket.on('answer_chunk', (chunk) => {
    // Split by character (or words) to feed the typewriter animation engine evenly
    const characters = Array.from(chunk);
    answerQueue.push(...characters);
    startThrottlingEngine();
  });

  // C. Completion signal handler
  socket.on('stream_done', () => {
    // Wait for the remaining items in the display buffer to clear out completely
    const drainCheckInterval = setInterval(() => {
      if (answerQueue.length === 0) {
        clearInterval(drainCheckInterval);
        if (throttleInterval) clearInterval(throttleInterval);
        
        setIsGenerating(false);
        const finalAnswer = liveAnswerRef.current;
        const finalThinking = liveThinkingRef.current;

        if (sessionId) {
          getSessionMessages(sessionId)
            .then((res) => {
              if (res.success) setMessages(res.data);
            })
            .catch((err) => console.error('❌ Post-Stream sync error:', err.message))
            .finally(() => {
              setLiveThinking('');
              setLiveAnswer('');
            });
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: finalAnswer,
              reasoningContent: finalThinking
            }
          ]);
          setLiveThinking('');
          setLiveAnswer('');
          loadSidebarData();
        }
      }
    }, 100);
  });

  socket.on('stream_error', (err) => {
    console.error('❌ Socket line error:', err.message);
    setIsGenerating(false);
    if (throttleInterval) clearInterval(throttleInterval);
  });

  return () => {
    socket.off('thinking_chunk');
    socket.off('answer_chunk');
    socket.off('stream_done');
    socket.off('stream_error');
    if (throttleInterval) clearInterval(throttleInterval);
  };
}, [loadSidebarData, sessionId, setLiveThinking, setLiveAnswer, setIsGenerating, setMessages]);

  /**
   * Action: Creates an empty conversation workspace node and pushes the router forward.
   */
  const createNewWorkspace = async () => {
    try {
      const res = await createSession(userId, 'New Conversation');
      if (res.success) {
        await loadSidebarData(); 
        navigate(`/chat/${res.data._id}`); 
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
      const res = await deleteSession(targetSessionId);
      if (res.success) {
        await loadSidebarData(); 
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
    const optimisticMessageTimeline = [...messages, newUserMessageObject];
    setMessages(optimisticMessageTimeline);

    socketRef.current.emit('sendMessage', {
      sessionId: sessionId || null,
      messages: optimisticMessageTimeline
    });
  };

  return {
    sessions,
    currentSessionId: sessionId || null,
    messages,
    liveThinking,
    liveAnswer,
    isGenerating,
    createNewWorkspace,
    purgeWorkspace,
    dispatchPrompt
  };
};