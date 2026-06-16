// src/hooks/useChatEngine.js
import { useContext, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createSession, getUserSessions, getSessionMessages, deleteSession } from '../services/api.service.js';
import socketService from '../services/socket.service.js';
import { ChatContext } from '../chat.context.jsx';

// GLOBAL STREAM BUFFERING QUEUES (Isolated from React lifecycle state drops)
const answerQueue = [];
let throttleInterval = null;

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

  // Persistent references to prevent closure lag stale values inside socket listeners
  const liveThinkingRef = useRef('');
  const liveAnswerRef = useRef('');

  const userId = '65f1a2b3c4d5e6f7a8b9c0d1';

  // Keep references continuously in sync with current context state
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
   * Action: Isolated Sidebar Refresh Sequence
   */
  useEffect(() => {
    loadSidebarData();
  }, [sessionId, loadSidebarData]);

  /**
   * Action: Orchestrates the real-time Socket.io state machine channel.
   * Locked to connect securely without dropouts or token fading.
   */
  useEffect(() => {
    const socket = socketService.connect();
    socketRef.current = socket;

    const startThrottlingEngine = () => {
      if (throttleInterval) return;

      throttleInterval = setInterval(() => {
        if (answerQueue.length > 0) {
          const nextToken = answerQueue.shift();
          setLiveAnswer((prev) => prev + nextToken);
        } else {
          clearInterval(throttleInterval);
          throttleInterval = null;
        }
      }, 15); // Ultra-smooth 15ms typing pacing flow rate
    };

    socket.on('thinking_chunk', (chunk) => {
      setLiveThinking((prev) => prev + chunk);
    });

    socket.on('answer_chunk', (chunk) => {
      // Split incoming chunks cleanly to stream text continuously
      const characters = Array.from(chunk);
      answerQueue.push(...characters);
      startThrottlingEngine();
    });

    socket.on('stream_done', () => {
      // Wait for the client text pacing queue to flush completely to screen
      const verifyQueueCleared = setInterval(() => {
        if (answerQueue.length === 0) {
          clearInterval(verifyQueueCleared);
          if (throttleInterval) {
            clearInterval(throttleInterval);
            throttleInterval = null;
          }

          setIsGenerating(false);

          const completedAnswer = liveAnswerRef.current;
          const completedThinking = liveThinkingRef.current;

          // Clear temporary streaming strings completely before history synchronization
          setLiveThinking('');
          setLiveAnswer('');

          if (sessionId) {
            // Re-fetch historical log array directly from server data source
            getSessionMessages(sessionId)
              .then((res) => {
                if (res.success) setMessages(res.data);
              })
              .catch((err) => console.error('❌ Async timeline recovery crash:', err.message));
          } else {
            // Append first message locally to hold screen space layout during session redirects
            setMessages([
              {
                role: 'user',
                content: optimisticPromptRef.current || ''
              },
              {
                role: 'assistant',
                content: completedAnswer,
                reasoningContent: completedThinking
              }
            ]);
            loadSidebarData();
          }
        }
      }, 50);
    });

    socket.on('stream_error', (err) => {
      console.error('❌ Core socket exception:', err.message);
      setIsGenerating(false);
      if (throttleInterval) clearInterval(throttleInterval);
    });

    return () => {
      socket.off('thinking_chunk');
      socket.off('answer_chunk');
      socket.off('stream_done');
      socket.off('stream_error');
    };
  }, [sessionId, loadSidebarData, setLiveThinking, setLiveAnswer, setIsGenerating, setMessages]);

  // Track the initial query to prevent first-turn vanishing states
  const optimisticPromptRef = useRef('');

  /**
   * Action: Optimistically updates the UI timeline and dispatches payloads over WebSockets.
   */
  const dispatchPrompt = (promptText) => {
    if (!promptText.trim() || isGenerating) return;

    setLiveThinking('');
    setLiveAnswer('');
    setIsGenerating(true);
    optimisticPromptRef.current = promptText;

    const newUserMessageObject = { role: 'user', content: promptText };
    const optimisticMessageTimeline = [...messages, newUserMessageObject];
    setMessages(optimisticMessageTimeline);

    socketRef.current.emit('sendMessage', {
      sessionId: sessionId || null,
      messages: optimisticMessageTimeline
    });
  };

  /**
   * Action: Creates an empty conversation workspace node.
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