"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import useSWR from "swr";
import { fetcher } from "@/app/lib/fetcher";
import api from "@/app/lib/axios";
import { toast } from "sonner";

export default function AuthenticationModal() {
  const [open, setOpen] = useState(false);

  // Fetch old setting
  const { data: settingRes, mutate: mutateSettings } = useSWR("/auth", fetcher);
  const settingData = React.useMemo(() => settingRes?.data || {}, [settingRes]);

  const [password, setPassword] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [airplaneMode, setAirplaneMode] = useState(false);

  // Set initial values when modal opens
  useEffect(() => {
    if (settingData) {
      setPassword(settingData.password || "");
      setEnabled(settingData.isEnabled || false);
      setAirplaneMode(settingData.isAirplaneModeEnabled || false);
    }
  }, [settingData, open]);

  const handleToggle = () => setEnabled(!enabled);
  const handleToggleAirplaneMode = () => setAirplaneMode(!airplaneMode);

  const handleSubmit = async () => {
    try {
      const res = await api.post("/auth", {
        password,
        isEnabled: enabled,
        isAirplaneModeEnabled: airplaneMode,
      });
      if (res.status === 200) {
        await mutateSettings?.();
        toast.success("Settings updated successfully");
        setOpen(false); // Close modal after successful submit
      }
    } catch (error) {
      toast.error("Failed to update Settings");
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Password</DialogTitle>
          <DialogDescription>
            Set your password and toggle the switches.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <Label htmlFor="switch">Enable</Label>
                <Switch
                  id="switch"
                  checked={enabled}
                  onCheckedChange={handleToggle}
                />
              </div>
              <div className="flex gap-2 items-center">
                <Label htmlFor="airplane-mode">Airplane Mode</Label>
                <Switch
                  id="airplane-mode"
                  checked={airplaneMode}
                  onCheckedChange={handleToggleAirplaneMode}
                />
              </div>
            </div>

            <Input
              id="password"
              type="text"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button className="mt-4" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
