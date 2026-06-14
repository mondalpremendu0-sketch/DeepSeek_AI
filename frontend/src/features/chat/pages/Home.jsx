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
    // FIXED: Swapped 'flex' for 'fixed inset-0' to lock the app edges to the screen borders, destroying whitespace leaks
    <div className="fixed inset-0 h-[100dvh] w-screen bg-slate-950 text-slate-100 font-sans flex overflow-hidden antialiased select-none">
      
      {/* Sidebar navigation element component */}
      <Sidebar 
        sessions={sessions}
        currentSessionId={currentSessionId}
        createNewWorkspace={createNewWorkspace}
        purgeWorkspace={purgeWorkspace}
        isGenerating={isGenerating}
        isOpen={mobileSidebarOpen}
        setIsOpen={setMobileSidebarOpen}
      />

      {/* Main Terminal Window Frame Block */}
      {/* FIXED: Enforced a clean flex-1 layout calculation block inside the screen window overlay */}
      <div className="flex-1 h-full w-full flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Header Navbar Action Row */}
        <header className="h-14 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between px-4 md:px-6 shrink-0 backdrop-blur-md z-30 w-full">
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

        {/* Message Stream Scrollable List Canvas Layout */}
        <ChatCanvas 
          messages={messages}
          liveThinking={liveThinking}
          liveAnswer={liveAnswer}
        />

        {/* Input Text Box Entry Footer Panel */}
        <PromptInput 
          dispatchPrompt={dispatchPrompt}
          isGenerating={isGenerating}
        />

      </div>
    </div>
  );
}