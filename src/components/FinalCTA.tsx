"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="cta" ref={ref} className="relative py-24 md:py-52 px-6 overflow-hidden border-t border-black/6">
      {/* Subtle vignette */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[300px]"
          style={{
            background: "radial-gradient(ellipse, rgba(0,0,0,0.03) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <motion.div style={{ y }} className="relative z-10 max-w-4xl mx-auto text-center">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <span className="w-8 h-px" style={{ background: "var(--accent)", opacity: 0.4 }} />
          <p className="text-[10px] tracking-[0.3em] uppercase text-black/35">
            Let&apos;s work together
          </p>
          <span className="w-8 h-px" style={{ background: "var(--accent)", opacity: 0.4 }} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1, ease }}
          className="text-[clamp(3rem,9vw,7rem)] font-black leading-[0.92] tracking-tight text-[#0A0A0A]"
        >
          Your next campaign
          <br />
          <span className="text-black/18">starts with a brief.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 text-base text-black/40 max-w-md mx-auto leading-relaxed"
        >
          Tell us about your product, your brand, and what you&apos;re trying to say.
          We&apos;ll handle the rest.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="mailto:hello@graft.media"
            className="px-10 py-5 rounded-full text-sm font-bold tracking-widest uppercase bg-[#0A0A0A] text-white hover:bg-black/85 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Start a project
          </motion.a>

          <motion.a
            href="mailto:hello@graft.media"
            className="px-10 py-5 rounded-full text-sm font-semibold tracking-widest uppercase text-black/35 border border-black/12 hover:text-black/60 hover:border-black/25 transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            hello@graft.media
          </motion.a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 text-xs text-black/35 tracking-wide"
        >
          Typical delivery 48–72 hours · All formats included · Unlimited revisions
        </motion.p>
      </motion.div>
    </section>
  );
}
