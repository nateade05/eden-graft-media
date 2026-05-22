"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-black/6 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Image
          src="/assets/logo/logo-clean.png"
          alt="Graft Media"
          width={100}
          height={24}
          className="h-5 w-auto opacity-25"
        />

        <p className="text-xs text-black/20 text-center tracking-wide">
          © {new Date().getFullYear()} Graft Media — AI-Led Creative Production Studio
        </p>

        <div className="flex items-center gap-6">
          {["Instagram", "LinkedIn"].map((s) => (
            <a
              key={s}
              href="#"
              className="text-[10px] tracking-widest uppercase text-black/20 hover:text-black/50 transition-colors"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
