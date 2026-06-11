"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { copy } from "@/content/copy";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
const CHAR_SRC = "/assets/videos/char-cta.mp4";

// Standard arrow cursor shape at 3× (48 px). Hotspot = tip at 3,3.
const BIG_CURSOR =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M 3 3 L 3 36 L 12 27 L 21 42 L 27 39 L 15 21 L 24 21 Z' fill='black' stroke='white' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E\") 3 3, auto";

export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);

  // ── Sample the video's corner pixel → match section bg ──
  useEffect(() => {
    const video = vidRef.current;
    const section = ref.current;
    if (!video || !section) return;
    const sample = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 4;
        canvas.height = 4;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, 4, 4);
        const d = ctx.getImageData(0, 0, 1, 1).data;
        const colour = `rgb(${d[0]},${d[1]},${d[2]})`;
        section.style.backgroundColor = colour;
        section.style.setProperty("--bg", colour);
      } catch {
        section.style.backgroundColor = "#f0f0f0";
        section.style.setProperty("--bg", "#f0f0f0");
      }
    };
    if (video.readyState >= 2) sample();
    else video.addEventListener("loadeddata", sample, { once: true });
  }, []);

  // ── Desktop: scrub video with mouse X delta ──
  useEffect(() => {
    const video = vidRef.current;
    if (!video) return;

    let prevX = -1;
    let targetTime = 0;
    let seeking = false;

    const onSeeked = () => {
      seeking = false;
      if (!video.duration) return;
      if (Math.abs(targetTime - video.currentTime) > 0.01) {
        seeking = true;
        video.currentTime = targetTime;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      if (!video.duration) return;
      if (prevX === -1) { prevX = e.clientX; return; }

      const delta = e.clientX - prevX;
      prevX = e.clientX;

      targetTime += (delta / window.innerWidth) * 1.0 * video.duration;
      targetTime = Math.max(0, Math.min(video.duration, targetTime));

      if (!seeking) {
        seeking = true;
        video.currentTime = targetTime;
      }
    };

    video.addEventListener("seeked", onSeeked);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // ── Mobile: autoplay ──
  useEffect(() => {
    const video = vidRef.current;
    if (!video || window.innerWidth >= 1024) return;
    video.autoplay = true;
    video.play().catch(() => {});
  }, []);

  return (
    <section
      id="cta"
      ref={ref}
      className="relative overflow-hidden"
      style={{
        minHeight: "92vh",
        backgroundColor: "#f0f0f0",
        "--bg": "#f0f0f0",
        cursor: BIG_CURSOR,
      } as React.CSSProperties}
    >
      {/* Character — the section itself, full bleed */}
      <motion.video
        ref={vidRef}
        src={CHAR_SRC}
        crossOrigin="anonymous"
        muted
        playsInline
        preload="auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.1 }}
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none hidden lg:block"
        style={{ objectPosition: "60% top" }}
      />

      {/* Left gradient — keeps text legible as character turns into frame */}
      <div
        className="absolute inset-y-0 left-0 w-[55%] pointer-events-none hidden lg:block z-[1]"
        style={{
          background: "linear-gradient(to right, var(--bg) 45%, transparent 100%)",
        }}
      />

      {/* Text — overlaid left side, no max-w wrapper */}
      <div className="relative z-10 flex items-center min-h-[92vh] px-8 md:px-14 xl:px-20 py-24">
        <div className="max-w-[560px]">

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-4 mb-10"
          >
            <span className="w-8 h-px bg-[#C8371A] opacity-50" />
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#1A1612]/40">
              {copy.finalCta.overline}
            </p>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="text-[clamp(3rem,6vw,5.5rem)] font-black leading-[1.00] tracking-tight text-[#1A1612] mb-8"
          >
            {copy.finalCta.headlineLine1}
            <br />
            <span className="text-[#1A1612]/20">{copy.finalCta.headlineLine2}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base text-[#1A1612]/45 max-w-sm leading-relaxed mb-12"
          >
            {copy.finalCta.body}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            <motion.a
              href={`mailto:${copy.finalCta.email}`}
              className="group relative overflow-hidden inline-flex items-center px-10 py-5 rounded-full text-sm font-bold tracking-widest uppercase text-white whitespace-nowrap bg-[#1A1612]"
              whileHover={{ scale: 1.03, boxShadow: "0 10px 40px rgba(240,112,90,0.35)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.35, ease }}
            >
              <span
                className="absolute inset-0 bg-[#F0705A] -translate-x-full group-hover:translate-x-0 transition-transform duration-[560ms]"
                style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                aria-hidden
              />
              <span className="relative z-10">{copy.finalCta.primaryCta}</span>
            </motion.a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 text-xs text-[#1A1612]/30 tracking-wide"
          >
            {copy.finalCta.footnote}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
