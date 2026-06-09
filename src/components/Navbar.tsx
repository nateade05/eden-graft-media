"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Work", href: "#portfolio" },
  { label: "Contact", href: "#cta" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const logoCanvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const darkHero = pathname.startsWith("/case-studies");
  // Use white text only on case-study pages (dark hero) when not yet scrolled
  const light = !scrolled && darkHero;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Canvas-based logo — mix-blend-mode:multiply works on <canvas> in Safari/WebKit;
  // applying it to a <video> element directly is not composited correctly in Safari.
  useEffect(() => {
    const canvas = logoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");

    const src1 = document.createElement("source");
    src1.src = "/assets/logo/logo-morph-alpha.webm";
    src1.type = "video/webm";
    const src2 = document.createElement("source");
    src2.src = "/assets/logo/logo-morph.mp4";
    src2.type = "video/mp4";
    video.appendChild(src1);
    video.appendChild(src2);
    video.load();

    let raf = 0;
    const draw = () => {
      if (video.readyState >= 2 && video.videoWidth > 0) {
        // Sync canvas to actual video dimensions so drawImage doesn't squash content
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Key out near-white background pixels — works in Safari without mix-blend-mode
        // (fixed-position elements are always GPU compositor layers; Safari can't blend those)
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i + 1], b = d[i + 2];
          if (r > 220 && g > 220 && b > 220) {
            d[i + 3] = Math.round(Math.max(0, (255 - Math.min(r, g, b)) * (255 / 35)));
          }
        }
        ctx.putImageData(img, 0, 0);
      }
      raf = requestAnimationFrame(draw);
    };

    video.play().catch(() => {});
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      video.pause();
    };
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#F7F6F2]/90 backdrop-blur-xl border-b border-black/6"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-25 flex items-center justify-between">
          <a href="/" className="flex items-center group">
            {/* Mobile: static logo — multiply blend on video doesn't composite on iOS */}
            <Image
              src="/assets/logo/logo-clean.png"
              alt="Graft Media"
              width={120}
              height={30}
              className={`md:hidden h-8 w-auto transition-all duration-500 group-hover:opacity-100 ${
                light ? "opacity-90 invert" : "opacity-80"
              }`}
            />
            {/* Desktop: canvas-based animated logo — multiply blend composites correctly in Safari on canvas, not on video */}
            <canvas
              ref={logoCanvasRef}
              width={894}
              height={250}
              aria-label="Graft Media"
              className="hidden md:block h-25 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-[11px] tracking-[0.2em] uppercase transition-colors duration-500 ${
                  light ? "text-white/70 hover:text-white" : "text-black/35 hover:text-black/80"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="#cta"
              className={`hidden md:inline-flex items-center px-5 py-2.5 text-[11px] font-bold tracking-widest uppercase rounded-full border transition-all duration-500 ${
                light
                  ? "border-white/35 text-white/70 hover:text-white hover:border-white/60"
                  : "border-black/20 text-black/55 hover:text-black/85 hover:border-black/35 hover:bg-black/[0.03]"
              }`}
            >
              Start a project
            </a>
            <button
              className={`md:hidden p-2 transition-colors duration-500 ${
                light ? "text-white/70 hover:text-white" : "text-black/40 hover:text-black"
              }`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              <span className="block w-5 h-px bg-current mb-1.5" />
              <span className="block w-5 h-px bg-current mb-1.5" />
              <span className="block w-3 h-px bg-current" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#F7F6F2]/97 backdrop-blur-xl pt-16 px-6 md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <nav className="flex flex-col gap-1 pt-8">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="text-3xl font-black text-black/60 hover:text-black py-4 border-b border-black/6 tracking-tight"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 inline-flex justify-center py-4 rounded-full bg-[#0A0A0A] text-white font-bold text-sm tracking-widest uppercase"
              >
                Start a project
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
