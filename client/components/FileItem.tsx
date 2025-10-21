"use client";

import React from "react";
import { FileItemType } from "@/data/folder";
import { useCart } from "@/context/CartContext";
import { FaFileExcel } from "react-icons/fa6";

interface FileItemProps {
  file: FileItemType;
}

export default function FileItem({ file }: FileItemProps) {
  const { addToCart, isInCart } = useCart();
  const alreadyInCart = isInCart(file._id);

  return (
    <div className="border border-gray-200 p-4 rounded shadow hover:shadow-md transition flex justify-between items-center text-black capitalize">
      <div className="flex items-center gap-2">
        <FaFileExcel className="text-green-700 text-2xl" />
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
