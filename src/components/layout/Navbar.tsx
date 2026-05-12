import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, User as UserIcon, LogOut, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { cn } from '../../lib/utils';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel py-4">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-sm skew-box group-hover:rotate-12 transition-transform duration-500"></div>
          <span className="font-display font-black text-2xl tracking-tighter uppercase glow-text">
            NeoAkiba<span className="text-neon-red">.Vault</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 uppercase tracking-[0.2em] font-bold text-xs">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "transition-all hover:text-neon-cyan relative group",
                location.pathname === link.path ? "text-neon-cyan" : "text-white/60"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-6">
          <Link to="/wishlist" className="relative group p-1">
            <Heart className={cn("w-5 h-5 transition-colors", wishlist.length > 0 ? "text-neon-red fill-neon-red" : "group-hover:text-neon-red")} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-neon-purple text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative transition-colors group">
            <ShoppingCart className="w-6 h-6 group-hover:text-neon-cyan transition-colors" />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-neon-red text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>
          
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full border border-neon-cyan overflow-hidden bg-white/10 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-neon-cyan" />
                </div>
                <button 
                  onClick={() => signOut(auth)}
                  className="text-neon-red/70 hover:text-neon-red transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="px-6 py-2 border border-white/20 skew-box hover:bg-white/10 transition-colors">
                <span className="no-skew block text-[10px] font-bold uppercase tracking-widest">Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cyber-black/95 backdrop-blur-2xl border-b border-white/10"
          >
            <div className="p-6 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="font-display font-bold uppercase tracking-widest text-lg py-2 border-b border-white/5"
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <Link to="/auth" className="cyber-button-purple w-full text-center mt-4">
                  Login / Sign Up
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
