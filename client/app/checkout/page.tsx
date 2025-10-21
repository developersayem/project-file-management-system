"use client";

import { OrderReceipt } from "@/components/checkout/order-receipt";

export default function Home() {
  function generateOrderId(): string {
    return Math.floor(10000000000 + Math.random() * 90000000000).toString();
  }

  const orderId = generateOrderId();

  return <OrderReceipt orderId={orderId} />;
}
