"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { copy } from "@/content/copy";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const { stats, merch: merchCopy, mockups: mockupsCopy, film, brief, hero: heroText, cta } = copy.beverleyKnight;

const merch = [
  { src: "merch-1.jpg", label: merchCopy.items[0].label, aspect: "1/1" },
  { src: "merch-2.jpg", label: merchCopy.items[1].label, aspect: "1/1" },
  { src: "merch-3.jpg", label: merchCopy.items[2].label, aspect: "1/1" },
  { src: "merch-4.jpg", label: merchCopy.items[3].label, aspect: "1/1" },
];

const mockups = [
  { src: "mockup-1.jpg", design: mockupsCopy.items[0].design },
  { src: "mockup-2.jpg", design: mockupsCopy.items[1].design },
  { src: "mockup-3.jpg", design: mockupsCopy.items[2].design },
  { src: "mockup-4.jpg", design: mockupsCopy.items[3].design },
];

function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => { ref.current?.play().catch(() => {}); }, []);
  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      autoPlay
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source src="/assets/case-studies/beverley-knight/hero-loop.mp4" type="video/mp4" />
    </video>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}

function FilmVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const manuallyPaused = useRef(false);
  const scrubbing = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !manuallyPaused.current) {
          el.play().then(() => setPlaying(true)).catch(() => {});
        } else if (!e.isIntersecting) {
          el.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTime = () => setCurrentTime(el.currentTime);
    const onMeta = () => setDuration(el.duration);
    const onEnded = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = muted;
  }, [muted]);

  const toggle = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      manuallyPaused.current = false;
      el.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      manuallyPaused.current = true;
      el.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = useCallback((e: { stopPropagation(): void }) => {
    e.stopPropagation();
    setMuted(m => !m);
  }, []);

  const seekTo = useCallback((e: React.PointerEvent) => {
    const track = trackRef.current;
    const el = ref.current;
    if (!track || !el || !el.duration) return;
    const r = track.getBoundingClientRect();
    el.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * el.duration;
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    scrubbing.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    seekTo(e);
  }, [seekTo]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (scrubbing.current) seekTo(e);
  }, [seekTo]);

  const onPointerUp = useCallback(() => { scrubbing.current = false; }, []);

  const enterFullscreen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    containerRef.current?.requestFullscreen?.();
  }, []);

  const pct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black group cursor-pointer" onClick={toggle}>
      <video ref={ref} playsInline className="w-full h-full object-contain">
        <source src="/assets/case-studies/beverley-knight/film.mp4" type="video/mp4" />
      </video>

      {/* Centre play/pause hit area */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}>
        <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center">
          {playing
            ? <svg width="18" height="18" viewBox="0 0 18 18" fill="white"><rect x="3" y="2" width="4" height="14" rx="1" /><rect x="11" y="2" width="4" height="14" rx="1" /></svg>
            : <svg width="18" height="18" viewBox="0 0 18 18" fill="white"><path d="M4 2.5L15 9L4 15.5V2.5Z" /></svg>}
        </div>
      </div>

      {/* Bottom control bar */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-10 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          {/* Play/pause */}
          <button onClick={toggle} className="flex-shrink-0 text-white/80 hover:text-white transition-colors">
            {playing
              ? <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="1" width="4" height="14" rx="1" /><rect x="10" y="1" width="4" height="14" rx="1" /></svg>
              : <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3 1.5L14 8L3 14.5V1.5Z" /></svg>}
          </button>

          {/* Scrub track */}
          <div
            ref={trackRef}
            className="relative flex-1 h-1 bg-white/20 rounded-full cursor-pointer group/track"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <div className="absolute inset-y-0 left-0 bg-white rounded-full" style={{ width: `${pct}%` }} />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow -translate-x-1/2 opacity-0 group-hover/track:opacity-100 transition-opacity"
              style={{ left: `${pct}%` }}
            />
          </div>

          {/* Time */}
          <span className="flex-shrink-0 text-[11px] text-white/55 tabular-nums">
            {fmt(currentTime)}{duration ? ` / ${fmt(duration)}` : ""}
          </span>

          {/* Mute */}
          <button onClick={toggleMute} className="flex-shrink-0 text-white/60 hover:text-white transition-colors">
            {muted ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 5.5v5h3l4 3V2.5L4 5.5H1z"/>
                <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M10.5 5.5l4 5M14.5 5.5l-4 5"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 5.5v5h3l4 3V2.5L4 5.5H1z"/>
                <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M10 5.5a3.5 3.5 0 0 1 0 5M11.5 3.5a6 6 0 0 1 0 9"/>
              </svg>
            )}
          </button>

          {/* Fullscreen */}
          <button onClick={enterFullscreen} className="flex-shrink-0 text-white/60 hover:text-white transition-colors">
            {isFullscreen
              ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 1H1v4M9 1h4v4M5 13H1v-4M9 13h4v-4" /></svg>
              : <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" /></svg>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BeverleyKnightCaseStudy() {
  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative h-[100svh] overflow-hidden">
        <HeroVideo />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/85" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3, ease }}
          className="absolute bottom-0 left-0 right-0 px-6 md:px-14 pb-14 md:pb-20"
        >
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/45 mb-4 font-semibold">
            {heroText.overline}
          </p>
          <h1 className="text-[clamp(3rem,9vw,7.5rem)] font-black leading-[0.85] text-white tracking-tighter">
            {heroText.headline}
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/55 max-w-lg leading-relaxed">
            {heroText.subtitle}
          </p>
        </motion.div>
      </section>

      {/* ── Brief + Stats ── */}
      <section className="py-20 md:py-32 px-6 border-b border-white/6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-6 font-semibold">
              {brief.overline}
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-white/65 max-w-lg">
              {brief.body}
            </p>
          </motion.div>

          <motion.div
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-x-8 gap-y-10"
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={fadeUp}>
                <p className="text-[clamp(2.5rem,5vw,3.5rem)] font-black leading-none text-white mb-2">{s.value}</p>
                <p className="text-[10px] tracking-[0.22em] uppercase text-white/35 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 01 The Designs ── */}
      <section className="py-20 md:py-28 border-b border-white/6">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-4 font-semibold">
              {merchCopy.overline}
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-white max-w-2xl">
              {merchCopy.headline}
            </h2>
          </motion.div>
        </div>

        {/* Design grid — white-bg cards to honour the artwork */}
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "3px" }}>
          {merch.map((item, i) => (
            <motion.div
              key={item.src}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-white flex items-center justify-center p-6 md:p-10"
              style={{ aspectRatio: item.aspect }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={`/assets/case-studies/beverley-knight/${item.src}`}
                  alt={item.label}
                  fill
                  className={item.src === "merch-1.jpg" ? "object-cover object-top" : "object-contain"}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-10">
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-sm text-white/40 max-w-xl leading-relaxed"
          >
            {merchCopy.body}
          </motion.p>
        </div>
      </section>

      {/* ── 02 The Mockups ── */}
      <section className="py-20 md:py-28 border-b border-white/6">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-4 font-semibold">
              {mockupsCopy.overline}
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-white max-w-2xl">
              {mockupsCopy.headline}
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "3px" }}>
          {mockups.map((item, i) => (
            <motion.div
              key={item.src}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="relative overflow-hidden group"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src={`/assets/case-studies/beverley-knight/${item.src}`}
                alt={item.design}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="absolute bottom-3 left-3 text-[9px] tracking-[0.22em] uppercase text-white/75 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.design}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-10">
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-sm text-white/40 max-w-xl leading-relaxed"
          >
            {mockupsCopy.body}
          </motion.p>
        </div>
      </section>

      {/* ── 03 The Film ── */}
      <section className="border-b border-white/6 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-stretch">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex-1 min-w-0 flex flex-col justify-center px-8 md:px-14 lg:px-20 py-16 md:py-24 order-2 md:order-1"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-5 font-semibold">
              {film.overline}
            </p>
            <h2 className="text-[clamp(2rem,3.5vw,3.2rem)] font-black leading-tight text-white mb-8">
              {film.headline}
            </h2>
            <p className="text-base text-white/55 leading-relaxed mb-10 max-w-sm">
              {film.body}
            </p>
            <div className="flex flex-col gap-5 border-t border-white/8 pt-8">
              {film.specs.map((item) => (
                <div key={item.label} className="flex items-baseline gap-6">
                  <span className="text-[10px] tracking-[0.22em] uppercase text-white/30 font-semibold w-16 flex-shrink-0">
                    {item.label}
                  </span>
                  <span className="text-sm text-white/60">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="w-full aspect-video md:h-[70vh] md:w-auto md:flex-shrink-0 order-1 md:order-2">
            <FilmVideo />
          </div>

        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 md:py-36 px-6 border-t border-white/6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-6 font-semibold">
              {cta.overline}
            </p>
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-tight text-white mb-10">
              {cta.headline}
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#cta"
                className="inline-flex px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-white text-black hover:bg-white/90 transition-colors duration-300"
              >
                {cta.primaryButton}
              </Link>
              <Link
                href="/case-studies/charles-keith"
                className="inline-flex px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase border border-white/20 text-white/55 hover:border-white/35 hover:text-white/80 transition-all duration-300"
              >
                {cta.secondaryButton}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
