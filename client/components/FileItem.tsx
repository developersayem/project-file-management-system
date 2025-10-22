/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { FileItemType } from "@/data/folder";
import { useCart } from "@/context/CartContext";

interface FileItemProps {
  file: FileItemType;
}

export default function FileItem({ file }: FileItemProps) {
  const { addToCart, isInCart } = useCart();
  const alreadyInCart = isInCart(file._id);

  return (
    <div className="border border-gray-200 p-1 rounded shadow hover:shadow-md transition flex justify-between items-center text-black capitalize">
      <div className="flex items-center gap-2">
        {file.icon === "pdf" ? (
          <img src="/pdf.png" alt="" className="w-15 h-15" />
        ) : (
          <img src="/xls.png" alt="" className="w-15 h-15" />
        )}
        <div>
          <p>{file.name}</p>
          <p className="text-[12px] text-gray-500">
            Number of Leads: {file.numbers}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[12px] text-gray-600 mb-2">
          <span className="px-1">{file.price}</span>
          {file.currency}
        </p>
        <button
          onClick={() => addToCart(file)}
          disabled={alreadyInCart}
          className={`px-3 py-1 rounded text-sm ${
            alreadyInCart
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {alreadyInCart ? "Added" : "Add to List"}
        </button>
      </div>
    </div>
  );
}
