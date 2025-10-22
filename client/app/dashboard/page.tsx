"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import FolderHeader from "@/components/dashboard/FolderHeader";
import FileItem from "@/components/dashboard/FileItem";
import { FileItemType } from "@/data/folder";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import LoginModal from "@/components/dashboard/LoginModal";

function Content() {
  // Fetch all folders
  const { data: foldersRes, mutate: mutateFolderData } = useSWR(
    "/app/folders-with-subfolders",
    fetcher
  );
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
  const { data: folderFilesRes, mutate: mutateFilesData } = useSWR(
    selectedFolder ? `/app/${selectedFolder}/files` : null,
    fetcher
  );

  const folderWithFiles = folderFilesRes?.data || { files: [] };

  console.log(folderWithFiles);

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
        mutateFolderData={mutateFolderData}
      />
      <main className="flex-1 bg-white overflow-y-auto">
        {selectedFolder ? (
          <>
            <FolderHeader
              folder={folderWithFiles}
              mutateFolderData={mutateFolderData}
              mutateFilesData={mutateFilesData}
              setSelectedFolder={setSelectedFolder}
            />
            {folderWithFiles.files.length ? (
              <div className="grid grid-cols-1 gap-4 px-5 pb-5">
                {folderWithFiles.files.map((file: FileItemType) => (
                  <FileItem
                    key={file._id}
                    file={file}
                    mutateFilesData={mutateFilesData}
                  />
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
      </main>
    </>
  );
}

export default function Page() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setAuthenticated(loggedIn);
  }, []);

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {authenticated ? (
        <Content />
      ) : (
        <LoginModal onLogin={handleLoginSuccess} />
      )}
    </div>
  );
}
