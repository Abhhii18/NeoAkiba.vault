import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, Share2, Star, ShieldCheck, Zap, ArrowLeft, Plus, Minus, Check, MessageSquare, User } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../constants';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, cn } from '../lib/utils';
import { ProductCard } from '../components/shop/ProductCard';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, where } from 'firebase/firestore';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : product?.rating.toFixed(1);

  useEffect(() => {
    const fetchProductData = async () => {
      // 1. Fetch info (from local for now or DB)
      const p = INITIAL_PRODUCTS.find(item => item.id === id);
      if (p) setProduct(p);

      // 2. Fetch Reviews
      if (id) {
        const reviewsQuery = query(
          collection(db, `products/${id}/reviews`),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(reviewsQuery);
        setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
      }

      // 3. Check if user has purchased
      if (auth.currentUser && id) {
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', auth.currentUser.uid)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const bought = ordersSnapshot.docs.some(doc => 
          doc.data().items.some((item: any) => item.productId === id)
        );
        setHasPurchased(bought);
      }

      setLoading(false);
      window.scrollTo(0, 0);
    };

    fetchProductData();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !id) return;
    setSubmittingReview(true);

    try {
      const reviewData = {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Unknown User',
        rating: reviewRating,
        comment: reviewComment,
        createdAt: serverTimestamp(),
        verifiedPurchase: hasPurchased
      };

      await addDoc(collection(db, `products/${id}/reviews`), reviewData);
      setReviewComment('');
      // Refresh reviews local state
      setReviews(prev => [{ ...reviewData, id: 'temp-' + Date.now(), createdAt: { seconds: Date.now()/1000 } } as Review, ...prev]);
    } catch (err) {
      console.error("Review error:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-40 flex justify-center">
        <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-40 text-center">
        <h2 className="text-3xl font-display font-black uppercase mb-4">Asset Not Found</h2>
        <Link to="/shop" className="cyber-button-purple inline-block">Return to Vault</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen py-10 px-6 max-w-7xl mx-auto">
      <Link to="/shop" className="inline-flex items-center space-x-2 text-white/50 hover:text-neon-cyan transition-colors mb-10 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs uppercase tracking-widest font-mono">Back to Vault</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Left: Images */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="glass rounded-2xl overflow-hidden border-white/10 relative p-4 group bg-gradient-to-br from-white/5 to-white/10">
            <img 
              src={product.image} 
              alt={product.name} 
              loading="lazy"
              className="w-full aspect-square object-cover rounded-xl group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
              referrerPolicy="no-referrer"
            />
            {/* Rare Badge */}
            {product.featured && (
              <div className="absolute top-8 left-8 bg-neon-purple text-white px-3 py-1 rounded-sm text-xs font-black uppercase tracking-widest shadow-lg">
                Exclusive Asset
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass aspect-square rounded-xl border-white/5 overflow-hidden cursor-pointer hover:border-neon-purple/50 transition-all opacity-60 hover:opacity-100 p-2">
                <img src={product.image} alt="" className="w-full h-full object-cover rounded-lg" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-[0.4em] px-2 py-0.5 border border-neon-cyan/30 rounded-sm">
                Authentic Figure
              </span>
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Serial #{product.id.split('-')[1]}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2 leading-tight">
              {product.name}
            </h1>
            <p className="text-lg text-white/50 font-display uppercase tracking-widest mb-4">Anime: {product.anime}</p>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={cn("w-4 h-4 fill-current", star > Math.floor(Number(averageRating)) && "opacity-30")} />
                ))}
                <span className="ml-2 text-sm text-white/60 font-mono">({averageRating})</span>
              </div>
              <span className="h-4 w-[1px] bg-white/10" />
              <span className="text-sm font-mono text-green-400 uppercase tracking-widest">{product.stock} Units In Cargo</span>
            </div>
          </div>

          <div className="py-8 border-y border-white/5">
            <span className="text-5xl font-display font-black text-white/90">
              {formatPrice(product.price)}
            </span>
          </div>

          <p className="text-white/60 leading-relaxed font-sans text-lg">
            {product.description}
          </p>

          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center glass border-white/10 rounded-lg p-1">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-3 hover:text-neon-cyan transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-mono font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-3 hover:text-neon-cyan transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 flex space-x-4">
                <button 
                  onClick={handleAddToCart}
                  className={cn(
                    "flex-1 py-4 flex items-center justify-center space-x-3 transition-all",
                    added ? "bg-green-500 text-white rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.5)]" : "cyber-button-purple"
                  )}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Cargo</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Initiate Transfer</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={() => product && toggleWishlist(product.id)}
                  className={cn(
                    "p-4 glass rounded-lg border-white/10 transition-all group",
                    isInWishlist(product?.id || '') ? "border-neon-red text-neon-red" : "hover:border-neon-red/50 text-white hover:text-neon-red"
                  )}
                >
                  <Heart className={cn("w-5 h-5", isInWishlist(product?.id || '') && "fill-current")} />
                </button>
              </div>
            </div>
          </div>

          {/* Trust Flags */}
          <div className="grid grid-cols-2 gap-4 pt-10">
            <div className="flex items-center space-x-3 text-xs text-white/40 font-mono tracking-widest uppercase">
              <ShieldCheck className="w-5 h-5 text-neon-cyan" />
              <span>Certified Original</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-white/40 font-mono tracking-widest uppercase">
              <Zap className="w-5 h-5 text-neon-purple" />
              <span>Express Delivery</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <div className="pt-24 border-t border-white/5 mb-24">
        {hasPurchased ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-black uppercase mb-6 tracking-tighter">Field <span className="text-neon-cyan">Reports</span></h2>
              <div className="glass p-6 rounded-2xl space-y-4">
                <div className="text-5xl font-black text-white">{averageRating}</div>
                <div className="flex items-center text-yellow-500">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={cn("w-4 h-4", s <= Math.floor(Number(averageRating)) ? "fill-current" : "opacity-20")} />
                  ))}
                </div>
                <p className="text-white/40 text-xs font-mono uppercase tracking-widest">Aggregate Satisfaction Score</p>
              </div>

              {auth.currentUser ? (
                <div className="mt-8 space-y-4">
                  <h4 className="text-sm font-bold uppercase">Submit Signal</h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(r => (
                        <button 
                          key={r}
                          type="button" 
                          onClick={() => setReviewRating(r)}
                          className={cn("p-1 transition-colors", reviewRating >= r ? "text-yellow-500" : "text-white/20")}
                        >
                          <Star className={cn("w-5 h-5", reviewRating >= r && "fill-current")} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Describe your asset's quality..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-sm focus:border-neon-cyan focus:outline-none h-32"
                    />
                    <button 
                      disabled={submittingReview || !reviewComment.trim()}
                      className="w-full cyber-button-purple text-xs"
                    >
                      {submittingReview ? 'Syncing...' : 'Broadcast Review'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="mt-8 p-6 border border-dashed border-white/10 rounded-2xl text-center">
                  <p className="text-white/40 text-xs font-mono uppercase mb-4">Authentication required for reviews</p>
                  <Link to="/auth" className="text-neon-cyan text-xs uppercase hover:underline">Sign In</Link>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-8">
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <div key={review.id} className="glass p-6 rounded-2xl border-white/5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-neon-purple" />
                        </div>
                        <div>
                          <div className="font-bold flex items-center space-x-2">
                            <span>{review.userName}</span>
                            {review.verifiedPurchase && (
                              <span className="text-[8px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded border border-green-500/30 uppercase tracking-widest font-mono">Verified Pilot</span>
                            )}
                          </div>
                          <div className="flex items-center text-yellow-500 mt-1">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className={cn("w-3 h-3", s <= review.rating ? "fill-current" : "opacity-20")} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-white/30">
                        {review.createdAt?.seconds ? new Date(review.createdAt.seconds * 1000).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-white/10 mb-4" />
                  <p className="text-white/30 font-mono uppercase tracking-widest">No signals recorded for this asset yet.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="glass p-16 rounded-3xl border-white/5 text-center max-w-2xl mx-auto shadow-[0_0_50px_rgba(189,0,255,0.1)]">
            <ShieldCheck className="w-16 h-16 text-neon-purple mx-auto mb-8 animate-pulse" />
            <h3 className="text-3xl font-black uppercase mb-4 tracking-tighter italic">Signal <span className="text-neon-cyan">Encrypted</span></h3>
            <p className="text-white/40 font-mono text-sm tracking-widest uppercase mb-10 leading-relaxed">
              Field reports and signal analysis are restricted to verified asset holders. <br />
              Secure this figure to unlock regional logistics data and peer feedback.
            </p>
            <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] text-neon-cyan font-bold tracking-[0.2em] uppercase">
               <div className="w-2 h-2 bg-neon-cyan rounded-full animate-ping" />
               <span>Awaiting Ownership Verification...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Products */}
      <div className="pt-24 border-t border-white/5">
        <h2 className="text-3xl font-black uppercase mb-12 tracking-tighter">Recommended Replacements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {INITIAL_PRODUCTS.filter(p => p.id !== product.id).slice(0, 4).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
