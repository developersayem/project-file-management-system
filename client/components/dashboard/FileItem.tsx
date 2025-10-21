"use client";

import React from "react";
import { FileItemType } from "@/data/folder";
import { FaFileExcel } from "react-icons/fa6";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { EditFileModal } from "./edit-file-modal";
import { KeyedMutator } from "swr";
import { toast } from "sonner";
import api from "@/app/lib/axios";

interface FileItemProps {
  file: FileItemType;
  mutateFilesData?: KeyedMutator<{ data: FileItemType[] }>;
}

export default function FileItem({ file, mutateFilesData }: FileItemProps) {
  const handleDeleteFile = async (fileId: string) => {
    if (!fileId && fileId === undefined) return toast.error("File not found");
    try {
      const res = await api.delete(`/files/${fileId}`); // Make sure your API supports folder creation
      if (res.status === 200) {
        toast.success("File Deleted successfully");
        await mutateFilesData?.();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete folder");
    }
  };

  return (
    <div className="border border-gray-200 p-4 rounded shadow hover:shadow-md transition flex justify-between items-center text-black capitalize">
      <div className="flex items-center gap-2">
        <FaFileExcel className="text-green-700 text-2xl" />
        <div>
          <p>{file.name}</p>
          <p className="text-sm text-gray-500">
            Number of Leads: {file.numbers}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <span className="px-1">{file.price}</span>
            {file.currency}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <EditFileModal file={file} mutateFilesData={mutateFilesData} />
        <Button
          variant="destructive"
          onClick={() => handleDeleteFile(file._id)}
        >
          <Trash />
        </Button>
      </div>
    </div>
  );
}
