"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

const SCRUB_DURATION = 11.5;
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const v = videoRef.current;
      if (!v) return;
      const target = Math.min(p * SCRUB_DURATION, SCRUB_DURATION);
      if (Math.abs(v.currentTime - target) > 0.016) v.currentTime = target;
    });
  });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const videoX = useTransform(
    scrollYProgress,
    [0, 0.14, 0.28, 0.50, 0.58, 0.76, 0.88, 1],
    ["0vw", "0vw", "-22vw", "-22vw", "0vw", "22vw", "22vw", "0vw"]
  );
  const videoScale = useTransform(scrollYProgress, [0, 0.07, 0.88, 1], [0.9, 1, 1, 0.96]);
  const videoOpacity = useTransform(scrollYProgress, [0.92, 1], [1, 0]);

  const introOpacity = useTransform(scrollYProgress, [0.0, 0.16], [1, 0]);
  const introY = useTransform(scrollYProgress, [0.0, 0.16], [0, -40]);

  const rightOpacity = useTransform(scrollYProgress, [0.24, 0.35, 0.48, 0.58], [0, 1, 1, 0]);
  const rightX = useTransform(scrollYProgress, [0.24, 0.35, 0.48, 0.58], ["28px", "0px", "0px", "28px"]);

  const leftOpacity = useTransform(scrollYProgress, [0.62, 0.72, 0.84, 0.92], [0, 1, 1, 0]);
  const leftX = useTransform(scrollYProgress, [0.62, 0.72, 0.84, 0.92], ["-28px", "0px", "0px", "-28px"]);

  const ctaOpacity = useTransform(scrollYProgress, [0.9, 0.97], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.9, 0.97], [24, 0]);

  const dot0 = useTransform(scrollYProgress, [0.01, 0.09, 0.17], [0.15, 1, 0.15]);
  const dot1 = useTransform(scrollYProgress, [0.30, 0.38, 0.46], [0.15, 1, 0.15]);
  const dot2 = useTransform(scrollYProgress, [0.63, 0.71, 0.79], [0.15, 1, 0.15]);
  const dot3 = useTransform(scrollYProgress, [0.86, 0.94, 1.00], [0.15, 1, 0.15]);
  const dotOpacities = [dot0, dot1, dot2, dot3];

  return (
    <>
    {/* ─── MOBILE HERO ───────────────────────────────────────────────── */}
    <section className="md:hidden relative min-h-[100svh] bg-[#F7F6F2] flex flex-col items-center justify-center px-6 text-center overflow-hidden pt-20 pb-16">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.3, ease }}
        className="text-[clamp(4rem,16vw,5.5rem)] font-black leading-[0.88] tracking-tighter"
      >
        <span className="block text-[#0A0A0A]">Brief in.</span>
        <span className="block text-black/10">Campaign out.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="mt-8 text-sm text-black/35 max-w-xs leading-relaxed"
      >
        We take your product and build the visual world around it — at machine speed.
      </motion.p>

      <motion.a
        href="#portfolio"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1, ease }}
        className="mt-10 inline-flex px-9 py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-[#0A0A0A] text-white"
      >
        See the work
      </motion.a>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-black/20"
      >
        <span className="text-[9px] tracking-[0.4em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-px h-7 bg-gradient-to-b from-black/20 to-transparent"
        />
      </motion.div>
    </section>

    {/* ─── DESKTOP SCROLL-SCRUB HERO ─────────────────────────────────── */}
    <div ref={containerRef} style={{ height: "400vh" }} className="relative hidden md:block">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#F7F6F2] flex items-center justify-center">

        {/* BACKDROP HEADLINE — giant type behind the video */}
        <motion.div
          style={{ opacity: introOpacity }}
          className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none select-none"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.3, ease }}
            className="text-[clamp(4.5rem,13vw,12rem)] font-black leading-[0.88] tracking-tighter text-center px-4"
          >
            <span className="block text-[#0A0A0A]">Brief in.</span>
            <span className="block text-black/10">Campaign out.</span>
          </motion.h1>
        </motion.div>

        {/* VIDEO — mix-blend-mode: multiply knocks out the white bg */}
        <motion.div
          style={{ x: videoX, scale: videoScale, opacity: videoOpacity, mixBlendMode: "multiply" }}
          className="relative z-10 flex-shrink-0 flex items-center justify-center"
        >
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            className="h-[78vh] w-auto object-contain block"
          >
            <source src="/assets/videos/hero-morph.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* INTRO SUBTITLE + SCROLL — phase 0, positioned at bottom */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-20 z-20 pointer-events-none"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-sm text-black/35 max-w-xs leading-relaxed text-center mb-10"
          >
            We take your product and build the visual world around it — at machine speed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col items-center gap-2 text-black/20"
          >
            <span className="text-[9px] tracking-[0.4em] uppercase">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="w-px h-7 bg-gradient-to-b from-black/20 to-transparent"
            />
          </motion.div>
        </motion.div>

        {/* RIGHT PANEL — phase 1: Speed */}
        <motion.div
          style={{ opacity: rightOpacity, x: rightX }}
          className="absolute right-[3vw] top-1/2 -translate-y-1/2 w-[26vw] max-w-[360px] z-20 pointer-events-none"
        >
          <p className="text-[10px] tracking-[0.28em] uppercase text-black/25 mb-4 font-semibold">
            Speed
          </p>
          <h2 className="text-[clamp(2rem,3.2vw,3rem)] font-black text-[#0A0A0A] leading-[1.0] mb-5">
            Weeks of production. Days of delivery.
          </h2>
          <p className="text-sm text-black/40 leading-relaxed font-light">
            Traditional shoots take weeks to brief, cast, produce, and retouch.
            We collapse that timeline — without compromising on creative quality.
          </p>
          <div className="mt-7 w-12 h-px bg-black/25" />
        </motion.div>

        {/* LEFT PANEL — phase 2: Variations */}
        <motion.div
          style={{ opacity: leftOpacity, x: leftX }}
          className="absolute left-[3vw] top-1/2 -translate-y-1/2 w-[26vw] max-w-[360px] z-20 pointer-events-none"
        >
          <p className="text-[10px] tracking-[0.28em] uppercase text-black/25 mb-4 font-semibold">
            Variations
          </p>
          <h2 className="text-[clamp(2rem,3.2vw,3rem)] font-black text-[#0A0A0A] leading-[1.0] mb-5">
            One brief.
            <br />
            Infinite cuts.
          </h2>
          <p className="text-sm text-black/40 leading-relaxed font-light">
            12 social formats, 3 hero banners, a short-form video. One brief covers
            all of it. We deliver the full suite.
          </p>
          <div className="mt-7 w-12 h-px bg-black/25" />
        </motion.div>

        {/* OUTRO CTA */}
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="absolute bottom-14 left-0 right-0 flex flex-col items-center z-20 pointer-events-none"
        >
          <p className="text-[11px] text-black/25 mb-5 tracking-[0.15em] uppercase">
            Ready to produce?
          </p>
          <a
            href="#cta"
            className="pointer-events-auto inline-flex px-9 py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-[#0A0A0A] text-white hover:bg-black/85 transition-colors"
          >
            Start a project
          </a>
        </motion.div>

        {/* SCROLL PROGRESS */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
          <div className="w-28 h-px bg-black/8 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-y-0 left-0 bg-black/30 rounded-full"
              style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
            />
          </div>
          <span className="text-[9px] tracking-[0.28em] uppercase text-black/18">
            Explore
          </span>
        </div>

        {/* Top vignette — keeps navbar readable */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#F7F6F2] to-transparent pointer-events-none z-30" />

        {/* Chapter dots */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
          {dotOpacities.map((op, i) => (
            <motion.div
              key={i}
              style={{ opacity: op }}
              className="w-1 h-1 rounded-full bg-black"
            />
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
