import React from 'react';
import { motion } from 'framer-motion';
import { Binary, Zap, Users, Shield, Cpu, Database, Network, ShieldCheck, ArrowRight, Layers, Activity } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

const Platform: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9F9F7] text-slate-950 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
      <PublicNavbar />
      {/* Texture Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.015] contrast-150 grayscale blend-soft-light bg-noise"></div>
      
      {/* 🔴 Technical Hero */}
      <section className="relative pt-40 pb-32 px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 bg-[#EAF2F1] rounded-full mb-8 border border-[#006D5B]/10"
          >
             <div className="w-1.5 h-1.5 rounded-full bg-[#006D5B] animate-pulse"></div>
             <span className="text-[#006D5B] text-[10px] font-black tracking-[0.3em] uppercase">The Infrastructure</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-[900] text-[#001D19] leading-[0.95] tracking-[-0.05em] mb-12 max-w-5xl"
          >
            The High-Performance <br/>
            <span className="text-[#006D5B]">College Event Engine.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[#64748b] font-medium max-w-2xl leading-[1.6]"
          >
            A cloud-native, modular architecture designed for the unique demands of global tertiary institutions. 
            Engineered for zero-latency coordination.
          </motion.p>
        </div>
      </section>

      {/* 🔘 Architecture Tiers */}
      <section className="py-24 px-6 lg:px-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
            { 
               icon: Layers, 
               tier: "Layer 01", 
               title: "Persistence Tier", 
               desc: "Distributed database architecture with sub-millisecond ACID compliance for institutional records.",
               list: ["Real-time Sync", "Auto-scaling Data", "Audit Logging"]
            },
            { 
               icon: Cpu, 
               tier: "Layer 02", 
               title: "Logic Engine", 
               desc: "Proprietary workflow orchestration engine that manages complex multi-role approval paths.",
               list: ["Event Pipelines", "Role Authorization", "Conflict Resolution"]
            },
            { 
               icon: Network, 
               tier: "Layer 03", 
               title: "Delivery Layer", 
               desc: "High-concurrency API gateway and frontend edge network for global campus access.",
               list: ["Edge Caching", "Real-time SSE", "Secure Gateways"]
            }
         ].map((item, i) => (
            <motion.div 
               key={i}
               initial={{ opacity: 0, scale: 0.98 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-xl shadow-black/[0.01] hover:shadow-2xl hover:shadow-[#006D5B]/5 transition-all duration-500 group"
            >
               <div className="flex justify-between items-start mb-10">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-[#F9F9F7] flex items-center justify-center group-hover:bg-[#001D19] group-hover:text-white transition-all duration-500 border border-slate-50">
                     <item.icon className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-black text-[#006D5B] bg-[#EAF2F1] px-4 py-1.5 rounded-full uppercase tracking-widest">{item.tier}</span>
               </div>
               <h3 className="text-2xl font-[900] text-[#001D19] mb-4 tracking-tight">{item.title}</h3>
               <p className="text-[#64748b] text-sm font-medium leading-relaxed mb-8">{item.desc}</p>
               <ul className="space-y-3 border-t border-slate-50 pt-8">
                  {item.list.map((li, j) => (
                     <li key={j} className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF885E]"></div>
                        {li}
                     </li>
                  ))}
               </ul>
            </motion.div>
         ))}
      </section>

      {/* 🟢 Security Industrial Block */}
      <section className="py-32 px-6 lg:px-20 max-w-7xl mx-auto">
         <div className="bg-[#001D19] rounded-[5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl shadow-black/20 border border-white/5">
            <div className="lg:w-1/2 p-16 md:p-24 flex flex-col justify-center">
               <div className="flex items-center gap-4 mb-8">
                  <ShieldCheck className="w-8 h-8 text-[#006D5B]" />
                  <span className="text-[10px] font-black text-[#006D5B] uppercase tracking-[0.4em]">Institutional Grade Security</span>
               </div>
               <h2 className="text-4xl md:text-6xl font-[900] text-white tracking-tighter mb-8 leading-none">
                  Academic <br/>
                  <span className="text-[#006D5B]">Trust Protocol.</span>
               </h2>
               <p className="text-white/40 text-lg font-medium leading-relaxed mb-12 max-w-md">
                  We implement multi-layered encryption and secure architecture to protect university data assets and student privacy.
               </p>
               <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-12">
                  <div>
                     <div className="text-2xl font-[900] text-white tracking-tight mb-2">AES-256</div>
                     <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">At-Rest Encryption</div>
                  </div>
                  <div>
                     <div className="text-2xl font-[900] text-white tracking-tight mb-2">ISO 27001</div>
                     <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">Compliance Ready</div>
                  </div>
               </div>
            </div>
            <div className="lg:w-1/2 bg-[#0A1F1D] relative p-16 flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-[#006B5A]/20 to-transparent"></div>
               <div className="relative z-10 grid grid-cols-2 gap-4 w-full h-full opacity-20">
                  {Array.from({length: 16}).map((_, i) => (
                     <div key={i} className="border border-[#006D5B] rounded-2xl flex items-center justify-center p-4">
                        <div className="w-full h-1 bg-[#006D5B]/30 rounded-full overflow-hidden">
                           <motion.div 
                              animate={{ x: ["-100%", "100%"] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                              className="w-full h-full bg-[#006D5B]"
                           />
                        </div>
                     </div>
                  ))}
               </div>
               <Shield className="absolute w-96 h-96 text-[#006D5B] opacity-5 animate-pulse" />
            </div>
         </div>
      </section>

      {/* 🔘 Connectivity Matrix */}
      <section className="py-32 px-6 lg:px-20 max-w-7xl mx-auto">
         <div className="flex flex-col md:flex-row items-end justify-between gap-10 mb-20 border-b border-slate-100 pb-12">
            <div>
               <h2 className="text-5xl font-[900] text-[#001D19] tracking-tighter mb-6 uppercase italic">Connectivity Matrix</h2>
               <p className="text-[#64748b] font-medium max-w-xl">
                  Easily integrate the College Event Management System with your existing university ecosystem. Our robust API and SSO support ensure a seamless institutional transition.
               </p>
            </div>
            <div className="flex gap-4">
               <div className="px-6 py-3 rounded-full border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">REST / GraphQL</div>
               <div className="px-6 py-3 rounded-full border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">SAML / SSO</div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
               { icon: Database, name: "ERP Integration", status: "Native" },
               { icon: Users, name: "LMS Synchronization", status: "Supported" },
               { icon: Zap, name: "Workflow Webhooks", status: "Real-time" },
               { icon: Binary, name: "Custom API SDK", status: "Available" }
            ].map((node, i) => (
               <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-10 rounded-[3rem] border border-slate-100 flex flex-col justify-between h-64 group shadow-xl shadow-black/[0.01]"
               >
                  <div className="w-14 h-14 rounded-2xl bg-[#F9F9F7] flex items-center justify-center group-hover:bg-[#FF885E] group-hover:text-white transition-all duration-500">
                     <node.icon className="w-6 h-6" />
                  </div>
                  <div>
                     <span className="text-[10px] font-black text-[#64748b] uppercase tracking-widest mb-2 block opacity-40">{node.status}</span>
                     <h4 className="text-xl font-[900] text-[#001D19] tracking-tight">{node.name}</h4>
                  </div>
               </motion.div>
            ))}
         </div>
      </section>

      {/* ⚪ Final Spec Section */}
      <section className="py-44 px-6 lg:px-20 max-w-7xl mx-auto flex flex-col items-center">
         <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-full bg-[#EAF2F1] rounded-[5rem] p-16 md:p-32 flex flex-col md:flex-row items-center gap-20 border border-[#006D5B]/5"
         >
            <div className="flex-1">
               <Activity className="w-20 h-20 text-[#006B5A] mb-12 animate-pulse" />
               <h3 className="text-4xl md:text-5xl font-[900] text-[#001D19] tracking-tighter mb-8 leading-none">
                  Calibrated for <br/>
                  <span className="text-[#006D5B]">Maximum Load.</span>
               </h3>
               <p className="text-[#64748b] font-medium text-lg leading-relaxed mb-10">
                  Our core engine is built with Golang and Elixir, utilizing an Actor-model architecture to handle event surges during campus-wide festivals and technical symposiums.
               </p>
               <button className="bg-[#001D19] text-white text-[11px] font-black uppercase tracking-[0.4em] px-10 py-5 rounded-2xl hover:bg-[#006D5B] transition-all duration-500">
                  View Tech Specs <ArrowRight className="w-4 h-4 inline-block ml-3" />
               </button>
            </div>
            <div className="flex-1 grid grid-cols-1 gap-6 w-full">
               {[
                  { label: "Request Latency", val: "< 12ms" },
                  { label: "Uptime SLA", val: "99.99%" },
                  { label: "Simultaneous Regs", val: "100K+" }
               ].map((spec, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 flex justify-between items-center shadow-sm">
                     <span className="text-[10px] font-black text-[#64748b] uppercase tracking-widest">{spec.label}</span>
                     <span className="text-2xl font-[900] text-[#001D19]">{spec.val}</span>
                  </div>
               ))}
            </div>
         </motion.div>
      </section>
      <PublicFooter />
    </div>
  );
};

export default Platform;
