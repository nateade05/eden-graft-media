"use client";

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

const items = copy.shortFilms.items;

export default function ShortFilmsPage() {
  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      <Navbar />

      <section className="pt-40 pb-16 md:pt-52 md:pb-24 px-6 border-b border-white/6">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <p className="text-[10px] tracking-[0.35em] uppercase text-white/40 mb-5 font-semibold">
              {copy.shortFilms.overline}
            </p>
            <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[0.95] text-white tracking-tighter max-w-3xl">
              {copy.shortFilms.headline}
            </h1>
            <p className="mt-6 text-base md:text-lg text-white/50 max-w-xl leading-relaxed">
              {copy.shortFilms.body}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto flex flex-col gap-20 md:gap-28">
          {items.map((item, i) => (
            <motion.div
              key={item.slug}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="relative overflow-hidden rounded-xl bg-black aspect-video mb-6">
                <CaseStudyVideoPlayer
                  src={`/assets/short-films/${item.slug}/film.mp4`}
                  poster={`/assets/short-films/${item.slug}/poster.jpg`}
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">{item.title}</h2>
              <p className="text-sm md:text-base text-white/50 max-w-2xl leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
