"use client";

import React from "react";
import { FolderType } from "@/data/folder";

interface FolderHeaderProps {
  folder: FolderType;
}

export default function FolderHeader({ folder }: FolderHeaderProps) {
  return (
    <div className="mb-6 border-b border-gray-200 p-4 text-black sticky top-0 z-10 bg-white capitalize">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">{folder.name}</h2>
        </div>
      </div>
      {folder.leads && (
        <p className="text-gray-600 text-sm mt-1">
          Leads: {folder.leads.toLocaleString()}
        </p>
      )}
    </div>
  );
}
