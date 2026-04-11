import { Mail, MapPin, Phone, Clock, Plus, Minus, Loader2, Send } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { useToast } from '../../components/ui-custom/Toast';

// Social Icon Components (Simple SVGs)
const Facebook = ({ className }: { className?: string }) => <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const Twitter = ({ className }: { className?: string }) => <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
const Linkedin = ({ className }: { className?: string }) => <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const Instagram = ({ className }: { className?: string }) => <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;

const Contact: React.FC = () => {
  const [activeFaq, setActiveFaq] = React.useState<number | null>(0);
  const { showToast } = useToast();
  
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const faqs = [
    { q: "How can I benefit from your platform?", a: "Our platform provides comprehensive tools for student engagement, event automation, and institutional analytics, ensuring a higher ROI for campus investments." },
    { q: "How can I get in touch with customer support?", a: "You can reach us via the contact form above, or directly via email at admin@support.com. Our typical response time is under 12 hours." },
    { q: "How do you ensure data security and privacy?", a: "We utilize industrial-grade encryption, SOC2 Type II compliance standards, and local data persistence policies to protect all institutional assets." },
    { q: "How do I get started with your offerings?", a: "Simply visit our registration portal or request a demo through the inquiry form, and our deployment team will guide you through the onboarding process." }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showToast('warning', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send message');

      showToast('success', 'Your message has been sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      showToast('danger', err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
      <PublicNavbar />
      
      {/* 🔴 Reference Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-20 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative inline-block"
        >
          <h1 className="text-5xl md:text-6xl font-[800] tracking-tight text-slate-900 mb-6">
            <span className="relative">
              Connect
              <svg className="absolute -bottom-2 left-0 w-full hidden md:block" viewBox="0 0 138 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 9.5C30.5 4 107.5 -2.5 136.5 9.5" stroke="#66C2C2" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </span> with Our Team
          </h1>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 max-w-2xl mx-auto leading-relaxed"
        >
          Get in touch with our team to start organizing your college events more efficiently. Whether you need an enterprise deployment or have a quick query, we're here to help.
        </motion.p>
      </section>

      {/* ⚪ Contact Hub (2-Column Grid) */}
      <section className="py-20 px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Get in Touch Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#F8F9FA] p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100"
          >
            <h2 className="text-3xl font-[800] text-slate-900 mb-10">Get in Touch with Us</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Input your name" 
                  className="w-full bg-white border border-slate-200 rounded-xl px-6 py-4 shadow-sm focus:outline-none focus:border-[#66C2C2] transition-colors" 
                  required
                />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Input your email" 
                  className="w-full bg-white border border-slate-200 rounded-xl px-6 py-4 shadow-sm focus:outline-none focus:border-[#66C2C2] transition-colors" 
                  required
                />
              </div>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject" 
                className="w-full bg-white border border-slate-200 rounded-xl px-6 py-4 shadow-sm focus:outline-none focus:border-[#66C2C2] transition-colors" 
                required
              />
              <textarea 
                rows={5} 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Submit your message request" 
                className="w-full bg-white border border-slate-200 rounded-xl px-6 py-4 shadow-sm focus:outline-none focus:border-[#66C2C2] transition-colors" 
                required
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1A1A1A] text-white px-10 py-5 rounded-xl font-bold tracking-tight hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending message...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send message
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right: Contact Details */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:pt-4"
          >
            <h2 className="text-3xl font-[800] text-slate-900 mb-6">Contact Details</h2>
            <p className="text-slate-500 mb-12 leading-relaxed">
              Reach out to our campus implementation specialists today to deploy the College Event Management System at your institution.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                { icon: MapPin, label: "Address", val: "Jl. Raya Kuta No. 121" },
                { icon: Phone, label: "Mobile", val: "(+021) 789 345" },
                { icon: Clock, label: "Availability", val: "Daily 09 am - 05 pm" },
                { icon: Mail, label: "Email", val: "admin@support.com" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group hover:border-[#66C2C2] transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] flex items-center justify-center text-white">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.label}</h4>
                    <p className="text-slate-500 text-sm">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">Social Media:</span>
              <div className="flex gap-4">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <motion.a href="#" key={i} whileHover={{ y: -3 }} className="text-slate-400 hover:text-slate-900 transition-colors">
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🔘 FAQ Section */}
      <section className="py-32 px-6 lg:px-20 bg-[#F9F9F7] border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-[800] text-slate-900 mb-6">
              Your Common Queries <span className="relative">
                Answered
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 100 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 4C30 2 70 2 100 4" stroke="#66C2C2" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span> with Additional FAQs
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Have questions about how our platform scales for campus festivals or integrates with university systems? Check out our frequently asked questions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left: Accordion */}
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full px-8 py-6 flex items-center justify-between text-left group"
                  >
                    <span className="font-bold text-slate-900 group-hover:text-[#66C2C2] transition-colors">{faq.q}</span>
                    {activeFaq === i ? <Minus className="w-5 h-5 text-[#66C2C2]" /> : <Plus className="w-5 h-5 text-slate-400" />}
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-8 pb-8 text-slate-500 leading-relaxed"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right: Image */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               className="relative rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <img 
                src="/images/support-specialist.png" 
                alt="Support Specialist" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </motion.div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default Contact;
