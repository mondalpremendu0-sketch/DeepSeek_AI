// src/components/ChatCanvas.jsx
import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Brain, Cpu, Terminal, Sparkles } from 'lucide-react';

export default function ChatCanvas({ messages, liveThinking, liveAnswer }) {
  const containerRef = useRef(null);

  // Auto-scroll anchor
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
        <div className={`max-w-[92%] text-xs leading-relaxed p-4 rounded-xl border ${
          isUser ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none shadow-md' : 'bg-slate-900 text-slate-300 border-slate-800/80 rounded-tl-none shadow-lg'
        }`}>
          {!isUser && reasoningContent && (
            <div className="mb-4 bg-slate-950/80 border-l-2 border-slate-700 rounded-r-lg p-3 font-mono text-[11px] text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                {isLive ? <Sparkles size={11} className="text-blue-400 animate-spin" /> : <Cpu size={11} />}
                {isLive ? 'Executing Logic Branch...' : `Cognitive Reasoning Track`}
              </div>
              <div className="whitespace-pre-wrap leading-normal opacity-85">{reasoningContent}</div>
            </div>
          )}
          <div className="w-full text-xs break-words space-y-2">
            {isUser ? (
              <div className="whitespace-pre-wrap">{content}</div>
            ) : (
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="leading-relaxed mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-4 my-2 space-y-1 block">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 my-2 space-y-1 block">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-bold text-blue-400">{children}</strong>,
                  code: ({ inline, children }) => inline 
                    ? <code className="bg-slate-950 text-blue-400 px-1 py-0.5 rounded text-[11px] border border-slate-800">{children}</code>
                    : <pre className="bg-slate-950/60 p-3 mt-2 rounded-lg border border-slate-800 overflow-x-auto text-[11px] text-emerald-400"><code>{children}</code></pre>
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
    // 🔥 THE TOUCH OVERRIDE 🔥
    // pointer-events-auto ensures your finger connects with THIS div, bypassing transparent shields.
    // overscroll-none completely disables the browser's pull-to-refresh reload hook.
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-y-auto overscroll-none p-4 md:p-6 scroll-smooth pointer-events-auto touch-pan-y"
    >
      <div className="max-w-2xl mx-auto flex flex-col space-y-6 pb-4">
        
        {workspaceIsEmpty && (
          <div className="h-[40vh] flex flex-col justify-center items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center text-blue-400 shadow-md">
              <Brain size={18} className="animate-pulse" />
            </div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase pt-1">Analytical Sandbox Active</h3>
          </div>
        )}

        {messages.map((msg, index) => (
          <RenderBubbleBlock key={`history-${index}`} role={msg.role} content={msg.content} reasoningContent={msg.reasoningContent} thinkingTime={msg.thinkingTime} isLive={false} />
        ))}

        {(liveThinking || liveAnswer) && (
          <RenderBubbleBlock key="active-live-stream-node" role="assistant" content={liveAnswer} reasoningContent={liveThinking} thinkingTime={null} isLive={true} />
        )}
      </div>
    </div>
  );
}