import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Trash } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, cn } from '../lib/utils';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-dashed border-white/20 animate-pulse">
          <ShoppingBag className="w-12 h-12 text-white/20" />
        </div>
        <h2 className="text-4xl font-display font-black uppercase tracking-tighter mb-4 italic">Cargo Hold is <span className="text-neon-red">Empty</span></h2>
        <p className="text-white/40 font-mono text-sm tracking-widest uppercase mb-10 max-w-md">
          No collectibles detected in your current session. Browse our vault to find legendary figures.
        </p>
        <Link to="/shop" className="cyber-button-purple">
          Browse the Vault
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Cargo <span className="text-neon-purple">Hold</span></h1>
        <div className="flex items-center space-x-3 text-white/40 font-mono text-sm tracking-[0.2em] uppercase">
          <span>Current Load:</span>
          <span className="text-neon-cyan">{cartCount} items</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass rounded-xl overflow-hidden border-white/5 hover:border-white/20 transition-all flex group p-4 gap-6"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-lg overflow-hidden border border-white/10">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col pt-2">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="text-[10px] font-mono text-neon-cyan uppercase tracking-widest mb-1">{item.anime}</p>
                      <h3 className="text-lg font-bold font-display uppercase tracking-tight group-hover:text-neon-purple transition-colors">{item.name}</h3>
                    </div>
                    <p className="font-mono font-bold text-lg">{formatPrice(item.price)}</p>
                  </div>

                  <div className="mt-auto flex justify-between items-center bg-black/20 p-2 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-md transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-mono font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-md transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-white/20 hover:text-neon-red p-2 transition-colors flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-[10px] uppercase font-mono tracking-widest">Eject</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <div className="pt-6">
            <Link to="/shop" className="inline-flex items-center space-x-2 text-white/40 hover:text-neon-cyan transition-colors text-xs font-mono uppercase tracking-widest">
              <ShoppingBag className="w-4 h-4" />
              <span>Add more assets to cargo</span>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl border-neon-purple/20 p-8 sticky top-24">
            <h3 className="text-xl font-display font-black uppercase tracking-tight mb-8 pb-4 border-b border-white/5">Order Manifest</h3>
            
            <div className="space-y-6 mb-8 text-sm font-mono uppercase tracking-widest">
              <div className="flex justify-between">
                <span className="text-white/40">Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Cargo Transit (Expedited)</span>
                <span className="text-neon-cyan">$15.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Credits Applied</span>
                <span className="text-neon-red">-$0.00</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mb-8 flex justify-between items-end">
              <span className="text-xs font-mono text-white/30 uppercase tracking-[0.3em]">Total Credits</span>
              <span className="text-4xl font-display font-black text-neon-purple">{formatPrice(cartTotal + 15)}</span>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full cyber-button-purple py-4 group flex items-center justify-center space-x-3"
            >
              <span>Initiate Checkout</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-8 flex items-center justify-center space-x-4 grayscale opacity-30">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
