// src/components/ChatCanvas.jsx
import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Brain, Cpu, Terminal, Sparkles } from 'lucide-react';

export default function ChatCanvas({ messages, liveThinking, liveAnswer }) {
  const scrollElementRef = useRef(null);

  // Instantly lock screen alignment anchors on active token updates
  useEffect(() => {
    scrollElementRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, liveThinking, liveAnswer]);

  const workspaceIsEmpty = messages.length === 0 && !liveThinking && !liveAnswer;

  // Embedded internal component layer to guarantee uniform text rendering formats
  const RenderBubbleBlock = ({ role, content, reasoningContent, thinkingTime, isLive }) => {
    const isUser = role === 'user';
    return (
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1 w-full animate-fade-in`}>
        <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-600 px-1">
          {isUser ? '// Operator Command' : isLive ? '// Compiling Live Stream' : '// Model Optimized Output'}
        </span>

        <div className={`max-w-[92%] text-xs leading-relaxed p-4 rounded-xl border transition-all duration-200 ${
          isUser
            ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none font-medium shadow-md'
            : 'bg-slate-900 text-slate-300 border-slate-800/80 rounded-tl-none shadow-lg'
        }`}>
          
          {/* COGNITIVE INTERIOR THINKING TRACK CONTAINER */}
          {!isUser && reasoningContent && (
            <div className="mb-4 bg-slate-950/80 border-l-2 border-slate-700 rounded-r-lg p-3 font-mono text-[11px] text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                {isLive ? <Sparkles size={11} className="text-blue-400 animate-spin" /> : <Cpu size={11} />}
                {isLive ? 'Executing Logic Branch...' : `Cognitive Reasoning Track ${thinkingTime ? `[~${(thinkingTime / 1000).toFixed(1)}s]` : ''}`}
              </div>
              <div className="whitespace-pre-wrap leading-normal opacity-85">{reasoningContent}</div>
            </div>
          )}

          {/* DYNAMIC STYLED MARKDOWN PARSING FRAME */}
          <div className={`prose prose-invert max-w-none text-xs break-words ${isUser ? 'prose-p:text-white' : 'prose-p:text-slate-300'}`}>
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1 text-slate-300">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1 text-slate-300">{children}</ol>,
                li: ({ children }) => <li className="mb-0.5">{children}</li>,
                h1: ({ children }) => <h1 className="text-xs font-bold text-slate-100 uppercase tracking-tight mt-4 mb-1.5 font-mono border-b border-slate-800/60 pb-1">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xs font-bold text-slate-200 mt-3 mb-1 font-mono">{children}</h2>,
                strong: ({ children }) => <strong className="font-bold text-blue-400/90">{children}</strong>,
                code: ({ inline, className, children }) => {
                  return inline ? (
                    <code className="bg-slate-950 text-blue-400 font-mono px-1.5 py-0.5 rounded text-[11px] border border-slate-800">
                      {children}
                    </code>
                  ) : (
                    <div className="my-2 border border-slate-800 rounded-lg overflow-hidden shadow-inner">
                      <div className="bg-slate-950 border-b border-slate-800 px-3 py-1.5 flex items-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                        <Terminal size={10} /> console matrix log
                      </div>
                      <pre className="bg-slate-950/60 p-3 overflow-x-auto font-mono text-[11px] text-emerald-400 leading-normal [scrollbar-width:thin]">
                        <code>{children}</code>
                      </pre>
                    </div>
                  );
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

        </div>
      </div>
    );
  };

  return (
    // FIXED: Formatted the canvas container using explicit height values ('h-0 min-h-0 flex-1 overflow-y-auto layout-touch') 
    // This allows natural scroll gestures to run seamlessly without layout leaks.
    <div className="w-full flex-1 h-0 min-h-0 overflow-y-auto touch-auto p-4 md:p-6 bg-slate-950 [scrollbar-width:thin] scrollbar-thumb-slate-800/80">
      <div className="max-w-2xl mx-auto space-y-6 pb-6">
        
        {/* Render Sandbox Placeholder Welcome Block */}
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

        {/* 1. MAP CHRONOLOGICAL PAST MESSAGE HISTORY RECORDINGS */}
        {messages.map((msg, index) => (
          <RenderBubbleBlock 
            key={`history-node-${index}`}
            role={msg.role}
            content={msg.content}
            reasoningContent={msg.reasoningContent}
            thinkingTime={msg.thinkingTime}
            isLive={false}
          />
        ))}

        {/* 2. RENDER ACTIVE INCOMING STREAM TOKENS CONTAINER */}
        {(liveThinking || liveAnswer) && (
          <RenderBubbleBlock 
            key="active-live-stream-node"
            role="assistant"
            content={liveAnswer}
            reasoningContent={liveThinking}
            thinkingTime={null}
            isLive={true}
          />
        )}

        <div ref={scrollElementRef} />
      </div>
    </div>
  );
}