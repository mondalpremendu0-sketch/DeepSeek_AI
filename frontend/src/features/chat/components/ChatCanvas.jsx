// src/components/ChatCanvas.jsx
import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Brain, Cpu, Terminal, Sparkles } from 'lucide-react';

export default function ChatCanvas({ messages, liveThinking, liveAnswer }) {
  const containerRef = useRef(null);

  // Instantly force-scroll the internal element directly to the bottom node
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, liveThinking, liveAnswer]);

  const workspaceIsEmpty = messages.length === 0 && !liveThinking && !liveAnswer;

  const RenderBubbleBlock = ({ role, content, reasoningContent, thinkingTime, isLive }) => {
    const isUser = role === 'user';
    return (
      <div className={`w-full flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}>
        <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-600 px-1">
          {isUser ? '// Operator Command' : isLive ? '// Compiling Live Stream' : '// Model Optimized Output'}
        </span>

        <div className={`max-w-[90%] text-xs leading-relaxed p-4 rounded-xl border ${
          isUser
            ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none shadow-md'
            : 'bg-slate-900 text-slate-300 border-slate-800/80 rounded-tl-none shadow-lg'
        }`}>
          
          {/* THINKING TRACK LOG CONTAINER */}
          {!isUser && reasoningContent && (
            <div className="mb-4 bg-slate-950/80 border-l-2 border-slate-700 rounded-r-lg p-3 font-mono text-[11px] text-slate-400 space-y-1.5 select-text">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                {isLive ? <Sparkles size={11} className="text-blue-400 animate-spin" /> : <Cpu size={11} />}
                {isLive ? 'Executing Logic Branch...' : `Cognitive Reasoning Track ${thinkingTime ? `[~${(thinkingTime / 1000).toFixed(1)}s]` : ''}`}
              </div>
              <div className="whitespace-pre-wrap leading-normal opacity-85">{reasoningContent}</div>
            </div>
          )}

          {/* TEXT CONTENT CONTAINER */}
          <div className={`w-full text-xs break-words space-y-2 select-text ${isUser ? 'text-white font-medium' : 'text-slate-300'}`}>
            {isUser ? (
              <div className="whitespace-pre-wrap">{content}</div>
            ) : (
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="leading-relaxed mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1 text-slate-300 block">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1 text-slate-300 block">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-bold text-blue-400">{children}</strong>,
                  h1: ({ children }) => <h1 className="text-xs font-bold text-slate-100 uppercase mt-3 mb-1 font-mono border-b border-slate-800/60 pb-1">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xs font-bold text-slate-200 mt-2 mb-1 font-mono">{children}</h2>,
                  code: ({ inline, children }) => {
                    return inline ? (
                      <code className="bg-slate-950 text-blue-400 font-mono px-1.5 py-0.5 rounded text-[11px] border border-slate-800">{children}</code>
                    ) : (
                      <div className="my-2 border border-slate-800 rounded-lg overflow-hidden">
                        <div className="bg-slate-950 border-b border-slate-800 px-3 py-1.5 flex items-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase"><Terminal size={10} /> console block</div>
                        <pre className="bg-slate-950/60 p-3 overflow-x-auto font-mono text-[11px] text-emerald-400"><code>{children}</code></pre>
                      </div>
                    );
                  }
                }}
              >
                {content}
              </ReactMarkdown>
            )}
          </div>

        </div>
      </div>
    );
  };

  return (
    // FIXED: Stripped out the forced touch-action and absolute classes.
    // 'flex-1' takes remaining height, 'overflow-y-auto' creates the scrollbar natively.
    <div 
      ref={containerRef}
      className="w-full flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950 scroll-smooth"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* We use 'min-h-full' to ensure the inner content stretches properly to trigger scrollbars */}
      <div className="max-w-2xl mx-auto flex flex-col space-y-6 pb-6 min-h-full">
        
        {workspaceIsEmpty && (
          <div className="h-[50vh] flex flex-col justify-center items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center text-blue-400 shadow-md">
              <Brain size={18} className="animate-pulse" />
            </div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase pt-1">Analytical Sandbox Active</h3>
            <p className="text-xs text-slate-600 max-w-xs">
              Dispatch a structured query payload to engage the reasoning stream matrix.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <RenderBubbleBlock 
            key={`history-${index}`}
            role={msg.role}
            content={msg.content}
            reasoningContent={msg.reasoningContent}
            thinkingTime={msg.thinkingTime}
            isLive={false}
          />
        ))}

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
        
        {/* Invisible spacer to ensure you can scroll slightly past the last message */}
        <div className="h-4 w-full shrink-0"></div>
      </div>
    </div>
  );
}