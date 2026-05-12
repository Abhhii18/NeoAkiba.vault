import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle, Twitter, Instagram } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center space-x-2 glass px-4 py-1.5 rounded-full mb-6 border-neon-cyan/30"
        >
          <MessageCircle className="w-4 h-4 text-neon-cyan" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neon-cyan">Open Communication Lines</span>
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic mb-6">
          Contact <span className="text-neon-purple">Support</span>
        </h1>
        <p className="text-white/50 max-w-xl mx-auto text-lg leading-relaxed">
          Need technical assistance or tracking status? Our support bots and elite agents are standing by to verify your signal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-10 rounded-2xl border-white/5 shadow-2xl"
        >
          <h3 className="text-2xl font-display font-black uppercase mb-8">Send Data Stream</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-mono text-white/30 uppercase mb-2">Subject Name</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-purple transition-colors" placeholder="Klaus Akiba" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-white/30 uppercase mb-2">Reply Signature</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-purple transition-colors" placeholder="user@neo-aki.ba" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-white/30 uppercase mb-2">Transmission Type</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-purple transition-colors appearance-none">
                <option className="bg-cyber-black">Order Tracking</option>
                <option className="bg-cyber-black">Damaged Asset</option>
                <option className="bg-cyber-black">Pre-Order Query</option>
                <option className="bg-cyber-black">Other Inquiries</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-white/30 uppercase mb-2">Data Contents</label>
              <textarea rows={5} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-purple transition-colors" placeholder="Stream your message here..." />
            </div>
            <button type="submit" className="w-full cyber-button-purple py-4 flex items-center justify-center space-x-3 group">
              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span>Broadcast Message</span>
            </button>
          </form>
        </motion.div>

        {/* Contact info & Map */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-between space-y-12"
        >
          <div className="space-y-10">
            <div className="flex items-start space-x-6">
              <div className="w-14 h-14 glass rounded-xl flex items-center justify-center border-neon-cyan/20 shrink-0">
                <Mail className="w-6 h-6 text-neon-cyan" />
              </div>
              <div>
                <h4 className="text-xl font-display font-black uppercase mb-1">Neural Mail</h4>
                <p className="text-white/40 mb-2 font-mono text-sm uppercase">Direct data link</p>
                <p className="text-neon-cyan hover:underline cursor-pointer">support@neoakiba.systems</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-14 h-14 glass rounded-xl flex items-center justify-center border-neon-purple/20 shrink-0">
                <Phone className="w-6 h-6 text-neon-purple" />
              </div>
              <div>
                <h4 className="text-xl font-display font-black uppercase mb-1">Vocal Link</h4>
                <p className="text-white/40 mb-2 font-mono text-sm uppercase">Emergency override</p>
                <p className="text-neon-purple hover:underline cursor-pointer">+81 03-XXXX-XXXX (EXT 101)</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-14 h-14 glass rounded-xl flex items-center justify-center border-neon-red/20 shrink-0">
                <MapPin className="w-6 h-6 text-neon-red" />
              </div>
              <div>
                <h4 className="text-xl font-display font-black uppercase mb-1">Physical Sector</h4>
                <p className="text-white/40 mb-2 font-mono text-sm uppercase">Global HQ Coordinates</p>
                <p className="text-white/60">Neo-Tokyo, Central Sector, Level -15, Akiba Plaza</p>
              </div>
            </div>
          </div>

          {/* Social Wall */}
          <div className="glass p-8 rounded-2xl border-white/5 space-y-6">
            <h4 className="text-sm font-mono uppercase tracking-[0.4em] text-white/30 text-center mb-8">Follow Social Streams</h4>
            <div className="flex justify-around">
              <a href="#" className="flex flex-col items-center space-y-2 group">
                <Twitter className="w-8 h-8 text-white/20 group-hover:text-[#1DA1F2] transition-colors" />
                <span className="text-[10px] font-mono uppercase opacity-0 group-hover:opacity-100 transition-opacity">X-FEED</span>
              </a>
              <a href="#" className="flex flex-col items-center space-y-2 group">
                <Instagram className="w-8 h-8 text-white/20 group-hover:text-[#E4405F] transition-colors" />
                <span className="text-[10px] font-mono uppercase opacity-0 group-hover:opacity-100 transition-opacity">INSTA-ARC</span>
              </a>
              <a href="#" className="flex flex-col items-center space-y-2 group">
                <MessageCircle className="w-8 h-8 text-white/20 group-hover:text-[#5865F2] transition-colors" />
                <span className="text-[10px] font-mono uppercase opacity-0 group-hover:opacity-100 transition-opacity">NEURAL-NODE</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
