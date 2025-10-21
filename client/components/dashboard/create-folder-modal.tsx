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
import { FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { KeyedMutator } from "swr";
// import api from "@/lib/axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FolderType } from "@/data/folder";
import api from "@/app/lib/axios";

interface CreateFolderModalProps {
  mutateFolderData?: KeyedMutator<{ data: FolderType[] }>;
}

export function CreateFolderModal({
  mutateFolderData,
}: CreateFolderModalProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Folder name cannot be empty");

    try {
      const res = await api.post("/folders", { name }); // Make sure your API supports folder creation
      if (res.status === 201) {
        toast.success("Folder created successfully");
        await mutateFolderData?.();
        setName("");
        setOpen(false);
      }
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
