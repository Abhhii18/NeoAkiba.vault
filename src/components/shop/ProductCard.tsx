import React from 'react';
import { ShoppingCart, Star, Eye, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice, cn } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500" />
      
      <div className="relative glass-panel rounded-lg overflow-hidden flex flex-col h-full group">
        {/* Wishlist Toggle */}
        <button 
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 left-3 z-10 p-2 glass rounded-full hover:bg-white/10 transition-colors"
        >
          <Heart className={cn("w-4 h-4 transition-colors", isInWishlist(product.id) ? "text-neon-red fill-neon-red" : "text-white/40")} />
        </button>

        {/* Badge */}
        {product.featured && (
          <div className="absolute top-3 right-3 z-10 bg-black/60 text-neon-cyan text-[10px] font-bold uppercase px-2 py-1 rounded border border-neon-cyan/50 tracking-widest">
            New Arrival
          </div>
        )}

        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-b from-white/5 to-white/10 group-hover:from-white/10 group-hover:to-white/20 transition-colors duration-500">
          <img 
            src={product.image} 
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-transparent to-transparent opacity-80" />
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-lg group-hover:text-neon-cyan transition-colors">
              {product.name}
            </h3>
            <span className="text-neon-cyan font-mono font-bold">
              {formatPrice(product.price)}
            </span>
          </div>
          
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-4">
            {product.anime} • {product.category}
          </p>
          
          <div className="mt-auto flex space-x-2">
            <button 
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className={cn(
                "flex-1 py-2 bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase transition-all",
                product.stock > 0 ? "hover:bg-neon-cyan hover:text-black" : "opacity-50 cursor-not-allowed"
              )}
            >
              {product.stock > 0 ? 'Quick Add' : 'Sold Out'}
            </button>
            <Link 
              to={`/product/${product.id}`}
              className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-all rounded-sm flex items-center justify-center"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
