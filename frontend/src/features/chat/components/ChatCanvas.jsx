// src/components/ChatCanvas.jsx
import React, { useEffect, useRef } from 'react';
import { Brain } from 'lucide-react';
import MessageBubble from './MessageBubble.jsx'; // FIXED: Connected the new bubble component here

export default function ChatCanvas({ messages, liveThinking, liveAnswer }) {
  const scrollElementRef = useRef(null);

  useEffect(() => {
    scrollElementRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, liveThinking, liveAnswer]);

  const workspaceIsEmpty = messages.length === 0 && !liveThinking && !liveAnswer;

  return (
    <div className="w-full flex-1 h-0 min-h-0 overflow-y-auto p-4 md:p-6 bg-slate-950 [scrollbar-width:thin] scrollbar-thumb-slate-800/80">
      <div className="max-w-2xl mx-auto space-y-6 pb-6">
        
        {/* Render Minimal Greeting Panel if Sandbox holds no content */}
        {workspaceIsEmpty && (
          <div className="h-[45vh] flex flex-col justify-center items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 shadow-md">
              <Brain size={18} className="animate-pulse" />
            </div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase pt-1">Analytical Sandbox Active</h3>
            <p className="text-xs text-slate-600 max-w-xs">
              Dispatch a structured query payload to engage the reasoning stream matrix.
            </p>
          </div>
        )}

        {/* 1. RENDER HISTORICAL CONVERSATION TIMELINE RECORD STACK */}
        {messages.map((msg, index) => (
          <MessageBubble 
            key={index}
            role={msg.role}
            content={msg.content}
            reasoningContent={msg.reasoningContent}
            thinkingTime={msg.thinkingTime}
          />
        ))}

        {/* 2. RENDER THE CURRENT INCOMING STREAM FRAGMENTS LIVE */}
        {(liveThinking || liveAnswer) && (
          <MessageBubble 
            role="assistant"
            content={liveAnswer}
            reasoningContent={liveThinking}
            thinkingTime={null}
          />
        )}

        <div ref={scrollElementRef} />
      </div>
    </div>
  );
}