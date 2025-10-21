"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react"; // use any edit icon
import { toast } from "sonner";
import { KeyedMutator } from "swr";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FolderType } from "@/data/folder";
import api from "@/app/lib/axios";

interface EditFolderModalProps {
  folder: FolderType;
  mutateFolderData?: KeyedMutator<{ data: FolderType[] }>;
}

export function EditFolderModal({
  folder,
  mutateFolderData,
}: EditFolderModalProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(folder.name || "");

  // Update input when folder changes
  React.useEffect(() => {
    setName(folder.name || "");
  }, [folder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Folder name cannot be empty");

    try {
      const res = await api.patch(`/folders/${folder._id}`, { name });
      if (res.status === 200) {
        toast.success("Folder updated successfully");
        await mutateFolderData?.();
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update folder");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          <Edit3 className="w-4 h-4 mr-2" /> Edit this folder
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-accent p-6">
        <DialogHeader>
          <DialogTitle>Edit Folder</DialogTitle>
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

          <div className="flex justify-end">
            <Button type="submit">
              <Edit3 className="w-4 h-4 mr-2" /> Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
