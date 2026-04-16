"use client";

import { useEffect } from "react";
import { fetchCurrentUser } from "../model/auth-api";
import { getAccessToken } from "../model/auth-sessions";

export function AuthBootstrap() {
  useEffect(() => {
    if (!getAccessToken()) {
      return;
    }

    void fetchCurrentUser().catch(() => undefined);
  }, []);

  return null;
}
