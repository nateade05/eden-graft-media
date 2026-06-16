"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { copy } from "@/content/copy";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const { stats, brief, concept, assets, film, banner, cta, hero: heroText } = copy.nike;

const gridImages = [
  "portrait-1.jpg",
  "portrait-2.jpg",
  "portrait-3.jpg",
  "portrait-4.jpg",
  "portrait-5.jpg",
  "portrait-6.jpg",
];

function NikeVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => { ref.current?.play().catch(() => {}); }, []);
  return (
    <div className="relative w-full h-full bg-black">
      <video ref={ref} autoPlay muted loop playsInline className="w-full h-full object-contain">
        <source src="/assets/case-studies/nike/concept.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export default function NikeCaseStudy() {
  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative h-[100svh] overflow-hidden">
        <Image
          src="/assets/case-studies/nike/detail-grill.jpg"
          alt="Nike Campaign"
          fill priority loading="eager"
          className="object-cover object-center"
          sizes="100vw"
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

      {/* ── 01 The Concept ── */}
      <section className="py-20 md:py-28 border-b border-white/6">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-4 font-semibold">
              {concept.overline}
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-white max-w-2xl">
              {concept.headline}
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-2" style={{ gap: "3px" }}>
          {["portrait-7.jpg", "portrait-8.jpg"].map((src, i) => (
            <motion.div
              key={src}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative overflow-hidden"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src={`/assets/case-studies/nike/${src}`}
                alt=""
                fill
                className="object-cover object-top"
                sizes="50vw"
              />
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24">
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-base text-white/55 leading-relaxed"
          >
            {concept.body1}
          </motion.p>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-base text-white/55 leading-relaxed"
          >
            {concept.body2}
          </motion.p>
        </div>
      </section>

      {/* ── 02 The Assets ── */}
      <section className="py-20 md:py-28 border-b border-white/6">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-4 font-semibold">
              {assets.overline}
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-white">
              {assets.headline}
            </h2>
          </motion.div>
        </div>

        {/* Portrait grid */}
        <div className="grid grid-cols-3 md:grid-cols-6" style={{ gap: "3px" }}>
          {gridImages.map((src, i) => (
            <motion.div
              key={src}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative overflow-hidden group"
              style={{ aspectRatio: "9/16" }}
            >
              <Image
                src={`/assets/case-studies/nike/${src}`}
                alt=""
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 33vw, 16vw"
              />
            </motion.div>
          ))}
        </div>

        {/* Detail pair */}
        <div className="grid grid-cols-2 mt-[3px]" style={{ gap: "3px" }}>
          {["detail-grill.jpg", "portrait-1.jpg"].map((src, i) => (
            <motion.div
              key={src}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="relative overflow-hidden"
              style={{ aspectRatio: "16/9" }}
            >
              <Image
                src={`/assets/case-studies/nike/${src}`}
                alt=""
                fill
                className="object-cover object-center"
                sizes="50vw"
              />
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-8">
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-sm text-white/40 max-w-xl leading-relaxed"
          >
            {assets.body}
          </motion.p>
        </div>
      </section>

      {/* ── 03 The Film ── */}
      <section className="border-b border-white/6 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center">

          {/* Text — flex-1 gets all the remaining width beside the portrait video */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex-1 min-w-[260px] flex flex-col justify-center px-8 md:px-14 lg:px-20 py-16 md:py-24 order-2 lg:order-1"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-5 font-semibold">
              {film.overline}
            </p>
            <h2 className="text-[clamp(2rem,3.5vw,3.2rem)] font-black leading-tight text-white mb-8">
              {film.headline}
            </h2>
            <p className="text-base text-white/55 leading-relaxed mb-10 max-w-lg">
              {film.body}
            </p>
            <div className="flex flex-col gap-5 border-t border-white/8 pt-8 max-w-md">
              {film.specs.map((item) => (
                <div key={item.label} className="flex items-baseline gap-6">
                  <span className="text-[10px] tracking-[0.22em] uppercase text-white/30 font-semibold w-16 flex-shrink-0">
                    {item.label}
                  </span>
                  <span className="text-sm text-white/60">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Portrait video — aspect-[9/16] locks exact ratio at all sizes */}
          <div className="w-full aspect-[9/16] lg:w-[36%] lg:flex-shrink-0 lg:pr-14 xl:pr-20 order-1 lg:order-2">
            <NikeVideo />
          </div>

        </div>
      </section>

      {/* ── Swoosh banner ── */}
      <section className="relative overflow-hidden" style={{ height: "44vh" }}>
        <Image
          src="/assets/case-studies/nike/swoosh.jpg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
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
