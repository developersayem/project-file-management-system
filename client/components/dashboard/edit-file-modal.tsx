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
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { KeyedMutator } from "swr";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileItemType } from "@/data/folder";
import api from "@/app/lib/axios";

interface EditFileModalProps {
  file: FileItemType;
  mutateFilesData?: KeyedMutator<{ data: FileItemType[] }>;
}

export function EditFileModal({ file, mutateFilesData }: EditFileModalProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(file.name);
  const [price, setPrice] = React.useState(file.price);
  const [numbers, setNumbers] = React.useState(file.numbers);
  const [currency, setCurrency] = React.useState(file.currency);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return toast.error("Name and price are required");

    try {
      const payload = { name, price, numbers, currency };
      const res = await api.put(`/files/${file._id}`, payload);

      if (res.status === 200) {
        toast.success("File updated successfully");
        await mutateFilesData?.();
        setOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update file");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg p-6">
        <DialogHeader>
          <DialogTitle>Edit File</DialogTitle>
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
              onChange={(e) => setPrice(parseInt(e.target.value))}
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
              <Pencil className="w-4 h-4 mr-2" /> Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
