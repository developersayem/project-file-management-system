"use client";
import React from "react";
import { FolderType } from "@/data/folder";
import { FaFolder } from "react-icons/fa6";

interface SidebarProps {
  folders: FolderType[];
  selectedFolder: string;
  setSelectedFolder: (folderId: string) => void;
}

export default function Sidebar({
  folders,
  selectedFolder,
  setSelectedFolder,
}: SidebarProps) {
  const handleSelect = (folder: FolderType) => {
    setSelectedFolder(folder._id);
  };

  return (
    <aside className="w-full lg:w-1/5 min-w-[220px] bg-gray-100 border-r border-gray-200 flex flex-col overflow-hidden text-black pl-5 capitalize">
      {/* ✅ Sticky header */}
      <div className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold pt-4">Leads Directory</h1>
        <h2 className="text-xl font-bold text-gray-500">Categories</h2>
      </div>

      {/* ✅ Scrollable folder list */}
      <ul className="space-y-2 mt-4 overflow-y-auto flex-1 pr-2">
        {folders.map((folder) => (
          <li
            key={folder._id}
            onClick={() => handleSelect(folder)}
            className={`
              cursor-pointer rounded py-5 px-5 shadow-md transition-all
              hover:bg-gray-50
              ${
                selectedFolder === folder._id
                  ? "border-2 border-blue-500 bg-white"
                  : "border border-transparent"
              }
            `}
          >
            <div className="capitalize">
              <div className="font-semibold flex items-center gap-1">
                <FaFolder className="text-yellow-400 text-5xl" />
                <div className="text-wrap">
                  <h1 className="text-wrap">{folder.name}</h1>
                  <p className="text-[12px] text-[#666] mt-1">
                    Leads ({folder.leads || "0"})
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
