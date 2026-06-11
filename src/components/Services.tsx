"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { copy } from "@/content/copy";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

// JPEGs used for the inactive 3×3 grid (displayed at low opacity under overlay)
const CONCEPT_GRID = [
  "/assets/images/concepts-s1.jpg",
  "/assets/images/concepts-s2.jpg",
  "/assets/images/concepts-s3.jpg",
  "/assets/images/concepts-s4.jpg",
  "/assets/images/concepts-s5.jpg",
  "/assets/images/concepts-s6.jpg",
  "/assets/images/concepts-s7.jpg",
  "/assets/images/concepts-s8.jpg",
  "/assets/images/concepts-s9.jpg",
];

// Character pairs (and one trio) for the active slideshow.
// Each inner array becomes a flex row of bottom-aligned figures,
// filling the horizontal container without white-space artifacts.
const CONCEPT_PAIRS: string[][] = [
  ["/assets/images/concepts-s1-alpha.png", "/assets/images/concepts-s2-alpha.png"],   // Look 4
  ["/assets/images/concepts-s3-alpha.png", "/assets/images/concepts-s4-alpha.png"],   // Look 6
  ["/assets/images/concepts-s5-alpha.png", "/assets/images/concepts-s6-alpha.png"],   // Look 7
  ["/assets/images/concepts-s7-alpha.png", "/assets/images/concepts-s8-alpha.png"],   // Look 8
  ["/assets/images/concepts-still-alpha.png", "/assets/images/concepts-s10-alpha.png"],  // Look 12 (still + 12C, both absent from grid)
];

const phases = [
  {
    number: copy.services.phases[0].number,
    phase: copy.services.phases[0].name,
    description: copy.services.phases[0].description,
    deliverables: copy.services.phases[0].deliverables,
    type: "slideshow" as const,
  },
  {
    number: copy.services.phases[1].number,
    phase: copy.services.phases[1].name,
    description: copy.services.phases[1].description,
    deliverables: copy.services.phases[1].deliverables,
    still: "/assets/images/asset-creation-still.jpg",
    video: "/assets/videos/asset-creation-hover.mp4",
    type: "video" as const,
  },
  {
    number: copy.services.phases[2].number,
    phase: copy.services.phases[2].name,
    description: copy.services.phases[2].description,
    deliverables: copy.services.phases[2].deliverables,
    video: "/assets/videos/campaign-production.mp4",
    type: "video-only" as const,
  },
];

export default function Services() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const slideRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null]);

  // Preload all pair images so switches are instant
  useEffect(() => {
    CONCEPT_PAIRS.flat().forEach((src) => {
      const img = new window.Image() as HTMLImageElement;
      img.src = src;
    });
  }, []);

  // Play/pause desktop accordion videos based on hover state
  useEffect(() => {
    [1, 2].forEach((phaseIdx) => {
      const vid = videoRefs.current[phaseIdx];
      if (!vid) return;
      if (hovered === phaseIdx) vid.play().catch(() => {});
      else vid.pause();
    });
  }, [hovered]);

  // Slideshow interval — only runs while Concepts is active
  useEffect(() => {
    if (hovered === 0) {
      slideRef.current = setInterval(() => {
        setSlideIndex((i) => (i + 1) % CONCEPT_PAIRS.length);
      }, 800);
    } else {
      if (slideRef.current) clearInterval(slideRef.current);
      setSlideIndex(0);
    }
    return () => {
      if (slideRef.current) clearInterval(slideRef.current);
    };
  }, [hovered]);

  const gridCols =
    hovered === null      ? "1fr 1fr 1fr"
    : hovered === 0       ? "2.5fr 0.75fr 0.75fr"
    : hovered === 1       ? "0.75fr 2.5fr 0.75fr"
    :                       "0.75fr 0.75fr 2.5fr";

  return (
    <section id="services" className="py-20 md:py-32 px-6 border-t border-black/6 bg-[#FFF0F0]">
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="mb-16"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-5 font-semibold">
            {copy.services.overline}
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-tight text-[#0A0A0A] max-w-2xl">
            {copy.services.headline}
          </h2>
        </motion.div>

        {/* ── Mobile: stacked ── */}
        <div className="md:hidden flex flex-col gap-px bg-black/6">
          {phases.map((phase) => (
            <div key={phase.number} className="relative bg-[#FFF0F0] p-8 overflow-hidden">
              {/* Concepts mobile: faint grid texture */}
              {phase.type === "slideshow" && (
                <div className="absolute inset-0 pointer-events-none">
                  <Image src={CONCEPT_GRID[0]} alt="" fill className="object-cover" style={{ objectPosition: "center 10%" }} sizes="100vw" aria-hidden />
                  <div className="absolute inset-0 bg-[#FFF0F0]/82" />
                </div>
              )}
              {/* Asset Creation mobile: still image */}
              {"still" in phase && (
                <div className="absolute inset-0 pointer-events-none">
                  <Image src={(phase as typeof phase & { still: string }).still} alt="" fill className="object-cover object-center" sizes="100vw" aria-hidden />
                  <div className="absolute inset-0 bg-[#FFF0F0]/80" />
                </div>
              )}
              <div className="relative">
                <span className="text-[10px] tracking-[0.28em] uppercase font-semibold block mb-4" style={{ color: "var(--accent)" }}>
                  {phase.number}
                </span>
                <h3 className="text-2xl font-black text-[#0A0A0A] mb-3">{phase.phase}</h3>
                <p className="text-sm text-black/40 leading-relaxed mb-6">{phase.description}</p>
                <ul className="space-y-3">
                  {phase.deliverables.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-black/60">
                      <span className="w-4 h-px flex-shrink-0" style={{ background: "var(--accent)", opacity: 0.5 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* ── Desktop: horizontal accordion ── */}
        <div
          className="hidden md:grid gap-px bg-black/6"
          style={{
            gridTemplateColumns: gridCols,
            transition: "grid-template-columns 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseLeave={() => setHovered(null)}
        >
          {phases.map((phase, i) => {
            const isActive = hovered === i;
            const isInactive = hovered !== null && !isActive;

            return (
              <div
                key={phase.number}
                className="relative bg-[#FFF0F0] overflow-hidden min-h-[520px] flex flex-col"
                onMouseEnter={() => setHovered(i)}
              >

                {/* ── Concepts: 3×3 grid (inactive) ↔ alpha slideshow (active) ── */}
                {phase.type === "slideshow" && (
                  <>
                    {/* Grid — faint background texture, matches other panels' inactive look */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        opacity: isActive ? 0 : 1,
                        transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-px">
                        {CONCEPT_GRID.map((src, idx) => (
                          <div key={idx} className="relative overflow-hidden">
                            <Image
                              src={src}
                              alt=""
                              fill
                              className="object-cover"
                              style={{ objectPosition: "center 10%" }}
                              sizes="15vw"
                              aria-hidden
                            />
                          </div>
                        ))}
                      </div>
                      {/* Overlay — same weight as the other two panels at rest */}
                      <div className="absolute inset-0 bg-[#FFF0F0]/82" />
                    </div>

                    {/* Slideshow — pair of alpha-keyed figures, flex row, bottom-aligned */}
                    <div
                      className="absolute inset-0 pointer-events-none flex items-end"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      {CONCEPT_PAIRS[slideIndex].map((src, j) => (
                        <div key={j} className="flex-1 h-full flex items-end justify-center overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="" className="h-full w-auto" aria-hidden />
                        </div>
                      ))}
                      {/* Overlay — same weight as Asset Creation / Campaign Production at hover */}
                      <div className="absolute inset-0 bg-[#FFF0F0]/72" />
                    </div>
                  </>
                )}

                {/* ── Asset Creation: still (inactive) → video (active) ── */}
                {phase.type === "video" && "still" in phase && (
                  <>
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        opacity: isActive ? 0 : 1,
                        transition: "opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <Image
                        src={(phase as typeof phase & { still: string }).still}
                        alt=""
                        fill
                        className="object-cover object-center"
                        sizes="33vw"
                        aria-hidden
                      />
                      <div className="absolute inset-0 bg-[#FFF0F0]/82" />
                    </div>
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transition: "opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <video
                        ref={(el) => { videoRefs.current[i] = el; }}
                        src={(phase as typeof phase & { video: string }).video}
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-[#FFF0F0]/72" />
                    </div>
                  </>
                )}

                {/* ── Campaign Production: video dims until hovered ── */}
                {phase.type === "video-only" && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      opacity: isActive ? 1 : 0.55,
                      transition: "opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <video
                      ref={(el) => { videoRefs.current[i] = el; }}
                      src={(phase as typeof phase & { video: string }).video}
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                    <div
                      className="absolute inset-0 bg-[#FFF0F0]"
                      style={{
                        opacity: isActive ? 0.72 : 0.78,
                        transition: "opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  </div>
                )}

                {/* Accent top bar */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: "var(--accent)", transformOrigin: "left" }}
                  animate={{ scaleX: isActive ? 1 : 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Ghost number */}
                <div
                  className="absolute -bottom-4 -right-2 text-[9rem] font-black leading-none select-none pointer-events-none"
                  style={{ color: "rgba(10,10,10,0.04)" }}
                >
                  {phase.number}
                </div>

                <div className="relative p-10 flex flex-col flex-1">
                  <span
                    className="text-[10px] tracking-[0.28em] uppercase font-semibold block mb-8 transition-colors duration-300"
                    style={{ color: isActive ? "var(--accent)" : "rgba(10,10,10,0.25)" }}
                  >
                    {phase.number}
                  </span>

                  <h3
                    className="font-black text-[#0A0A0A] leading-tight"
                    style={{
                      fontSize: isActive ? "2.2rem" : "1.4rem",
                      transition: "font-size 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {phase.phase}
                  </h3>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.3, ease }}
                        className="mt-8 flex flex-col flex-1"
                      >
                        <p className="text-sm text-black/40 leading-relaxed mb-8">
                          {phase.description}
                        </p>
                        <ul className="space-y-3 mt-auto">
                          {phase.deliverables.map((item, j) => (
                            <motion.li
                              key={item}
                              initial={{ opacity: 0, x: -16 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: j * 0.055, duration: 0.4, ease }}
                              className="flex items-center gap-3 text-sm text-[#0A0A0A]/65"
                            >
                              <span
                                className="w-4 h-px flex-shrink-0"
                                style={{ background: "var(--accent)", opacity: 0.5 }}
                              />
                              {item}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Dim on inactive */}
                <motion.div
                  className="absolute inset-0 bg-black pointer-events-none"
                  animate={{ opacity: isInactive ? 0.04 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
