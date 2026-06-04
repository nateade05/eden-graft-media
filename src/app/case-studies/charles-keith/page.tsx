"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const looks = [
  { src: "look-1.jpg", label: "Look 01" },
  { src: "look-2.jpg", label: "Look 02" },
  { src: "look-3.jpg", label: "Look 03" },
  { src: "look-4.jpg", label: "Look 04" },
  { src: "look-5.jpg", label: "Look 05" },
  { src: "look-6.jpg", label: "Look 06" },
];

const stats = [
  { value: "12",  label: "AI-generated looks" },
  { value: "60+", label: "Campaign stills" },
  { value: "1",   label: "Hero film" },
];

function CampaignVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    ref.current?.play().catch(() => {});
  }, []);

  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={ref}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full"
      >
        <source src="/assets/case-studies/charles-keith/campaign.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export default function CharlesKeithCaseStudy() {
  return (
    <main className="relative bg-[#F7F6F2] min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative h-[100svh] overflow-hidden">
        <Image
          src="/assets/case-studies/charles-keith/hero.jpg"
          alt="Charles & Keith Summer Calling Campaign"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/65" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3, ease }}
          className="absolute bottom-0 left-0 right-0 px-6 md:px-14 pb-14 md:pb-20"
        >
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/45 mb-4 font-semibold">
            Case study
          </p>
          <h1 className="text-[clamp(3rem,9vw,7.5rem)] font-black leading-[0.85] text-white tracking-tighter">
            Charles & Keith
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/55 max-w-lg leading-relaxed">
            Summer Calling. A fully AI-produced runway campaign for Charles & Keith's SS26 collection.
          </p>
        </motion.div>
      </section>

      {/* ── Brief + Stats ── */}
      <section className="py-20 md:py-32 px-6 border-b border-black/6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-6 font-semibold">
              The brief
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-black/65 max-w-lg">
              Charles & Keith needed a full runway campaign for their Summer 2026 collection.
              Every look AI-generated from the ground up: character, styling, set, and light.
              No casting. No studio. No shoot days. A complete visual campaign built entirely in AI.
            </p>
          </motion.div>

          <motion.div
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-x-8 gap-y-10"
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={fadeUp}>
                <p className="text-[clamp(2.5rem,5vw,3.5rem)] font-black leading-none text-[#0A0A0A] mb-2">
                  {s.value}
                </p>
                <p className="text-[10px] tracking-[0.22em] uppercase text-black/35 font-medium">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 01 Concepts ── */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-4 font-semibold">
              01. Direction
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-[#0A0A0A] max-w-xl">
              Setting the world.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
            {[1, 2, 3].map((n, i) => (
              <motion.div
                key={n}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="relative aspect-video overflow-hidden"
              >
                <Image
                  src={`/assets/case-studies/charles-keith/concept-${n}.jpg`}
                  alt={`Summer Calling direction ${n}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </motion.div>
            ))}
          </div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-sm text-black/40 max-w-xl leading-relaxed"
          >
            Before generating a single look, we established the world: light quality, set
            aesthetic, colour palette, and the mood the collection needed to live in.
            Everything built from a creative direction brief, not a prompt.
          </motion.p>
        </div>
      </section>

      {/* ── 02 The Looks ── */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-4 font-semibold">
              02. The Looks
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-[#0A0A0A]">
              12 looks. No studio.
            </h2>
          </motion.div>
        </div>

        {/* Full-bleed look grid */}
        <div
          className="grid grid-cols-3 md:grid-cols-6"
          style={{ gap: "3px" }}
        >
          {looks.map((look, i) => (
            <motion.div
              key={look.src}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative group overflow-hidden"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src={`/assets/case-studies/charles-keith/${look.src}`}
                alt={look.label}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <p className="absolute bottom-3 left-3 text-[9px] tracking-[0.22em] uppercase text-white/75 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {look.label}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-8">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-sm text-black/40 max-w-xl leading-relaxed"
          >
            Each look built individually using AI: character generation, outfit application,
            lighting matching, and final grading. Iterated to match the creative direction exactly.
          </motion.p>
        </div>
      </section>

      {/* ── 03 Campaign Stills ── */}
      <section className="py-20 md:py-28 border-t border-black/6">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-4 font-semibold">
              03. Campaign Stills
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-[#0A0A0A]">
              Graded and ready.
            </h2>
          </motion.div>
        </div>

        {/* Wide aerial shot */}
        <div className="relative w-full aspect-[16/7] overflow-hidden mb-1">
          <Image
            src="/assets/case-studies/charles-keith/aerial.jpg"
            alt="Summer Calling aerial campaign still"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "3px" }}>
          {[1, 2, 3, 4].map((n, i) => (
            <motion.div
              key={n}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="relative aspect-video overflow-hidden"
            >
              <Image
                src={`/assets/case-studies/charles-keith/still-${n}.jpg`}
                alt={`Summer Calling campaign still ${n}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 04 The Film ── */}
      <section className="border-t border-black/6 overflow-hidden">
        <div className="flex flex-col md:flex-row md:h-[70vh]">

          {/* Text left column — takes remaining space after video */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex-1 min-w-0 flex flex-col justify-center px-8 md:px-14 lg:px-20 py-16 md:py-24 order-2 md:order-1"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-5 font-semibold">
              04. The Film
            </p>
            <h2 className="text-[clamp(2rem,3.5vw,3.2rem)] font-black leading-tight text-[#0A0A0A] mb-8">
              Summer Calling.
            </h2>
            <p className="text-base text-black/55 leading-relaxed mb-10 max-w-sm">
              The campaign film. Every frame AI-generated and composited, colour-graded
              to match the creative direction. Produced for YouTube and paid social placements.
            </p>
            <div className="flex flex-col gap-5 border-t border-black/8 pt-8">
              {[
                { label: "Format",  value: "1920×1080, 16:9" },
                { label: "Output",  value: "YouTube, paid social" },
                { label: "Tools",   value: "Kling AI · Runway · DaVinci Resolve" },
              ].map((item) => (
                <div key={item.label} className="flex items-baseline gap-6">
                  <span className="text-[10px] tracking-[0.22em] uppercase text-black/30 font-semibold w-16 flex-shrink-0">
                    {item.label}
                  </span>
                  <span className="text-sm text-black/60">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Video right column — 16:9 at full section height */}
          <div className="w-full aspect-video md:h-full md:w-auto flex-shrink-0 order-1 md:order-2">
            <CampaignVideo />
          </div>

        </div>
      </section>

      {/* ── 05 In Context ── */}
      <section className="py-20 md:py-28 px-6 border-t border-black/6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-4 font-semibold">
              05. In Context
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-[#0A0A0A]">
              How it lands.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {[1, 2, 3].map((n, i) => (
              <motion.div
                key={n}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="relative aspect-video overflow-hidden"
              >
                <Image
                  src={`/assets/case-studies/charles-keith/perspec-${n}.jpg`}
                  alt={`Summer Calling in context ${n}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 md:py-36 px-6 border-t border-black/6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-6 font-semibold">
              Start your project
            </p>
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-tight text-[#0A0A0A] mb-10">
              Brief in. Campaign out.
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#cta"
                className="inline-flex px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-[#0A0A0A] text-white hover:bg-black/80 transition-colors duration-300"
              >
                Start a project
              </Link>
              <Link
                href="/case-studies/illvzn"
                className="inline-flex px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase border border-black/20 text-black/55 hover:border-black/35 hover:text-black/80 transition-all duration-300"
              >
                View ILLVZN
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
