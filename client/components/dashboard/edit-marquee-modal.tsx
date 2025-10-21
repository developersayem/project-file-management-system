"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import api from "@/app/lib/axios";
import useSWR from "swr";
import { fetcher } from "@/app/lib/fetcher";

// interface IMarquee {
//   _id: string;
//   text: string;
//   bgColor: string;
//   color: string;
// }

export function EditMarqueeModal() {
  // Fetch marquee
  const { data: marqueeRes } = useSWR(`/app/marquee`, fetcher);
  const marquee = marqueeRes?.data || "";

  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState(marquee.text);
  const [bgColor, setBgColor] = React.useState(marquee.bgColor);
  const [color, setColor] = React.useState(marquee.color);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return toast.error("Text is required");

    try {
      setLoading(true);
      const payload = { text, bgColor, color };
      const res = await api.put(`/app/marquee/${marquee._id}`, payload);

      if (res.status === 200) {
        toast.success("Marquee updated successfully");
        setOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update marquee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          <Pencil className="w-4 h-4 mr-2" />
          Edit Marquee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg p-6">
        <DialogHeader>
          <DialogTitle>Edit Marquee</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Text */}
          <div className="space-y-2">
            <Label>Marquee Text</Label>
            <Textarea
              className="min-h-[150px]"
              rows={45}
              placeholder="Enter marquee text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>

          {/* Background Color */}
          <div className="space-y-2">
            <Label>Background Color</Label>
            <Input
              type="text"
              placeholder="e.g. #ff0000"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              required
            />
          </div>

          {/* Text Color */}
          <div className="space-y-2">
            <Label>Text Color</Label>
            <Input
              type="text"
              placeholder="e.g. #ffffff "
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            />
          </div>

          {/* Preview */}
          <div
            className="rounded-md p-3 text-center font-semibold"
            style={{ backgroundColor: bgColor, color }}
          >
            {text || "Preview your marquee here"}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              <Pencil className="w-4 h-4 mr-2" />{" "}
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
