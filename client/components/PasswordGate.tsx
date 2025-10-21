"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthentication } from "@/app/hooks/useAuthentication";

export default function PasswordGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings, isAuthorized, checkPassword } = useAuthentication();
  const [passwordInput, setPasswordInput] = useState("");
  const [loading, setLoading] = useState(false);

  // If password protection is off, allow access directly
  if (!settings.isEnabled) return <>{children}</>;

  // If user already authorized, show content
  if (isAuthorized) return <>{children}</>;

  // Render password input form
  const handleSubmit = async () => {
    setLoading(true);
    const valid = await checkPassword(passwordInput);
    setLoading(false);

    if (!valid) {
      toast.error("Incorrect password");
      setPasswordInput("");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4 text-center">Enter Password</h2>
        <Input
          type="password"
          placeholder="Password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <Button
          className="w-full mt-4"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Checking..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
