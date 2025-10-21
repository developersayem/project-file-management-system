"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { MdDeleteOutline } from "react-icons/md";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Input } from "./ui/input";

export default function Cart() {
  const { cart, removeFromCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Load saved info from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("receipt_name");
    const savedPhone = localStorage.getItem("receipt_phone");
    if (savedName) setName(savedName);
    if (savedPhone) setPhone(savedPhone);
  }, []);

  const total = cart.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  const isCheckoutDisabled =
    cart.length === 0 || name.trim() === "" || phone.trim() === "";

  const handleCheckout = () => {
    // Save only when Checkout button is clicked
    localStorage.setItem("receipt_name", name);
    localStorage.setItem("receipt_phone", phone);
  };

  return (
    <aside className="text-black lg:w-1/4 min-w-[250px] bg-gray-50 border-l border-gray-200 flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="py-8 px-4 border-b bg-gray-50 sticky top-0 z-10 flex gap-2 items-center">
        <h2 className="text-xl font-bold">Cart</h2>
        <ShoppingCart />
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <p className="text-gray-500">No items yet</p>
        ) : (
          <ul className="space-y-3 capitalize">
            {cart.map((item) => (
              <li
                key={item._id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Leads {item.numbers} | {item.price} {item.currency}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <MdDeleteOutline size={20} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50 sticky bottom-0 z-10">
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-0.5">
            <h1 className="font-semibold">Receipt Info</h1>
            <span className="text-red-500 text-sm">(Required)</span>
          </div>
          <Input
            className="border border-blue-600"
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            className="border border-blue-600"
            type="number"
            placeholder="Enter Your WhatsApp Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <p className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>BDT{total.toFixed(2)}</span>
          </p>
          <Link href={isCheckoutDisabled ? "#" : "/checkout"}>
            <button
              onClick={handleCheckout}
              disabled={isCheckoutDisabled}
              className={`mt-4 w-full py-2 rounded text-white ${
                isCheckoutDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Checkout
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
