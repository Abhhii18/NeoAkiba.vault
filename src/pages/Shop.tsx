import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, SlidersHorizontal, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { ProductCard } from '../components/shop/ProductCard';
import { INITIAL_PRODUCTS } from '../constants';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSeries = searchParams.get('series');

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<string>(initialSeries || 'All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState('Newest Arrivals');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const series = ['All', 'Naruto', 'One Piece', 'Jujutsu Kaisen', 'Attack on Titan', 'Dragon Ball'];
  const sortOptions = ['Newest Arrivals', 'Top Rated', 'Price: Low to High', 'Price: High to Low'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const fetchedProducts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Product));
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;

    // Search
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.anime.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Series Filter
    if (selectedSeries !== 'All') {
      result = result.filter(p => p.anime === selectedSeries);
    }

    // Price Filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Top Rated') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'Newest Arrivals') {
      result.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedSeries, priceRange, sortBy, products]);

  return (
    <div className="min-h-screen py-10 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 glow-text">THE <span className="text-neon-red">VAULT</span></h1>
        <p className="text-white/40 font-mono text-[10px] tracking-[0.3em] uppercase">ACCESSING GLOBAL ARCHIVE... ENCRYPTED ASSETS ONLY</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="text"
            placeholder="Search characters, series..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-panel border-white/10 rounded-sm pl-12 pr-4 py-4 focus:outline-none focus:border-neon-cyan transition-colors text-white font-mono text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "flex items-center space-x-2 px-6 py-4 border border-white/10 skew-box transition-all text-[10px] font-bold uppercase tracking-widest",
              isFilterOpen ? "bg-neon-cyan/20 border-neon-cyan text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]" : "glass-panel hover:border-white/30"
            )}
          >
            <span className="no-skew flex items-center space-x-2">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Filters</span>
            </span>
          </button>

          <div className="relative group">
            <button className="flex items-center space-x-2 px-6 py-4 glass-panel border-white/10 hover:border-neon-purple/50 transition-all text-[10px] font-bold uppercase tracking-widest min-w-[200px] justify-between skew-box">
              <span className="no-skew flex items-center justify-between w-full">
                <span>Sort: {sortBy}</span>
                <ChevronDown className="w-3 h-3" />
              </span>
            </button>
            <div className="absolute top-full right-0 mt-2 w-full glass-panel border-white/10 p-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-all z-20 shadow-2xl">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className="w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-neon-purple/20 hover:text-white rounded-md transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.aside
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full lg:w-64 space-y-10"
            >
              {/* Anime Series */}
              <div>
                <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-6">Origins</h4>
                <div className="flex flex-wrap lg:flex-col gap-2">
                  {series.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSeries(s)}
                      className={cn(
                        "text-left px-4 py-2 rounded-lg text-xs uppercase tracking-widest border transition-all",
                        selectedSeries === s 
                          ? "bg-neon-purple/20 border-neon-purple text-white shadow-[0_0_15px_rgba(188,19,254,0.3)]" 
                          : "border-white/5 text-white/50 hover:border-white/20 hover:text-white"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-6">Value (USD)</h4>
                <div className="space-y-6">
                  <div className="flex justify-between items-center space-x-2">
                    <input 
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full bg-white/5 border border-white/10 rounded p-1.5 text-[10px] font-mono"
                      placeholder="Min"
                    />
                    <span className="text-white/20">-</span>
                    <input 
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                      className="w-full bg-white/5 border border-white/10 rounded p-1.5 text-[10px] font-mono"
                      placeholder="Max"
                    />
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="500" 
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-neon-cyan"
                  />
                  <div className="flex justify-between font-mono text-[10px] text-white/50">
                    <span>${priceRange[0]}</span>
                    <span className="text-neon-cyan">${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { setSelectedSeries('All'); setPriceRange([0, 200]); setSearchTerm(''); }}
                className="w-full p-3 glass border-neon-red/20 text-neon-red text-[10px] uppercase tracking-widest hover:bg-neon-red/10 transition-all rounded-lg"
              >
                Reset Systems
              </button>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl">
              <p className="text-white/30 font-mono uppercase tracking-widest mb-4">No assets found</p>
              <button 
                onClick={() => setSelectedSeries('All')}
                className="text-neon-purple text-xs uppercase tracking-widest hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
