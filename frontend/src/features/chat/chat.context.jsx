import React, { createContext, useState, useContext } from 'react';

export const ChatContext = createContext();

/**
 * LAYER 3: CONTEXT PROVIDER LAYER
 * This component wraps your application layout and maintains the central,
 * single source of truth for all conversational state matrices.
 */
export default function ChatProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  
  const [currentSessionId, setCurrentSessionId] = useState(null);
  
  const [messages, setMessages] = useState([]);
  
  const [liveThinking, setLiveThinking] = useState('');
  
  const [liveAnswer, setLiveAnswer] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);

  // Group all states and updates into a distinct, flat reference object
  const contextValue = {
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
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}