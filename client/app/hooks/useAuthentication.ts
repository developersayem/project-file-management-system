"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/app/lib/fetcher";
import api from "@/app/lib/axios";

export const useAuthentication = () => {
  const { data: settingRes, mutate } = useSWR("/auth", fetcher);
  const settings = settingRes?.data || {};

  const [isAuthorized, setIsAuthorized] = useState(false);

  // Check airplane mode
  useEffect(() => {
    if (settings.isAirplaneModeEnabled) {
      window.location.href = "https://www.google.com";
    }
  }, [settings.isAirplaneModeEnabled]);

  const checkPassword = async (password: string) => {
    try {
      const res = await api.post("/auth/check-password", { password });
      if (res.data.data.isMatch) {
        setIsAuthorized(true);
        return true;
      } else {
        setIsAuthorized(false);
        return false;
      }
    } catch (err) {
      console.error("Failed to check password", err);
      return false;
    }
  };

  return { settings, isAuthorized, checkPassword, mutate };
};
