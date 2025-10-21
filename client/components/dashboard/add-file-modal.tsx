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
import useSWR, { KeyedMutator } from "swr";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileItemType } from "@/data/folder";
import api from "@/app/lib/axios";
import { fetcher } from "@/app/lib/fetcher";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [numbers, setNumbers] = React.useState<number>(0);
  const [unitPriceInput, setUnitPriceInput] = React.useState<number | "">("");
  const [price, setPrice] = React.useState<number | "">("");
  const [currency, setCurrency] = React.useState("BDT");
  const [manualPrice, setManualPrice] = React.useState(false);
  const [fileType, setFileType] = React.useState("xls"); // Default file type

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
      folder: folderId,
      numbers,
      price,
      currency,
      unitPrice: unitPriceInput || defaultUnitPrice,
      icon: fileType, // Send the selected file type
    };

    try {
      const res = await api.post("/files", payload);
      if (res.status === 201) {
        toast.success("File created successfully");
        await mutateFilesData?.();
        // Reset form
        setName("");
        setNumbers(0);
        setUnitPriceInput("");
        setPrice("");
        setCurrency("BDT");
        setManualPrice(false);
        setFileType("xls");
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
          <FilePlus className="w-4 h-4" /> Add a new file
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

          <div className="space-y-2 flex items-start gap-2">
            <div className="w-full space-y-1">
              <Label>Currency</Label>
              <Input
                placeholder="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label>File Type</Label>
              <Select
                value={fileType}
                onValueChange={(value) => setFileType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xls">XLS</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
