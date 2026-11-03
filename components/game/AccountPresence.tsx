"use client";
import { useEffect } from "react";
import { accountRequest } from "@/lib/account-client";
export default function AccountPresence() {
  useEffect(() => {
    let loggedIn = false;
    let active = true;
    const beat = () => {
      if (loggedIn && document.visibilityState === "visible")
        void accountRequest("heartbeat", {}).catch(() => {});
    };
    const refresh = () =>
      void accountRequest("session")
        .then((session) => {
          if (active) {
            loggedIn = Boolean(session.user);
            beat();
          }
        })
        .catch(() => {});
    refresh();
    const timer = setInterval(beat, 30_000);
    window.addEventListener("qazaq-account-change", refresh);
    document.addEventListener("visibilitychange", beat);
    return () => {
      active = false;
      clearInterval(timer);
      window.removeEventListener("qazaq-account-change", refresh);
      document.removeEventListener("visibilitychange", beat);
    };
  }, []);
  return null;
}
