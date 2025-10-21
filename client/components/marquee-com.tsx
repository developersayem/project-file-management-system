"use client";

import { fetcher } from "@/app/lib/fetcher";
import React, { useState } from "react";
import useSWR from "swr";

const MarqueeCom = () => {
  const [paused, setPaused] = useState(false);

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
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`inline-block py-2 text-lg font-semibold animate-marquee ${
          paused ? "paused" : ""
        }`}
      >
        {marquee.text}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(300%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .paused {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default MarqueeCom;
