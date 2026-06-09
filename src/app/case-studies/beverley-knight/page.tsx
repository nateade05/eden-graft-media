"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const stats = [
  { value: "4",    label: "Merch designs" },
  { value: "1",    label: "Music video" },
  { value: "0",    label: "Shoot days" },
];

const merch = [
  { src: "merch-1.jpg", label: "Portrait", aspect: "1/1" },
  { src: "merch-2.jpg", label: "Everything's Gonna Be Alright", aspect: "1/1" },
  { src: "merch-3.jpg", label: "Come As You Are", aspect: "1/1" },
  { src: "merch-4.jpg", label: "Shoulda Woulda Coulda", aspect: "1/1" },
];

const mockups = [
  { src: "mockup-1.jpg", design: "Portrait tee — black" },
  { src: "mockup-2.jpg", design: "Shoulda Woulda Coulda — white" },
  { src: "mockup-3.jpg", design: "Come As You Are — black" },
  { src: "mockup-4.jpg", design: "Everything's Gonna Be Alright — white" },
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

function FilmVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const manuallyPaused = useRef(false);

  // Autoplay when 40% of the section scrolls into view; respect manual pause
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

  const enterFullscreen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    el.requestFullscreen?.();
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onEnded = () => setPlaying(false);
    el.addEventListener("ended", onEnded);
    return () => el.removeEventListener("ended", onEnded);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black group cursor-pointer" onClick={toggle}>
      <video ref={ref} playsInline className="w-full h-full object-contain">
        <source src="/assets/case-studies/beverley-knight/film.mp4" type="video/mp4" />
      </video>

      {/* Play/pause overlay */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}>
        <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center">
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
              <rect x="3" y="2" width="4" height="14" rx="1" />
              <rect x="11" y="2" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
              <path d="M4 2.5L15 9L4 15.5V2.5Z" />
            </svg>
          )}
        </div>
      </div>

      {/* Fullscreen button */}
      <button
        onClick={enterFullscreen}
        className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/20"
        aria-label="Fullscreen"
      >
        {isFullscreen ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M5 1H1v4M9 1h4v4M5 13H1v-4M9 13h4v-4" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" />
          </svg>
        )}
      </button>
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
            Case study
          </p>
          <h1 className="text-[clamp(3rem,9vw,7.5rem)] font-black leading-[0.85] text-white tracking-tighter">
            Beverley Knight
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/55 max-w-lg leading-relaxed">
            Tour merch and a music video for the Systematic Overload tour — designed, rendered, and delivered entirely in AI.
          </p>
        </motion.div>
      </section>

      {/* ── Brief + Stats ── */}
      <section className="py-20 md:py-32 px-6 border-b border-white/6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-6 font-semibold">
              The brief
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-white/65 max-w-lg">
              Beverley Knight needed a full creative suite for her Systematic Overload tour: merch designs, photorealistic wear mockups, and a music video for the title track. Every asset built in AI. No photographer, no print studio, no production crew.
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
              01. Merch Designs
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-white max-w-2xl">
              Four designs. Zero print studio.
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
            Each design built from Beverley&apos;s catalogue — her portrait and three of her most iconic song titles. Tour-ready artwork generated in AI, print-ready from day one.
          </motion.p>
        </div>
      </section>

      {/* ── 02 The Mockups ── */}
      <section className="py-20 md:py-28 border-b border-white/6">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-4 font-semibold">
              02. Wear Mockups
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-white max-w-2xl">
              Product shoot. No product shoot.
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
            AI-rendered wear mockups across four colourways and designs. Photorealistic enough to go straight to e-commerce — no model booking, no garment printing, no photography day.
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
              03. The Music Video
            </p>
            <h2 className="text-[clamp(2rem,3.5vw,3.2rem)] font-black leading-tight text-white mb-8">
              Systematic Overload.
            </h2>
            <p className="text-base text-white/55 leading-relaxed mb-10 max-w-sm">
              The full music video for the tour title track. Directed, generated, and edited entirely using AI tools — every scene, every transition, every grade.
            </p>
            <div className="flex flex-col gap-5 border-t border-white/8 pt-8">
              {[
                { label: "Runtime", value: "3:17" },
                { label: "Format",  value: "1920×1080, 16:9" },
                { label: "Tools",   value: "Kling AI · Runway · DaVinci Resolve" },
              ].map((item) => (
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
              Start your project
            </p>
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-tight text-white mb-10">
              Brief in. Campaign out.
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#cta"
                className="inline-flex px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-white text-black hover:bg-white/90 transition-colors duration-300"
              >
                Start a project
              </Link>
              <Link
                href="/case-studies/charles-keith"
                className="inline-flex px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase border border-white/20 text-white/55 hover:border-white/35 hover:text-white/80 transition-all duration-300"
              >
                View Charles &amp; Keith
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
