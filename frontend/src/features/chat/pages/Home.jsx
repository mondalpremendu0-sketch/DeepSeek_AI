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
    <div className="w-full h-[100dvh] flex overflow-hidden bg-slate-950 text-slate-100 font-sans antialiased">
      
      <Sidebar 
        sessions={sessions}
        currentSessionId={currentSessionId}
        createNewWorkspace={createNewWorkspace}
        purgeWorkspace={purgeWorkspace}
        isGenerating={isGenerating}
        isOpen={mobileSidebarOpen}
        setIsOpen={setMobileSidebarOpen}
      />

      {/* 🔥 THE CSS GRID FIX 🔥
        grid-rows-[auto_1fr_auto] means:
        Row 1: Takes exactly the height of the header
        Row 2: Takes all remaining space (1fr) -> This guarantees it scrolls!
        Row 3: Takes exactly the height of the input box
      */}
      <div className="flex-1 grid grid-cols-1 grid-rows-[auto_1fr_auto] h-full w-full overflow-hidden bg-slate-950">
        
        {/* ROW 1: HEADER */}
        <header className="row-start-1 col-start-1 h-14 min-h-[56px] border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between px-4 md:px-6 z-20">
          <div className="flex items-center gap-3">
            <button
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

        {/* ROW 2: CHAT CANVAS CONTAINER (Relative bounding box) */}
        <main className="row-start-2 col-start-1 w-full h-full relative overflow-hidden">
          <ChatCanvas 
            messages={messages}
            liveThinking={liveThinking}
            liveAnswer={liveAnswer}
          />
        </main>

        {/* ROW 3: PROMPT INPUT FOOTER */}
        <div className="row-start-3 col-start-1 w-full z-20 bg-slate-950">
          <PromptInput 
            dispatchPrompt={dispatchPrompt}
            isGenerating={isGenerating}
          />
        </div>

      </div>
    </div>
  );
}