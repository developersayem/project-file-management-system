"use client";

import { fetcher } from "@/app/lib/fetcher";
import React from "react";
import useSWR from "swr";

const MarqueeCom = () => {
  // Fetch marquee
  const { data: marqueeRes } = useSWR(`/app/marquee`, fetcher);
  const marquee = marqueeRes?.data || "";

  return (
    <div
      style={{
        backgroundColor: marquee.bgColor,
        color: marquee.color,
      }}
      className="overflow-hidden whitespace-nowrap cursor-pointer select-none"
    >
      <div className="text-center py-2">{marquee.text}</div>
    </div>
  );
};

export default MarqueeCom;
