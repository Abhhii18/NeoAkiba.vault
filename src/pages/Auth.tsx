import React, { useState } from 'react';
import { motion } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Github, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          createdAt: serverTimestamp(),
        });
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(auth, provider);
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        createdAt: serverTimestamp(),
      }, { merge: true });
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/10 blur-[120px] rounded-full -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-2xl border-white/10 p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-black uppercase tracking-tighter mb-2">
            {isLogin ? 'Access' : 'Initiate'} <span className="text-neon-purple">Protocol</span>
          </h2>
          <p className="text-white/50 text-sm font-mono tracking-widest uppercase">
            {isLogin ? 'Welcome back, Citizen' : 'Register your digital signature'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-neon-red/10 border border-neon-red/30 rounded-lg flex items-center space-x-3 text-neon-red text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-[10px] font-mono text-white/50 uppercase tracking-widest mb-2">Identity Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-purple transition-colors text-white"
              placeholder="user@neo-tokyo.net"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-white/50 uppercase tracking-widest mb-2">Pass-Key</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-purple transition-colors text-white"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full cyber-button-purple py-3 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                <span>{isLogin ? 'Authenticate' : 'Initiate Sign Up'}</span>
              </>
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]"><span className="bg-cyber-gray px-3 text-white/30">Or Connect Via</span></div>
        </div>

        <button 
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full glass py-3 border-white/10 hover:border-white/20 transition-all flex items-center justify-center space-x-3 rounded-lg group"
        >
          <Mail className="w-5 h-5 group-hover:text-neon-cyan transition-colors" />
          <span className="text-sm font-medium">Continue with Google</span>
        </button>

        <p className="mt-8 text-center text-sm text-white/40 font-sans">
          {isLogin ? "New to the Akira-verse?" : "Already registered?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-neon-cyan hover:text-white transition-colors underline underline-offset-4"
          >
            {isLogin ? 'Register Now' : 'Sign In instead'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};
