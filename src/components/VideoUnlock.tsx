"use client";
import { useEffect } from "react";

// On first mobile touch: fix React's iOS muted-attribute bug, dispatch a sync
// "videoUnlock" event (runs handlers in the same gesture context so play() is
// allowed for unmuted videos too), then play every video currently in view.
export default function VideoUnlock() {
  useEffect(() => {
    const unlock = () => {
      (window as Window & { __videoUnlocked?: boolean }).__videoUnlocked = true;

      // Propagate the muted *property* — React sometimes only sets the HTML
      // attribute, which iOS ignores when deciding autoplay eligibility.
      document.querySelectorAll<HTMLVideoElement>("video").forEach(v => {
        if (v.hasAttribute("muted")) v.muted = true;
      });

      // Dispatch synchronously so each component's handler runs inside the
      // same user-gesture call stack, letting iOS allow play() on unmuted video.
      window.dispatchEvent(new Event("videoUnlock"));

      // Also play any video that is already visible right now.
      document.querySelectorAll<HTMLVideoElement>("video").forEach(v => {
        const r = v.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          v.play().catch(() => {});
        }
      });
    };

    document.addEventListener("touchstart", unlock, {
      once: true,
      capture: true,
      passive: true,
    });
    return () => document.removeEventListener("touchstart", unlock, true);
  }, []);

  return null;
}
