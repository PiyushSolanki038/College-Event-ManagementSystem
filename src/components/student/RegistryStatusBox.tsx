import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface RegistryStatusBoxProps {
  endorsementsCount?: number;
}

const RegistryStatusBox: React.FC<RegistryStatusBoxProps> = ({ endorsementsCount = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] p-6 border border-slate-50 shadow-saas overflow-hidden relative group"
    >
      {/* 🧩 Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-orange-500/10 transition-all duration-700"></div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100 shadow-sm shadow-orange-500/10">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-1">
            <p className="text-[13px] font-bold text-slate-600 leading-relaxed font-['Inter',sans-serif]">
              Your identity has been verified through the <span className="text-black font-extrabold">central registry</span>.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active Registry Session</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[14px] font-[900] text-black font-['Manrope',sans-serif]">{endorsementsCount}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Endorsements</span>
          </div>
          <button className="flex items-center gap-1 text-[10px] font-black text-orange-500 uppercase tracking-widest hover:gap-2 transition-all">
            View Details <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RegistryStatusBox;
