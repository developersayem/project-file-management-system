"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginModal({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const correctUsername = "admin.leadsko";
  const correctPassword = "LeadsKo@2025";

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      if (username === correctUsername && password === correctPassword) {
        localStorage.setItem("adminLoggedIn", "true");
        toast.success("Login successful!");
        onLogin();
      } else {
        toast.error("Invalid credentials!");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <Dialog open>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Admin Login</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-3 mt-2">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button disabled={loading} onClick={handleLogin}>
            {loading ? "Verifying..." : "Login"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
