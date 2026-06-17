"use client";

import { useEffect } from "react";

const SCROLL_KEY = "home-scroll-y";
export const SLUG_KEY = "home-return-slug";

export default function HomeScrollRestore() {
  useEffect(() => {
    // Priority 1: back from a case-study tile — scroll to that card
    const slug = sessionStorage.getItem(SLUG_KEY);
    if (slug) {
      const el = document.querySelector<HTMLElement>(`[data-slug="${slug}"]`);
      if (el) el.scrollIntoView({ block: "center", behavior: "instant" });
      sessionStorage.removeItem(SLUG_KEY);
    } else {
      // Priority 2: restore raw scroll position for any other back navigation
      const saved = sessionStorage.getItem(SCROLL_KEY);
      if (saved) {
        window.scrollTo({ top: parseInt(saved), behavior: "instant" });
        sessionStorage.removeItem(SCROLL_KEY);
      }
    }

    // Keep the saved value current on every scroll so it's accurate whenever the user leaves
    const save = () => sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY)));
    window.addEventListener("scroll", save, { passive: true });

    // iOS requires a user gesture before programmatic video.play() is allowed.
    const unlock = () => window.dispatchEvent(new Event("videoUnlock"));
    window.addEventListener("touchstart", unlock, { once: true, passive: true });

    return () => {
      window.removeEventListener("scroll", save);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  return null;
}
