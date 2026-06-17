// src/pages/Home.jsx
import React, { useState } from 'react';
import { Cpu, Menu } from 'lucide-react';
import { useChatEngine } from '../hook/useChatContext.js';
import Sidebar from '../components/Sidebar.jsx';
import ChatCanvas from '../components/ChatCanvas.jsx';
import PromptInput from '../components/PromptInput.jsx';

export default function Home() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
    // FIXED: Using absolute positioning limits on the parent view wrapper to bypass any broken height properties
    <div className="absolute inset-0 w-screen h-[100dvh] max-h-[100dvh] bg-slate-950 text-slate-100 flex overflow-hidden antialiased">
      
      {/* Navigation Sidebar Panel */}
      <Sidebar 
        sessions={sessions}
        currentSessionId={currentSessionId}
        createNewWorkspace={createNewWorkspace}
        purgeWorkspace={purgeWorkspace}
        isGenerating={isGenerating}
        isOpen={mobileSidebarOpen}
        setIsOpen={setMobileSidebarOpen}
      />

      {/* FIXED WINDOW WRAPPER LAYER */}
      {/* Enforces a hard h-full limit so inner child text blocks can never expand the layout height */}
      <div className="absolute top-0 right-0 left-0 md:left-[260px] bottom-0 h-full max-h-[100dvh] flex flex-col overflow-hidden bg-slate-950">
        
        {/* Header Block (Fixed 3.5rem / 56px height) */}
        <header className="h-14 max-h-14 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between px-4 md:px-6 shrink-0 backdrop-blur-md z-30 w-full">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 bg-slate-900 border border-slate-800/80 md:hidden outline-none"
            >
              <Menu size={16} />
            </button>

            <div className="flex items-center gap-2">
              <Cpu className="text-blue-500" size={14} strokeWidth={2.5} />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Gemini Workspace
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Message Timeline Window Container */}
        {/* FIXED: Formatted the chat canvas parent grid with strict space allocations to force internal scrollbars to hook */}
        <div className="w-full h-[calc(100dvh-9rem)] max-h-[calc(100dvh-9rem)] relative overflow-hidden flex-1 min-h-0">
          <ChatCanvas 
            messages={messages}
            liveThinking={liveThinking}
            liveAnswer={liveAnswer}
          />
        </div>

        {/* Input Interface Deck Row */}
        <PromptInput 
          dispatchPrompt={dispatchPrompt}
          isGenerating={isGenerating}
        />

      </div>
    </div>
  );
}