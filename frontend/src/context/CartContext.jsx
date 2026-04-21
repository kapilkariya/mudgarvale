import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Get total number of items in cart
  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price of all items
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Add item to cart
  const addToCart = (newItem) => {
    setCart((prevCart) => {
      // Check if item with same productId and weight already exists
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === newItem.productId && item.selectedWeight === newItem.selectedWeight
      );

      if (existingIndex >= 0) {
        // Update quantity of existing item
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += newItem.quantity;
        return updatedCart;
      }

      // Add new item
      return [...prevCart, newItem];
    });
  };

  // Update item quantity
  const updateQuantity = (productId, weight, quantity) => {
    if (quantity < 1) return;

    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.productId === productId && item.selectedWeight === weight) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  // Remove item from cart
  const removeFromCart = (productId, weight) => {
    setCart((prevCart) => {
      return prevCart.filter(
        (item) => !(item.productId === productId && item.selectedWeight === weight)
      );
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    getCartCount,
    getCartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
