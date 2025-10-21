"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { FileItemType } from "@/data/folder";

export interface CartItem extends FileItemType {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: FileItemType) => void;
  removeFromCart: (id: string) => void;
  isInCart: (id: string) => boolean;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 🧠 Load cart from localStorage on first render
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error("Invalid cart data in localStorage");
        localStorage.removeItem("cart");
        console.log(e);
      }
    }
  }, []);

  // 💾 Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: FileItemType) => {
    setCart((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      if (exists) return prev; // prevent duplicates
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const isInCart = (id: string) => cart.some((item) => item._id === id);

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, isInCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
