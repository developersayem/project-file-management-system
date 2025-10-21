"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { toast } from "sonner";
import useSWR, { KeyedMutator } from "swr";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FolderType } from "@/data/folder";
import api from "@/app/lib/axios";
import { fetcher } from "@/app/lib/fetcher";
interface CreateFolderModalProps {
  mutateFolderData?: KeyedMutator<{ data: FolderType[] }>;
}

export function CreateFolderModal({
  mutateFolderData,
}: CreateFolderModalProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [parentFolder, setParentFolder] = React.useState("");

  // Fetch all folders
  const { data: foldersRes } = useSWR("/app/folders-with-leads", fetcher);
  const folders = React.useMemo(() => foldersRes?.data || [], [foldersRes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Folder name cannot be empty");

    try {
      const res = await api.post("/folders", { name, parentFolder }); // Make sure your API supports folder creation
      if (res.status === 201) {
        toast.success("Folder created successfully");
        await mutateFolderData?.();
        setName("");
        setOpen(false);
      }
      console.log(parentFolder);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create folder");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full">
          <FolderPlus className="w-4 h-4" /> Create a new folder
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-accent p-6">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Folder Name</Label>
            <Input
              placeholder="Enter folder name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Select onValueChange={(value) => setParentFolder(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Parent Folder" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {folders.map((folder: FolderType) => (
                  <SelectItem key={folder._id} value={folder._id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              <FolderPlus className="w-4 h-4 mr-2" /> Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
