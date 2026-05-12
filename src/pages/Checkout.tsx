import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, ArrowLeft, Loader2, CheckCircle, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { auth, db, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { formatPrice, cn } from '../lib/utils';
import { OperationType, Order } from '../types';

export const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Prepare Order Object
      const orderData: Order = {
        userId: auth.currentUser?.uid || 'guest',
        customerInfo: formData,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: cartTotal + 15, // Including shipping
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      // 2. Save to Firestore
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      const orderId = docRef.id;

      // 3. Trigger Email via Backend
      try {
        await fetch('/api/confirm-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order: { ...orderData, id: orderId },
            customerEmail: formData.email,
            customerName: formData.fullName,
          }),
        });
      } catch (emailErr) {
        console.error('Email failed (proceeding anyway):', emailErr);
      }

      // 4. Success
      clearCart();
      navigate('/order-success', { state: { orderId, formData, total: cartTotal + 15, items: cart } });
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, 'orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Transmission <span className="text-neon-cyan">Point</span></h1>
        <p className="text-white/40 font-mono text-sm tracking-[0.2em] uppercase">Secure finalize and shipping protocols</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Shipping & Payment Info */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass p-8 rounded-2xl border-white/5">
            <h3 className="text-xl font-display font-black uppercase mb-8 flex items-center">
              <Truck className="w-6 h-6 mr-3 text-neon-cyan" />
              <span>Destination Coordinates</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Full Identity Name</label>
                <input required name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-cyan transition-colors" placeholder="e.g. Satoru Gojo" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Communication Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-cyan transition-colors" placeholder="user@neo-aki.ba" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Com-Link Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-cyan transition-colors" placeholder="+81 XX-XXXX-XXXX" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Sector & Street Address</label>
                <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-cyan transition-colors" placeholder="Sector 7, Building B, Floor 12" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Citadel/City</label>
                <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-cyan transition-colors" placeholder="Neo Tokyo" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Prefecture/State</label>
                <input required name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-cyan transition-colors" placeholder="Kanto" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Access PIN Code</label>
                <input required name="pinCode" value={formData.pinCode} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-cyan transition-colors" placeholder="100-XXX" />
              </div>
            </div>
          </section>

          <section className="glass p-8 rounded-2xl border-white/5">
            <h3 className="text-xl font-display font-black uppercase mb-8 flex items-center">
              <CreditCard className="w-6 h-6 mr-3 text-neon-purple" />
              <span>Credit Transfer Protocol</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'card', name: 'Secure Card', icon: CreditCard },
                { id: 'upi', name: 'Direct Link', icon: Smartphone },
                { id: 'cod', name: 'Arrival Transfer', icon: ShieldCheck },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={cn(
                    "p-6 rounded-xl border flex flex-col items-center justify-center space-y-4 transition-all",
                    paymentMethod === method.id 
                      ? "bg-neon-purple/20 border-neon-purple shadow-[0_0_20px_rgba(188,19,254,0.3)]" 
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  )}
                >
                  <method.icon className={cn("w-8 h-8", paymentMethod === method.id ? "text-neon-purple" : "text-white/30")} />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em]">{method.name}</span>
                </button>
              ))}
            </div>

            {paymentMethod === 'card' && (
              <div className="mt-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Card Credentials</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-purple transition-colors" placeholder="4242 4242 4242 4242" />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">De-Activation Date</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-purple transition-colors" placeholder="MM/YY" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">CVV Protocol</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-purple transition-colors" placeholder="XXX" />
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl border-neon-cyan/20 p-8 sticky top-24">
            <h3 className="text-xl font-display font-black uppercase tracking-tight mb-8">Manifest Summary</h3>
            
            <div className="space-y-4 mb-8">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate text-white/90">{item.name}</p>
                    <p className="text-[10px] font-mono text-white/40 uppercase">x{item.quantity}</p>
                  </div>
                  <p className="font-mono font-bold text-neon-cyan ml-4">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10 mb-8 text-xs font-mono uppercase tracking-widest">
              <div className="flex justify-between">
                <span className="text-white/40">Cargo Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Transit Credits</span>
                <span>$15.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-4 text-white">
                <span className="font-display">Total Credits</span>
                <span className="text-neon-purple">{formatPrice(cartTotal + 15)}</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-neon-purple text-white py-4 font-display font-bold uppercase tracking-[0.2em] relative overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(188,19,254,0.6)] group disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Execute Purchase</span>
                </div>
              )}
            </button>

            <p className="mt-6 text-[10px] text-center font-mono text-white/30 uppercase tracking-widest">
              Encrypted via Neo-Akiba Secure Bridge
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
