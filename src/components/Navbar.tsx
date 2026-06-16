"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { copy } from "@/content/copy";

const links = copy.nav.links;

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
    // Safari can't use mix-blend-mode on fixed compositor layers, so we crop
    // the canvas to the tight content bounds on first frame — any residual white
    // fringe is then a few pixels at the very edge rather than a large visible box.
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    let cropSrc: { x: number; y: number; w: number; h: number } | null = null;
    let boundsDetected = false;

    const draw = () => {
      if (video.readyState >= 2 && video.videoWidth > 0) {
        const vw = video.videoWidth;
        const vh = video.videoHeight;

        if (isSafari && !boundsDetected) {
          boundsDetected = true;
          // Scan the first frame on a temp canvas to find the non-white bounding box.
          // Threshold at 40 to avoid MP4 compression artefacts at frame edges being
          // detected as content (they typically deviate < 20 from white).
          const tmp = document.createElement("canvas");
          tmp.width = vw; tmp.height = vh;
          const tc = tmp.getContext("2d")!;
          tc.drawImage(video, 0, 0);
          const { data } = tc.getImageData(0, 0, vw, vh);
          let x0 = vw, y0 = vh, x1 = 0, y1 = 0;
          for (let y = 0; y < vh; y++) {
            for (let x = 0; x < vw; x++) {
              const i = (y * vw + x) * 4;
              if (Math.max(255 - data[i], 255 - data[i + 1], 255 - data[i + 2]) > 40) {
                if (x < x0) x0 = x; if (y < y0) y0 = y;
                if (x > x1) x1 = x; if (y > y1) y1 = y;
              }
            }
          }
          if (x1 > x0) {
            const pad = 12;
            const cx = Math.max(0, x0 - pad);
            const cy = Math.max(0, y0 - pad);
            cropSrc = {
              x: cx, y: cy,
              w: Math.min(vw, x1 + pad + 1) - cx,
              h: Math.min(vh, y1 + pad + 1) - cy,
            };
            canvas.width = cropSrc.w;
            canvas.height = cropSrc.h;
            // Restore the logo's visual position: add back the cropped-off space
            // on each side as CSS padding so the element occupies the same footprint
            // as the original full-frame canvas. Scale = 6.25rem / vh (display rem
            // per source pixel). box-sizing must be content-box so padding is
            // additive rather than inset (Tailwind defaults to border-box).
            const scale = 6.25 / vh;
            canvas.style.boxSizing = "content-box";
            canvas.style.height = `${cropSrc.h * scale}rem`;
            canvas.style.padding = [
              cy,
              vw - cx - cropSrc.w,
              vh - cy - cropSrc.h,
              cx,
            ].map(v => `${v * scale}rem`).join(" ");
          }
        }

        const src = isSafari ? cropSrc : null;
        const cw = src ? src.w : vw;
        const ch = src ? src.h : vh;
        if (canvas.width !== cw || canvas.height !== ch) {
          canvas.width = cw; canvas.height = ch;
        }
        ctx.clearRect(0, 0, cw, ch);
        if (src) {
          ctx.drawImage(video, src.x, src.y, src.w, src.h, 0, 0, cw, ch);
        } else {
          ctx.drawImage(video, 0, 0, cw, ch);
        }

        // Pixel-key any remaining fringe within the cropped region
        const img = ctx.getImageData(0, 0, cw, ch);
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
          const dev = Math.max(255 - d[i], 255 - d[i + 1], 255 - d[i + 2]);
          if (dev < 100) d[i + 3] = Math.round(dev * (255 / 100));
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
              {copy.nav.cta}
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
                {copy.nav.cta}
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
