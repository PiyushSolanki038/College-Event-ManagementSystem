import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Briefcase, ArrowRight, Zap, Target, ShieldCheck, Activity, BarChart3, Globe, Command } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

const Solutions: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9F9F7] text-slate-950 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
      <PublicNavbar />
      {/* Texture Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.015] contrast-150 grayscale blend-soft-light bg-noise"></div>
      
      {/* 🔵 Solutions Hero */}
      <section className="relative pt-40 pb-32 px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 bg-[#FDEEE7] rounded-full mb-8 border border-[#FF885E]/10"
          >
             <div className="w-1.5 h-1.5 rounded-full bg-[#FF885E] animate-pulse"></div>
             <span className="text-[#FF885E] text-[10px] font-black tracking-[0.3em] uppercase">The Specialized Portfolios</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-[900] text-[#001D19] leading-[0.95] tracking-[-0.05em] mb-12 max-w-5xl"
          >
            College Event Solutions <br/>
            <span className="text-[#FF885E]">For Your Campus.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[#64748b] font-medium max-w-2xl leading-[1.6]"
          >
            We provide precision-engineered environments for students, faculty, and leadership, 
            calibrated for maximum institutional coordination.
          </motion.p>
        </div>
      </section>

      {/* 🟠 Detailed Persona Bento Grid */}
      <section className="py-24 px-6 lg:px-20 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* 1. Student Communities */}
            <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-7 bg-white rounded-[4rem] p-16 border border-slate-100 shadow-xl shadow-black/[0.01] flex flex-col justify-between group"
            >
               <div>
                  <div className="w-20 h-20 bg-[#FDEEE7] rounded-[1.5rem] flex items-center justify-center mb-10">
                     <UserCheck className="w-10 h-10 text-[#FF885E]" />
                  </div>
                  <h3 className="text-4xl font-[900] text-[#001D19] mb-6 tracking-tight">Student Communities.</h3>
                  <p className="text-[#64748b] text-lg font-medium leading-relaxed max-w-md mb-10">
                     A high-velocity discovery engine for campus landmarks, symposiums, and cultural festivals. 
                     Sync your events with a single institutional ID.
                  </p>
               </div>
               <div className="flex flex-wrap gap-4 pt-10 border-t border-slate-50">
                  {['Discovery Hub', 'Instant Registry', 'QR Entrance', 'Live Pulse'].map(tag => (
                     <span key={tag} className="px-5 py-2 rounded-full bg-slate-50 text-[10px] font-black text-slate-400 tracking-widest uppercase border border-slate-100">{tag}</span>
                  ))}
               </div>
            </motion.div>

            {/* 2. Admin Analytics (Bento Side) */}
            <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-5 bg-[#001D19] rounded-[4rem] p-16 flex flex-col justify-center items-center text-center group"
            >
               <BarChart3 className="w-16 h-16 text-[#006D5B] mb-10" />
               <h3 className="text-3xl font-[900] text-white mb-6 uppercase tracking-tight leading-none italic">Admin <br/> Control.</h3>
               <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs mb-8">
                  Supervise platform-wide security, venue utilization, and departmental registration trends with zero friction.
               </p>
               <button className="text-[#006D5B] font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
                  View Dashboard <ArrowRight className="w-4 h-4" />
               </button>
            </motion.div>

            {/* 3. Organizer Suite */}
            <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-5 bg-[#EAF2F1] rounded-[4rem] p-16 flex flex-col justify-between group"
            >
               <Briefcase className="w-12 h-12 text-[#006D5B] mb-10" />
               <div>
                  <h3 className="text-3xl font-[900] text-[#001D19] mb-4 tracking-tight">Organizer Pipeline.</h3>
                  <p className="text-[#64748b] text-sm font-medium leading-relaxed">
                     Automate venue logistics and budget approvals with a high-fidelity workflow engine.
                  </p>
               </div>
            </motion.div>

            {/* 4. Global Infrastructure */}
            <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-7 bg-white rounded-[4rem] p-16 border border-slate-100 shadow-xl shadow-black/[0.01] flex items-center justify-between group overflow-hidden relative"
            >
               <div className="relative z-10 max-w-sm">
                  <Globe className="w-12 h-12 text-[#001D19] mb-10" />
                  <h3 className="text-3xl font-[900] text-[#001D19] mb-4 tracking-tight">Global Connectivity.</h3>
                  <p className="text-[#64748b] text-sm font-medium leading-relaxed">
                     Connect across disparate academic hubs and satellite campuses with a unified data persistence layer.
                  </p>
               </div>
               <Command className="absolute -right-10 -bottom-10 w-64 h-64 text-[#EAF2F1] -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
            </motion.div>
         </div>
      </section>

      {/* 🔘 Industrial Workflow Visualization */}
      <section className="py-32 bg-white border-y border-slate-100">
         <div className="max-w-7xl mx-auto px-6 lg:px-20 text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-[900] text-[#001D19] tracking-tight mb-6 uppercase italic">The Institutional Loop</h2>
            <p className="text-[#64748b] font-medium uppercase text-[10px] tracking-[0.4em]">Optimized Workflow Persistence</p>
         </div>
         
         <div className="max-w-7xl mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-100 hidden lg:block -translate-y-1/2"></div>
            
            {[
               { icon: Target, step: "Discovery", desc: "Advanced AI-driven event matching for student stakeholders." },
               { icon: Zap, step: "Authorization", desc: "Automated institutional audit and budget clearance paths." },
               { icon: Activity, step: "Engagement", desc: "Real-time participation tracking and live pulse monitoring." },
               { icon: ShieldCheck, step: "Compliance", desc: "Post-event verification and archival into the central registry." }
            ].map((node, i) => (
               <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative z-10 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-black/[0.01] flex flex-col items-center text-center group hover:border-[#006D5B]/30 transition-all duration-500"
               >
                  <div className="w-16 h-16 rounded-2xl bg-[#F9F9F7] flex items-center justify-center mb-8 border border-slate-50 group-hover:bg-[#001D19] group-hover:text-white transition-all duration-500">
                     <node.icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-[900] text-[#001D19] mb-4 tracking-tight uppercase italic">{node.step}</h4>
                  <p className="text-[#64748b] text-xs font-bold leading-relaxed opacity-70 uppercase tracking-widest">{node.desc}</p>
               </motion.div>
            ))}
         </div>
      </section>

      {/* ⚪ Stakeholder KPI Indicators */}
      <section className="py-44 px-6 lg:px-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
         {[
            { 
               group: "Students", 
               val: "85%", 
               label: "Engagement Lift", 
               desc: "Significant increase in cross-departmental event participation through intelligent discovery.",
               color: "text-[#FF885E]",
               bar: "bg-[#FDEEE7]"
            },
            { 
               group: "Faculty", 
               val: "40h+", 
               label: "Saved Per Term", 
               desc: "Reduction in administrative overhead through automated venue and budget approvals.",
               color: "text-[#006D5B]",
               bar: "bg-[#EAF2F1]"
            },
            { 
               group: "Admin", 
               val: "100%", 
               label: "Audit Accuracy", 
               desc: "Absolute fidelity in institutional records and compliance reporting for every campus event.",
               color: "text-slate-900",
               bar: "bg-slate-100"
            }
         ].map((kpi, i) => (
            <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="group flex flex-col gap-8"
            >
               <div className={`p-10 rounded-[3.5rem] ${kpi.bar} flex flex-col justify-between h-72 border border-black/[0.02]`}>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50">{kpi.group}</p>
                  <div>
                     <div className={`text-7xl font-[900] ${kpi.color} tracking-tighter mb-2 leading-none`}>{kpi.val}</div>
                     <div className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{kpi.label}</div>
                  </div>
               </div>
               <p className="text-[#64748b] font-medium leading-relaxed px-4 opacity-80 italic">
                  "{kpi.desc}"
               </p>
            </motion.div>
         ))}
      </section>
      <PublicFooter />
    </div>
  );
};

export default Solutions;
