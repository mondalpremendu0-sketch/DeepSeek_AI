// src/components/MessageBubble.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Cpu, Terminal } from 'lucide-react';

export default function MessageBubble({ role, content, reasoningContent, thinkingTime }) {
  const isUser = role === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1 w-full`}>
      {/* Structural Metadata Sub-Labels */}
      <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-600 px-1">
        {isUser ? '// Operator Command' : '// Model Optimized Output'}
      </span>

      {/* Main Text Container Capsule */}
      <div className={`max-w-[92%] text-xs leading-relaxed p-4 rounded-xl border ${
        isUser
          ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none font-medium shadow-md'
          : 'bg-slate-900 text-slate-300 border-slate-800/80 rounded-tl-none shadow-lg'
      }`}>
        
        {/* RENDER THE DEEP REASONING STEP LOGS */}
        {!isUser && reasoningContent && (
          <div className="mb-4 bg-slate-950/80 border-l-2 border-slate-700 rounded-r-lg p-3 font-mono text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              <Cpu size={11} />
              Cognitive Reasoning Track {thinkingTime ? `[~${(thinkingTime / 1000).toFixed(1)}s]` : ''}
            </div>
            <div className="whitespace-pre-wrap leading-normal opacity-85">{reasoningContent}</div>
          </div>
        )}

        {/* STRUCTURED MARKDOWN ENGINE EXTRACTOR */}
        <div className={`prose prose-invert max-w-none text-xs break-words ${isUser ? 'prose-p:text-white' : 'prose-p:text-slate-300'}`}>
          <ReactMarkdown
            components={{
              // Catch and format paragraphs correctly
              p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
              // Catch and format list arrays correctly
              ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1 text-slate-300">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1 text-slate-300">{children}</ol>,
              li: ({ children }) => <li className="mb-0.5">{children}</li>,
              // Format headings
              h1: ({ children }) => <h1 className="text-xs font-bold text-slate-100 uppercase tracking-tight mt-3 mb-1.5 font-mono border-b border-slate-800 pb-1">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xs font-bold text-slate-200 mt-2 mb-1 font-mono">{children}</h2>,
              // Format inline and code blocks
              code: ({ inline, className, children }) => {
                return inline ? (
                  <code className="bg-slate-950 text-blue-400 font-mono px-1.5 py-0.5 rounded text-[11px] border border-slate-800">
                    {children}
                  </code>
                ) : (
                  <div className="my-2 border border-slate-800 rounded-lg overflow-hidden shadow-inner">
                    <div className="bg-slate-950 border-b border-slate-800 px-3 py-1.5 flex items-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                      <Terminal size={10} /> console block output
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
}