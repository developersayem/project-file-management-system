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
import useSWR from "swr";
import { fetcher } from "@/app/lib/fetcher";

interface EditFileModalProps {
  file: FileItemType;
  mutateFilesData?: KeyedMutator<{ data: FileItemType[] }>;
}

export function EditFileModal({ file, mutateFilesData }: EditFileModalProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(file.name);
  const [numbers, setNumbers] = React.useState(file.numbers || 0);
  const [unitPriceInput, setUnitPriceInput] = React.useState<number | "">("");
  const [price, setPrice] = React.useState(file.price || 0);
  const [currency, setCurrency] = React.useState(file.currency || "BDT");
  const [manualPrice, setManualPrice] = React.useState(false);

  // Fetch default unit price
  const { data: unitPriceRes } = useSWR("/unit-price", fetcher);
  const unitPriceData = React.useMemo(
    () => unitPriceRes?.data || [],
    [unitPriceRes]
  );
  const defaultUnitPrice = unitPriceData[0]?.unitprice || 0;

  // Automatically calculate price
  React.useEffect(() => {
    const currentUnitPrice = unitPriceInput || defaultUnitPrice;
    if (!manualPrice && numbers > 0) {
      setPrice(numbers * currentUnitPrice);
    }
  }, [numbers, unitPriceInput, manualPrice, defaultUnitPrice]);

  const handleNumbersChange = (value: number) => setNumbers(value);
  const handleUnitPriceChange = (value: number) => setUnitPriceInput(value);
  const handlePriceChange = (value: number) => {
    setPrice(value);
    setManualPrice(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price)
      return toast.error("Name, numbers, and price are required");

    const payload = {
      name,
      numbers,
      price,
      currency,
      unitPrice: unitPriceInput || defaultUnitPrice,
    };

    try {
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
            <Label>Numbers</Label>
            <Input
              type="number"
              placeholder="Enter Leads numbers"
              value={numbers}
              onChange={(e) => handleNumbersChange(parseInt(e.target.value))}
              required
            />
          </div>

          <div className="flex gap-2 items-start">
            <div className="w-full space-y-1">
              <Label>Unit Price</Label>
              <Input
                type="number"
                placeholder={`Default: ${defaultUnitPrice}`}
                value={unitPriceInput}
                onChange={(e) =>
                  handleUnitPriceChange(parseFloat(e.target.value))
                }
              />
            </div>

            <div className="w-full space-y-1">
              <Label>Price</Label>
              <Input
                type="number"
                placeholder="Calculated or manual"
                value={price}
                onChange={(e) => handlePriceChange(parseFloat(e.target.value))}
                required
              />
            </div>
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
