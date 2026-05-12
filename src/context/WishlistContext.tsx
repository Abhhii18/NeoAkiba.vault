import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

interface WishlistContextType {
  wishlist: string[]; // Array of product IDs
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        if (userDoc.exists()) {
          setWishlist(userDoc.data().wishlist || []);
        }
      } else {
        setWishlist([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      alert("Please login to manage your wishlist");
      return;
    }

    const isAdded = wishlist.includes(productId);
    const userRef = doc(db, 'users', user.uid);

    try {
      if (isAdded) {
        await updateDoc(userRef, {
          wishlist: arrayRemove(productId)
        });
        setWishlist(prev => prev.filter(id => id !== productId));
      } else {
        await updateDoc(userRef, {
          wishlist: arrayUnion(productId)
        });
        setWishlist(prev => [...prev, productId]);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
