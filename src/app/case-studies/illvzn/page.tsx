"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const stats = [
  { value: "15+", label: "Assets delivered" },
  { value: "3",   label: "Output formats" },
  { value: "1",   label: "Revision round" },
];

const campaignGrid = [
  { src: "edit-port-1.jpg", aspect: "2/3" },
  { src: "edit-land-1.jpg", aspect: "3/2" },
  { src: "edit-port-2.jpg", aspect: "2/3" },
  { src: "edit-land-2.jpg", aspect: "3/2" },
  { src: "edit-port-3.jpg", aspect: "2/3" },
  { src: "glitch.jpg",      aspect: "2/3" },
  { src: "edit-port-4.jpg", aspect: "2/3" },
  { src: "edit-land-3.jpg", aspect: "3/2" },
];

export default function ILLVZNCaseStudy() {
  return (
    <main className="relative bg-[#F7F6F2] min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative h-[100svh] overflow-hidden">
        <Image
          src="/assets/case-studies/illvzn/edit-land-1.jpg"
          alt="ILLVZN Campaign Hero"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3, ease }}
          className="absolute bottom-0 left-0 right-0 px-6 md:px-14 pb-14 md:pb-20"
        >
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/45 mb-4 font-semibold">
            Case study
          </p>
          <h1 className="text-[clamp(4rem,12vw,9rem)] font-black leading-[0.85] text-white tracking-tighter">
            ILLVZN
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/55 max-w-md leading-relaxed">
            Full campaign production for an emerging UK streetwear brand, from creative direction to final delivery.
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
              ILLVZN needed a complete campaign identity for their collaboration with Footasylum:
              campaign stills, editorial portraits, a glitch-art hero asset, and a motion piece
              for Oxford Street&apos;s digital screens.
            </p>
          </motion.div>

          <motion.div
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-x-8 gap-y-10"
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
              01. Concepts
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-[#0A0A0A] max-w-xl">
              Building the visual world.
            </h2>
          </motion.div>

          <div className="grid grid-cols-3 gap-1 md:gap-2 mb-8">
            {[1, 2, 3].map((n, i) => (
              <motion.div
                key={n}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="relative aspect-square overflow-hidden"
              >
                <Image
                  src={`/assets/case-studies/illvzn/concept-${n}.webp`}
                  alt={`ILLVZN concept direction ${n}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 25vw"
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
            We opened with mood imagery to lock in character aesthetic, lighting direction, and the
            gritty urban world the brand lives in. Three directions presented. One signed off.
            Then we built everything from there.
          </motion.p>
        </div>
      </section>

      {/* ── 02 Campaign Stills ── */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-4 font-semibold">
              02. Asset Creation
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-[#0A0A0A]">
              The full suite.
            </h2>
          </motion.div>
        </div>

        <div
          className="columns-2 md:columns-4"
          style={{ columnGap: "3px" }}
        >
          {campaignGrid.map((img) => (
            <div key={img.src} className="break-inside-avoid" style={{ marginBottom: "3px" }}>
              <div className="relative overflow-hidden" style={{ aspectRatio: img.aspect }}>
                <Image
                  src={`/assets/case-studies/illvzn/${img.src}`}
                  alt="ILLVZN campaign still"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 03 Motion ── */}
      <section className="border-t border-black/6 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:min-h-[75vh]">

          {/* Video — full height left column */}
          <div className="relative w-full lg:w-1/2 aspect-square lg:aspect-auto bg-black overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/assets/case-studies/illvzn/tobimanny.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Text — right column */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-14 lg:px-20 py-16 md:py-24"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-5 font-semibold">
              03. Motion
            </p>
            <h2 className="text-[clamp(2rem,3.5vw,3.2rem)] font-black leading-tight text-[#0A0A0A] mb-8">
              Oxford Street, digital.
            </h2>
            <p className="text-base text-black/55 leading-relaxed mb-10 max-w-sm">
              A square-format edit produced for the ILLVZN × Footasylum Oxford Street
              digital screen placement. Directed, composited, and colour-graded in-house.
            </p>
            <div className="flex flex-col gap-5 border-t border-black/8 pt-8">
              {[
                { label: "Format",    value: "1:1 square, 1260×1260px" },
                { label: "Placement", value: "Oxford Street digital OOH" },
                { label: "Tools",     value: "DaVinci Resolve · After Effects" },
              ].map((item) => (
                <div key={item.label} className="flex items-baseline gap-6">
                  <span className="text-[10px] tracking-[0.22em] uppercase text-black/30 font-semibold w-20 flex-shrink-0">
                    {item.label}
                  </span>
                  <span className="text-sm text-black/60">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── In the Wild ── */}
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
              In the wild
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-[#0A0A0A]">
              Deployed.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-2 mb-2">
            {[1, 2, 3].map((n, i) => (
              <motion.div
                key={n}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="relative aspect-[2/3] overflow-hidden"
              >
                <Image
                  src={`/assets/case-studies/illvzn/photo-${n}.jpg`}
                  alt={`ILLVZN × Footasylum campaign deployment`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-1 md:gap-2">
            {[1, 2].map((n, i) => (
              <motion.div
                key={n}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="relative aspect-video overflow-hidden bg-black"
              >
                <Image
                  src={`/assets/case-studies/illvzn/mockup-${n}.jpg`}
                  alt={`Footasylum platform placement`}
                  fill
                  className="object-cover"
                  sizes="50vw"
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
            <Link
              href="/#cta"
              className="inline-flex px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-[#0A0A0A] text-white hover:bg-black/80 transition-colors duration-300"
            >
              Start a project
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
