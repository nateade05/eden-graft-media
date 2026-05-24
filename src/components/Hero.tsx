"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vhRef = useRef(0);

  // Track viewport height for the manual progress calculation
  useEffect(() => {
    const update = () => { vhRef.current = window.innerHeight; };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  // Use raw window scrollY instead of target-ref tracking — avoids
  // measurement issues when the container starts hidden or SSR-painted.
  // Container is 650vh starting at page top → progress = scrollY / (6.5 × vh).
  const { scrollY } = useScroll();
  const scrollYProgress = useTransform(scrollY, (latest) => {
    const h = (vhRef.current || 800) * 6.5;
    return Math.max(0, Math.min(1, latest / h));
  });

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  // Mobile: draw video onto canvas so no native play-button overlay ever appears
  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const video = document.createElement("video");
    video.src = "/assets/videos/hero-morph.mp4";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.load();

    let raf = 0;
    let started = false;

    const drawLoop = () => {
      if (video.readyState >= 2) {
        if (canvas.width !== video.videoWidth && video.videoWidth > 0) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      raf = requestAnimationFrame(drawLoop);
    };

    const start = () => {
      if (started) return;
      video.play().then(() => { started = true; drawLoop(); }).catch(() => {});
    };

    start();
    document.addEventListener("touchstart", start, { once: true, passive: true });

    return () => {
      cancelAnimationFrame(raf);
      video.pause();
      document.removeEventListener("touchstart", start);
    };
  }, []);

  // 570vh container. Video LEADS text: settles into position, then text slides in.
  //
  // vh→progress: 100vh = 0.1754  |  Phases:
  //   0–103vh  (0–0.18):   Intro
  //   103–143vh (0.18–0.25): Intro fades + video races left  [simultaneous]
  //   143vh    (0.25):      Video settled at -22vw — Speed panel slides in
  //   143–263vh (0.25–0.46): Speed panel visible
  //   263–336vh (0.46–0.59): Speed fades + video sweeps left→right [continuous]
  //                          Variations fades in, complete at 0.59
  //   336vh    (0.59):      Video settled at +22vw — Variations fully visible
  //   336–428vh (0.59–0.75): Variations visible
  //   428–479vh (0.75–0.84): Variations fades + video races back to center + CTA
  //   479–570vh (0.84–1.0):  Buffer

  const videoX = useTransform(
    scrollYProgress,
    // continuous sweep: no center pause between left and right
    [0, 0.14, 0.20, 0.37, 0.47, 0.66, 0.74, 1],
    ["0vw", "0vw", "-22vw", "-22vw", "22vw", "22vw", "0vw", "0vw"]
  );
  const videoScale = useTransform(scrollYProgress, [0, 0.06, 0.88, 1], [0.9, 1, 1, 0.96]);
  const videoOpacity = useTransform(scrollYProgress, [0.90, 1], [1, 0]);

  // Intro fades in lockstep with video racing left
  const introOpacity = useTransform(scrollYProgress, [0.14, 0.20], [1, 0]);
  const introY = useTransform(scrollYProgress, [0.14, 0.20], [0, -40]);

  // Speed panel: fades out as soon as video starts sweeping right
  const rightOpacity = useTransform(scrollYProgress, [0.20, 0.26, 0.37, 0.42], [0, 1, 1, 0]);
  const rightX = useTransform(scrollYProgress, [0.20, 0.26, 0.37, 0.42], ["28px", "0px", "0px", "28px"]);

  // Variations panel: fades in during sweep, complete when video lands right; fades out when video races back
  const leftOpacity = useTransform(scrollYProgress, [0.42, 0.47, 0.64, 0.71], [0, 1, 1, 0]);
  const leftX = useTransform(scrollYProgress, [0.42, 0.47, 0.64, 0.71], ["-28px", "0px", "0px", "-28px"]);

  const ctaOpacity = useTransform(scrollYProgress, [0.71, 0.74], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.71, 0.74], [24, 0]);

  const dot0 = useTransform(scrollYProgress, [0.02, 0.09, 0.14], [0.15, 1, 0.15]);
  const dot1 = useTransform(scrollYProgress, [0.22, 0.27, 0.34], [0.15, 1, 0.15]);
  const dot2 = useTransform(scrollYProgress, [0.48, 0.53, 0.58], [0.15, 1, 0.15]);
  const dot3 = useTransform(scrollYProgress, [0.63, 0.68, 0.74], [0.15, 1, 0.15]);
  const dotOpacities = [dot0, dot1, dot2, dot3];

  return (
    <>
    {/* ─── MOBILE HERO ───────────────────────────────────────────────── */}
    <section className="md:hidden relative min-h-[100svh] bg-[#F7F6F2] flex flex-col items-center justify-center px-6 text-center overflow-hidden pt-20 pb-16">

      {/* Canvas — video drawn here via JS, no native play-button overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        style={{ mixBlendMode: "multiply" }}
      />

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.3, ease }}
        className="relative z-10 text-[clamp(4rem,16vw,5.5rem)] font-black leading-[0.88] tracking-tighter"
      >
        <span className="block text-[#0A0A0A]">Brief in.</span>
        <span className="block text-black/10">Campaign out.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="relative z-10 mt-8 text-sm text-black/35 max-w-xs leading-relaxed"
      >
        We take your product and build the visual world around it — at machine speed.
      </motion.p>

      <motion.a
        href="#portfolio"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1, ease }}
        className="relative z-10 mt-10 inline-flex px-9 py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-[#0A0A0A] text-white"
      >
        See the work
      </motion.a>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-10 z-10 flex flex-col items-center gap-2 text-black/20"
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
    <div ref={containerRef} style={{ height: "650vh" }} className="relative max-md:hidden">
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
            autoPlay
            loop
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
          className="absolute left-[62%] top-1/2 -translate-y-1/2 w-[26vw] max-w-[360px] z-20 pointer-events-none"
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
          className="absolute right-[62%] top-1/2 -translate-y-1/2 w-[26vw] max-w-[360px] z-20 pointer-events-none"
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
          className="absolute top-[85%] left-0 right-0 flex flex-col items-center z-20 pointer-events-none"
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
