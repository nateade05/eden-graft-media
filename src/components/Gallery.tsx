"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const row1 = [
  { src: "/assets/images/material-circuit.png", label: "Circuit Board" },
  { src: "/assets/images/material-gold.png",    label: "24K Gold" },
  { src: "/assets/images/material-chrome.png",  label: "Chrome" },
  { src: "/assets/images/material-fur.png",     label: "Soft Fur" },
];

const row2 = [
  { src: "/assets/images/material-rust.png",     label: "Oxidised Metal" },
  { src: "/assets/images/material-lava.png",     label: "Molten Lava" },
  { src: "/assets/images/material-magazine.png", label: "Magazine Collage" },
  { src: "/assets/images/material-purple.png",   label: "Candy Purple" },
];

function GalleryRow({
  items,
  reverse = false,
  delay = 0,
}: {
  items: { src: string; label: string }[];
  reverse?: boolean;
  delay?: number;
}) {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden">
      <div
        className={`flex gap-4 ${reverse ? "marquee-reverse" : "marquee-track"}`}
        style={{ animationDelay: `${delay}s` }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="group relative flex-shrink-0 w-64 h-40 rounded-xl overflow-hidden cursor-default"
            style={{
              background: "#f5f2ed",
              border: "1px solid rgba(26,22,18,0.09)",
              boxShadow: "0 1px 8px rgba(26,22,18,0.06)",
            }}
          >
            <Image
              src={item.src}
              alt={item.label}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              sizes="256px"
            />

            {/* Label strip */}
            <div
              className="absolute bottom-0 left-0 right-0 py-1.5 px-3"
              style={{ background: "rgba(26,22,18,0.45)", backdropFilter: "blur(4px)" }}
            >
              <span className="text-[9px] tracking-[0.18em] uppercase font-bold text-white/70 group-hover:text-[#c9a96e] transition-colors">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Gallery() {
  return (
    <section id="gallery" className="py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-5 font-semibold">
            Showcase
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-tight text-[#1a1612]">
            Every texture.{" "}
            <span className="shimmer-text">Every world.</span>
          </h2>
          <p className="mt-5 text-lg text-[#1a1612]/45 max-w-lg mx-auto font-light">
            A sample of what's possible. Each render is crafted with meticulous
            attention to light, shadow, and physical accuracy.
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col gap-4">
        <GalleryRow items={row1} />
        <GalleryRow items={row2} reverse delay={-8} />
      </div>
    </section>
  );
}
