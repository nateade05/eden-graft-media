"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const steps = [
  {
    number: "01",
    title: "Brief",
    description:
      "Share your product, campaign goal, and any reference that inspires you. A 30-minute call is enough. No lengthy briefs, no agency decks.",
  },
  {
    number: "02",
    title: "Concept",
    description:
      "We develop the visual direction — mood, aesthetic, and the world your product lives in. You review and sign off before a pixel is produced.",
  },
  {
    number: "03",
    title: "Production",
    description:
      "We generate, composite, and refine every asset using AI tools guided by experienced creative direction. Not prompts and hope — deliberate craft.",
  },
  {
    number: "04",
    title: "Delivery",
    description:
      "All formats, export-ready. Stills, video, cut-downs, platform sizes. Typically 48–72 hours from sign-off. Unlimited revisions until it's right.",
  },
];

export default function Process() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="process" ref={ref} className="py-16 md:py-32 px-6 border-t border-black/6">
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="mb-12 md:mb-20"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-5 font-semibold">
            How it works
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-tight text-[#0A0A0A] max-w-xl">
            From brief to campaign, in days.
          </h2>
        </motion.div>

        <div className="relative">
          {/* Static connector track */}
          <div className="hidden md:block absolute top-[1.125rem] left-0 right-0 h-px bg-black/10" />

          {/* Animated fill — draws left to right on inView */}
          <div className="hidden md:block absolute top-[1.125rem] left-0 right-0 h-px overflow-hidden">
            <motion.div
              className="h-full bg-black/25"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "left" }}
            />
          </div>

          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6"
          >
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
                }}
                className="relative"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative flex items-center justify-center w-9 h-9 rounded-full border border-black/20 bg-[#F7F6F2] flex-shrink-0 z-10">
                    <span className="text-[10px] font-black text-black/40 tracking-tight">{step.number}</span>
                    {/* Inner dot */}
                    <span className="absolute inset-0 flex items-end justify-end pr-1.5 pb-1.5 pointer-events-none">
                      <span className="w-1 h-1 rounded-full bg-black/20" />
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-[#0A0A0A] mb-4">{step.title}</h3>
                <p className="text-sm text-black/40 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
