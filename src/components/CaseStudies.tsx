"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { copy } from "@/content/copy";
import { blurData } from "@/lib/blurData";
import { SLUG_KEY } from "@/components/HomeScrollRestore";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

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
  {
    slug: "music",
    client: copy.portfolio.caseStudies.items[3].client,
    title: copy.portfolio.caseStudies.items[3].title,
    description: copy.portfolio.caseStudies.items[3].description,
    image: "/assets/case-studies/music/card.webp",
    video: "/assets/case-studies/music/card-loop.mp4",
    poster: "/assets/case-studies/music/card-poster.jpg",
  },
];

export default function CaseStudies() {
  return (
    <section id="case-studies" className="border-t border-black/6 bg-[#F7F6F2]">
      <div className="px-6 py-20 md:py-28 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="mb-14"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-5 font-semibold">
            {copy.portfolio.caseStudies.overline}
          </p>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-[#0A0A0A]">
            {copy.portfolio.caseStudies.headline}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
          {caseStudies.map((cs, i) => (
            <motion.div
              key={cs.slug}
              data-slug={cs.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
            >
              <Link
                href={`/case-studies/${cs.slug}`}
                className="group block"
                onClick={() => sessionStorage.setItem(SLUG_KEY, cs.slug)}
              >
                {/* Image / Video */}
                <div className="relative overflow-hidden aspect-[4/3] bg-black/5 mb-5">
                  {cs.video ? (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
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
