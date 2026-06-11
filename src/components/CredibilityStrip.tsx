"use client";

import Image from "next/image";
import { motion, useAnimationFrame } from "framer-motion";
import { useRef } from "react";
import { clients } from "@/data/clients";
import { copy } from "@/content/copy";

const SPEED = 0.045; // px per ms

const { stats } = copy.credibility;

function LogoMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef   = useRef(0);
  const paused   = useRef(false);

  useAnimationFrame((_, delta) => {
    if (paused.current) return;
    const el = trackRef.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    if (half <= 0) return;
    posRef.current -= delta * SPEED;
    // Wrap: when we've scrolled exactly one set, reset — no jump because content repeats
    if (posRef.current <= -half) posRef.current += half;
    el.style.transform = `translateX(${posRef.current}px)`;
  });

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#1A1612] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#1A1612] to-transparent z-10 pointer-events-none" />

      {/* Two identical sets — JS drives translateX so we never restart the animation */}
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ width: "max-content" }}
      >
        {[...clients, ...clients].map((client, i) => (
          <div key={i} className="inline-flex items-center justify-center flex-shrink-0 px-12 group/logo">
            <Image
              src={client.logoSrc}
              alt={client.name}
              width={400}
              height={80}
              className={`${client.sizeClass ?? "h-7"} w-auto object-contain grayscale invert opacity-30 transition-all duration-300 ease-out group-hover/logo:opacity-100 group-hover/logo:scale-125`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CredibilityStrip() {
  return (
    <section className="relative py-12 md:py-20 overflow-hidden border-t border-white/6 bg-[#1A1612]">

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-6 mb-12 md:mb-20">
        <div className="grid grid-cols-3 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="text-center"
            >
              <div className="text-[clamp(2rem,5vw,3rem)] font-black leading-none text-white mb-2">
                {s.value}
              </div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-white/35 font-medium">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trusted by label */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex items-center justify-center gap-4 mb-10"
      >
        <span className="w-8 h-px" style={{ background: "var(--accent)", opacity: 0.4 }} />
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/35">{copy.credibility.trustedByLabel}</span>
        <span className="w-8 h-px" style={{ background: "var(--accent)", opacity: 0.4 }} />
      </motion.div>

      <LogoMarquee />
    </section>
  );
}
