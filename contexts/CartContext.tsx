"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface CartItem {
  itemId: string;
  quantity: number;
  addedAt: string;
  item?: {
    _id: string;
    title: string;
    brand: string;
    price_cents: number;
    images: string[];
    condition: string;
  };
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  isLoading: boolean;
  isItemLoading: (itemId: string) => boolean;
  addToCart: (itemId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const { isSignedIn } = useUser();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const fetchCart = async () => {
    if (!isSignedIn) {
      setCart([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      
      if (data.success) {
        console.log('Cart API response:', data.data); // Debug log
        setCart(data.data || []);
      } else {
        console.error('Failed to fetch cart:', data.error);
        setCart([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (itemId: string, quantity: number = 1) => {
    if (!isSignedIn) {
      alert('Please sign in to add items to cart');
      return;
    }

    // Set loading for this specific item
    setLoadingItems(prev => new Set(prev).add(itemId));
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, quantity }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Optimistically update cart count without full refresh
        setCart(prevCart => {
          const existingItem = prevCart.find(item => item.itemId === itemId);
          if (existingItem) {
            return prevCart.map(item => 
              item.itemId === itemId 
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            // Add new item optimistically - we'll get the full details on next page load
            return [...prevCart, { itemId, quantity, addedAt: new Date().toISOString(), item: undefined }];
          }
        });
      } else {
        alert(data.error || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    } finally {
      // Remove loading for this specific item
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!isSignedIn) return;

    console.log('Removing item from cart:', itemId); // Debug log
    
    if (!itemId) {
      console.error('No itemId provided to removeFromCart');
      alert('Error: No item ID provided');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Optimistically remove item from cart
        setCart(prevCart => prevCart.filter(item => item.itemId !== itemId));
      } else {
        console.error('Failed to remove item:', data.error);
        alert(data.error || 'Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!isSignedIn) return;

    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    setIsLoading(true);
    try {
      // Remove the item first, then add it back with new quantity
      await removeFromCart(itemId);
      await addToCart(itemId, quantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isSignedIn) return;

    setIsLoading(true);
    try {
      // Remove all items one by one
      for (const cartItem of cart) {
        await removeFromCart(cartItem.itemId);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, cartItem) => {
      if (cartItem.item) {
        return total + (cartItem.item.price_cents * cartItem.quantity);
      }
      return total;
    }, 0);
  };

  const refreshCart = async () => {
    await fetchCart();
  };

  const isItemLoading = (itemId: string): boolean => {
    return loadingItems.has(itemId);
  };

  useEffect(() => {
    fetchCart();
  }, [isSignedIn]);

  const value: CartContextType = {
    cart,
    cartCount,
    isLoading,
    isItemLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
