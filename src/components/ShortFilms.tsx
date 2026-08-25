"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { copy } from "@/content/copy";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const items = copy.shortFilms.items;

function FilmCard({ item, i }: { item: (typeof items)[number]; i: number }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!el.src) { el.src = `/assets/short-films/${item.slug}/card-loop.mp4`; el.load(); }
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [item.slug]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: i * 0.08, ease }}
    >
      <Link href="/short-films" className="group block">
        <div className="relative overflow-hidden aspect-[4/3] bg-white/5 mb-5">
          <video
            ref={ref}
            muted
            loop
            playsInline
            preload="none"
            poster={`/assets/short-films/${item.slug}/card-poster.jpg`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
        </div>
        <h3 className="text-lg font-black text-white mb-2 leading-snug">{item.title}</h3>
        <p className="text-sm text-white/45 leading-relaxed">{item.description}</p>
      </Link>
    </motion.div>
  );
}

export default function ShortFilms() {
  return (
    <section id="short-films" className="border-t border-white/6 bg-[#0A0A0A]">
      <div className="px-6 py-20 md:py-28 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-5 font-semibold">
              {copy.shortFilms.overline}
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-white max-w-xl mb-4">
              {copy.shortFilms.headline}
            </h2>
            <p className="text-sm text-white/45 max-w-md leading-relaxed">{copy.shortFilms.body}</p>
          </div>
          <Link
            href="/short-films"
            className="inline-flex flex-shrink-0 items-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors duration-200"
          >
            {copy.shortFilms.viewAll}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {items.map((item, i) => (
            <FilmCard key={item.slug} item={item} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
