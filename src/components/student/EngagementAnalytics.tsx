import React from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, TrendingUp, Award, CheckCircle2, Zap, ChevronRight } from 'lucide-react';

interface EngagementAnalyticsProps {
  registrationCount: number;
}

const EngagementAnalytics: React.FC<EngagementAnalyticsProps> = ({ registrationCount }) => {
  const academicCredits = registrationCount * 2;
  
  const metrics = [
    { label: 'Active Participations', value: registrationCount, icon: Target, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Academic Credits', value: academicCredits, icon: Award, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Verification Hours', value: registrationCount * 3.5, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-10">
      {/* 🏛️ Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, i) => (
          <motion.div 
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-white p-8 rounded-[2rem] shadow-saas hover:shadow-heavy transition-all duration-500 border border-slate-50 group"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-11 h-11 rounded-xl ${metric.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-['Manrope',sans-serif]">{metric.label}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <h4 className="text-4xl font-[900] text-black tracking-tight tabular-nums font-['Manrope',sans-serif]">{metric.value}</h4>
              <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 📅 Academic Commitment Progress */}
      <div className="bg-black p-10 rounded-[3rem] relative overflow-hidden group shadow-2xl shadow-black/10">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

         <div className="relative z-10 text-white">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500 font-['Manrope',sans-serif]">Engagement Level</h5>
                </div>
                <p className="text-[18px] text-white font-[900] tracking-tight font-['Manrope',sans-serif]">Institutional Growth Milestone</p>
              </div>
              <div className="flex items-center gap-3 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
                 <CheckCircle2 className="w-4 h-4 text-orange-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Level 1 Complete</span>
              </div>
           </div>
           
           <div className="space-y-4">
             <div className="flex justify-between items-end mb-2">
               <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Current Participation Density</span>
               <span className="text-[14px] font-[900] text-orange-500 font-['Manrope',sans-serif]">{Math.min((registrationCount / 10) * 100, 100)}%</span>
             </div>
             <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((registrationCount / 10) * 100, 100)}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full relative"
                >
                </motion.div>
             </div>
           </div>
           
           <div className="flex justify-between mt-8 pt-8 border-t border-white/5">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{registrationCount} / 10 Target Participations</span>
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
                Next Milestone: Level 2
                <ChevronRight className="w-3 h-3" />
              </span>
           </div>
         </div>
      </div>
    </div>
  );
};

export default EngagementAnalytics;

