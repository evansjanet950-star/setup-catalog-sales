import React, { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { products, bundles } from '@/data/products';
import { Header } from './Header';
import { Hero } from './Hero';
import { ChristmasBanner } from './ChristmasBanner';
import { DiscountBanner } from './DiscountBanner';
import DiscountModal from './DiscountModal';
import ProductCard from './ProductCard';
import BundleCard from './BundleCard';
import CartModal from './CartModal';
import { Footer } from './Footer';
import { FeaturedProducts } from './FeaturedProducts';
import EmailCaptureModal from './EmailCaptureModal';
import { supabase } from '@/lib/supabase';




const AppLayout: React.FC = () => {
  const cart = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    // Show email modal after 30 seconds if cart has items and no email saved
    if (cart.cart.length > 0 && !userEmail) {
      const timer = setTimeout(() => {
        setEmailModalOpen(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [cart.cart, userEmail]);

  useEffect(() => {
    // Save abandoned cart when cart changes and email is available
    if (cart.cart.length > 0 && userEmail) {
      saveAbandonedCart();
    }
  }, [cart.cart, userEmail]);

  const saveAbandonedCart = async () => {
    try {
      await supabase.functions.invoke('save-abandoned-cart', {
        body: {
          email: userEmail,
          cartData: cart.cart
        }
      });
    } catch (error) {
      console.error('Error saving abandoned cart:', error);
    }
  };

  const handleEmailSubmit = (email: string) => {
    setUserEmail(email);
    localStorage.setItem('userEmail', email);
    saveAbandonedCart();
  };

  const handleClaimDiscount = () => {
    setDiscountModalOpen(true);
  };

  const handleApplyDiscount = () => {
    cart.setDiscount(0.1);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    window.location.href = '/checkout';
  };


  return (
    <div className="min-h-screen flex flex-col">
      <ChristmasBanner />
      <DiscountBanner onClaim={handleClaimDiscount} />


      <Header onCartClick={() => setCartOpen(true)} />
      
      <main className="flex-1">
        <Hero />
        
        <FeaturedProducts />

        <section id="products" className="py-16 bg-gray-50">

          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Shop All Products</h2>
              <p className="text-gray-600">Premium apparel with exclusive crown designs</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={cart.addToCart}
                  showDiscount={cart.discount > 0}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="bundles" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Bundle Deals</h2>
              <p className="text-gray-600">Save big with our curated bundles</p>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {bundles.map(bundle => (
                <BundleCard
                  key={bundle.id}
                  bundle={bundle}
                  onAddToCart={() => {
                    bundle.products.forEach(p => cart.addToCart(p));
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      </main>


      <Footer />
      
      <CartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart.cart}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeFromCart}
        subtotal={cart.subtotal}
        total={cart.total}
        discount={cart.discount}
        onCheckout={handleCheckout}
      />

      <DiscountModal
        isOpen={discountModalOpen}
        onClose={() => setDiscountModalOpen(false)}
        onApply={handleApplyDiscount}
      />

      <EmailCaptureModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        onSubmit={handleEmailSubmit}
      />
    </div>
  );
};

export default AppLayout;

