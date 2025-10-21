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
import useSWR from "swr";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import api from "@/app/lib/axios";
import { fetcher } from "@/app/lib/fetcher";

export function UnitPriceModal() {
  const [open, setOpen] = React.useState(false);
  const [unitPriceInput, setUnitPriceInput] = React.useState<number | "">("");

  // Fetch default unit price
  const { data: unitPriceRes, mutate } = useSWR("/unit-price", fetcher);
  const unitPriceData = React.useMemo(
    () => unitPriceRes?.data || [],
    [unitPriceRes]
  );
  const defaultUnitPrice = unitPriceData[0]?.unitprice || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      unitprice: unitPriceInput || defaultUnitPrice,
    };

    try {
      const res = await api.post("/unit-price", payload);
      if (res.status === 201 || res.status === 200) {
        toast.success("Unit price updated successfully");
        await mutate?.(); // refresh SWR data
        setUnitPriceInput(""); // reset input
        setOpen(false); // close modal
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update unit price");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="">
          <FilePlus className="w-4 h-4" /> Update Unit Price
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg p-6">
        <DialogHeader>
          <DialogTitle>Update Unit Price</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full space-y-1">
            <Label>Unit Price</Label>
            <Input
              type="number"
              placeholder={`Default: ${defaultUnitPrice}`}
              value={unitPriceInput}
              onChange={(e) => setUnitPriceInput(parseFloat(e.target.value))}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              <FilePlus className="w-4 h-4 mr-2" /> Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
