import React from 'react';
import { motion } from 'framer-motion';
import { History, CheckCircle2, UserPlus, Info, FileText, ChevronRight } from 'lucide-react';

const ActivityTimeline: React.FC = () => {
  const activities = [
    { type: 'registration', text: 'Participation verified for Technical Symposium 2026', date: '2h ago', icon: CheckCircle2, color: 'text-orange-500' },
    { type: 'profile', text: 'Academic credentials updated in Central Registry', date: '1d ago', icon: UserPlus, color: 'text-slate-400' },
    { type: 'system', text: 'Departmental Access: Heritage Hall permissions granted', date: '2d ago', icon: Info, color: 'text-slate-400' },
    { type: 'registration', text: 'Enrolled in Cultural Marathon Milestone', date: '3d ago', icon: FileText, color: 'text-slate-400' },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-saas relative overflow-hidden transition-all duration-500 border border-slate-50">
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
            <History className="w-5 h-5 text-slate-400" />
          </div>
          <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-black font-['Manrope',sans-serif]">Academic Activity Ledger</h5>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-lg">
           <span className="text-[8px] font-black text-orange-600 uppercase tracking-widest leading-none">v1.2.4 Premium</span>
        </div>
      </div>

      <div className="space-y-6">
        {activities.map((activity, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-6 group cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-50 transition-all duration-300 border border-transparent group-hover:border-orange-100`}>
              <activity.icon className={`w-4 h-4 ${activity.color} transition-transform group-hover:scale-110`} />
            </div>
            
            <div className="space-y-1 flex-1">
              <p className="text-[13px] font-bold text-black leading-tight group-hover:text-orange-500 transition-colors font-['Inter',sans-serif]">{activity.text}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest tabular-nums">{activity.date}</p>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-200 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
          </motion.div>
        ))}
      </div>
      
      <button className="w-full mt-10 py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-orange-500 transition-all shadow-xl shadow-black/5 active:scale-[0.98]">
        Download Participation Transcript
      </button>
    </div>
  );
};

export default ActivityTimeline;

