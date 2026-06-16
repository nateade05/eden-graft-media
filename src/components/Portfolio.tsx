"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { copy } from "@/content/copy";
import { blurData } from "@/lib/blurData";

type WallItem = {
  id: string;
  type: "video" | "image";
  src: string;
  aspect: string;
  client?: string;
  poster?: string;
};

const P = "/assets/wall/posters";

const items: WallItem[] = [
  { id: "ck-bird-ig",       type: "video", src: "/assets/wall/ck-bird-ig.mp4",       aspect: "9/16",  client: "Charles & Keith", poster: `${P}/ck-bird-ig.jpg` },
  { id: "knicks",           type: "image", src: "/assets/wall/knicks.webp",           aspect: "2/3",   client: "ILLVZN" },
  { id: "ck-easter-26",     type: "video", src: "/assets/wall/ck-easter-26.mp4",     aspect: "9/16",  client: "Charles & Keith", poster: `${P}/ck-easter-26.jpg` },
  { id: "oakley-concept",   type: "video", src: "/assets/wall/oakley-concept.mp4",   aspect: "9/16",  client: "Oakley",           poster: `${P}/oakley-concept.jpg` },
  { id: "ck-qixi-butter",   type: "image", src: "/assets/wall/ck-qixi-butterflies.jpg", aspect: "1/1", client: "Charles & Keith" },
  { id: "graft-contact",    type: "image", src: "/assets/wall/graft-contact.webp",    aspect: "2/3" },
  { id: "ck-tropical",      type: "image", src: "/assets/wall/ck-tropical.jpg",      aspect: "4/3",   client: "Charles & Keith" },
  { id: "spurs",            type: "image", src: "/assets/wall/spurs.webp",            aspect: "2/3",   client: "ILLVZN" },
  { id: "ck-horse-tt",      type: "video", src: "/assets/wall/ck-horse-tt.mp4",      aspect: "9/16",  client: "Charles & Keith", poster: `${P}/ck-horse-tt.jpg` },
  { id: "sunset-youth",     type: "image", src: "/assets/wall/sunset-youth.webp",     aspect: "2/3" },
  { id: "ck-chihuahua",     type: "video", src: "/assets/wall/ck-chihuahua.mp4",     aspect: "4/5",   client: "Charles & Keith", poster: `${P}/ck-chihuahua.jpg` },
  { id: "oakley-portrait",  type: "image", src: "/assets/wall/oakley-portrait.jpg",  aspect: "3/4",   client: "Oakley" },
  { id: "ck-summer-26",     type: "video", src: "/assets/wall/ck-summer-26.mp4",     aspect: "9/16",  client: "Charles & Keith", poster: `${P}/ck-summer-26.jpg` },
  { id: "hf-video",         type: "video", src: "/assets/wall/hf-video.mp4",         aspect: "9/16",  poster: `${P}/hf-video.jpg` },
  { id: "ck-qixi-bag",      type: "image", src: "/assets/wall/ck-qixi-bag.jpg",      aspect: "3/2",   client: "Charles & Keith" },
  { id: "netflix-graft",    type: "image", src: "/assets/wall/netflix-graft.webp",    aspect: "16/9" },
  { id: "ck-winter-animal", type: "image", src: "/assets/wall/ck-winter-animal.jpg", aspect: "4/5",   client: "Charles & Keith" },
  { id: "ef-portrait",      type: "video", src: "/assets/wall/ef-portrait.mp4",      aspect: "3/4",   poster: `${P}/ef-portrait.jpg` },
  { id: "ck-polka-bag",     type: "image", src: "/assets/wall/ck-polka-bag.jpg",     aspect: "9/16",  client: "Charles & Keith" },
  { id: "tennis",           type: "image", src: "/assets/wall/tennis.webp",           aspect: "1/1" },
];

type CaseStudy = {
  slug: string;
  client: string;
  title: string;
  description: string;
  image: string | null;
  video?: string;
  poster?: string;
};

const caseStudies: CaseStudy[] = [
  {
    slug: "beverley-knight",
    client: copy.portfolio.caseStudies.items[0].client,
    title: copy.portfolio.caseStudies.items[0].title,
    description: copy.portfolio.caseStudies.items[0].description,
    image: "/assets/case-studies/beverley-knight/card-still.jpg",
    video: "/assets/case-studies/beverley-knight/card-loop.mp4",
    poster: "/assets/case-studies/beverley-knight/card-poster.jpg",
  },
  {
    slug: "charles-keith",
    client: copy.portfolio.caseStudies.items[1].client,
    title: copy.portfolio.caseStudies.items[1].title,
    description: copy.portfolio.caseStudies.items[1].description,
    image: "/assets/case-studies/charles-keith/hero.jpg",
  },
  {
    slug: "nike",
    client: copy.portfolio.caseStudies.items[2].client,
    title: copy.portfolio.caseStudies.items[2].title,
    description: copy.portfolio.caseStudies.items[2].description,
    image: "/assets/case-studies/nike/detail-grill.jpg",
  },
];

function WallVideo({ item }: { item: WallItem }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let loaded = false;

    // 200px pre-load margin: set src before element enters view
    const loadObs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !loaded) {
          loaded = true;
          el.src = item.src;
          el.load();
          loadObs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    // Play/pause once in actual view
    const playObs = new IntersectionObserver(
      ([e]) => { e.isIntersecting ? el.play().catch(() => {}) : el.pause(); },
      { threshold: 0.1 }
    );

    loadObs.observe(el);
    playObs.observe(el);
    return () => { loadObs.disconnect(); playObs.disconnect(); };
  }, [item.src]);

  return (
    <div className="relative overflow-hidden group" style={{ aspectRatio: item.aspect }}>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        poster={item.poster}
        className="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-300 pointer-events-none" />
      {item.client && (
        <p className="absolute bottom-3 left-3 text-[9px] tracking-[0.22em] uppercase text-white/75 font-semibold opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-300 pointer-events-none">
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
        loading="eager"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        placeholder="blur"
        blurDataURL={blurData[item.src]}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-300 pointer-events-none" />
      {item.client && (
        <p className="absolute bottom-3 left-3 text-[9px] tracking-[0.22em] uppercase text-white/75 font-semibold opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-300 pointer-events-none">
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
            {copy.portfolio.overline}
          </p>
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-tight text-[#0A0A0A]">
            {copy.portfolio.headline}
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
            {copy.portfolio.caseStudies.overline}
          </p>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-[#0A0A0A]">
            {copy.portfolio.caseStudies.headline}
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
                {/* Image / Video */}
                <div className="relative overflow-hidden aspect-[4/3] bg-black/5 mb-5">
                  {cs.video ? (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="none"
                      poster={cs.poster}
                      src={cs.video}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  ) : cs.image ? (
                    <Image
                      src={cs.image}
                      alt={cs.client}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      placeholder="blur"
                      blurDataURL={blurData[cs.image]}
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
