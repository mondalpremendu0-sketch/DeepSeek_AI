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
    // 'fixed inset-0' locks the app boundary securely to the glass of the phone.
    <div className="fixed inset-0 w-full h-full bg-slate-950 text-slate-100 font-sans flex flex-col overflow-hidden">
      
      <Sidebar 
        sessions={sessions} currentSessionId={currentSessionId} createNewWorkspace={createNewWorkspace} 
        purgeWorkspace={purgeWorkspace} isGenerating={isGenerating} isOpen={mobileSidebarOpen} setIsOpen={setMobileSidebarOpen}
      />

      {/* FIXED HEADER: High z-index to stay on top */}
      <header className="shrink-0 h-14 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between px-4 md:px-6 z-30">
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

      {/* DYNAMIC MIDDLE AREA: flex-1 takes exact remaining space, min-h-0 prevents overflow */}
      <main className="flex-1 min-h-0 w-full relative z-10">
        <ChatCanvas messages={messages} liveThinking={liveThinking} liveAnswer={liveAnswer} />
      </main>

      {/* FIXED FOOTER: High z-index to stay above the chat */}
      <div className="shrink-0 w-full z-30 bg-slate-950 border-t border-slate-900">
        <PromptInput dispatchPrompt={dispatchPrompt} isGenerating={isGenerating} />
      </div>

    </div>
  );
}