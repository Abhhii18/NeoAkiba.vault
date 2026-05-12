import React from 'react';
import { motion } from 'motion/react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Box, Package, ArrowRight, Download, Mail } from 'lucide-react';
import { formatPrice } from '../lib/utils';

export const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const state = location.state as { orderId: string, formData: any, total: number, items: any[] };

  if (!state) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen py-20 px-6 flex flex-col items-center">
      <div className="relative mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10 }}
          className="w-24 h-24 bg-neon-cyan/20 border-2 border-neon-cyan rounded-full flex items-center justify-center z-10 relative"
        >
          <CheckCircle2 className="w-12 h-12 text-neon-cyan" />
        </motion.div>
        {/* Particle effect simulation */}
        <div className="absolute inset-0 bg-neon-cyan/10 blur-[50px] scale-150 animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 italic">
          Mission <span className="text-neon-cyan">Accomplished</span>
        </h1>
        <p className="text-white/60 text-lg mb-12 font-sans">
          Transmission successful. Your legendary collectibles are now being phased into reality.
        </p>

        <div className="glass rounded-2xl border-white/10 p-8 text-left mb-12 relative overflow-hidden">
          {/* Cyber accents */}
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Package className="w-32 h-32" />
          </div>

          <div className="flex flex-col md:flex-row justify-between border-b border-white/5 pb-6 mb-6">
            <div>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Authorization ID</p>
              <p className="font-mono font-bold text-neon-purple">#{state.orderId}</p>
            </div>
            <div className="mt-4 md:mt-0 md:text-right">
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Target Coordinates</p>
              <p className="text-sm font-bold uppercase">{state.formData.city}, {state.formData.state}</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-4">Cargo Manifest</h4>
            {state.items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-center text-sm font-mono uppercase">
                <span className="text-white/60">{item.name} <span className="text-neon-cyan ml-2">x{item.quantity}</span></span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-between items-end">
            <div className="flex items-center space-x-2 text-neon-cyan">
              <Mail className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase tracking-widest">Receipt Sent To {state.formData.email}</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono text-white/30 uppercase mb-1">Settled Assets</p>
              <p className="text-3xl font-display font-black text-white">{formatPrice(state.total)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link to="/" className="cyber-button-purple px-10">
            Home Signal
          </Link>
          <button className="cyber-button-outline px-10 flex items-center justify-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Archive Receipt</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
