import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Rocket, Sparkles } from 'lucide-react';
import { ProductCard } from '../components/shop/ProductCard';
import { INITIAL_PRODUCTS } from '../constants';
import { collection, getDocs, query, limit, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { cn } from '../lib/utils';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(INITIAL_PRODUCTS.filter(p => p.featured));

  const series = [
    { name: 'Jujutsu Kaisen', count: 12, color: 'bg-purple-600' },
    { name: 'One Piece', count: 45, color: 'bg-red-600' },
    { name: 'Naruto', count: 32, color: 'bg-orange-500' },
    { name: 'Attack on Titan', count: 18, color: 'bg-emerald-600' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/10 blur-[150px] animate-pulse delay-700" />
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 mb-2">
              <h2 className="text-xs font-bold text-neon-cyan uppercase tracking-[0.3em]">Limited Seasonal Drop</h2>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black italic mb-6 tracking-tighter leading-none uppercase">
              UNLEASH<br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1px white' }}>THE CORE</span>
            </h1>
            
            <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-lg">
              Premium 1/6 scale collectibles engineered for the next generation of Otaku. Genuine authentication chips included with every piece.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/shop" className="btn-red px-8 py-3 skew-box text-center group">
                <span className="no-skew flex items-center justify-center text-xs">
                  EXPLORE COLLECTION <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link to="/contact" className="px-8 py-3 border border-white/20 skew-box hover:bg-white/10 transition-colors text-center">
                <span className="no-skew block text-xs font-bold uppercase tracking-widest">Learn More</span>
              </Link>
            </div>

            <div className="mt-16 flex items-center space-x-8 grayscale opacity-50">
              <div className="flex flex-col">
                <span className="text-2xl font-display font-black">1.5K+</span>
                <span className="text-[10px] font-mono uppercase">Figures</span>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-2xl font-display font-black">24H</span>
                <span className="text-[10px] font-mono uppercase">Global Shipping</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden md:block"
          >
            {/* Main Image Frame */}
            <div className="relative z-10 glass p-3 rounded-2xl border-neon-cyan/20">
              <img 
                src="https://images.unsplash.com/photo-1615125350941-6893988e7a0d?q=80&w=1000&auto=format&fit=crop" 
                alt="Main Character" 
                className="w-full aspect-[4/5] object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
              {/* Floating Data UI */}
              <div className="absolute top-10 -right-12 glass p-4 rounded-lg border-neon-purple/50 animate-bounce-slow">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-neon-purple" />
                  <span className="text-[10px] font-mono uppercase">Syncing Data...</span>
                </div>
                <div className="text-xs font-bold">LEGENDARY RANK</div>
              </div>
            </div>
            
            {/* Side Glows */}
            <div className="absolute -inset-4 bg-neon-purple/20 blur-3xl opacity-50 -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <div className="flex items-center space-x-2 text-neon-purple mb-2">
              <Zap className="w-5 h-5 fill-current" />
              <span className="text-sm font-mono uppercase tracking-[0.3em]">Top Rated</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Trending Collectibles</h2>
          </div>
          <Link to="/shop" className="text-neon-cyan hover:text-white transition-colors flex items-center space-x-2 text-xs font-mono uppercase tracking-widest mt-6 md:mt-0">
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Anime Series Section */}
      <section className="bg-cyber-gray/30 py-24 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tight mb-4">Choose Your Universe</h2>
            <p className="text-white/40 font-mono text-sm tracking-widest uppercase">Browse by Anime Legacy</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {series.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative h-64 glass rounded-xl overflow-hidden cursor-pointer border-white/5 hover:border-neon-purple/50 transition-all"
              >
                <div className={cn("absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity", s.color)} />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="text-xl font-display font-black uppercase tracking-tighter mb-2 group-hover:text-neon-purple transition-colors">{s.name}</h3>
                  <span className="text-[10px] font-mono text-white/50">{s.count}+ Items</span>
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-neon-purple flex items-center justify-center">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features/Trust Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <div className="w-12 h-12 glass rounded-lg flex items-center justify-center border-neon-cyan/30 text-neon-cyan">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-black uppercase">Authentic Guarantee</h3>
          <p className="text-white/40 text-sm leading-relaxed">
            Every figure is 100% genuine, sourced directly from manufacturers in Japan. Holographic COA included with every purchase.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 glass rounded-lg flex items-center justify-center border-neon-purple/30 text-neon-purple">
            <Rocket className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-black uppercase">Warp Speed Delivery</h3>
          <p className="text-white/40 text-sm leading-relaxed">
            Global express shipping with ultra-secure packaging. Your collectibles arrive in pristine condition, ready for display.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 glass rounded-lg flex items-center justify-center border-neon-red/30 text-neon-red">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-black uppercase">Community Hub</h3>
          <p className="text-white/40 text-sm leading-relaxed">
            Join 50k+ collectors in our Neo-Akiba Discord. Get early access to rare drops and limited edition prototypes.
          </p>
        </div>
      </section>
    </div>
  );
};
