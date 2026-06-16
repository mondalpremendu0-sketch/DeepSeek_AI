import { Brain } from 'lucide-react';

export default function Loading() {
    return (
      <div className="fixed inset-0 h-[100dvh] w-screen bg-slate-950 flex flex-col justify-center items-center text-center select-none">
        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center text-blue-500">
          <Brain size={18} className="animate-pulse" />
        </div>
        <span className="text-[10px] font-mono text-slate-600 tracking-widest uppercase mt-3">
          Verifying Core Credentials...
        </span>
      </div>
    );
  }