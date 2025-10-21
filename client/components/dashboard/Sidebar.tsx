"use client";
import React, { useState } from "react";
import { FolderType } from "@/data/folder";
import { FaFolder, FaFolderOpen } from "react-icons/fa6";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CreateFolderModal } from "./create-folder-modal";
import { KeyedMutator } from "swr";

interface SidebarProps {
  folders: FolderType[];
  selectedFolder: string;
  setSelectedFolder: (folderId: string) => void;
  mutateFolderData?: KeyedMutator<{ data: FolderType[] }>;
}

const FolderItem = ({
  folder,
  level = 0,
  selectedFolder,
  setSelectedFolder,
  isSubfolder = false,
}: {
  folder: FolderType;
  level?: number;
  selectedFolder: string;
  setSelectedFolder: (folderId: string) => void;
  isSubfolder?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const hasSubfolders =
    Array.isArray(folder.subfolders) && folder.subfolders.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFolder(folder._id);

    // Toggle only if folder has subfolders
    if (hasSubfolders) setOpen((prev) => !prev);
  };

  return (
    <li className="w-full">
      <div
        onClick={handleClick}
        className={`flex items-center justify-between py-2 px-3 rounded cursor-pointer transition-all 
          hover:bg-gray-50 
          ${
            selectedFolder === folder._id
              ? "border-2 border-blue-500 bg-white"
              : ""
          }`}
        style={{ marginLeft: `${level * 16}px` }}
      >
        <div className="flex items-center gap-2">
          {/* Folder icon */}
          {isSubfolder || open ? (
            <FaFolderOpen className="text-yellow-500 text-lg" />
          ) : (
            <FaFolder className="text-yellow-400 text-lg" />
          )}

          <div>
            <div className="font-semibold capitalize">{folder.name}</div>
            <div className="text-xs text-gray-500">
              Files ({folder.fileCount || 0}) • Leads ({folder.totalLeads || 0})
            </div>
          </div>
        </div>

        {/* Chevron only for folders with subfolders */}
        {hasSubfolders && (
          <div>
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        )}
      </div>

      {/* Subfolders */}
      {hasSubfolders && open && (
        <ul className="mt-1">
          {folder.subfolders?.map((sub) => (
            <FolderItem
              key={sub._id}
              folder={sub}
              level={level + 1}
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
              isSubfolder={true}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default function Sidebar({
  folders,
  selectedFolder,
  setSelectedFolder,
  mutateFolderData,
}: SidebarProps) {
  console.log(folders);
  return (
    <aside className="w-full lg:w-1/5 min-w-[250px] bg-gray-100 border-r border-gray-200 flex flex-col overflow-hidden text-black px-3">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-100 pb-3 border-b border-gray-200">
        <h1 className="text-2xl font-bold pt-4">Leads Directory</h1>
        <h2 className="text-xl font-bold text-gray-500">Categories</h2>
        <CreateFolderModal mutateFolderData={mutateFolderData} />
      </div>

      {/* Folder list */}
      <ul className="space-y-1 mt-4 overflow-y-auto flex-1 pr-2">
        {folders.map((folder) => (
          <FolderItem
            key={folder._id}
            folder={folder}
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
          />
        ))}
      </ul>
    </aside>
  );
}
