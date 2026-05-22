"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const showcaseItems = [
  {
    src: "/assets/images/material-lava.png",
    label: "Molten Lava",
    description: "Earth's raw energy — your brand forged in fire.",
    accent: "#e05a20",
  },
  {
    src: "/assets/images/material-gold.png",
    label: "24K Gold",
    description: "The permanence of legacy, the language of prestige.",
    accent: "#c9a96e",
  },
  {
    src: "/assets/images/material-magazine.png",
    label: "Magazine Collage",
    description: "A decade of culture, compressed into a single mark.",
    accent: "#a070b8",
  },
];

export default function VideoShowcase() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-4 font-semibold">
            In Detail
          </p>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-black text-[#1a1612]">
            The art of{" "}
            <span className="shimmer-text">material.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {showcaseItems.map((item, i) => (
            <motion.div
              key={item.src}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.12, ease }}
              className="group relative rounded-2xl overflow-hidden cursor-default"
              style={{
                border: "1px solid rgba(26,22,18,0.08)",
                boxShadow: "0 2px 16px rgba(26,22,18,0.05)",
              }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
            >
              {/* Image */}
              <div className="relative aspect-square bg-[#f5f2ed] overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  className="object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Gradient overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612]/12 via-transparent to-transparent" />
              </div>

              {/* Bottom text */}
              <div className="p-5 bg-white">
                <div
                  className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1.5"
                  style={{ color: item.accent }}
                >
                  {item.label}
                </div>
                <p className="text-sm text-[#1a1612]/50 leading-snug">{item.description}</p>
              </div>

              {/* Hover border */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: `inset 0 0 0 1px ${item.accent}35` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
