"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { copy } from "@/content/copy";
import { blurData } from "@/lib/blurData";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const VIDEO_URL =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_2yiYkl8oAdOhUSD2s94hh9bw3Zt/68dbdb37-90bc-4cf0-b26e-95ff96b1ab73.mp4";

const SERVICE_OPTIONS = ["Brand", "Digital", "Campaign", "Other"] as const;

const SERVICE_STYLES: Record<string, { color: string; shadow: string }> = {
  Brand:    { color: "#D2647F", shadow: "rgba(210,100,127,0.3)" },
  Digital:  { color: "#8090A8", shadow: "rgba(128,144,168,0.3)" },
  Campaign: { color: "#C9A96E", shadow: "rgba(201,169,110,0.3)" },
  Other:    { color: "#C8371A", shadow: "rgba(200,55,26,0.3)"   },
};

const BIG_CURSOR =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M 3 3 L 3 36 L 12 27 L 21 42 L 27 39 L 15 21 L 24 21 Z' fill='black' stroke='white' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E\") 3 3, auto";

function useTypewriter(text: string, speed = 38, startDelay = 300) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const trigger = useCallback(() => setTriggered(true), []);

  useEffect(() => {
    if (!triggered) return;
    setDisplayed("");
    setDone(false);
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
    }, startDelay);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [text, speed, startDelay, triggered]);

  return { displayed, done, trigger };
}

export default function FinalCTA() {
  const ref    = useRef<HTMLElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const typewriterText = `${copy.finalCta.headlineLine1}\n${copy.finalCta.headlineLine2}`;
  const { displayed, done, trigger } = useTypewriter(typewriterText);

  // Fire typewriter when section enters view
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { trigger(); observer.disconnect(); } },
      { threshold: 0.25 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [trigger]);

  // Desktop: scrub video with horizontal mouse delta
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
        seeking = true; video.currentTime = targetTime;
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024 || !video.duration) return;
      if (prevX === -1) { prevX = e.clientX; return; }
      const delta = e.clientX - prevX;
      prevX = e.clientX;
      targetTime += (delta / window.innerWidth) * video.duration;
      targetTime = Math.max(0, Math.min(video.duration, targetTime));
      if (!seeking) { seeking = true; video.currentTime = targetTime; }
    };
    video.addEventListener("seeked", onSeeked);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // Mobile: autoplay
  useEffect(() => {
    const video = vidRef.current;
    if (!video || window.innerWidth >= 1024) return;
    video.autoplay = true;
    video.play().catch(() => {});
  }, []);

  const toggleService = (service: string) =>
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );

  const mailtoHref = `mailto:${copy.finalCta.email}?subject=${encodeURIComponent(`Project enquiry: ${selectedServices.join(", ")}`)}`;

  return (
    <section
      id="cta"
      ref={ref}
      className="relative overflow-hidden"
      style={{ minHeight: "92vh", backgroundColor: "#f0f0f0", cursor: BIG_CURSOR } as React.CSSProperties}
    >
      {/* Character video — right side, desktop only */}
      <motion.video
        ref={vidRef}
        src={VIDEO_URL}
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

      {/* Character still — mobile only, faded for text legibility */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.1 }}
        className="absolute inset-0 pointer-events-none lg:hidden"
      >
        <Image
          src="/assets/images/cta-character.jpg"
          alt=""
          fill
          className="object-cover object-[65%_top] select-none"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={blurData["/assets/images/cta-character.jpg"]}
        />
        {/* Fade overlay so text stays readable */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(240,240,240,0.75) 0%, rgba(240,240,240,0.65) 40%, rgba(240,240,240,0.85) 80%, #f0f0f0 100%)" }}
        />
      </motion.div>

      {/* Left gradient keeps text legible — desktop */}
      <div
        className="absolute inset-y-0 left-0 w-[55%] pointer-events-none hidden lg:block z-[1]"
        style={{ background: "linear-gradient(to right, #f0f0f0 45%, transparent 100%)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-[92vh] px-8 md:px-14 xl:px-20 py-24">
        <div className="max-w-[560px]">

          {/* Overline */}
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

          {/* Headline — typewriter, fixed height via ghost */}
          <div className="relative mb-8">
            {/* Ghost text reserves the full height from the start */}
            <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-black leading-[1.00] tracking-tight text-[#1A1612] whitespace-pre-wrap select-none invisible" aria-hidden>
              {typewriterText}
            </h2>
            {/* Typewriter text sits on top */}
            <h2 className="absolute inset-0 text-[clamp(3rem,6vw,5.5rem)] font-black leading-[1.00] tracking-tight text-[#1A1612] whitespace-pre-wrap select-none">
              {displayed}
              {!done && (
                <span className="inline-block w-[3px] h-[0.85em] bg-[#1A1612] align-middle ml-[2px] animate-blink" />
              )}
            </h2>
          </div>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base text-[#1A1612]/45 max-w-sm leading-relaxed mb-10"
          >
            {copy.finalCta.body}
          </motion.p>

          {/* Service pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            <div className="flex items-baseline gap-3 mb-4">
              <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-[#1A1612]/35">
                What do you need?
              </p>
              <p className="text-[11px] text-[#1A1612]/25">Select all that apply</p>
            </div>

            <div className="flex flex-wrap gap-2.5 mb-8">
              {SERVICE_OPTIONS.map(service => {
                const active = selectedServices.includes(service);
                const { color, shadow } = SERVICE_STYLES[service];
                return (
                  <motion.button
                    key={service}
                    onClick={() => toggleService(service)}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-200"
                    style={active ? {
                      backgroundColor: color,
                      color: "white",
                      border: `1px solid ${color}`,
                      boxShadow: `0 6px 24px ${shadow}`,
                      opacity: 1,
                    } : {
                      backgroundColor: color,
                      color: "white",
                      border: `1px solid ${color}`,
                      opacity: 0.45,
                    }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.opacity = "0.45"; }}
                  >
                    <AnimatePresence mode="wait">
                      {active && (
                        <motion.span
                          key="check"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <polyline points="1.5,5.5 4.5,8.5 9.5,2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {service}
                  </motion.button>
                );
              })}
            </div>

            {/* CTA — always active */}
            <motion.a
              href={mailtoHref}
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

          {/* Footnote */}
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
