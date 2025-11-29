import { useState, useEffect } from 'react';
import { CartItem, Product, Size } from '@/types/product';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, size?: Size, color?: string) => {
    setCart(prev => {
      // Create unique key based on product id, size, and color
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedSize === size &&
        item.selectedColor === color
      );
      
      if (existing) {
        return prev.map(item =>
          item.id === product.id && 
          item.selectedSize === size &&
          item.selectedColor === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
  };

  const removeFromCart = (id: string, size?: Size, color?: string) => {
    setCart(prev => prev.filter(item => 
      !(item.id === id && item.selectedSize === size && item.selectedColor === color)
    ));
  };

  const updateQuantity = (id: string, quantity: number, size?: Size, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }
    setCart(prev =>
      prev.map(item => 
        item.id === id && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal - (subtotal * discount);

  return {
    cart,
    items: cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    total,
    discount,
    setDiscount,
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
  };
};

