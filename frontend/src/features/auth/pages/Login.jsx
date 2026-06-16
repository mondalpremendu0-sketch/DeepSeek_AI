// src/pages/LoginPage.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Cpu, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  
  // Initialize react-hook-form validation hooks
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ mode: 'onChange' });

  // Handle payload submission pass
  const onLoginSubmit = async (data) => {
    try {
      console.log('📡 Verifying operator token sequence:', data);
      
      // Simulate network response authentication delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Route the authorized user straight into the core dashboard sandbox
      navigate('/');
    } catch (err) {
      console.error('❌ Authentication handshake failed:', err.message);
    }
  };

  const inputStyle = "w-full bg-slate-900 border text-slate-100 placeholder-slate-600 text-xs rounded-xl py-3 pl-11 pr-4 outline-none transition duration-150";

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-center items-center overflow-hidden p-4 select-none">
      
      {/* Background Ambient Glow Layer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] sm:w-[50vw] sm:h-[50vw] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none z-0" />

      {/* Core Interface Login Box Container */}
      <div className="w-full max-w-sm bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-6">
        
        {/* Branding Identity Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 items-center justify-center text-blue-500 shadow-md mx-auto mb-2">
            <Cpu size={18} strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase text-blue-500 tracking-widest block">// SYSTEM ACCESS INITIALIZATION</span>
          <h2 className="text-base font-extrabold tracking-tight text-slate-200">Authenticate Operator</h2>
        </div>

        {/* Input Execution Form Grid */}
        <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
          
          {/* INPUT: EMAIL FIELD */}
          <div className="space-y-1 relative">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pl-0.5">Network Coordinate</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-600" size={14} />
              <input
                type="email"
                placeholder="name@company.com"
                className={`${inputStyle} ${errors.email ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800 focus:border-slate-700'}`}
                {...register('email', { 
                  required: 'Email coordinates are required to handshake.',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid communication address layout.'
                  }
                })}
              />
            </div>
            {errors.email && (
              <p className="text-[10px] text-rose-400 flex items-center gap-1 pl-1 pt-0.5 animate-fade-in">
                <AlertCircle size={10} /> {errors.email.message}
              </p>
            )}
          </div>

          {/* INPUT: PASSWORD FIELD */}
          <div className="space-y-1 relative">
            <div className="flex justify-between items-center px-0.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Access Key</label>
              <button 
                type="button" 
                className="text-[10px] text-slate-500 hover:text-blue-400 transition outline-none"
                onClick={() => console.log('Link reset token stream dispatched.')}
              >
                Forgot Key?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-slate-600" size={14} />
              <input
                type="password"
                placeholder="Enter secure encryption passkey"
                className={`${inputStyle} ${errors.password ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800 focus:border-slate-700'}`}
                {...register('password', { 
                  required: 'Access encryption passkey is required.',
                  minLength: { value: 6, message: 'Passkey length must be >= 6 positions.' }
                })}
              />
            </div>
            {errors.password && (
              <p className="text-[10px] text-rose-400 flex items-center gap-1 pl-1 pt-0.5 animate-fade-in">
                <AlertCircle size={10} /> {errors.password.message}
              </p>
            )}
          </div>

          {/* SUBMIT INTERFACE SELECTION BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white disabled:text-slate-600 font-semibold text-xs tracking-wide uppercase py-3.5 rounded-xl transition-all duration-150 shadow-lg shadow-blue-600/10 flex items-center justify-center gap-1.5 outline-none pt-4"
          >
            {isSubmitting ? 'Verifying Credentials...' : 'Establish Connection'}
            {!isSubmitting && <ArrowRight size={13} strokeWidth={2.5} />}
          </button>

        </form>

        {/* Footer Link Navigation Toggle */}
        <div className="text-center pt-2 border-t border-slate-900/60">
          <p className="text-xs text-slate-500">
            New operator system line?{' '}
            <button 
              onClick={() => navigate('/register')} 
              className="text-blue-400 hover:text-blue-300 font-medium outline-none underline decoration-blue-500/20 underline-offset-4"
            >
              Create Account
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}