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
    // FIXED: Ensured absolute structural locking using w-full h-[100dvh] without suppressing scroll selectors
    <div className="w-full h-[100dvh] bg-slate-950 text-slate-100 font-sans flex overflow-hidden antialiased">
      
      {/* Sidebar Navigation Panel View */}
      <Sidebar 
        sessions={sessions}
        currentSessionId={currentSessionId}
        createNewWorkspace={createNewWorkspace}
        purgeWorkspace={purgeWorkspace}
        isGenerating={isGenerating}
        isOpen={mobileSidebarOpen}
        setIsOpen={setMobileSidebarOpen}
      />

      {/* FIXED CONTAINER MAIN PANEL BLOCK */}
      {/* Enforced max-h-full and min-h-0 so flex box compressions activate internal scrolling automatically */}
      <div className="flex-1 flex flex-col h-full max-h-full min-h-0 min-w-0 overflow-hidden relative bg-slate-950">
        
        {/* Top Navbar Row Header */}
        <header className="h-14 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between px-4 md:px-6 shrink-0 backdrop-blur-md z-30 w-full">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 bg-slate-900 border border-slate-800/80 md:hidden outline-none active:scale-95 transition-transform"
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

        {/* Dynamic Messages Canvas Slot */}
        <ChatCanvas 
          messages={messages}
          liveThinking={liveThinking}
          liveAnswer={liveAnswer}
        />

        {/* Grounded Prompt Input Controller Deck */}
        <PromptInput 
          dispatchPrompt={dispatchPrompt}
          isGenerating={isGenerating}
        />

      </div>
    </div>
  );
}