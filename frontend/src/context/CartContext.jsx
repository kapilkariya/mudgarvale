import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../config/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Initialize cart from localStorage (for non-logged in users)
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fetch cart from backend when user logs in
  useEffect(() => {
    const fetchBackendCart = async () => {
      if (isAuthenticated()) {
        try {
          setIsLoading(true);
          const response = await cartAPI.get();
          if (response.success) {
            // Merge backend cart with localStorage cart
            const backendItems = response.data.items || [];
            const localItems = JSON.parse(localStorage.getItem('cart') || '[]');

            // If both have items, prioritize backend (or merge intelligently)
            if (backendItems.length > 0) {
              setCart(backendItems);
              // Update localStorage to match
              localStorage.setItem('cart', JSON.stringify(backendItems));
            } else if (localItems.length > 0) {
              // Sync local items to backend
              await cartAPI.sync(localItems);
            }
          }
        } catch (err) {
          console.error('Failed to fetch cart:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBackendCart();
  }, [isAuthenticated()]);

  // Save cart to localStorage and sync to backend whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));

    // Sync to backend if logged in
    if (isAuthenticated() && !isLoading) {
      const syncToBackend = async () => {
        try {
          await cartAPI.sync(cart);
        } catch (err) {
          console.error('Failed to sync cart to backend:', err);
        }
      };
      syncToBackend();
    }
  }, [cart, isAuthenticated()]);

  // Get total number of items in cart
  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price of all items
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Add item to cart
  const addToCart = async (newItem) => {
    setCart((prevCart) => {
      // Check if item with same productId and weight already exists
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === newItem.productId && item.selectedWeight === newItem.selectedWeight
      );

      let updatedCart;
      if (existingIndex >= 0) {
        // Update quantity of existing item - always increase by 1
        updatedCart = [...prevCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + 1
        };
      } else {
        // Add new item with quantity 1
        updatedCart = [...prevCart, { ...newItem, quantity: 1 }];
      }
      return updatedCart;
    });

    // Sync to backend if logged in
    if (isAuthenticated()) {
      try {
        await cartAPI.add({ ...newItem, quantity: 1 });
      } catch (err) {
        console.error('Failed to add item to backend cart:', err);
      }
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, weight, quantity) => {
    if (quantity < 1) return;

    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.productId === productId && item.selectedWeight === weight) {
          return { ...item, quantity };
        }
        return item;
      });
    });

    // Note: Backend sync happens in useEffect
  };

  // Remove item from cart
  const removeFromCart = async (productId, weight) => {
    setCart((prevCart) => {
      return prevCart.filter(
        (item) => !(item.productId === productId && item.selectedWeight === weight)
      );
    });

    // Note: Backend sync happens in useEffect
  };

  // Clear entire cart
  const clearCart = async () => {
    setCart([]);
    if (isAuthenticated()) {
      try {
        await cartAPI.clear();
      } catch (err) {
        console.error('Failed to clear backend cart:', err);
      }
    }
  };

  const value = {
    cart,
    getCartCount,
    getCartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
