"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Printer, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderReceiptProps {
  orderId: string;
}

export function OrderReceipt({ orderId }: OrderReceiptProps) {
  const router = useRouter();
  const { cart } = useCart();
  const [receiptName, setReceiptName] = useState("");
  const [receiptPhone, setReceiptPhone] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const receiptRef = useRef<HTMLDivElement>(null);

  // Load user info + timestamp
  useEffect(() => {
    if (typeof window !== "undefined") {
      setReceiptName(localStorage.getItem("receipt_name") || "");
      setReceiptPhone(localStorage.getItem("receipt_phone") || "");
    }

    const now = new Date();
    const formatted = now.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    setTimestamp(formatted);
  }, []);

  // Convert number to words
  const numberToWords = (num: number): string => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const scales = ["", "Thousand", "Million", "Billion"];

    if (num === 0) return "Zero";

    const convertHundreds = (n: number) => {
      let result = "";
      const hundred = Math.floor(n / 100);
      if (hundred > 0) result += ones[hundred] + " Hundred ";
      const remainder = n % 100;
      if (remainder >= 20) {
        result += tens[Math.floor(remainder / 10)];
        if (remainder % 10 > 0) result += " " + ones[remainder % 10];
      } else if (remainder >= 10) {
        result += teens[remainder - 10];
      } else if (remainder > 0) {
        result += ones[remainder];
      }
      return result.trim();
    };

    const parts: string[] = [];
    let scaleIndex = 0;
    while (num > 0) {
      const chunk = num % 1000;
      if (chunk > 0) {
        const part = convertHundreds(chunk);
        parts.unshift(
          part + (scales[scaleIndex] ? " " + scales[scaleIndex] : "")
        );
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return parts.join(" ").trim() + " Only";
  };

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );
  const totalNumbers = cart.reduce(
    (sum, item) => sum + (Number(item.numbers) || 0),
    0
  );
  const grandTotal = subtotal;

  const handleClose = () => router.push("/");

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap items-center justify-end gap-3 action-buttons">
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Print
        </Button>

        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleClose}
        >
          <X className="h-4 w-4" /> Close
        </Button>
      </div>

      {/* Receipt Content */}
      <Card
        ref={receiptRef}
        className="mx-auto max-w-3xl bg-white p-8 rounded-lg shadow-sm"
      >
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold">Selected Data Receipt</h1>
        </div>

        {/* Order Info */}
        <div className="border-b pb-6 flex justify-between items-center capitalize">
          <div>
            <p>Receipt ID: {orderId}</p>
            <p className="text-sm text-gray-500">{timestamp}</p>
          </div>
          <div>
            <p>Receipt Name: {receiptName}</p>
            <p>WhatsApp: {receiptPhone}</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left pb-2">Item</th>
                <th className="text-center pb-2">Unit</th>
                <th className="text-center pb-2">Leads</th>
                <th className="text-right pb-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id} className="border-b text-sm">
                  <td className="py-1 capitalize">{item.name}</td>
                  <td className="py-1 text-center">{item.quantity}</td>
                  <td className="py-1 text-center">{item.numbers}</td>
                  <td className="py-1 text-right">
                    {item.price} {item.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="space-y-3 border-t pt-6 mt-4">
          <div className="flex justify-between">
            <span>Total Leads:</span>
            <span>{totalNumbers.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{subtotal.toFixed(2)} BDT</span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="text-lg font-bold">Grand Total:</span>
            <span className="text-lg font-bold text-blue-600">
              {grandTotal.toFixed(2)} BDT
            </span>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg flex items-center gap-1">
          <p className="text-sm font-semibold">Amount in Words:</p>
          <p className="text-lg font-semibold">
            {numberToWords(Math.floor(grandTotal))}
          </p>
        </div>

        <div className="border-t pt-6 text-center mt-4">
          <p>Thank you for your order!</p>
        </div>
      </Card>
    </div>
  );
}
