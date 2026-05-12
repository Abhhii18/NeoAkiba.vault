import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { INITIAL_PRODUCTS } from '../constants';
import { Product } from '../types';
import { formatPrice, cn } from '../lib/utils';

export const Wishlist: React.FC = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  // In a real app, these would be fetched from the DB based on IDs
  // For now we filter initial products
  const wishlistItems = INITIAL_PRODUCTS.filter(p => wishlist.includes(p.id));

  const moveToCart = (product: Product) => {
    addToCart(product);
    toggleWishlist(product.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-dashed border-white/20">
          <Heart className="w-12 h-12 text-white/20" />
        </div>
        <h2 className="text-4xl font-display font-black uppercase tracking-tighter mb-4 italic">Wishlist is <span className="text-neon-cyan">Vacant</span></h2>
        <p className="text-white/40 font-mono text-sm tracking-widest uppercase mb-10 max-w-md">
          Your future collection hasn't been signaled yet. Find items you'd love to own.
        </p>
        <Link to="/shop" className="cyber-button-purple">
          Explore the Vault
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">FUTURE <span className="text-neon-red">RELICS</span></h1>
        <div className="flex items-center space-x-3 text-white/40 font-mono text-sm tracking-[0.2em] uppercase">
          <span>Signal detected:</span>
          <span className="text-neon-cyan">{wishlistItems.length} items pinned</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {wishlistItems.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel rounded-xl overflow-hidden group flex flex-col h-full bg-[#110820]/40"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-black to-transparent" />
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-neon-red/50 rounded-full transition-colors group/del"
                >
                  <Trash2 className="w-4 h-4 text-white/70 group-hover/del:text-white" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <span className="text-neon-cyan font-mono font-bold">{formatPrice(product.price)}</span>
                </div>
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-6">{product.anime}</p>

                <div className="mt-auto flex space-x-2">
                  <button 
                    onClick={() => moveToCart(product)}
                    className="flex-1 py-3 bg-neon-purple text-white text-[10px] font-bold tracking-widest uppercase hover:shadow-[0_0_15px_rgba(189,0,255,0.4)] transition-all flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Move to Cargo</span>
                  </button>
                  <Link 
                    to={`/product/${product.id}`}
                    className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center rounded-sm"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
