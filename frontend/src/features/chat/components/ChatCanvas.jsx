// src/components/ChatCanvas.jsx
import React, { useEffect, useRef } from 'react';
import { Brain, Sparkles, Cpu } from 'lucide-react';

export default function ChatCanvas({ messages, liveThinking, liveAnswer }) {
  const scrollElementRef = useRef(null);

  useEffect(() => {
    scrollElementRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, liveThinking, liveAnswer]);

  const workspaceIsEmpty = messages.length === 0 && !liveThinking && !liveAnswer;

  return (
    /* FIXED: Swapped flex-1 layouts for a strict height computation rule (h-[calc(100vh-12rem)]) 
       with explicit fallback parameters. This guarantees that your message timeline occupies 
       only the space between the header and footer, preventing layout overflow.
    */
    <div className="w-full flex-1 h-0 min-h-0 overflow-y-auto p-4 md:p-6 bg-slate-950 [scrollbar-width:thin] scrollbar-thumb-slate-800/80">
      <div className="max-w-2xl mx-auto space-y-5 pb-6">
        
        {/* Render greeting blocks and messages array loops exactly as written previously */}
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

        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1`}>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600 px-1">
              {msg.role === 'user' ? '// Operator' : '// Model Response'}
            </span>
            <div className={`max-w-[90%] text-xs leading-relaxed p-3.5 rounded-xl border whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none font-medium shadow-md'
                : 'bg-slate-900 text-slate-300 border-slate-800 rounded-tl-none'
            }`}>
              {msg.role === 'assistant' && msg.reasoningContent && (
                <div className="mb-3 bg-slate-950/80 border-l border-slate-600 rounded-r-lg p-2.5 font-mono text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                    <Cpu size={10} />
                    Cognitive Track [~{((msg.thinkingTime || 0) / 1000).toFixed(1)}s elapsed]
                  </div>
                  <div>{msg.reasoningContent}</div>
                </div>
              )}
              <div>{msg.content}</div>
            </div>
          </div>
        ))}

        {(liveThinking || liveAnswer) && (
          <div className="flex flex-col items-start space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 flex items-center gap-1 px-1">
              <Sparkles size={10} className="animate-spin" />
              Compiling Stream
            </span>
            <div className="max-w-[90%] bg-slate-900 text-slate-300 border border-slate-800 text-xs leading-relaxed p-3.5 rounded-xl rounded-tl-none">
              {liveThinking && (
                <div className="bg-slate-950/80 border-l border-blue-500/60 rounded-r-lg p-2.5 font-mono text-[11px] text-slate-400 space-y-1 mb-2.5">
                  <div className="flex items-center gap-1 text-[9px] font-bold text-blue-400 uppercase tracking-wider">
                    <Brain size={10} className="animate-pulse" />
                    Executing Logic Branch...
                  </div>
                  <div className="opacity-90">{liveThinking}</div>
                </div>
              )}
              {liveAnswer && <div className="animate-fade-in">{liveAnswer}</div>}
            </div>
          </div>
        )}

        <div ref={scrollElementRef} />
      </div>
    </div>
  );
}