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
  useEffect(() => {
    loadSidebarData(); 

    const socket = socketService.connect();
    socketRef.current = socket;

    socket.on('thinking_chunk', (chunk) => {
      setLiveThinking((prev) => prev + chunk);
    });

    socket.on('answer_chunk', (chunk) => {
      setLiveAnswer((prev) => prev + chunk);
    });

    // FIXED: Patched data targets and substituted named functions correctly to stop state drops
    socket.on('stream_done', () => {
      setIsGenerating(false);

      const finalAnswer = liveAnswerRef.current;
      const finalThinking = liveThinkingRef.current;

      if (sessionId) {
        // Option A: Active Session exists -> Re-fetch complete array directly from DB
        getSessionMessages(sessionId)
          .then((res) => {
            if (res.success) setMessages(res.data);
          })
          .catch((err) => console.error('❌ Async message sync crash:', err.message))
          .finally(() => {
            setLiveThinking('');
            setLiveAnswer('');
          });
      } else {
        // Option B: First message loop turn -> Explicitly write current state history cache locally 
        // before clearing temporary string buffers so it never disappears from the screen!
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
        loadSidebarData(); // Instantly fetch the newly auto-generated session item into the sidebar
      }
    });

    socket.on('stream_error', (err) => {
      console.error('❌ Core socket line exception caught:', err.message);
      setIsGenerating(false);
    });

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