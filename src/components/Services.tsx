"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const services = [
  {
    number: "01",
    title: "Creative Direction",
    description:
      "We develop the visual concept, art direction, and campaign narrative — the same thinking a top creative director brings, without the agency overhead.",
    deliverables: ["Mood boards", "Art direction", "Campaign concept", "Visual strategy"],
  },
  {
    number: "02",
    title: "AI Production",
    description:
      "Your product, placed into any world. We use the latest generative AI to produce hero images, campaign stills, and short-form video that look like they came from a premium shoot.",
    deliverables: ["Campaign stills", "Hero imagery", "Short-form video", "Product composites"],
  },
  {
    number: "03",
    title: "Variations at Scale",
    description:
      "One brief, every format. We deliver the full suite of assets — resized, recut, and optimised for every placement from OOH to Instagram Stories.",
    deliverables: ["Social formats", "Banner ads", "Story cuts", "Platform-ready files"],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-40 px-6 border-t border-black/6">
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="mb-20"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-5 font-semibold">
            What we do
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-tight text-[#0A0A0A] max-w-2xl">
            A full creative production studio. Powered by AI.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/6">
          {services.map((s, i) => (
            <motion.div
              key={s.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease }}
              className="relative overflow-hidden bg-[#F7F6F2] p-10 flex flex-col group hover:bg-white transition-colors duration-500"
            >
              {/* Ghost number — decorative backdrop */}
              <span
                aria-hidden="true"
                className="absolute -top-3 -right-2 text-[7rem] font-black leading-none select-none pointer-events-none text-black/[0.04] group-hover:text-black/[0.07] group-hover:translate-x-1 transition-all duration-500"
              >
                {s.number}
              </span>

              <span className="text-[10px] tracking-[0.3em] uppercase text-black/20 font-semibold mb-10 relative">
                {s.number}
              </span>

              <h3 className="text-2xl font-black text-[#0A0A0A] mb-5 leading-tight relative">
                {s.title}
              </h3>

              <p className="text-sm text-black/45 leading-relaxed mb-10 flex-1 relative">
                {s.description}
              </p>

              <ul className="space-y-2.5 relative">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-3 text-xs text-black/35">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "var(--accent)", opacity: 0.5 }}
                    />
                    {d}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
