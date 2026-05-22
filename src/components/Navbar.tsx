"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Work", href: "#portfolio" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#cta" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
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
        <div className="max-w-7xl mx-auto px-6 h-25 flex items-center justify-between">
          <a href="#" className="flex items-center group">
            <video
              autoPlay
              muted
              loop
              playsInline
              aria-label="Graft Media"
              className="h-25 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
              style={{ mixBlendMode: "multiply" }}
            >
              {/* VP9 WebM carries true alpha on Chrome/Firefox/Edge.
                  On Safari, mix-blend-mode: multiply knocks out the white bg against the light navbar. */}
              <source src="/assets/logo/logo-morph-alpha.webm" type="video/webm" />
            </video>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[11px] tracking-[0.2em] uppercase text-black/35 hover:text-black/80 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="#cta"
              className="hidden md:inline-flex items-center px-5 py-2.5 text-[11px] font-bold tracking-widest uppercase rounded-full border border-black/20 text-black/55 hover:text-black/85 hover:border-black/35 hover:bg-black/[0.03] transition-all duration-300"
            >
              Start a project
            </a>
            <button
              className="md:hidden p-2 text-black/40 hover:text-black transition-colors"
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
            className="fixed inset-0 z-40 bg-[#F7F6F2]/97 backdrop-blur-xl pt-20 px-6 md:hidden"
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
