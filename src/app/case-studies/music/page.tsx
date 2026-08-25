"use client";

import Image from "next/image";
import { blurData } from "@/lib/blurData";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CaseStudyVideoPlayer from "@/components/CaseStudyVideoPlayer";
import { copy } from "@/content/copy";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const { stats, brief, visuals, visualisers, banner, cta, hero: heroText } = copy.music;

const visualsGrid = ["visual-1.webp", "visual-2.webp", "visual-3.webp", "visual-4.webp", "visual-5.webp", "visual-6.webp"];

const trackVideos = [
  { file: "kino-v2.mp4", poster: "kino-poster.jpg" },
  { file: "not-tonight-v2.mp4", poster: "not-tonight-poster.jpg" },
  { file: "wide-open-v2.mp4", poster: "wide-open-poster.jpg" },
];

export default function MusicCaseStudy() {
  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative h-[100svh] overflow-hidden">
        <Image
          src="/assets/case-studies/music/hero.webp"
          alt="Music Videos"
          fill priority loading="eager"
          className="object-cover object-center"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={blurData["/assets/case-studies/music/hero.webp"]}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/85" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3, ease }}
          className="absolute bottom-0 left-0 right-0 px-6 md:px-14 pb-14 md:pb-20"
        >
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/45 mb-4 font-semibold">
            {heroText.overline}
          </p>
          <h1 className="text-[clamp(3rem,9vw,7.5rem)] font-black leading-[0.85] text-white tracking-tighter">
            {heroText.headline}
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/55 max-w-lg leading-relaxed">
            {heroText.subtitle}
          </p>
        </motion.div>
      </section>

      {/* ── Brief + Stats ── */}
      <section className="py-20 md:py-32 px-6 border-b border-white/6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-6 font-semibold">
              {brief.overline}
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-white/65 max-w-lg">
              {brief.body}
            </p>
          </motion.div>

          <motion.div
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-3 gap-x-8 gap-y-10"
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={fadeUp}>
                <p className="text-[clamp(2.5rem,5vw,3.5rem)] font-black leading-none text-white mb-2">{s.value}</p>
                <p className="text-[10px] tracking-[0.22em] uppercase text-white/35 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 01 The Visuals ── */}
      <section className="py-20 md:py-28 border-b border-white/6">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-4 font-semibold">
              {visuals.overline}
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-white max-w-2xl mb-6">
              {visuals.headline}
            </h2>
            <p className="text-base text-white/55 leading-relaxed max-w-xl">
              {visuals.body}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "3px" }}>
          {visualsGrid.map((src, i) => (
            <motion.div
              key={src}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="relative overflow-hidden group"
              style={{ aspectRatio: "16/9" }}
            >
              <Image
                src={`/assets/case-studies/music/${src}`}
                alt=""
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 33vw"
                placeholder="blur"
                blurDataURL={blurData[`/assets/case-studies/music/${src}`]}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 02 The Visualisers ── */}
      <section className="py-20 md:py-28 border-b border-white/6">
        <div className="max-w-7xl mx-auto px-6 mb-14">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-4 font-semibold">
              {visualisers.overline}
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-white mb-6">
              {visualisers.headline}
            </h2>
            <p className="text-base text-white/55 leading-relaxed max-w-xl">
              {visualisers.body}
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-16 md:gap-20">
          {visualisers.tracks.map((track, i) => (
            <motion.div
              key={track.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.05 }}
              className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-14 items-center"
            >
              <div className="relative overflow-hidden rounded-xl bg-black aspect-video">
                <CaseStudyVideoPlayer
                  src={`/assets/case-studies/music/${trackVideos[i].file}`}
                  poster={`/assets/case-studies/music/${trackVideos[i].poster}`}
                />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-white/30 font-semibold mb-3">
                  Track {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-2xl font-black text-white mb-3">{track.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{track.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Banner ── */}
      <section className="relative overflow-hidden" style={{ height: "44vh" }}>
        <Image
          src="/assets/case-studies/music/card.webp"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={blurData["/assets/case-studies/music/card.webp"]}
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-[clamp(1.1rem,2.8vw,2rem)] font-black text-white/75 tracking-[0.15em] uppercase text-center px-6"
          >
            {banner}
          </motion.p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 md:py-36 px-6 border-t border-white/6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-6 font-semibold">
              {cta.overline}
            </p>
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-tight text-white mb-10">
              {cta.headline}
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#cta"
                className="inline-flex px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-white text-black hover:bg-white/90 transition-colors duration-300"
              >
                {cta.primaryButton}
              </Link>
              <Link
                href="/case-studies/beverley-knight"
                className="inline-flex px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase border border-white/20 text-white/55 hover:border-white/35 hover:text-white/80 transition-all duration-300"
              >
                {cta.secondaryButton}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
