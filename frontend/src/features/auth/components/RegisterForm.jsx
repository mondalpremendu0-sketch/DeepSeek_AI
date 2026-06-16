// src/components/register/RegisterForm.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, User, Mail, Lock } from 'lucide-react';

export default function RegisterForm({ formStep, setFormStep, isRegistered, setIsRegistered }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const inputStyles = "w-full bg-slate-900/60 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-sans";

  const handleNextStep = (e) => {
    e.preventDefault();
    if (formStep === 1 && formData.name) setFormStep(2);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      setIsRegistered(true);
    }
  };

  // Setup layout step parameters
  const stepVariants = {
    initial: { x: 40, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 14 } },
    exit: { x: -40, opacity: 0, transition: { duration: 0.2 } }
  };

  if (isRegistered) {
    return (
      <motion.div 
        variants={stepVariants} initial="initial" animate="animate"
        className="w-full bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-8 text-center space-y-4 shadow-2xl"
      >
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
          <CheckCircle2 size={24} />
        </div>
        <h3 className="text-base font-bold tracking-wide">Sync Sequence Complete</h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
          Operator node identity written successfully to the centralized main network matrix ledger.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={formStep} variants={stepVariants} initial="initial" animate="animate" exit="exit"
      className="w-full bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative"
    >
      <div>
        <span className="text-[10px] font-mono font-bold uppercase text-blue-500 tracking-widest">// JOIN SYSTEM NODE</span>
        <h2 className="text-lg font-extrabold text-slate-100 tracking-tight mt-0.5">Register Now</h2>
        <p className="text-xs text-slate-400">Secure your spot in our upcoming live webinar.</p>
      </div>

      {formStep === 1 ? (
        <form onSubmit={handleNextStep} className="space-y-4">
          <div className="space-y-1.5 relative">
            <label className="text-[11px] font-medium text-slate-400 pl-0.5">What's your name?</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 text-slate-500" size={14} />
              <input 
                type="text" required placeholder="Surname" value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={inputStyles}
              />
            </div>
          </div>
          <button
            type="submit" disabled={!formData.name.trim()}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white disabled:text-slate-600 font-semibold text-xs py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 outline-none active:scale-[0.99]"
          >
            Next <ArrowRight size={14} />
          </button>
        </form>
      ) : (
        <form onSubmit={handleFinalSubmit} className="space-y-4">
          <div className="space-y-1.5 relative">
            <label className="text-[11px] font-medium text-slate-400 pl-0.5">Enter your email address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-500" size={14} />
              <input 
                type="email" required placeholder="name@company.com" value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={inputStyles}
              />
            </div>
          </div>

          <div className="space-y-1.5 relative">
            <label className="text-[11px] font-medium text-slate-400 pl-0.5">Enter password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-slate-500" size={14} />
              <input 
                type="password" required placeholder="••••••••" value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={inputStyles}
              />
            </div>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              type="button" onClick={() => setFormStep(1)}
              className="flex-1 border border-slate-800 hover:bg-slate-800 text-slate-400 font-semibold text-xs py-3.5 rounded-xl transition-all outline-none"
            >
              Back
            </button>
            <button
              type="submit" disabled={!formData.email || !formData.password}
              className="flex-[2] bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white disabled:text-slate-600 font-semibold text-xs py-3.5 rounded-xl transition-all shadow-lg outline-none active:scale-[0.99]"
            >
              Submit Registration
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}