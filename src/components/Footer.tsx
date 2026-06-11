"use client";

import Image from "next/image";
import { copy } from "@/content/copy";

export default function Footer() {
  return (
    <footer className="border-t border-black/6 py-12 px-6 bg-[#F7F6F2]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Image
          src="/assets/logo/logo-clean.png"
          alt="Graft Media"
          width={100}
          height={24}
          className="h-5 w-auto opacity-25"
        />

        <p className="text-xs text-black/20 text-center tracking-wide">
          © {new Date().getFullYear()} Graft Media. {copy.footer.tagline}
        </p>

        <div className="flex items-center gap-6">
          {copy.footer.socials.map((s) => (
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
