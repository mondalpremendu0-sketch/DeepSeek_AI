import React from "react";
import { Plus, MessageSquare, Trash2, Brain } from "lucide-react";
import { useNavigate } from "react-router";

export default function Sidebar({
    sessions,
    currentSessionId,
    createNewWorkspace,
    purgeWorkspace,
    isGenerating
}) {
    const navigate = useNavigate();

    return (
        <aside className="w-72 h-full bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
            {/* Genesis Spawn Action Block */}
            <div className="p-4 shrink-0">
                <button
                    onClick={createNewWorkspace}
                    disabled={isGenerating}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-medium text-xs tracking-wide uppercase py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                    <Plus size={14} strokeWidth={2.5} />
                    New Workspace
                </button>
            </div>

            {/* Real-time Content List Index */}
            <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5 overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="text-[10px] font-bold text-slate-500 px-3 py-2 uppercase tracking-widest">
                    Analyses Ledgers
                </div>

                {sessions.length === 0 ? (
                    <div className="text-xs text-slate-500 italic px-3 py-6 text-center bg-slate-950/20 rounded-xl border border-dashed border-slate-800/60 mx-1">
                        No history cached
                    </div>
                ) : (
                    sessions.map(session => {
                        const isActive = currentSessionId === session._id;
                        return (
                            <div
                                key={session._id}
                                onClick={() =>
                                    !isActive &&
                                    navigate(`/chat/${session._id}`)
                                }
                                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                                    isActive
                                        ? "bg-slate-800 text-slate-100 font-medium"
                                        : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                                }`}
                            >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <MessageSquare
                                        size={14}
                                        className={
                                            isActive
                                                ? "text-blue-400"
                                                : "text-slate-500"
                                        }
                                    />
                                    <span className="text-xs truncate">
                                        {session.title}
                                    </span>
                                </div>

                                {/* Micro Delete Anchor */}
                                <button
                                    onClick={e => {
                                        e.stopPropagation();
                                        purgeWorkspace(session._id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-500 hover:bg-slate-700 hover:text-rose-400 transition-all duration-150 outline-none"
                                    title="Purge session data"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            {/* System Profile Baseline */}
            <div className="p-3 border-t border-slate-800/60 bg-slate-950/20 flex items-center gap-2.5 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-xs font-bold text-slate-100 shadow-inner">
                    SYS
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate text-slate-300">
                        Lab Console Node
                    </p>
                    <p className="text-[10px] text-slate-500 tracking-wider uppercase font-medium">
                        DeepSeek Engine
                    </p>
                </div>
            </div>
        </aside>
    );
}
