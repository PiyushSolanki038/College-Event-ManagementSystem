import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, PlayCircle, Users, BarChart3, Binary, Zap } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9F9F7] text-slate-950 overflow-x-hidden selection:bg-teal-100 selection:text-[#006D5B] font-['Plus_Jakarta_Sans',sans-serif] relative">
      {/* Texture Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.015] contrast-150 grayscale blend-soft-light bg-noise"></div>
      
      {/* 1. High-End Industrial Navigation */}
      <PublicNavbar />

      {/* Hand-drawn floating accents - Asterisk / Plus */}
      <div className="absolute top-[20%] left-[8%] opacity-20 hidden lg:block">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="animate-spin-slow">
          <path d="M20 5V35M5 20H35M10 10L30 30M30 10L10 30" stroke="#006D5B" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Hand-drawn floating accents - Spiral */}
      <div className="absolute top-[65%] right-[8%] opacity-30 hidden lg:block">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            d="M10 50C10 20 50 10 70 30C90 50 60 80 40 70C20 60 30 40 50 40C70 40 80 60 70 80"
            stroke="#FF885E"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>


      {/* Hero Section */}
      <section className="relative pt-36 pb-12 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24">

        {/* Left Column Content */}
        <div className="flex-1 text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#FDEEE7] rounded-full mb-8"
          >
            <span className="text-[#FF885E] text-[10px] font-black tracking-wider uppercase">College Event Management System</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-[900] text-[#001D19] leading-[1.05] tracking-[-0.05em] mb-10 relative"
          >
            Seamless <br/>
            <span className="relative">
              <span className="relative inline-block z-10 text-[#006D5B]">College Events</span>
              {/* Refined Dashed Box Accent */}
              <div className="absolute -inset-x-4 -inset-y-1.5 border-2 border-dashed border-[#FFD37B]/40 rounded-2xl z-0 pointer-events-none"></div>
              {/* Subtle Decorative SVG Plus */}
              <div className="absolute -top-10 -right-8 pointer-events-none opacity-30 scale-125">
                 <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M20 5V35M5 20H35" stroke="#FFCE6D" strokeWidth="3" strokeLinecap="round"/>
                 </svg>
              </div>
            </span>
            <br/> Management Platform
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="text-xl text-[#64748b] font-medium max-w-lg leading-[1.6] mb-12"
          >
            A comprehensive college event management system designed for students, organizers, and administration. 
            Streamline registrations, manage attendees, and elevate your campus experiences.
          </motion.p>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-12"
            >
              <Link to="/register" className="w-full sm:w-auto bg-[#006D5B] text-white font-[800] px-12 py-6 rounded-full hover:bg-slate-900 transition-all shadow-xl text-center active:scale-95 translate-y-0 hover:-translate-y-1">
                Host an Event
              </Link>
              <Link to="/register" className="flex items-center gap-5 font-[800] text-slate-900 hover:text-[#006D5B] transition-colors group">
                <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:bg-[#006D5B] group-hover:border-[#006D5B] group-hover:text-white transition-all duration-300">
                  <PlayCircle className="w-6 h-6 fill-current" />
                </div>
                Explore
              </Link>
            </motion.div>

            {/* Hand-drawn Arrow SVG */}
            <div className="absolute -top-16 -right-20 pointer-events-none hidden xl:block">
              <svg width="200" height="150" viewBox="0 0 200 150" fill="none">
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
                  d="M10 10C30 50 120 40 180 130"
                  stroke="#FFCE6D"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="8 8"
                />
                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 }}
                  d="M175 110L185 135L160 133"
                  stroke="#FFCE6D"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start gap-4">
            <div className="flex flex-col items-center ml-10 group cursor-pointer text-slate-400 hover:text-[#006D5B] transition-colors">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-50 group-hover:opacity-100">Scroll Down</span>
              <div className="w-6 h-10 rounded-full border-2 border-slate-200 group-hover:border-[#006D5B] flex justify-center py-2 transition-colors">
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1.5 h-1.5 rounded-full bg-[#006D5B]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Pure Aesthetic Abstract Graphics */}
        <div className="flex-1 w-full relative h-[600px] flex items-center justify-center">
          
          {/* Main Graphic Graphic Stack */}
          <div className="relative w-full max-w-lg aspect-square">
            
            {/* 1. Backdrop Rotating Gradients */}
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 z-0"
            >
               <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-[#006D5B] rounded-[120px] opacity-[0.03]"></div>
               <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-[#FF885E] rounded-[100px] opacity-[0.02]"></div>
            </motion.div>

            {/* 2. Main Geometric Focal Points */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative w-full h-full"
            >
               {/* Large Teal Rounded Rect with Cutout */}
               <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-[15%] bg-[#006D5B] rounded-[80px] shadow-2xl z-10 overflow-hidden"
               >
                  {/* Glass Cutout Top-Right */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 backdrop-blur-3xl rounded-bl-[80px] z-20 border-l border-b border-white/20"></div>
                  
                  {/* Inner Dynamic Dot Grid */}
                  <div className="absolute inset-0 opacity-10 bg-dots scale-150"></div>
                  
                  {/* Central Glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
               </motion.div>

               {/* Orange Blob - Floating */}
               <motion.div 
                  animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-[5%] right-[5%] w-[65%] h-[65%] bg-[#FF885E] rounded-[70px] -rotate-12 z-0 shadow-lg opacity-90"
               ></motion.div>

               {/* Yellow Shape - Behind */}
               <motion.div 
                  animate={{ x: [0, -10, 0], y: [0, 15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-[5%] left-[5%] w-[40%] h-[80%] bg-[#FFD37B] rounded-[60px] rotate-6 z-0 shadow-xl opacity-80"
               ></motion.div>

               {/* 3. Connection Nodes (The 'Management' Feel) */}
               <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-40" viewBox="0 0 400 400">
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, delay: 1 }}
                    d="M100 100 Q 200 50 300 100 T 350 250" 
                    stroke="white" 
                    strokeWidth="1" 
                    strokeDasharray="4 4" 
                    fill="none" 
                  />
                  <circle cx="100" cy="100" r="4" fill="#FFD37B" />
                  <circle cx="350" cy="250" r="4" fill="#FF885E" />
                  <circle cx="200" cy="75" r="4" fill="#006D5B" className="animate-pulse" />
               </svg>

               {/* 4. Frosted Glass Status Cards (High-end UI Graphics) */}
               {/* Card 1: Attendance */}
               <motion.div 
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="absolute top-1/4 -right-8 z-30 bg-white/80 backdrop-blur-2xl px-6 py-5 rounded-[2rem] border border-white/50 shadow-ambient flex items-center gap-4 group hover:scale-105 transition-transform"
               >
                  <div className="w-10 h-10 rounded-full bg-[#EAF2F1] flex items-center justify-center group-hover:bg-[#006D5B] transition-colors">
                     <Users className="w-5 h-5 text-[#006D5B] group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase">Verified Hub</p>
                    <p className="text-xl font-black text-slate-950">12.4k+</p>
                  </div>
               </motion.div>

               {/* Card 2: Analytics Trend */}
               <motion.div 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="absolute -bottom-10 left-10 z-30 bg-white/90 backdrop-blur-2xl px-8 py-6 rounded-[2.5rem] border border-white/50 shadow-ambient group"
               >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center">
                       <BarChart3 className="w-3.5 h-3.5 text-[#006D5B]" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Pulse</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-12">
                     {[40, 70, 45, 90, 60, 80, 55].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 1.8 + (i * 0.1), duration: 0.6 }}
                          className="w-2.5 bg-[#006D5B] rounded-full opacity-80"
                        />
                     ))}
                  </div>
               </motion.div>

               {/* 5. Micro-floating Icons */}
               <motion.div 
                  animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-[10%] right-[15%] z-20 text-[#FFD37B]"
               >
                  <Zap className="w-8 h-8 fill-current opacity-80" />
               </motion.div>
               <motion.div 
                  animate={{ y: [0, 10, 0], x: [0, -10, 0] }}
                  transition={{ duration: 7, repeat: Infinity }}
                  className="absolute bottom-[20%] left-[10%] z-20 text-teal-200"
               >
                  <Binary className="w-10 h-10 opacity-60" />
               </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badge Section */}
      <section className="py-12 border-t border-slate-100/50 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="flex flex-wrap justify-between items-center gap-12 group">
            <div className="text-3xl font-[900] tracking-tighter text-slate-400 hover:text-slate-900 transition-colors"> ENGINEERING COUNCIL </div>
            <div className="text-3xl font-[900] tracking-tighter text-slate-400 hover:text-slate-900 transition-colors"> CULTURAL HUB </div>
            <div className="text-3xl font-[900] tracking-tighter text-slate-400 hover:text-slate-900 transition-colors"> SPORTS PAVILION </div>
            <div className="text-3xl font-[900] tracking-tighter text-slate-400 hover:text-slate-900 transition-colors"> STUDENT GUILD </div>
          </div>
        </div>
      </section>

      {/* Powered Features Grid */}
      <section className="py-20 px-6 lg:px-20 bg-white relative overflow-hidden">
        {/* Simple Background Accent */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#006D5B] opacity-[0.02] rounded-full blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto text-center mb-24">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="inline-flex items-center gap-3 px-6 py-2 bg-[#FDEEE7] rounded-full mb-8"
           >
             <div className="w-1.5 h-1.5 rounded-full bg-[#FF885E]"></div>
             <span className="text-[#FF885E] text-[10px] font-black tracking-widest uppercase">Platform Excellence</span>
           </motion.div>
           <h2 className="text-4xl md:text-5xl font-[900] text-slate-950 tracking-tight leading-[1.2]">
             The Ultimate <br/>
             <span className="text-[#006D5B]">College Event System.</span>
           </h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="group p-10 bg-white rounded-[3rem] border border-slate-100/50 hover:border-[#006D5B]/20 shadow-xl shadow-black/[0.02] hover:shadow-2xl hover:shadow-[#006D5B]/5 transition-all duration-500"
            >
               <div className="w-16 h-16 rounded-[1.5rem] bg-[#EAF2F1] flex items-center justify-center mb-8 group-hover:bg-[#006D5B] transition-colors duration-500">
                  <Zap className="w-7 h-7 text-[#006D5B] group-hover:text-white" />
               </div>
               <h3 className="text-2xl font-[900] text-[#001D19] mb-4 tracking-tight group-hover:text-[#006D5B] transition-colors">Automated Workflow</h3>
               <p className="text-[#64748b] text-sm leading-relaxed font-semibold opacity-80">
                 From submission to approval. Our institutional-grade engine eliminates coordination overhead for campus leaders.
               </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="group p-10 bg-[#006D5B] rounded-[3rem] shadow-2xl shadow-[#006D5B]/20 hover:shadow-[#006D5B]/30 transition-all duration-500 border border-white/5"
            >
               <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center mb-8 group-hover:bg-white transition-colors duration-500">
                  <BarChart3 className="w-7 h-7 text-white group-hover:text-[#006D5B]" />
               </div>
               <h3 className="text-2xl font-[900] text-white mb-4 tracking-tight">Analytics Engine</h3>
               <p className="text-teal-50/70 text-sm leading-relaxed font-semibold">
                 Deep insights into student engagement and registration trends. Data-driven decisions for your next landmark.
               </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
               className="group p-10 bg-white rounded-[3rem] border border-slate-100/50 hover:border-[#FF885E]/20 shadow-xl shadow-black/[0.02] hover:shadow-2xl hover:shadow-[#FF885E]/5 transition-all duration-500"
            >
               <div className="w-16 h-16 rounded-[1.5rem] bg-orange-50 flex items-center justify-center mb-8 group-hover:bg-[#FF885E] transition-colors duration-500">
                  <Users className="w-7 h-7 text-[#FF885E] group-hover:text-white" />
               </div>
               <h3 className="text-2xl font-[900] text-[#001D19] mb-4 tracking-tight group-hover:text-[#FF885E] transition-colors">Smart Networking</h3>
               <p className="text-[#64748b] text-sm leading-relaxed font-semibold opacity-80">
                 Connect students with the events they care about. Our discovery hub fosters a vibrant academic community.
               </p>
            </motion.div>
        </div>
      </section>

      {/* Institutional Experience - Role Focus Section */}
      <section className="py-32 px-6 lg:px-20 bg-[#F9F9F7] relative overflow-hidden">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24">
            {/* Left Column Graphic */}
            <div className="flex-1 w-full order-2 lg:order-1 relative">
                <div className="relative w-full max-w-sm ml-auto aspect-square group">
                    {/* Floating Cards Graphic */}
                    <motion.div 
                       initial={{ x: -20, opacity: 0 }}
                       whileInView={{ x: 0, opacity: 1 }}
                       className="absolute top-0 right-0 w-64 h-64 bg-[#006D5B] rounded-[3rem] shadow-xl z-10 p-8 text-white"
                    >
                       <Binary className="w-10 h-10 mb-4 opacity-50" />
                       <p className="text-xs font-black uppercase tracking-widest mb-2 opacity-60">Admin Controls</p>
                       <p className="text-xl font-black">Role-Based Dashboard Access</p>
                    </motion.div>
                    
                    <motion.div 
                       initial={{ x: 20, y: 40, opacity: 0 }}
                       whileInView={{ x: 0, y: 40, opacity: 1 }}
                       className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-[3rem] border border-slate-200 shadow-2xl p-8 z-20"
                    >
                       <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                          <Zap className="w-5 h-5 text-[#FF885E]" />
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Organizer Hub</p>
                       <p className="text-xl font-[900] text-slate-950 leading-tight">Instant Event Deployment.</p>
                    </motion.div>
                </div>

                {/* Hand-drawn Spiral near Cards */}
                <div className="absolute -bottom-10 -right-10 opacity-20">
                   <svg width="150" height="150" viewBox="0 0 100 100">
                      <motion.path 
                         initial={{ pathLength: 0 }}
                         whileInView={{ pathLength: 1 }}
                         d="M10 10 Q 50 10 50 50 T 90 90" 
                         stroke="#006D5B" strokeWidth="2" fill="none" strokeDasharray="5 5" 
                      />
                   </svg>
                </div>
            </div>

            {/* Right Column Content */}
            <div className="flex-1 order-1 lg:order-2">
               <motion.span 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 className="text-[#006D5B] text-xs font-black uppercase tracking-[0.3em] mb-6 block"
               >
                 Institutional Blueprint
               </motion.span>
               <h2 className="text-4xl md:text-5xl font-[900] text-slate-950 mb-10 leading-[1.2]">
                 One Unified Engine. <br/>
                 <span className="text-slate-400">Three Powerful Roles.</span>
               </h2>
               
               <div className="space-y-10">
                  <div className="flex items-start gap-6">
                     <div className="w-1.5 h-10 bg-[#FF885E] rounded-full mt-1"></div>
                     <div>
                        <h4 className="text-xl font-[900] text-slate-900 mb-2">Campus Organizers</h4>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium">Create, submit, and manage events from a dedicated high-fidelity workspace.</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-6">
                     <div className="w-1.5 h-10 bg-[#006D5B] rounded-full mt-1"></div>
                     <div>
                        <h4 className="text-xl font-[900] text-slate-900 mb-2">The Approval Core</h4>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium">Institutional administrators oversee all platform activity with high-precision review tools.</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-6">
                     <div className="w-1.5 h-10 bg-[#FFD37B] rounded-full mt-1"></div>
                     <div>
                        <h4 className="text-xl font-[900] text-slate-900 mb-2">Student Discovery</h4>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium">Discover landmarks, workshops, and culturals from a curated, intuitive feed.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Join the Journey - High-End Institutional Timeline */}
      <section className="py-32 px-6 lg:px-20 bg-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto text-center mb-28">
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="inline-flex items-center gap-3 px-5 py-2 bg-[#FDEEE7] rounded-full mb-8"
            >
               <div className="w-1.5 h-1.5 rounded-full bg-[#FF885E]"></div>
               <span className="text-[#FF885E] text-[10px] font-black tracking-widest uppercase">The Process</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-[900] text-[#001D19] tracking-[-0.05em] leading-tight">
               Simple Journey. <br/>
               <span className="text-slate-400">Institutional Impact.</span>
            </h2>
         </div>

         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {/* Dynamic Flow Connector for Desktop */}
            <div className="absolute top-[32px] left-[10%] right-[10%] hidden md:block opacity-40">
               <svg className="w-full h-1 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 1">
                  <motion.path 
                     initial={{ pathLength: 0 }}
                     whileInView={{ pathLength: 1 }}
                     transition={{ duration: 2.5, ease: "easeInOut" }}
                     d="M0 0.5 H 100" 
                     stroke="url(#timeline-gradient)" 
                     strokeWidth="2" 
                     strokeDasharray="4 4"
                  />
                  <defs>
                     <linearGradient id="timeline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#CBD5E1" />
                        <stop offset="50%" stopColor="#006D5B" />
                        <stop offset="100%" stopColor="#CBD5E1" />
                     </linearGradient>
                  </defs>
               </svg>
            </div>

            {/* Step 1 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="relative z-10 text-center flex flex-col items-center group"
            >
               <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-sm font-[900] text-slate-700 mb-8 shadow-sm group-hover:text-white group-hover:bg-[#006D5B] group-hover:border-[#006D5B] transition-all duration-500">01</div>
               <h4 className="text-sm font-[900] text-[#001D19] mb-3 uppercase tracking-[0.1em]">Register Account</h4>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Institutional <br/> Onboarding</p>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="relative z-10 text-center flex flex-col items-center group"
            >
               <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-sm font-[900] text-slate-700 mb-8 shadow-sm group-hover:text-white group-hover:bg-[#006D5B] group-hover:border-[#006D5B] transition-all duration-500">02</div>
               <h4 className="text-sm font-[900] text-[#001D19] mb-3 uppercase tracking-[0.1em]">Discovery events</h4>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Smart <br/> Filtering Feed</p>
            </motion.div>

            {/* Step 3 - ACTIVE */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
               className="relative z-10 text-center flex flex-col items-center group"
            >
               {/* Ambient Glow */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#006D5B] opacity-[0.08] blur-2xl rounded-full pointer-events-none"></div>
               
               <div className="w-16 h-16 rounded-2xl bg-[#006D5B] shadow-2xl shadow-[#006D5B]/30 flex items-center justify-center text-sm font-[900] text-white mb-8 relative z-10 border border-white/20">03</div>
               <h4 className="text-sm font-[900] text-[#001D19] mb-3 uppercase tracking-[0.1em]">Instant Registration</h4>
               <p className="text-[10px] font-black text-[#006D5B] uppercase tracking-widest leading-relaxed">One-click <br/> Enrollment</p>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.4 }}
               className="relative z-10 text-center flex flex-col items-center group"
            >
               <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-sm font-[900] text-slate-700 mb-8 shadow-sm group-hover:text-white group-hover:bg-[#006D5B] group-hover:border-[#006D5B] transition-all duration-500">04</div>
               <h4 className="text-sm font-[900] text-[#001D19] mb-3 uppercase tracking-[0.1em]">Attend & Pulse</h4>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Live <br/> Participation</p>
            </motion.div>
         </div>
      </section>

      {/* Event Categories - Bento Grid Discovery */}
      <section className="py-24 px-6 lg:px-20 bg-[#F9F9F7] relative">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
               <div className="max-w-2xl">
                  <h2 className="text-4xl font-[900] text-slate-900 mb-6">Explore by Category.</h2>
                  <p className="text-slate-500 font-medium">Browse institutional events tailored to your academic and personal growth journey.</p>
               </div>
               <Link to="/register" className="text-[#006D5B] font-black text-xs uppercase tracking-widest border-b-2 border-[#006D5B] pb-1 hover:text-slate-900 hover:border-slate-900 transition-all">View All Events</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
               {/* Large Featured Category */}
               <motion.div 
                 whileHover={{ y: -8 }}
                 className="md:col-span-2 md:row-span-2 bg-[#006D5B] rounded-[3rem] p-12 relative overflow-hidden group border border-black/5"
               >
                  <div className="relative z-10 h-full flex flex-col justify-between">
                     <div>
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-6">
                           <Binary className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-3xl font-[900] text-white mb-4">Technical <br/> Symposiums</h3>
                        <p className="text-teal-50/60 text-sm font-medium max-w-xs">Hackathons, coding challenges, and innovation summits.</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="text-4xl font-black text-white">45+</span>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Events</span>
                     </div>
                  </div>
                  {/* Decorative Circle */}
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
               </motion.div>

               {/* Cultural */}
               <motion.div 
                 whileHover={{ y: -8 }}
                 className="md:col-span-2 bg-[#FF885E] rounded-[3rem] p-10 relative overflow-hidden group shadow-lg shadow-[#FF885E]/10"
               >
                  <div className="relative z-10 flex flex-col justify-between h-full">
                     <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-[900] text-white tracking-tight">Cultural <br/> fests</h3>
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                           <Zap className="w-6 h-6 text-white" />
                        </div>
                     </div>
                     <div className="mt-8">
                        <p className="text-orange-50/70 text-[10px] font-black uppercase tracking-[0.2em]">28 Upcoming landmarks</p>
                     </div>
                  </div>
                  {/* Subtle Texture */}
                  <div className="absolute inset-0 opacity-10 bg-grid-white/[0.2] pointer-events-none"></div>
               </motion.div>

               {/* Workshops */}
               <motion.div 
                 whileHover={{ y: -8 }}
                 className="bg-white rounded-[3rem] p-8 border border-slate-200/60 relative overflow-hidden group shadow-xl shadow-black/[0.02]"
               >
                  <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
                     <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-[#FDEEE7] transition-all duration-500">
                        <Users className="w-6 h-6 text-slate-300 group-hover:text-[#FF885E]" />
                     </div>
                     <h3 className="text-lg font-[900] text-[#001D19] uppercase tracking-wide">Workshops</h3>
                  </div>
               </motion.div>

               {/* Sports */}
               <motion.div 
                 whileHover={{ y: -8 }}
                 className="bg-[#FFD37B] rounded-[3rem] p-8 relative overflow-hidden group shadow-xl shadow-[#FFD37B]/20"
               >
                  <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
                     <div className="w-14 h-14 rounded-2xl bg-white/30 flex items-center justify-center mb-4">
                        <Zap className="w-6 h-6 text-white" />
                     </div>
                     <h3 className="text-lg font-[900] text-[#001D19] uppercase tracking-wide">Sports Meet</h3>
                  </div>
                  {/* Decorative Sparkle */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/20 blur-xl"></div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6">
         <div className="max-w-5xl mx-auto bg-[#006D5B] rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-[#006D5B]/30">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,#FF885E_0%,transparent_40%)] opacity-20"></div>
            
            <div className="relative z-10">
               <motion.h2 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 className="text-4xl md:text-6xl font-[900] text-white mb-10 leading-tight"
               >
                 Ready to Scale Your <br/> Campus Events?
               </motion.h2>
               <p className="text-teal-50/60 text-lg font-medium mb-12 max-w-xl mx-auto">
                 Join 500+ institutions already automating their workflow and boosting student participation.
               </p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/register" className="w-full sm:w-auto bg-white text-[#006D5B] font-black px-12 py-6 rounded-full hover:bg-[#FFD37B] hover:text-slate-900 transition-all shadow-xl active:scale-95">
                    Host Your Next Campus Event
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto text-white/60 hover:text-white font-black text-xs uppercase tracking-[0.2em] transition-colors">
                    College Admin Login
                  </Link>
               </div>
            </div>
         </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default LandingPage;
