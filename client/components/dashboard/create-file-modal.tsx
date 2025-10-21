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
import { FilePlus } from "lucide-react";
import { toast } from "sonner";
import { KeyedMutator } from "swr";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileItemType } from "@/data/folder";
import api from "@/app/lib/axios";

interface CreateFileModalProps {
  folderId: string;
  mutateFilesData?: KeyedMutator<{ data: FileItemType[] }>;
}

export function CreateFileModal({
  folderId,
  mutateFilesData,
}: CreateFileModalProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [numbers, setNumbers] = React.useState<number>();
  const [currency, setCurrency] = React.useState("BDT");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return toast.error("Name and price are required");

    try {
      const payload = {
        name,
        folder: folderId,
        price,
        numbers,
        currency,
      };

      const res = await api.post("/files", payload);

      if (res.status === 201) {
        toast.success("File created successfully");
        await mutateFilesData?.(); // Revalidate files list
        setName("");
        setPrice("");
        setNumbers(0);
        setCurrency("BDT");
        setOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create file");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full">
          <FilePlus className="w-4 h-4" />
          Add a new file
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg p-6">
        <DialogHeader>
          <DialogTitle>Add File</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>File Name</Label>
            <Input
              placeholder="Enter file name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Price</Label>
            <Input
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Numbers</Label>
            <Input
              type="number"
              placeholder="Enter Leads numbers"
              value={numbers}
              onChange={(e) => setNumbers(parseInt(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Currency</Label>
            <Input
              placeholder="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              <FilePlus className="w-4 h-4 mr-2" /> Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
