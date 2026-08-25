"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
  { id: "golfer",           type: "video", src: "/assets/wall/golfer.mp4",           aspect: "9/16",  poster: `${P}/golfer.jpg` },
  { id: "tennis",           type: "image", src: "/assets/wall/tennis.webp",           aspect: "1/1" },
];

// Revealed in two rounds of 16 via "View more" — keeps the default grid tight.
// Ordering within (and across) each batch deliberately cycles through category
// (eyewear / beauty / wrestle / wet-quirky / CK street / CK F26 / video) so
// visually similar tiles never land next to each other in the column flow.
const moreItems1: WallItem[] = [
  { id: "grid-eyewear-01",      type: "image", src: "/assets/wall/grid-eyewear-01.webp",      aspect: "4/5" },
  { id: "grid-beauty-glitter",  type: "image", src: "/assets/wall/grid-beauty-glitter.webp",   aspect: "3/4" },
  { id: "ck-bag-fence",         type: "image", src: "/assets/wall/ck-bag-fence.webp",          aspect: "5/6" },
  { id: "cafe",                 type: "video", src: "/assets/wall/cafe.mp4",                   aspect: "9/16", poster: `${P}/cafe.jpg` },
  { id: "ck-f26-city-plaza",    type: "video", src: "/assets/wall/ck-f26-city-plaza.mp4",      aspect: "9/16", poster: `${P}/ck-f26-city-plaza.jpg` },
  { id: "grid-beauty-blue",     type: "image", src: "/assets/wall/grid-beauty-blue.webp",      aspect: "3/4" },
  { id: "ck-crosswalk",         type: "image", src: "/assets/wall/ck-crosswalk.webp",          aspect: "9/10" },
  { id: "grid-mohawk",          type: "video", src: "/assets/wall/grid-mohawk.mp4",            aspect: "9/16", poster: `${P}/grid-mohawk.jpg` },
  { id: "grid-wrestle-tropical", type: "image", src: "/assets/wall/grid-wrestle-tropical.webp", aspect: "3/4" },
  { id: "grid-wet-goggles",     type: "image", src: "/assets/wall/grid-wet-goggles.webp",      aspect: "3/4" },
  { id: "ck-platform-bomber",   type: "image", src: "/assets/wall/ck-platform-bomber.webp",    aspect: "3/4" },
  { id: "diesel",               type: "video", src: "/assets/wall/diesel.mp4",                 aspect: "9/16", client: "Diesel", poster: `${P}/diesel.jpg` },
  { id: "ck-f26-charms",        type: "video", src: "/assets/wall/ck-f26-charms.mp4",          aspect: "4/5",  poster: `${P}/ck-f26-charms.jpg` },
  { id: "grid-wet-cereal",      type: "image", src: "/assets/wall/grid-wet-cereal.webp",       aspect: "3/4" },
  { id: "ck-revolving-door",    type: "image", src: "/assets/wall/ck-revolving-door.webp",     aspect: "3/4" },
  { id: "flower-market",        type: "video", src: "/assets/wall/flower-market.mp4",          aspect: "9/16", poster: `${P}/flower-market.jpg` },
];

const moreItems2: WallItem[] = [
  { id: "grid-eyewear-02",      type: "image", src: "/assets/wall/grid-eyewear-02.webp",      aspect: "3/4" },
  { id: "ck-street-lookback",   type: "image", src: "/assets/wall/ck-street-lookback.webp",   aspect: "3/4" },
  { id: "grid-beauty-bob",      type: "image", src: "/assets/wall/grid-beauty-bob.webp",      aspect: "3/4" },
  { id: "ck-f26-qixi",          type: "video", src: "/assets/wall/ck-f26-qixi.mp4",           aspect: "9/16", poster: `${P}/ck-f26-qixi.jpg` },
  { id: "grid-wet-stars",       type: "image", src: "/assets/wall/grid-wet-stars.webp",       aspect: "3/4" },
  { id: "ck-bag-wall",          type: "image", src: "/assets/wall/ck-bag-wall.webp",          aspect: "2/1" },
  { id: "grid-blue",            type: "video", src: "/assets/wall/grid-blue.mp4",             aspect: "9/16", poster: `${P}/grid-blue.jpg` },
  { id: "grid-wrestle-warrior", type: "image", src: "/assets/wall/grid-wrestle-warrior.webp", aspect: "3/4" },
  { id: "ck-subway-train",      type: "image", src: "/assets/wall/ck-subway-train.webp",      aspect: "3/1" },
  { id: "squirrel",             type: "video", src: "/assets/wall/squirrel.mp4",              aspect: "9/16", poster: `${P}/squirrel.jpg` },
  { id: "grid-eyewear-03",      type: "image", src: "/assets/wall/grid-eyewear-03.webp",      aspect: "4/5" },
  { id: "ck-sandals-bridge",    type: "image", src: "/assets/wall/ck-sandals-bridge.webp",    aspect: "7/4" },
  { id: "ck-f26-tennis",        type: "video", src: "/assets/wall/ck-f26-tennis.mp4",         aspect: "9/16", poster: `${P}/ck-f26-tennis.jpg` },
  { id: "grid-beauty-facepaint", type: "image", src: "/assets/wall/grid-beauty-facepaint.webp", aspect: "3/4" },
  { id: "ck-f26-plaza-wide",    type: "image", src: "/assets/wall/ck-f26-plaza-wide.webp",    aspect: "16/9" },
  { id: "grid-wet-tortilla",    type: "image", src: "/assets/wall/grid-wet-tortilla.webp",    aspect: "3/4" },
];

function WallVideo({ item }: { item: WallItem }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // DOM property must be set — React's muted attribute is ignored by iOS.
    el.muted = true;

    let loaded = false;
    let inView = false;

    // Only play when BOTH src is loaded AND element is visible.
    // Avoids the race where playObs fires before loadObs has set the src.
    const tryPlay = () => { if (loaded && inView) el.play().catch(() => {}); };

    // Pre-fetch src 200 px before the element enters view
    const loadObs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !loaded) {
          loaded = true;
          el.preload = "auto";
          el.src = item.src;
          el.load();
          tryPlay();          // play immediately if already in view
          loadObs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    // Play / pause as the element enters / leaves the viewport
    const playObs = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView) tryPlay(); else el.pause();
      },
      { threshold: 0.1 }
    );

    // iOS unlock: first touch on the page dispatches "videoUnlock"
    const onUnlock = () => {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) el.play().catch(() => {});
    };
    window.addEventListener("videoUnlock", onUnlock, { once: true });

    loadObs.observe(el);
    playObs.observe(el);
    return () => {
      loadObs.disconnect();
      playObs.disconnect();
      window.removeEventListener("videoUnlock", onUnlock);
    };
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
  const [revealLevel, setRevealLevel] = useState(0); // 0 = base, 1 = +batch 1, 2 = +batch 1 + batch 2
  const wallItems =
    revealLevel === 0 ? items :
    revealLevel === 1 ? [...items, ...moreItems1] :
    [...items, ...moreItems1, ...moreItems2];
  const nextBatchCount = revealLevel === 0 ? moreItems1.length : moreItems2.length;

  return (
    <section id="portfolio" className="border-t border-black/6 bg-[#F7F6F2]">

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
        {wallItems.map((item) => (
          <div key={item.id} className="break-inside-avoid" style={{ marginBottom: "3px" }}>
            {item.type === "video" ? <WallVideo item={item} /> : <WallImage item={item} />}
          </div>
        ))}
      </div>

      {revealLevel < 2 && (
        <div className="flex justify-center py-10">
          <button
            onClick={() => setRevealLevel((l) => Math.min(l + 1, 2))}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[11px] font-bold tracking-widest uppercase bg-[#0A0A0A] text-white hover:bg-black/85 active:scale-[0.97] transition-all duration-200"
          >
            View more
            <span className="text-white/50">({nextBatchCount})</span>
          </button>
        </div>
      )}

    </section>
  );
}
