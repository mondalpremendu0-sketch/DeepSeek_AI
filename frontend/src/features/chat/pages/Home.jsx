// src/pages/Home.jsx
import React, { useState } from 'react';
import { Cpu, Menu } from 'lucide-react';
import { useChatEngine } from '../hook/useChatContext.js';
import Sidebar from '../components/Sidebar.jsx';
import ChatCanvas from '../components/ChatCanvas.jsx';
import PromptInput from '../components/PromptInput.jsx';

export default function Home() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { sessions, currentSessionId, messages, liveThinking, liveAnswer, isGenerating, createNewWorkspace, purgeWorkspace, dispatchPrompt } = useChatEngine();

  return (
    // No more overflow-hidden or h-[100dvh] locks here. Just a min-height container.
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      
      <Sidebar 
        sessions={sessions} currentSessionId={currentSessionId} createNewWorkspace={createNewWorkspace} 
        purgeWorkspace={purgeWorkspace} isGenerating={isGenerating} isOpen={mobileSidebarOpen} setIsOpen={setMobileSidebarOpen}
      />

      {/* 1. FIXED HEADER (Pinned to the absolute top of the phone) */}
      <header className="fixed top-0 left-0 right-0 h-14 border-b border-slate-800/60 bg-slate-900/90 backdrop-blur-md z-40 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileSidebarOpen(true)} className="p-2 rounded-lg text-slate-400 hover:text-slate-100 bg-slate-900 border border-slate-800/80 md:hidden outline-none">
            <Menu size={16} />
          </button>
          <div className="flex items-center gap-2">
            <Cpu className="text-blue-500" size={14} strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Gemini Workspace</span>
          </div>
        </div>
      </header>

      {/* 2. NATIVE SCROLLING MAIN AREA */}
      {/* pt-14 pushes it below the header, pb-32 pushes it above the footer */}
      <main className="pt-14 pb-32 w-full min-h-screen flex flex-col">
        <ChatCanvas messages={messages} liveThinking={liveThinking} liveAnswer={liveAnswer} />
      </main>

      {/* 3. FIXED FOOTER (Pinned to the absolute bottom of the phone) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950 border-t border-slate-800/60 shadow-[0_-10px_40px_rgba(2,6,23,0.8)]">
        <PromptInput dispatchPrompt={dispatchPrompt} isGenerating={isGenerating} />
      </div>

    </div>
  );
}