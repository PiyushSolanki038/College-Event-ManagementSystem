import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Globe, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  QrCode
} from 'lucide-react';

interface StudentIdCardProps {
  name: string;
  role: string;
  email: string;
}

const StudentIdCard: React.FC<StudentIdCardProps> = ({ name, role, email }) => {
  return (
    <div className="relative h-64 w-full group perspective-1000">
      
      {/* 🔮 Background Layer Card (Glassmorphism) */}
      <motion.div 
        initial={{ x: 25, y: -15, rotateZ: 5, opacity: 0.3 }}
        whileHover={{ x: 35, y: -25, rotateZ: 8, opacity: 0.8, scale: 1.02 }}
        className="absolute top-0 right-[-10px] h-48 w-[88%] bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl flex flex-col justify-between p-7 text-white overflow-hidden transition-all duration-700 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="flex justify-between items-start opacity-40">
           <Globe className="w-5 h-5" />
           <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
           <p className="text-[14px] font-black tracking-[0.2em] font-mono opacity-30">REGISTRY RECORD #5502</p>
           <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40">Identity Proofing Protocol</p>
        </div>
      </motion.div>

      {/* 💳 Primary Identification Card (Surface) */}
      <motion.div 
        initial={{ rotateY: -8, rotateX: 4, opacity: 0, scale: 0.96 }}
        animate={{ rotateY: 0, rotateX: 0, opacity: 1, scale: 1 }}
        whileHover={{ 
          y: -12, 
          rotateX: 2,
          transition: { duration: 0.4, ease: "easeOut" } 
        }}
        className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-br from-slate-900 to-[#0c1222] rounded-[2.5rem] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] text-white overflow-hidden border border-white/10 z-10 transition-all duration-500 cursor-pointer"
      >
        {/* ✨ Holographic Shimmer Overlay */}
        <motion.div 
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
          className="absolute inset-0 z-10 opacity-10 pointer-events-none bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-30deg] scale-150"
        ></motion.div>

        {/* 🎭 Decorative Depth Elements */}
        <div className="absolute top-[-20%] right-[-10%] w-56 h-56 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-40 h-40 bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="flex justify-between items-start mb-10 relative z-20">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                 <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">Global Identity</span>
                 <span className="text-[7px] font-black uppercase tracking-[0.2em] text-orange-400">Verified Level 4</span>
              </div>
           </div>
           
           {/* 📟 Digital Chip */}
           <div className="w-10 h-8 bg-gradient-to-br from-amber-400/80 to-amber-200/40 rounded-md border border-amber-300/30 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)]"></div>
              <Cpu className="w-4 h-4 text-amber-800/60" />
           </div>
        </div>

        <div className="mb-8 relative z-20">
           <h3 className="text-[24px] font-black tracking-[0.1em] font-mono text-white/90 mb-2 tabular-nums">
             {name.slice(0, 1).toUpperCase()}{name.slice(-1).toUpperCase()} • {Math.floor(1000 + Math.random() * 9000)} • 6782
           </h3>
           <div className="flex gap-8">
              <div className="space-y-1">
                 <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/30">Registry Holder</p>
                 <p className="text-[11px] font-black uppercase tracking-widest text-white/80">{name.split(' ')[0]}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/30">Expiration</p>
                 <p className="text-[11px] font-black uppercase tracking-widest text-white/80">09 / 2029</p>
              </div>
           </div>
        </div>

        <div className="flex justify-between items-end relative z-20">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Secure Institutional Node</span>
           </div>
           
           <div className="flex items-center gap-3">
              <QrCode className="w-6 h-6 text-white/10 group-hover:text-white/30 transition-colors" />
              <div className="flex -space-x-3">
                 <div className="w-7 h-7 rounded-full bg-orange-500 border-2 border-[#0c1222] z-10"></div>
                 <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-md border-2 border-[#0c1222]"></div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentIdCard;


