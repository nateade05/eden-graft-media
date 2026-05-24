"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { portfolioItems, TAGS, type PortfolioItem } from "@/data/portfolio";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

function VideoItem({ item }: { item: PortfolioItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => videoRef.current?.play();
  const handleMouseLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-[#EDECE8]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={item.src}
        muted
        playsInline
        loop
        preload="none"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
          <svg className="w-3.5 h-3.5 text-black/70 ml-0.5" fill="currentColor" viewBox="0 0 8 10">
            <path d="M0 0l8 5-8 5z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function PortfolioCard({ item }: { item: PortfolioItem }) {
  const aspectStyle =
    item.aspect === "portrait"
      ? { aspectRatio: "3/4" }
      : item.aspect === "square"
      ? { aspectRatio: "1/1" }
      : { aspectRatio: "16/9" };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, ease }}
      className="group relative overflow-hidden bg-[#EDECE8] rounded-xl"
      style={aspectStyle}
    >
      {item.type === "video" ? (
        <VideoItem item={item} />
      ) : (
        <Image
          src={item.src}
          alt={item.description ?? item.client}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        <p className="text-[10px] tracking-[0.22em] uppercase text-white/60 mb-1">{item.client}</p>
        {item.description && (
          <p className="text-sm font-semibold text-white">{item.description}</p>
        )}
      </div>

      {item.type === "video" && (
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/75 backdrop-blur-sm pointer-events-none">
          <span className="text-[9px] tracking-widest uppercase text-black/50 font-semibold">Video</span>
        </div>
      )}
    </motion.div>
  );
}

export default function Portfolio() {
  const [activeTag, setActiveTag] = useState<string>("All");

  const filtered =
    activeTag === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.tags.includes(activeTag));

  return (
    <section id="portfolio" className="py-14 md:py-24 px-6 border-t border-black/6">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-5 font-semibold">
              The work
            </p>
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-tight text-[#0A0A0A]">
              Built to stop the scroll.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-[0.18em] uppercase transition-all duration-200 ${
                  activeTag === tag
                    ? "bg-[#0A0A0A] text-white"
                    : "border border-black/10 text-black/30 hover:text-black/60 hover:border-black/25"
                }`}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          <AnimatePresence>
            {filtered.map((item) => (
              <div key={item.id} className="break-inside-avoid mb-4">
                <PortfolioCard item={item} />
              </div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-black/20 text-sm py-20">
            More work coming soon.
          </p>
        )}
      </div>
    </section>
  );
}
