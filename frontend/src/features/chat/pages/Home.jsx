import React from 'react';
import { Cpu } from 'lucide-react';
import { useChatEngine } from '../hook/useChatContext.js';
import Sidebar from '../components/Sidebar.jsx';
import ChatCanvas from '../components/ChatCanvas.jsx';
import PromptInput from '../components/PromptInput.jsx';

export default function Home() {
  // Pull all tracking variables directly from our Layer 4 Hooks engine
  const {
    sessions,
    currentSessionId,
    messages,
    liveThinking,
    liveAnswer,
    isGenerating,
    createNewWorkspace,
    purgeWorkspace,
    dispatchPrompt
  } = useChatEngine();

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden antialiased">
      
      {/* 1. Left Navigation Drawer Pane */}
      <Sidebar 
        sessions={sessions}
        currentSessionId={currentSessionId}
        createNewWorkspace={createNewWorkspace}
        purgeWorkspace={purgeWorkspace}
        isGenerating={isGenerating}
      />

      {/* 2. Interactive Stream Interface Grid */}
      <div className="flex-1 h-full flex flex-col min-w-0">
        
        {/* Top Floating Context Header Bar */}
        <header className="h-14 border-b border-slate-800/60 bg-slate-900/10 flex items-center justify-between px-6 shrink-0 backdrop-blur-md z-10 select-none">
          <div className="flex items-center gap-2">
            <Cpu className="text-blue-500" size={14} strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Gemini Reasoning Workspace
            </span>
          </div>
          
          {currentSessionId && (
            <div className="text-[10px] font-mono text-slate-600 bg-slate-900/50 border border-slate-800/40 px-2 py-0.5 rounded-md">
              SESSION: {currentSessionId.slice(-6)}
            </div>
          )}
        </header>

        {/* 3. Message Stream Timeline Visualization */}
        <ChatCanvas 
          messages={messages}
          liveThinking={liveThinking}
          liveAnswer={liveAnswer}
        />

        {/* 4. Prompt Input Dock Controls */}
        <PromptInput 
          dispatchPrompt={dispatchPrompt}
          isGenerating={isGenerating}
        />

      </div>
    </div>
  );
}