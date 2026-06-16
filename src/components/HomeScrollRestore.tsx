"use client";

import { useEffect } from "react";

const KEY = "home-scroll-y";

export default function HomeScrollRestore() {
  useEffect(() => {
    // Restore saved position from a previous case-study visit
    const saved = sessionStorage.getItem(KEY);
    if (saved) {
      window.scrollTo({ top: parseInt(saved), behavior: "instant" });
      sessionStorage.removeItem(KEY);
    }

    // Keep the saved value current on every scroll so it's accurate whenever the user leaves
    const save = () => sessionStorage.setItem(KEY, String(Math.round(window.scrollY)));
    window.addEventListener("scroll", save, { passive: true });

    // iOS requires a user gesture before programmatic video.play() is allowed.
    // Dispatch "videoUnlock" on the first touch so every WallVideo can start playing.
    const unlock = () => window.dispatchEvent(new Event("videoUnlock"));
    window.addEventListener("touchstart", unlock, { once: true, passive: true });

    return () => {
      window.removeEventListener("scroll", save);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  return null;
}
