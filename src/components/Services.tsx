"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const phases = [
  {
    number: "01",
    phase: "Concepts",
    description: "The thinking before anything is made — direction, narrative, and the visual world your brand lives in.",
    deliverables: [
      "Creative direction",
      "Brand voice",
      "Character design",
      "Visual world-building",
    ],
  },
  {
    number: "02",
    phase: "Asset Creation",
    description: "Using AI to generate the raw material — every image, render, and visual building block your campaign needs.",
    deliverables: [
      "Character & scene renders",
      "Campaign stills",
      "Ecommerce imagery",
      "Product mockups",
      "Merch design",
    ],
  },
  {
    number: "03",
    phase: "Campaign Production",
    description: "Static assets become motion. We produce the final content that goes live — cut, graded, and ready to perform.",
    deliverables: [
      "Short-form video",
      "Colour grading",
      "Sound design & SFX",
      "Format cuts & delivery",
    ],
  },
];

export default function Services() {
  const [hovered, setHovered] = useState<number | null>(null);

  const gridCols =
    hovered === null      ? "1fr 1fr 1fr"
    : hovered === 0       ? "2.5fr 0.75fr 0.75fr"
    : hovered === 1       ? "0.75fr 2.5fr 0.75fr"
    :                       "0.75fr 0.75fr 2.5fr";

  return (
    <section id="services" className="py-20 md:py-32 px-6 border-t border-black/6">
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="mb-16"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-5 font-semibold">
            What we do
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-tight text-[#0A0A0A] max-w-2xl">
            A full creative production studio. Powered by AI.
          </h2>
        </motion.div>

        {/* ── Mobile: all phases expanded, stacked ── */}
        <div className="md:hidden flex flex-col gap-px bg-black/6">
          {phases.map((phase) => (
            <div key={phase.number} className="bg-[#F7F6F2] p-8">
              <span
                className="text-[10px] tracking-[0.28em] uppercase font-semibold block mb-4"
                style={{ color: "var(--accent)" }}
              >
                {phase.number}
              </span>
              <h3 className="text-2xl font-black text-[#0A0A0A] mb-3">{phase.phase}</h3>
              <p className="text-sm text-black/40 leading-relaxed mb-6">{phase.description}</p>
              <ul className="space-y-3">
                {phase.deliverables.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-black/60">
                    <span
                      className="w-4 h-px flex-shrink-0"
                      style={{ background: "var(--accent)", opacity: 0.5 }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
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
                className="relative bg-[#F7F6F2] overflow-hidden min-h-[520px] flex flex-col"
                onMouseEnter={() => setHovered(i)}
              >
                {/* Accent top bar — draws in on active */}
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
                  {/* Phase number */}
                  <span
                    className="text-[10px] tracking-[0.28em] uppercase font-semibold block mb-8 transition-colors duration-300"
                    style={{ color: isActive ? "var(--accent)" : "rgba(10,10,10,0.25)" }}
                  >
                    {phase.number}
                  </span>

                  {/* Phase name — grows on active */}
                  <h3
                    className="font-black text-[#0A0A0A] leading-tight"
                    style={{
                      fontSize: isActive ? "2.2rem" : "1.4rem",
                      transition: "font-size 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {phase.phase}
                  </h3>

                  {/* Description + deliverables — only when active */}
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

                {/* Subtle dim on inactive columns */}
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
