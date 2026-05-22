"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function ImmersiveSection() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale      = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.94]);
  const textY      = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]);
  // Overlay goes from very dark → slightly lighter at center → dark again
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.92, 0.72, 0.72, 0.92]);

  return (
    <section id="immersive" ref={ref} className="relative py-8 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          style={{ scale }}
          className="relative rounded-3xl overflow-hidden aspect-video"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {/* The hero morph video — white bg, heavy overlay turns it cinematic */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 w-full h-full object-cover"
            src="/assets/videos/hero-morph.mp4"
          />

          {/* Heavy dark overlay — renders the white-bg video as a dark cinematic bg */}
          <motion.div
            style={{
              opacity: overlayOpacity,
              background:
                "linear-gradient(to bottom, rgba(8,8,8,0.7) 0%, rgba(8,8,8,0.55) 40%, rgba(8,8,8,0.55) 60%, rgba(8,8,8,0.7) 100%)",
            }}
            className="absolute inset-0"
          />

          {/* Centred text block */}
          <motion.div
            style={{ y: textY }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-6 font-semibold"
            >
              Photorealistic Quality
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease }}
              className="text-[clamp(2rem,6vw,5rem)] font-black leading-tight text-white max-w-3xl"
            >
              Every pixel. Rendered
              <br />
              <span className="shimmer-text-light">to perfection.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 text-lg text-white/60 max-w-lg font-light"
            >
              Studio-grade 3D rendering at 4K resolution, with physically‑based
              materials that react to light exactly as they would in the real world.
            </motion.p>
          </motion.div>

          {/* Corner brackets */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/20 rounded-tl-lg" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/20 rounded-tr-lg" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/20 rounded-bl-lg" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/20 rounded-br-lg" />
        </motion.div>
      </div>
    </section>
  );
}
