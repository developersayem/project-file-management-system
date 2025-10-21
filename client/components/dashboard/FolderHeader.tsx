"use client";

import React from "react";
import { FileItemType, FolderType } from "@/data/folder";
import { CreateFileModal } from "./add-file-modal";
import { KeyedMutator } from "swr";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import api from "@/app/lib/axios";
import { EditFolderModal } from "./edit-folder-modal";
import { EditMarqueeModal } from "./edit-marquee-modal";
import { UnitPriceModal } from "./unit-price-modal";

interface FolderHeaderProps {
  folder: FolderType;
  setSelectedFolder: (folderId: string) => void;
  mutateFolderData?: KeyedMutator<{ data: FolderType[] }>;
  mutateFilesData?: KeyedMutator<{ data: FileItemType[] }>;
}

export default function FolderHeader({
  folder,
  setSelectedFolder,
  mutateFolderData,
  mutateFilesData,
}: FolderHeaderProps) {
  const handleDeleteFolder = async (folderId: string) => {
    if (!folderId && folderId === undefined)
      return toast.error("Folder not found");
    try {
      const res = await api.delete(`/folders/${folderId}`); // Make sure your API supports folder creation
      if (res.status === 200) {
        toast.success("Folder Deleted successfully");
        await mutateFolderData?.();
        setSelectedFolder("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete folder");
    }
  };

  return (
    <div className="mb-6 border-b border-gray-200 p-4 text-black sticky top-0 z-10 bg-white capitalize">
      <div className="flex items-center justify-between mb-2">
        <div className="w-full flex justify-between items-center gap-2">
          <h2 className="text-2xl font-semibold">{folder.name}</h2>
          {/* actions buttons */}
          <div className="flex items-center gap-2 z-50">
            <UnitPriceModal />
            <EditMarqueeModal />
            <div className="flex items-center gap-2">
              <CreateFileModal
                folderId={folder._id}
                mutateFilesData={mutateFilesData}
              />
            </div>

            <EditFolderModal
              folder={folder}
              mutateFolderData={mutateFolderData}
            />
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDeleteFolder(folder._id as string)}
            >
              <Trash /> Delete this folder
            </Button>
          </div>
        </div>
      </div>
      <p className="text-gray-600 text-sm mt-1">{folder.leads} Leads</p>
    </div>
  );
}
