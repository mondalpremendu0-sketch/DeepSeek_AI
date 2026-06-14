// src/components/PromptInput.jsx
import React, { useState } from "react";
import { Send } from "lucide-react";

export default function PromptInput({ dispatchPrompt, isGenerating }) {
    const [prompt, setPrompt] = useState("");

    const submitAction = e => {
        e.preventDefault();
        if (!prompt.trim() || isGenerating) return;

        dispatchPrompt(prompt);
        setPrompt("");
    };

    const interceptKeyboard = e => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submitAction(e);
        }
    };

    return (
        // FIXED: Shifted padding layout targets to elevate the bar away from device touch zones completely
        <footer className="p-4 pb-6 md:p-4 bg-slate-950 shrink-0 w-full z-20 border-t border-slate-900/40">
            <form
                onSubmit={submitAction}
                className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex items-end gap-1.5 focus-within:border-slate-700 transition-all duration-150 shadow-2xl relative"
            >
                <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onKeyDown={interceptKeyboard}
                    placeholder="Execute system input prompt..."
                    rows={1}
                    disabled={isGenerating}
                    className="flex-1 bg-transparent border-0 outline-none focus:ring-0 text-slate-200 text-xs py-2 px-3.5 resize-none max-h-32 placeholder-slate-600 leading-normal disabled:opacity-40"
                />

                {/* FIXED: Shifted send button positioning parameters inside a distinct square footprint block */}
                <button
                    type="submit"
                    disabled={!prompt.trim() || isGenerating}
                    className="bg-slate-800 hover:bg-blue-600 disabled:bg-transparent text-slate-400 hover:text-white disabled:text-slate-700 p-2.5 mx-1 mb-0.5 rounded-lg transition-all duration-150 shrink-0 outline-none flex items-center justify-center aspect-square"
                >
                    <Send size={12} strokeWidth={2.5} />
                </button>
            </form>
        </footer>
    );
}
