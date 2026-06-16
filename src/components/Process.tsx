"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { copy } from "@/content/copy";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const steps = copy.process.steps;

// SVG viewBox: 0 0 1000 80
// Wave y alternates between 18 (circle-center height of top-row cards)
// and 62 (circle-center height of offset cards with pt-11 = 44px + 18px radius)
// x positions match approx. left-edge-of-column + circle radius in a gap-6 4-col grid
// Path extends to x=0 and x=1000 so it fills the full container width.
const WAVE =
  "M 0 18 L 14 18 C 100 18 182 62 269 62 C 356 62 438 18 523 18 C 608 18 692 62 778 62 L 1000 62";

// Node reveal delays: each node appears as the clip rect's right edge passes its x position.
// clip animates width 0→1000 over 3.8s (starts at 0.3s delay).
// delay_i = 0.3 + 3.8 * (x_i / 1000)
const NODES = [
  { x: 14,  y: 18, delay: 0.35 },
  { x: 269, y: 62, delay: 1.32 },
  { x: 523, y: 18, delay: 2.29 },
  { x: 778, y: 62, delay: 3.26 },
];

export default function Process() {
  const ref = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(timelineRef, { once: true, margin: "-60px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="process" ref={ref} className="py-16 md:py-32 px-6 border-t border-black/6 bg-[#FFF0F0]">
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="mb-12 md:mb-24"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-5 font-semibold">
            {copy.process.overline}
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-tight text-[#0A0A0A] max-w-xl">
            {copy.process.headline}
          </h2>
        </motion.div>

        {/* ── Desktop: wave timeline ── */}
        <div ref={timelineRef} className="relative hidden md:block">

          <svg
            className="absolute inset-0 w-full pointer-events-none"
            style={{ height: 80 }}
            viewBox="0 0 1000 80"
            preserveAspectRatio="none"
            overflow="visible"
          >
            <defs>
              {/* Expanding rect reveals the coloured wave left-to-right.
                  clipPathUnits="userSpaceOnUse" means coords match the SVG viewBox. */}
              <clipPath id="wave-clip" clipPathUnits="userSpaceOnUse">
                <motion.rect
                  x={0} y={-10} height={100}
                  initial={{ width: shouldReduceMotion ? 1000 : 0 }}
                  animate={{ width: shouldReduceMotion || inView ? 1000 : 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 5.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </clipPath>
            </defs>

            {/* Ghost track — always visible, shows the full path ahead */}
            <path
              d={WAVE}
              fill="none"
              stroke="rgba(0,0,0,0.07)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />

            {/* Coloured wave — revealed by the expanding clip rect */}
            <path
              d={WAVE}
              fill="none"
              stroke="rgba(200,55,26,0.4)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              clipPath="url(#wave-clip)"
            />

            {/* Node rings — each pops in as the clip rect passes its x */}
            {NODES.map((node, i) => (
              <motion.circle
                key={i}
                cx={node.x}
                cy={node.y}
                r={5}
                fill="#FFF0F0"
                stroke="rgba(200,55,26,0.45)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                initial={{ scale: shouldReduceMotion ? 1 : 0, opacity: shouldReduceMotion ? 1 : 0 }}
                animate={{ scale: shouldReduceMotion || inView ? 1 : 0, opacity: shouldReduceMotion || inView ? 1 : 0 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.35, delay: node.delay, ease }}
              />
            ))}
          </svg>

          {/* Cards — odd-indexed offset downward to sit on wave troughs */}
          <motion.div
            initial="hidden"
            animate={shouldReduceMotion || inView ? "visible" : "hidden"}
            variants={{ visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.15 } } }}
            className="grid grid-cols-4 gap-6"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                variants={{
                  hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0 : 0.7, ease } },
                }}
                className={i % 2 === 1 ? "pt-11" : ""}
              >
                <div className="mb-8">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full border border-black/15 bg-[#FFF0F0] relative z-10">
                    <span className="text-[10px] font-black text-black/40 tracking-tight">{step.number}</span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-[#0A0A0A] mb-4">{step.title}</h3>
                <p className="text-sm text-black/40 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Mobile: vertical timeline — shares timelineRef via md:hidden sibling ──
            No SVG, no preserveAspectRatio, no browser quirks.
            Circle left + flex connector line + content right. */}
        <motion.div
          initial="hidden"
          animate={shouldReduceMotion || inView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.18 } } }}
          className="md:hidden"
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={{
                hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -14 },
                visible: { opacity: 1, x: 0, transition: { duration: shouldReduceMotion ? 0 : 0.6, ease } },
              }}
              className="flex gap-5 pb-10 last:pb-0"
            >
              {/* Left: circle + vertical connector to next step */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-9 h-9 rounded-full border border-black/15 bg-[#FFF0F0] flex items-center justify-center z-10">
                  <span className="text-[10px] font-black text-black/40 tracking-tight">{step.number}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 w-px bg-black/10 mt-2 mb-0" />
                )}
              </div>

              {/* Right: content */}
              <div className="pt-1 pb-2">
                <h3 className="text-xl font-black text-[#0A0A0A] mb-3">{step.title}</h3>
                <p className="text-sm text-black/40 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Process reel ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.0, delay: 0.2, ease }}
          className="mt-16 md:mt-28 rounded-2xl overflow-hidden"
        >
          <video
            src="/assets/videos/process-reel.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/assets/videos/process-reel-poster.jpg"
            className="w-full object-cover"
          />
        </motion.div>

      </div>
    </section>
  );
}
