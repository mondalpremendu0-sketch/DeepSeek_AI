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
    // The main app container. It fills the screen and does NOT scroll.
    <div className="w-full h-[100dvh] flex flex-col bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
      
      <Sidebar 
        sessions={sessions} currentSessionId={currentSessionId} createNewWorkspace={createNewWorkspace} 
        purgeWorkspace={purgeWorkspace} isGenerating={isGenerating} isOpen={mobileSidebarOpen} setIsOpen={setMobileSidebarOpen}
      />

      {/* HEADER: It shrinks to its content and stays put. */}
      <header className="shrink-0 h-14 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between px-4 md:px-6 z-20">
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

      {/* CHAT CANVAS: It takes the remaining space and SCROLLS. */}
      <ChatCanvas messages={messages} liveThinking={liveThinking} liveAnswer={liveAnswer} />

      {/* FOOTER: It shrinks to its content and stays put. */}
      <div className="shrink-0 w-full z-20 bg-slate-950">
        <PromptInput dispatchPrompt={dispatchPrompt} isGenerating={isGenerating} />
      </div>

    </div>
  );
}