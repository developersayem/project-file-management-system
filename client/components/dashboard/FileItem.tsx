/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { FileItemType } from "@/data/folder";
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
    <div className="border border-gray-200 p-1 rounded shadow hover:shadow-md transition flex justify-between items-center text-black capitalize">
      <div className="flex items-center gap-2">
        {file.icon === "pdf" ? (
          <img src="/pdf.png" alt="" className="w-15 h-15" />
        ) : (
          <img src="/xls.png" alt="" className="w-15 h-15" />
        )}
        <div>
          <p>{file.name}</p>
          <div className="flex gap-2">
            <p className="text-sm text-gray-500">Leads: {file.numbers}</p>
            <p className="text-sm bg-blue-500 text-white rounded px-1">
              {file.price}
              <span className="pl-1"> {file.currency}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 pr-3">
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
