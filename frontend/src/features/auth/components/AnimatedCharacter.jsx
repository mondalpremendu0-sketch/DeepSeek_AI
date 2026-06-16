// src/components/register/AnimatedCharacter.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react'; // Fallback vector object setup

export default function AnimatedCharacter({ isRegistered, formStep }) {
  const characterVariants = {
    hidden: { y: -20, opacity: 0, scale: 0.9 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring', stiffness: 70, damping: 14 }
    },
    exit: { 
      y: -50, 
      opacity: 0, 
      transition: { ease: 'easeInOut', duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={characterVariants}
      initial="hidden"
      animate={isRegistered ? 'exit' : 'visible'}
      className="relative w-36 h-36 md:w-64 md:h-64 flex flex-col items-center justify-center select-none"
    >
      {/* SHADOW BASE LAYER */}
      <div className="absolute bottom-0 w-24 h-3 bg-black/40 rounded-full blur-md" />

      {/* FIXED: Swapped out the unresolvable external illustration link for a clean, animated asset ring */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="w-24 h-24 md:w-44 md:h-44 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center border border-blue-400/30 shadow-2xl shadow-blue-500/20"
      >
        <User className="text-white w-10 h-10 md:w-16 md:h-16 opacity-90 drop-shadow-md" strokeWidth={1.5} />
      </motion.div>

      {/* CONSOLE STATUS SPEECH TAG */}
      <div className="absolute -top-4 bg-slate-900 border border-slate-800/80 px-2.5 py-1 rounded-xl text-[9px] font-mono text-blue-400 tracking-wider shadow-xl flex items-center gap-1.5 whitespace-nowrap">
        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
        {formStep === 1 && "AWAITING OPERATOR"}
        {formStep === 2 && "SECURING TUNNEL"}
        {isRegistered && "SYNC SUCCESSFUL"}
      </div>

    </motion.div>
  );
}