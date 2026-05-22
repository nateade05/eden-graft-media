"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const materials = [
  {
    id: "circuit",
    name: "Digital & Tech",
    tag: "Circuit Board",
    description:
      "Precision-engineered electronics fused into your logotype. Perfect for tech companies, SaaS brands, and digital-native studios.",
    image: "/assets/images/material-circuit.png",
    accent: "#64d4ff",
  },
  {
    id: "gold",
    name: "Prestige & Luxury",
    tag: "24K Gold Coin",
    description:
      "Ancient coinage, modern brand. The weight of gold — the permanence of legacy. Ideal for premium and luxury-tier positioning.",
    image: "/assets/images/material-gold.png",
    accent: "#c9a96e",
  },
  {
    id: "chrome",
    name: "Clean & Modern",
    tag: "Brushed Chrome",
    description:
      "Reflective, surgical, timeless. Chrome speaks the language of precision engineering. For brands that mean business.",
    image: "/assets/images/material-chrome.png",
    accent: "#8090a8",
  },
  {
    id: "lava",
    name: "Bold & Volcanic",
    tag: "Molten Lava",
    description:
      "Forged in the earth's core. For brands that run hot — disruptors, challengers, and those who refuse to be ignored.",
    image: "/assets/images/material-lava.png",
    accent: "#e05a20",
  },
  {
    id: "fur",
    name: "Organic Texture",
    tag: "Soft Fur",
    description:
      "Impossibly tactile. A celebration of craft, warmth, and the unexpected. Makes audiences reach out and touch the screen.",
    image: "/assets/images/material-fur.png",
    accent: "#4ab8b0",
  },
  {
    id: "rust",
    name: "Raw & Industrial",
    tag: "Oxidised Metal",
    description:
      "Weathered by time. Industrial-grade authenticity for brands that celebrate craft, heritage, and the beauty of decay.",
    image: "/assets/images/material-rust.png",
    accent: "#b06828",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease },
  },
};

function MaterialCard({ m }: { m: (typeof materials)[0] }) {
  return (
    <motion.div
      variants={cardVariants}
      className="group relative rounded-2xl overflow-hidden cursor-default"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(26,22,18,0.08)",
        boxShadow: "0 2px 16px rgba(26,22,18,0.05)",
      }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
    >
      {/* Image area */}
      <div className="relative h-52 overflow-hidden bg-[#f5f2ed] flex items-center justify-center">
        <Image
          src={m.image}
          alt={m.tag}
          fill
          className="object-contain object-center group-hover:scale-105 transition-transform duration-700 p-4"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Tag badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full"
            style={{
              background: `${m.accent}18`,
              border: `1px solid ${m.accent}40`,
              color: m.accent,
              backdropFilter: "blur(8px)",
            }}
          >
            {m.tag}
          </span>
        </div>

        {/* Separator */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#1a1612]/08" />
      </div>

      {/* Text content */}
      <div className="p-6">
        <h3 className="text-base font-bold text-[#1a1612] mb-2">{m.name}</h3>
        <p className="text-sm text-[#1a1612]/45 leading-relaxed">{m.description}</p>
      </div>

      {/* Bottom accent reveal on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${m.accent}55, transparent)`,
        }}
      />

      {/* Border glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${m.accent}30` }}
      />
    </motion.div>
  );
}

export default function Features() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={ref} className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-5 font-semibold">
            The Material Library
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-tight text-[#1a1612]">
            Infinite{" "}
            <span className="shimmer-text">Possibilities.</span>
          </h2>
          <p className="mt-5 text-lg text-[#1a1612]/45 max-w-xl mx-auto leading-relaxed font-light">
            From precious metals to volcanic rock, from soft fur to living
            circuits — your logo can become anything.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {materials.map((m) => (
            <MaterialCard key={m.id} m={m} />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12 text-sm text-[#1a1612]/30"
        >
          100+ materials available — custom requests welcome
        </motion.p>
      </div>
    </section>
  );
}
