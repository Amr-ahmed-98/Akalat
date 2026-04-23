"use client";

import { useEffect } from "react";
import { fetchCurrentUser } from "../model/auth-api";
import {
  getAccessToken,
  setAuthBootstrapStatus,
} from "../model/auth-sessions";

export function AuthBootstrap() {
  useEffect(() => {
    if (!getAccessToken()) {
      setAuthBootstrapStatus("ready");
      return;
    }

    setAuthBootstrapStatus("loading");
    void fetchCurrentUser()
      .catch(() => undefined)
      .finally(() => {
        setAuthBootstrapStatus("ready");
      });
  }, []);

  return null;
}
