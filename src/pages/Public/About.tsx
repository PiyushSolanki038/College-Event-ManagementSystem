import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Users, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9F9F7] text-slate-950 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
      <PublicNavbar />
      {/* Texture Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.015] contrast-150 grayscale blend-soft-light bg-noise"></div>
      
      {/* 🟢 Hero Section */}
      <section className="relative pt-40 pb-32 px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 bg-[#FDEEE7] rounded-full mb-8 border border-[#FF885E]/10"
          >
             <div className="w-1.5 h-1.5 rounded-full bg-[#FF885E] animate-pulse"></div>
             <span className="text-[#FF885E] text-[10px] font-black tracking-[0.3em] uppercase">The Institution</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-[900] text-[#001D19] leading-[0.95] tracking-[-0.05em] mb-12 max-w-5xl"
          >
            The Ultimate <br/>
            <span className="text-[#006D5B]">College Event System.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[#64748b] font-medium max-w-2xl leading-[1.6]"
          >
            The College Event Management System was established to resolve the growing complexities of university coordination. 
            We build the digital infrastructure that empowers a new generation of institutional leaders.
          </motion.p>
        </div>
      </section>

      {/* 🔘 Core Values Bento */}
      <section className="py-24 px-6 lg:px-20 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-2 gap-6 h-auto md:h-[800px]">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="md:col-span-8 bg-white rounded-[4rem] p-16 border border-slate-100 shadow-xl shadow-black/[0.01] flex flex-col justify-between group overflow-hidden relative"
            >
               <div className="relative z-10">
                  <div className="w-20 h-20 bg-[#EAF2F1] rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:bg-[#006D5B] transition-colors duration-500">
                     <ShieldCheck className="w-10 h-10 text-[#006D5B] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-4xl font-[900] text-[#001D19] mb-6 tracking-tight">Institutional Integrity.</h3>
                  <p className="text-[#64748b] text-lg font-medium leading-relaxed max-w-md">
                     We maintain the highest standards of data security and protocol compliance, ensuring every campus event is recorded with absolute fidelity.
                  </p>
               </div>
               <Shield className="absolute -bottom-20 -right-20 w-96 h-96 text-slate-50 opacity-50 group-hover:text-[#006D5B]/5 transition-colors" />
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="md:col-span-4 bg-[#001D19] rounded-[4rem] p-16 flex flex-col justify-center text-center items-center group"
            >
               <Zap className="w-16 h-16 text-[#FF885E] mb-10 group-hover:scale-110 transition-transform duration-500" />
               <h3 className="text-3xl font-[900] text-white mb-6 tracking-tight leading-none text-center">Velocity <br/> Engine.</h3>
               <p className="text-white/50 text-sm font-medium leading-relaxed">
                  Eliminating approval bottlenecks through automated workflow orchestration.
               </p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="md:col-span-5 bg-[#FDEEE7] rounded-[4rem] p-16 flex flex-col justify-between group"
            >
               <div>
                  <Globe className="w-12 h-12 text-[#FF885E] mb-10" />
                  <h3 className="text-3xl font-[900] text-[#001D19] mb-4 tracking-tight">Global Context.</h3>
                  <p className="text-[#64748b] text-sm font-bold uppercase tracking-widest leading-loose">
                     Calibrated for diverse academic ecosystems.
                  </p>
               </div>
               <div className="flex gap-2">
                  {[1,2,3,4].map(i => <div key={i} className="w-12 h-1.5 bg-[#FF885E]/20 rounded-full"></div>)}
               </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
               className="md:col-span-7 bg-white rounded-[4rem] p-16 border border-slate-100 shadow-xl shadow-black/[0.01] flex items-center justify-between group"
            >
               <div className="max-w-xs">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-3 h-3 rounded-full bg-[#006D5B]"></div>
                     <span className="text-[10px] font-black text-[#006D5B] uppercase tracking-[0.3em]">Operational Strength</span>
                  </div>
                  <h3 className="text-3xl font-[900] text-[#001D19] mb-4 tracking-tight">Scalable Foundations.</h3>
                  <p className="text-[#64748b] text-sm font-medium leading-relaxed">
                     Support for millions of registrations with sub-millisecond persistence.
                  </p>
               </div>
               <Cpu className="w-32 h-32 text-slate-100 group-hover:text-[#006D5B]/10 transition-colors" />
            </motion.div>
         </div>
      </section>

      {/* 🟢 Impact Metrics */}
      <section className="py-24 bg-white border-y border-slate-100 overflow-hidden relative">
         <div className="max-w-7xl mx-auto px-6 lg:px-20 grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
            {[
               { label: "Active HUBs", val: "420+", icon: Globe },
               { label: "Event Volume", val: "125K", icon: Zap },
               { label: "Student Reach", val: "2.4M", icon: Users },
               { label: "Audit Success", val: "99.9%", icon: ShieldCheck },
            ].map((stat, i) => (
               <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col gap-4"
               >
                  <stat.icon className="w-6 h-6 text-[#006D5B] opacity-30" />
                  <div>
                     <div className="text-5xl font-[900] text-[#001D19] tracking-tighter mb-1">{stat.val}</div>
                     <div className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.3em]">{stat.label}</div>
                  </div>
               </motion.div>
            ))}
         </div>
      </section>

      {/* 🔘 Timeline / Evolution */}
      <section className="py-32 px-6 lg:px-20 max-w-5xl mx-auto mb-44">
         <div className="text-center mb-24">
             <h2 className="text-4xl md:text-5xl font-[900] text-[#001D19] tracking-tight mb-6 italic uppercase underline decoration-[#FF885E] decoration-4 underline-offset-8">The Evolution</h2>
             <p className="text-[#64748b] font-medium uppercase text-[10px] tracking-[0.4em]">Milestones in platform persistence</p>
         </div>

         <div className="space-y-24 relative">
            <div className="absolute left-1/2 top-10 bottom-10 w-[2px] bg-slate-100 -translate-x-1/2 hidden md:block"></div>
            
            {[
               { yr: "2024", title: "Institutional Genesis", desc: "The system was conceptualized as the first truly integrated university coordination engine." },
               { yr: "2025", title: "The Alpha Nexus", desc: "First deployment across major academic hubs, reaching 50,000 active institutional users." },
               { yr: "2026", title: "Intelligence Era", desc: "Expansion of the real-time analytics suite and high-concurrency event builder infrastructure." }
            ].map((entry, idx) => (
               <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`flex flex-col md:flex-row items-center gap-12 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
               >
                  <div className="flex-1 text-center md:text-left">
                     <div className={`flex flex-col ${idx % 2 === 0 ? 'md:items-start' : 'md:items-end'}`}>
                        <div className="text-6xl font-[900] text-[#FDEEE7] mb-4">{entry.yr}</div>
                        <h4 className="text-2xl font-[900] text-[#001D19] mb-4 tracking-tight">{entry.title}</h4>
                        <p className={`text-[#64748b] font-medium leading-relaxed max-w-sm ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right text-center'}`}>
                           {entry.desc}
                        </p>
                     </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#001D19] border-4 border-[#F9F9F7] shadow-xl relative z-10 hidden md:block"></div>
                  <div className="flex-1 hidden md:block"></div>
               </motion.div>
            ))}
         </div>
      </section>

      {/* ⚪ Final CTA */}
      <section className="py-24 px-6 lg:px-20 max-w-7xl mx-auto mb-32">
         <div className="bg-[#001D19] rounded-[5rem] p-16 md:p-32 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#006D5B] opacity-10 blur-[100px]"></div>
            <motion.h2 
               whileInView={{ opacity: [0, 1], y: [20, 0] }}
               className="text-4xl md:text-6xl font-[900] text-white tracking-tighter mb-12 max-w-4xl mx-auto leading-none"
            >
               Ready to Define the <br/>
               <span className="text-[#006D5B]">Future of Campus Life?</span>
            </motion.h2>
            <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="bg-[#006D5B] text-white text-[12px] font-black uppercase tracking-[0.4em] px-12 py-7 rounded-[2rem] shadow-2xl hover:bg-[#FF885E] transition-all duration-500"
            >
               Join the Institution <ArrowRight className="w-5 h-5 inline-block ml-4" />
            </motion.button>
         </div>
      </section>
      <PublicFooter />
    </div>
  );
};

export default About;
