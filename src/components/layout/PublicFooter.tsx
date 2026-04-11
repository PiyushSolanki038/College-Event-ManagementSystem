import React from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, MapPin } from 'lucide-react';

// Social Icon Components (Simple SVGs)
const Facebook = ({ className }: { className?: string }) => <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const Twitter = ({ className }: { className?: string }) => <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
const Linkedin = ({ className }: { className?: string }) => <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const Instagram = ({ className }: { className?: string }) => <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;

const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-24 pb-12 px-6 lg:px-20 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Column 1: Contact Information */}
          <div className="space-y-8">
            <h3 className="text-xl font-[800] tracking-tight">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex gap-4 items-start group">
                <MapPin className="w-5 h-5 text-slate-500 mt-1 group-hover:text-[#006D5B] transition-colors" />
                <p className="text-slate-400 text-sm leading-relaxed">
                  University Campus, Academic Square 101,<br /> Engineering Department Office.
                </p>
              </div>
              <div className="flex gap-4 items-center group">
                <Phone className="w-5 h-5 text-slate-500 group-hover:text-[#006D5B] transition-colors" />
                <p className="text-slate-400 text-sm">(+62)-822-4545-2882</p>
              </div>
            </div>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <motion.a 
                  key={i}
                  whileHover={{ y: -3, color: '#006D5B' }}
                  href="#" 
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-8">
            <h3 className="text-xl font-[800] tracking-tight">Quick Links</h3>
            <ul className="space-y-4">
              {['About', 'Services', 'Contact', 'Team'].map((link) => (
                <li key={link}>
                  <motion.a 
                    whileHover={{ x: 5, color: '#006D5B' }}
                    href={`/${link.toLowerCase()}`} 
                    className="text-slate-400 text-sm hover:text-white transition-colors"
                  >
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div className="space-y-8">
            <h3 className="text-xl font-[800] tracking-tight">Our Services</h3>
            <ul className="space-y-4">
              {['Event Discovery', 'Venue Metrics', 'Admin Audit', 'Registration Hub'].map((service) => (
                <li key={service}>
                  <motion.a 
                    whileHover={{ x: 5, color: '#006D5B' }}
                    href="#" 
                    className="text-slate-400 text-sm hover:text-white transition-colors"
                  >
                    {service}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-8">
            <h3 className="text-xl font-[800] tracking-tight">Get Latest Update</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Stay updated with the latest campus symposiums, cultural fests, and technical workshops.
            </p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Enter Your Email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-[#006D5B] transition-all"
              />
              <button className="absolute right-2 top-2 bottom-2 px-4 bg-[#66C2C2] hover:bg-[#55abab] text-white rounded-lg transition-colors flex items-center justify-center group-hover:scale-95 duration-200">
                <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Subscribe</span>
                <Send className="w-3 h-3 sm:ml-2" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">
            © 2026 College Event Management System. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-500 text-xs uppercase tracking-widest hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 text-xs uppercase tracking-widest hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
