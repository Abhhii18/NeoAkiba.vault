import React from 'react';
import { Github, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-cyber-black pt-16 pb-8 border-t border-white/5 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-neon-purple/10 blur-[100px] rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-neon-cyan/10 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-neon-purple rounded-sm flex items-center justify-center transform rotate-45">
              <span className="text-white font-display font-black text-lg -rotate-45">N</span>
            </div>
            <span className="font-display font-black text-xl tracking-tighter uppercase">
              Neo<span className="text-neon-purple">Akiba</span>
            </span>
          </Link>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Your premium destination for futuristic anime collectibles. We curate the highest quality figures for the true enthusiasts of the machine age.
          </p>
          <div className="flex space-x-4">
            {[Twitter, Instagram, Youtube, Github].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-neon-purple/20 hover:text-neon-purple transition-all border-white/5 shadow-lg">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-6 text-white">Navigation</h4>
          <ul className="space-y-4">
            {['Home', 'Shop All', 'New Arrivals', 'Featured', 'Contact'].map((item) => (
              <li key={item}>
                <Link to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} className="text-white/40 hover:text-neon-cyan transition-colors text-sm uppercase tracking-wide">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-6 text-white">Anime Series</h4>
          <ul className="space-y-4">
            {['Naruto', 'One Piece', 'Jujutsu Kaisen', 'Attack on Titan', 'Dragon Ball'].map((item) => (
              <li key={item}>
                <Link to={`/shop?series=${item}`} className="text-white/40 hover:text-neon-purple transition-colors text-sm uppercase tracking-wide">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-6 text-white">HQ Status</h4>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3 text-white/50 text-sm">
              <MapPin className="w-5 h-5 text-neon-cyan shrink-0" />
              <span>Neo-Tokyo Sector 7, Cyber-Building 404</span>
            </li>
            <li className="flex items-center space-x-3 text-white/50 text-sm">
              <Phone className="w-5 h-5 text-neon-cyan shrink-0" />
              <span>+81 03-XXXX-XXXX</span>
            </li>
            <li className="flex items-center space-x-3 text-white/50 text-sm">
              <Mail className="w-5 h-5 text-neon-cyan shrink-0" />
              <span>core@neoakiba.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 py-6 border-t border-white/10 glass-panel flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.2em] font-bold text-white/40 relative z-10">
        <div className="mb-4 md:mb-0">CONNECTING TO NEO-AKIBAN_DATACENTER... <span className="text-green-500">SUCCESS</span></div>
        <div className="flex space-x-6 mb-4 md:mb-0">
          <a href="#" className="hover:text-neon-cyan transition-colors">X / TWITTER</a>
          <a href="#" className="hover:text-neon-cyan transition-colors">DISCORD</a>
          <a href="#" className="hover:text-neon-cyan transition-colors">INSTAGRAM</a>
          <a href="#" className="hover:text-neon-cyan transition-colors">SHIPPING</a>
        </div>
        <div>©2026 NEOAKIBA.VAULT INDUSTRIES</div>
      </div>
    </footer>
  );
};
