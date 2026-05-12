/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Chatbot } from './components/chat/Chatbot';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Contact } from './pages/Contact';
import { Auth } from './pages/Auth';

export default function App() {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider>
          <div className="flex flex-col min-h-screen relative">
            <div className="fixed inset-0 cyber-grid pointer-events-none -z-10" />
            <Navbar />
            <main className="flex-grow pt-20 relative z-10">
              <Routes>
                <Route path="/" element={<HomeLoader />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
              </Routes>
            </main>
            <Footer />
            <Chatbot />
          </div>
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

// Wrapper to handle home page specifically if needed
function HomeLoader() {
  return <Home />;
}

