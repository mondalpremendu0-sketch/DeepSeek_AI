// src/pages/RegisterPage.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Cpu, User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import {useAuthContext} from '../hook/useAuthContext.js'







export default function RegisterPage() {
  const navigate = useNavigate();
  const {handleRegister} = useAuthContext();
  // Initialize react-hook-form with strict validation mode configuration
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ mode: 'onChange' });

  // Handle payload submission pass
  const onRegistrationSubmit = async (data) => {
    try {
      console.log('📡 Dispatching user payload sequence:', data);
      await handleRegister(data);
      // Simulate API network pipeline processing delay
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      // Navigate straight into the main chat workspace sandbox upon success
      navigate('/');
    } catch (err) {
      console.error('❌ Registration processing crash:', err.message);
    }
  };

  const inputStyle = "w-full bg-slate-900 border text-slate-100 placeholder-slate-600 text-xs rounded-xl py-3 pl-11 pr-4 outline-none transition duration-150";

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-center items-center overflow-hidden p-4 select-none">
      
      {/* Background Ambient Glow Layer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] sm:w-[50vw] sm:h-[50vw] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none z-0" />

      {/* Main Framework Form Card Wrapper */}
      <div className="w-full max-w-sm bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-6">
        
        {/* Branding Identity Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 items-center justify-center text-blue-500 shadow-md mx-auto mb-2">
            <Cpu size={18} strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase text-blue-500 tracking-widest block">// IDENTITY REGISTRATION</span>
          <h2 className="text-base font-extrabold tracking-tight text-slate-200">Initialize Console Account</h2>
        </div>

        {/* Core Submission Form Grid */}
        <form onSubmit={handleSubmit(onRegistrationSubmit)} className="space-y-4">
          
          {/* INPUT: FULL NAME FIELD */}
          <div className="space-y-1 relative">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pl-0.5">Operator Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 text-slate-600" size={14} />
              <input
                type="text"
                placeholder="Enter callsign"
                className={`${inputStyle} ${errors.name ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800 focus:border-slate-700'}`}
                {...register('firstname', { required: 'Operator callsign designation is required.' })}
              />
            
            </div>
            {errors.name && (
              <p className="text-[10px] text-rose-400 flex items-center gap-1 pl-1 pt-0.5 animate-fade-in">
                <AlertCircle size={10} /> {errors.name.message}
              </p>
            )}
          </div>
          
          <div className="space-y-1 relative">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pl-0.5">Operator SurName</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 text-slate-600" size={14} />
              <input
                type="text"
                placeholder="Enter callsign"
                className={`${inputStyle} ${errors.name ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800 focus:border-slate-700'}`}
                {...register('lastname', { required: 'Operator callsign designation is required.' })}
              />
            
            </div>
            {errors.name && (
              <p className="text-[10px] text-rose-400 flex items-center gap-1 pl-1 pt-0.5 animate-fade-in">
                <AlertCircle size={10} /> {errors.name.message}
              </p>
            )}
          </div>

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
                  required: 'Email coordinates are required.',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid communication address layout.'
                  }
                })}
              />
            </div>
            {errors.email && (
              <p className="text-[10px] text-rose-400 flex items-center gap-1 pl-1 pt-0.5">
                <AlertCircle size={10} /> {errors.email.message}
              </p>
            )}
          </div>

          {/* INPUT: PASSWORD FIELD */}
          <div className="space-y-1 relative">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pl-0.5">Access Encryption Key</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-slate-600" size={14} />
              <input
                type="password"
                placeholder="Minimum 6 security positions"
                className={`${inputStyle} ${errors.password ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800 focus:border-slate-700'}`}
                {...register('password', { 
                  required: 'Access encryption passkey is required.',
                  minLength: { value: 6, message: 'Passkey length must be >= 6 characters.' }
                })}
              />
            </div>
            {errors.password && (
              <p className="text-[10px] text-rose-400 flex items-center gap-1 pl-1 pt-0.5">
                <AlertCircle size={10} /> {errors.password.message}
              </p>
            )}
          </div>

          {/* SUBMIT BUTTON TRIGGER */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white disabled:text-slate-600 font-semibold text-xs tracking-wide uppercase py-3.5 rounded-xl transition-all duration-150 shadow-lg shadow-blue-600/10 flex items-center justify-center gap-1.5 outline-none pt-4"
          >
            {isSubmitting ? 'Compiling Registry...' : 'Initialize Profile'}
            {!isSubmitting && <ArrowRight size={13} strokeWidth={2.5} />}
          </button>

        </form>

        {/* Footer Redirect Navigation Anchor */}
        <div className="text-center pt-2 border-t border-slate-900/60">
          <p className="text-xs text-slate-500">
            Already have an active terminal?{' '}
            <button 
              onClick={() => navigate('/')} 
              className="text-blue-400 hover:text-blue-300 font-medium outline-none underline decoration-blue-500/20 underline-offset-4"
            >
              Sign In
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}