"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import Cart from "@/components/Cart";
import FolderHeader from "@/components/FolderHeader";
import FileItem from "@/components/FileItem";
import { FileItemType } from "@/data/folder";
import useSWR from "swr";
import { fetcher } from "./lib/fetcher";
import MarqueeCom from "@/components/marquee-com";
import PasswordGate from "@/components/PasswordGate";

function Content() {
  // Fetch all folders
  const { data: foldersRes } = useSWR("/app/folders-with-subfolders", fetcher);
  const folders = useMemo(() => foldersRes?.data || [], [foldersRes]);

  // State for selected folder
  const [selectedFolder, setSelectedFolder] = useState<string>("");

  // Automatically select first folder when folders load
  useEffect(() => {
    if (folders.length > 0 && !selectedFolder) {
      setSelectedFolder(folders[0]._id || folders[0].id);
    }
  }, [folders, selectedFolder]);

  // Fetch files for selected folder
  const { data: folderFilesRes } = useSWR(
    selectedFolder ? `/app/${selectedFolder}/files` : null,
    fetcher
  );

  const folderWithFiles = folderFilesRes?.data || { files: [] };

  // Normalize file IDs to _id
  folderWithFiles.files = folderWithFiles.files.map(
    (f: { _id?: string; id?: string }) => ({
      ...f,
      _id: f._id || f.id,
    })
  );

  return (
    <>
      <Sidebar
        folders={folders}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
      />
      <div className="flex-1 bg-white overflow-y-auto">
        {selectedFolder ? (
          <>
            <FolderHeader folder={folderWithFiles} />
            {folderWithFiles.files.length ? (
              <div className="grid grid-cols-1 gap-4 px-5 pb-5">
                {folderWithFiles.files.map((file: FileItemType) => (
                  <FileItem key={file._id} file={file} />
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center mt-20 text-lg">
                This folder is empty
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-500 text-center mt-20 text-lg">
            Please select a folder to view its contents
          </div>
        )}
      </div>
      <Cart />
    </>
  );
}

export default function Page() {
  return (
    <PasswordGate>
      <div className="md:h-[calc(100vh-40px)]  flex flex-col lg:flex-row overflow-hidden">
        <Content />
      </div>
      <MarqueeCom />
    </PasswordGate>
  );
}
