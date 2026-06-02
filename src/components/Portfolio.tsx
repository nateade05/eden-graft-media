"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type WallItem = {
  id: string;
  type: "video" | "image";
  src: string;
  aspect: string;
  client?: string;
};

const items: WallItem[] = [
  { id: "ck-bird",         type: "video", src: "/assets/wall/ck-bird.mp4",         aspect: "9/16",  client: "Charles & Keith" },
  { id: "sports-1",        type: "image", src: "/assets/wall/sports-1.jpg",        aspect: "3/4",   client: "ILLVZN" },
  { id: "cowboy",          type: "video", src: "/assets/wall/cowboy.mp4",          aspect: "4/5",   client: "Don Julio" },
  { id: "hf-1",            type: "image", src: "/assets/wall/hf-1.jpg",            aspect: "3/4" },
  { id: "illvzn",          type: "image", src: "/assets/wall/illvzn.jpg",          aspect: "2/3",   client: "ILLVZN" },
  { id: "ralph",           type: "video", src: "/assets/wall/ralph.mp4",           aspect: "9/16",  client: "Ralph Lauren" },
  { id: "glitch",          type: "image", src: "/assets/wall/glitch.jpg",          aspect: "2/3" },
  { id: "ck-summer",       type: "image", src: "/assets/wall/ck-summer.jpg",       aspect: "3/2",   client: "Charles & Keith" },
  { id: "tobimanny",       type: "video", src: "/assets/wall/tobimanny.mp4",       aspect: "1/1" },
  { id: "sports-2",        type: "image", src: "/assets/wall/sports-2.jpg",        aspect: "3/4",   client: "ILLVZN" },
  { id: "hf-2",            type: "image", src: "/assets/wall/hf-2.jpg",            aspect: "3/4" },
  { id: "don-julio",       type: "video", src: "/assets/wall/don-julio.mp4",       aspect: "4/5",   client: "Don Julio" },
  { id: "ck-qixi",         type: "image", src: "/assets/wall/ck-qixi.jpg",         aspect: "1/1",   client: "Charles & Keith" },
  { id: "edit-landscape",  type: "image", src: "/assets/wall/edit-landscape.jpg",  aspect: "3/2" },
  { id: "ck-calling",      type: "video", src: "/assets/wall/ck-calling.mp4",      aspect: "16/9",  client: "Charles & Keith" },
  { id: "mockup-purple",   type: "image", src: "/assets/wall/mockup-purple.jpg",   aspect: "4/3" },
  { id: "sports-3",        type: "image", src: "/assets/wall/sports-3.jpg",        aspect: "3/4",   client: "ILLVZN" },
  { id: "ck-easter",       type: "video", src: "/assets/wall/ck-easter.mp4",       aspect: "9/16",  client: "Charles & Keith" },
  { id: "don-julio-bottle",type: "image", src: "/assets/wall/don-julio-bottle.jpg",aspect: "3/4",   client: "Don Julio" },
  { id: "ck-landscape",    type: "image", src: "/assets/wall/ck-landscape.jpg",    aspect: "3/2",   client: "Charles & Keith" },
  { id: "look-9b",         type: "image", src: "/assets/wall/look-9b.jpg",         aspect: "3/4" },
  { id: "cowboy-bottle",   type: "image", src: "/assets/wall/cowboy-bottle.jpg",   aspect: "4/5",   client: "Don Julio" },
  { id: "ck-2023",         type: "image", src: "/assets/wall/ck-2023.jpg",         aspect: "4/3",   client: "Charles & Keith" },
  { id: "edit-portrait",   type: "image", src: "/assets/wall/edit-portrait.jpg",   aspect: "2/3" },
  { id: "ck-winter",       type: "image", src: "/assets/wall/ck-winter.jpg",       aspect: "4/5",   client: "Charles & Keith" },
  { id: "image-1",         type: "image", src: "/assets/wall/image-1.jpg",         aspect: "3/2" },
];

type CaseStudy = {
  slug: string;
  client: string;
  title: string;
  description: string;
  image: string | null;
};

const caseStudies: CaseStudy[] = [
  {
    slug: "illvzn",
    client: "ILLVZN",
    title: "Building a Sports Brand from Scratch",
    description: "Full visual world for an emerging UK sports brand — character design, campaign stills, and short-form video, all in under a week.",
    image: "/assets/wall/illvzn.jpg",
  },
  {
    slug: "charles-keith",
    client: "Charles & Keith",
    title: "Runway Campaign, AI-Produced",
    description: "Seasonal runway campaign stills and motion assets generated and delivered in 48 hours — no shoot, no travel, no compromise.",
    image: "/assets/wall/ck-summer.jpg",
  },
  {
    slug: "coming-soon",
    client: "Coming Soon",
    title: "Next Case Study in Production",
    description: "We're documenting our next project end-to-end. Check back soon.",
    image: null,
  },
];

function WallVideo({ item }: { item: WallItem }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { e.isIntersecting ? el.play().catch(() => {}) : el.pause(); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="relative overflow-hidden group" style={{ aspectRatio: item.aspect }}>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-[1.04]"
      >
        <source src={item.src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      {item.client && (
        <p className="absolute bottom-3 left-3 text-[9px] tracking-[0.22em] uppercase text-white/75 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          {item.client}
        </p>
      )}
    </div>
  );
}

function WallImage({ item }: { item: WallItem }) {
  return (
    <div className="relative overflow-hidden group" style={{ aspectRatio: item.aspect }}>
      <Image
        src={item.src}
        alt={item.client ?? "Graft Media"}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      {item.client && (
        <p className="absolute bottom-3 left-3 text-[9px] tracking-[0.22em] uppercase text-white/75 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          {item.client}
        </p>
      )}
    </div>
  );
}

export default function Portfolio() {
  return (
    <section id="portfolio" className="border-t border-black/6">

      <div className="px-6 py-14 md:py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-5 font-semibold">
            The work
          </p>
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-tight text-[#0A0A0A]">
            Built to stop the scroll.
          </h2>
        </motion.div>
      </div>

      {/* Full-bleed masonry wall — 4 cols max so tiles are large */}
      <div
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4"
        style={{ columnGap: "3px" }}
      >
        {items.map((item) => (
          <div key={item.id} className="break-inside-avoid" style={{ marginBottom: "3px" }}>
            {item.type === "video" ? <WallVideo item={item} /> : <WallImage item={item} />}
          </div>
        ))}
      </div>

      {/* Featured case studies */}
      <div className="px-6 py-20 md:py-28 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="mb-14"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-5 font-semibold">
            Case studies
          </p>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-[#0A0A0A]">
            See how it's made.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {caseStudies.map((cs, i) => (
            <motion.div
              key={cs.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            >
              <Link href={`/case-studies/${cs.slug}`} className="group block">
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3] bg-black/5 mb-5">
                  {cs.image ? (
                    <Image
                      src={cs.image}
                      alt={cs.client}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-end p-6 bg-gradient-to-br from-black/8 to-black/20">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-black/30 font-semibold">Coming soon</span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>

                {/* Text */}
                <p className="text-[10px] tracking-[0.28em] uppercase font-semibold mb-2" style={{ color: "var(--accent)" }}>
                  {cs.client}
                </p>
                <h3 className="text-lg font-black text-[#0A0A0A] mb-2 leading-snug">{cs.title}</h3>
                <p className="text-sm text-black/40 leading-relaxed mb-5">{cs.description}</p>
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-black/40 group-hover:text-black/70 transition-colors duration-200">
                  View case study
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
