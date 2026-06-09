"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

// ─── Character cycle ──────────────────────────────────────────────────────────

interface Char {
  solo: string;
  trans: string;
  auto?: boolean;
}

const C = "/assets/videos/chars/";
const T = "/assets/videos/transitions/";

const CYCLE: Char[] = [
  { solo: `${C}metal-blob`,       trans: `${T}blob-to-mannequin`,        auto: true },
  { solo: `${C}chrome-mannequin`, trans: `${T}mannequin-to-chrome-woman` },
  { solo: `${C}chrome-woman`,     trans: `${T}chrome-woman-to-boombox`   },
  { solo: `${C}boombox-guy`,      trans: `${T}boombox-to-graft-girl`     },
  { solo: `${C}graft-girl`,       trans: `${T}graft-girl-to-cowboy`      },
  { solo: `${C}cowboy`,           trans: `${T}cowboy-to-werewolf`        },
  { solo: `${C}werewolf`,         trans: `${T}werewolf-to-cheetah`       },
  { solo: `${C}pink-cheetah`,     trans: `${T}cheetah-to-archer`         },
  { solo: `${C}runic-archer`,     trans: `${T}archer-to-door`            },
  { solo: `${C}art-deco-door`,    trans: `${T}door-to-sandal`            },
  { solo: `${C}chrome-sandal`,    trans: `${T}lipgloss-to-blob`          },
  { solo: `${C}lip-gloss`,        trans: `${T}sandal-to-lipgloss`        },
];

// ─── Sparkle particle system ──────────────────────────────────────────────────

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  size: number;
  hue: number;
  alpha: number;
  type: 0 | 1 | 2 | 3; // 0=spark 1=smoke 2=ember 3=aurora
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileCanvasRef = useRef<HTMLCanvasElement>(null);
  const vhRef = useRef(0);

  // Two video elements — double-buffer for seamless swap, stacked and opacity-swapped
  const vidARef = useRef<HTMLVideoElement>(null);
  const vidBRef = useRef<HTMLVideoElement>(null);


  // Sparkle overlay canvas
  const sparkCanvasRef = useRef<HTMLCanvasElement>(null);
  const sparkRafRef = useRef(0);

  // Shared sparkle intensity state — written by state machine + click handler, read by sparkle loop
  const sparkStateRef = useRef<{ phase: "idle" | "clicking" | "transitioning"; transStart: number; transDur: number; }>({ phase: "idle", transStart: 0, transDur: 0 });

  // State machine (refs only — no re-renders)
  const activeRef  = useRef<"a" | "b">("a");
  const phaseRef   = useRef<"solo" | "trans">("solo");
  const idxRef     = useRef(0);
  const pendingRef = useRef(false);

  const [clickable, setClickable] = useState(false);
  const [hovering, setHovering]   = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [inCharZone, setInCharZone] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const charRotateY = useSpring(useTransform(mouseX, [-1, 1], [-6, 6]), { stiffness: 55, damping: 22 });
  const charRotateX = useSpring(useTransform(mouseY, [-1, 1], [3, -3]), { stiffness: 55, damping: 22 });
  const videoDivRef = useRef<HTMLDivElement>(null);
  const videoExtRef = useRef<string>(".webm");

  // ── Viewport height ─────────────────────────────────────────────────────────
  useEffect(() => {
    const update = () => { vhRef.current = window.innerHeight; };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  // ── Character cursor-tracking tilt ──────────────────────────────────────────
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  // ── Scroll transforms ────────────────────────────────────────────────────────
  const { scrollY } = useScroll();
  const scrollYProgress = useTransform(scrollY, (v) => {
    const h = (vhRef.current || 800) * 6.5;
    return Math.max(0, Math.min(1, v / h));
  });

  const videoX       = useTransform(scrollYProgress, [0,0.14,0.20,0.37,0.47,0.66,0.74,1], ["0vw","0vw","-22vw","-22vw","22vw","22vw","0vw","0vw"]);
  const videoScale   = useTransform(scrollYProgress, [0,0.06,0.88,1], [0.9,1,1,0.96]);
  const videoOpacity = useTransform(scrollYProgress, [0.90,1], [1,0]);

  const introOpacity = useTransform(scrollYProgress, [0.14,0.20], [1,0]);
  const introY       = useTransform(scrollYProgress, [0.14,0.20], [0,-40]);
  const rightOpacity = useTransform(scrollYProgress, [0.20,0.26,0.37,0.42], [0,1,1,0]);
  const rightX       = useTransform(scrollYProgress, [0.20,0.26,0.37,0.42], ["28px","0px","0px","28px"]);
  const leftOpacity  = useTransform(scrollYProgress, [0.42,0.47,0.64,0.71], [0,1,1,0]);
  const leftX        = useTransform(scrollYProgress, [0.42,0.47,0.64,0.71], ["-28px","0px","0px","-28px"]);
  const ctaOpacity   = useTransform(scrollYProgress, [0.71,0.74], [0,1]);
  const ctaY         = useTransform(scrollYProgress, [0.71,0.74], [24,0]);

  const dot0 = useTransform(scrollYProgress, [0.02,0.09,0.14], [0.15,1,0.15]);
  const dot1 = useTransform(scrollYProgress, [0.22,0.27,0.34], [0.15,1,0.15]);
  const dot2 = useTransform(scrollYProgress, [0.48,0.53,0.58], [0.15,1,0.15]);
  const dot3 = useTransform(scrollYProgress, [0.63,0.68,0.74], [0.15,1,0.15]);

  // ── Double-buffer video state machine ────────────────────────────────────────
  useEffect(() => {
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    const vidA = vidARef.current;
    const vidB = vidBRef.current;
    if (!vidA || !vidB) return;

    const activeVid   = () => activeRef.current === "a" ? vidA : vidB;
    const inactiveVid = () => activeRef.current === "a" ? vidB : vidA;

    videoExtRef.current = ".webm";
    const v = (path: string) => path + ".webm";

    function preload(vid: HTMLVideoElement, src: string) {
      vid.src = v(src);
      vid.loop = false;
      vid.preload = "auto";
      vid.load();
    }

    // Deferred visual swap: starts `to` playing, waits for 2 presented frames before
    // committing. VP9 alpha is decoded on a separate plane from luminance — the first
    // rVFC fires when luminance is composited but alpha can lag by one frame, causing
    // a white flash. Waiting for the 2nd frame gives alpha time to sync.
    function playAndCommit(from: HTMLVideoElement, to: HTMLVideoElement, onCommit: () => void) {
      to.play().catch(() => {});
      const commit = () => {
        from.style.opacity = "0";
        to.style.opacity   = "1";
        onCommit();
      };
      if ("requestVideoFrameCallback" in to) {
        (to as any).requestVideoFrameCallback(() => {
          (to as any).requestVideoFrameCallback(commit);
        });
      } else {
        requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(commit)));
      }
    }

    // Boot: start directly with the first transition (skip the metal-blob solo)
    activeRef.current  = "a";
    phaseRef.current   = "trans";
    idxRef.current     = 0;
    pendingRef.current = false;

    vidA.src = v(CYCLE[0].trans);
    vidA.loop = false;
    vidA.preload = "auto";
    vidA.load();
    vidA.play().catch(() => {});
    preload(vidB, CYCLE[1].solo);

    function handleEnded(this: HTMLVideoElement) {
      if (this !== activeVid()) return;

      if (phaseRef.current === "solo") {
        if (pendingRef.current) {
          pendingRef.current = false;
          phaseRef.current   = "trans";
          const from = this;
          const to   = inactiveVid();
          // Logical state advances immediately so inactiveVid() is correct inside commit
          activeRef.current = activeRef.current === "a" ? "b" : "a";
          playAndCommit(from, to, () => {
            // If user-triggered (phase was "clicking"), ramp sparkles down over transition duration
            if (sparkStateRef.current.phase === "clicking") {
              sparkStateRef.current = {
                phase: "transitioning",
                transStart: performance.now(),
                transDur: (to.duration > 0 && isFinite(to.duration) ? to.duration : 4) * 1000,
              };
            }
            const nextIdx = (idxRef.current + 1) % CYCLE.length;
            preload(inactiveVid(), CYCLE[nextIdx].solo);
          });
        } else {
          // No pending transition — loop this solo
          this.currentTime = 0;
          this.play().catch(() => {});
        }
      } else {
        // Transition ended → advance to next solo
        phaseRef.current  = "solo";
        idxRef.current    = (idxRef.current + 1) % CYCLE.length;
        const char = CYCLE[idxRef.current];
        const from = this;
        const to   = inactiveVid();
        activeRef.current = activeRef.current === "a" ? "b" : "a";
        playAndCommit(from, to, () => {
          sparkStateRef.current.phase = "idle";
          if (char.auto) {
            pendingRef.current = true;
            preload(inactiveVid(), char.trans);
            setClickable(false);
          } else {
            to.loop = true; // native seamless loop — no currentTime=0 seek flash
            pendingRef.current = false;
            preload(inactiveVid(), char.trans); // pre-warm transition so it's buffered before click
            setClickable(true);
          }
        });
      }
    }

    vidA.addEventListener("ended", handleEnded);
    vidB.addEventListener("ended", handleEnded);
    return () => {
      vidA.removeEventListener("ended", handleEnded);
      vidB.removeEventListener("ended", handleEnded);
      vidA.pause();
      vidB.pause();
    };
  }, []);

  // ── Click handler ────────────────────────────────────────────────────────────
  const handleVideoClick = useCallback(() => {
    if (!clickable || pendingRef.current || phaseRef.current !== "solo") return;

    pendingRef.current = true;
    setClickable(false);
    sparkStateRef.current.phase = "clicking";

    // Disable native loop so ended fires on the next natural completion
    const act = activeRef.current === "a" ? vidARef.current : vidBRef.current;
    if (act) act.loop = false;

    const char = CYCLE[idxRef.current];
    const inact = activeRef.current === "a" ? vidBRef.current : vidARef.current;
    if (inact) {
      inact.loop = false;
      // Only reload if the pre-warm didn't already set this src
      const ext = videoExtRef.current;
      const transSrc = char.trans + ext;
      if (!inact.src.endsWith(char.trans.split("/").pop()! + ext)) {
        inact.src = transSrc;
        inact.preload = "auto";
        inact.load();
      }
    }
  }, [clickable]);

  // ── Sparkle cursor canvas ────────────────────────────────────────────────────
  useEffect(() => {
    if (shouldReduceMotion) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    const canvas = sparkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Particle[] = [];
    let mx = -999, my = -999, isOver = false;

    function resize() {
      const r = canvas!.parentElement!.getBoundingClientRect();
      canvas!.width = r.width;
      canvas!.height = r.height;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    // Triangle-wave: 0 → 1 at midpoint → 0
    function getAreaIntensity() {
      const s = sparkStateRef.current;
      if (s.phase !== "transitioning") return 0;
      const t = Math.max(0, Math.min(1, (performance.now() - s.transStart) / s.transDur));
      return t <= 0.5 ? t * 2 : (1 - t) * 2;
    }

    // Which hero step the user is currently in, based on scroll position
    // 0 = intro (center), 1 = speed panel (left), 2 = variations panel (right), 3 = cta (center)
    function getStep(): 0 | 1 | 2 | 3 {
      const p = scrollYProgress.get();
      if (p < 0.17) return 0;
      if (p < 0.42) return 1;
      if (p < 0.70) return 2;
      return 3;
    }

    // Area ellipse centre/radius per step, tracking where the character sits on screen
    function areaParams(step: number, w: number, h: number) {
      const cy = h * 0.5, ry = h * 0.44;
      if (step === 1) return { cx: w * 0.30, cy, rx: w * 0.24, ry };
      if (step === 2) return { cx: w * 0.70, cy, rx: w * 0.24, ry };
      return { cx: w * 0.50, cy, rx: w * 0.28, ry };
    }

    function inEllipse(cx: number, cy: number, rx: number, ry: number) {
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random());
      return { x: cx + Math.cos(a) * r * rx, y: cy + Math.sin(a) * r * ry };
    }

    const MAX_PARTICLES = 1200;

    // ── Cursor effects per step ──────────────────────────────────────────────
    function spawnCursor(x: number, y: number, step: 0 | 1 | 2 | 3) {
      if (particles.length >= MAX_PARTICLES) return;
      if (step === 0) {
        for (let i = 0; i < 5; i++) {
          const a = Math.random() * Math.PI * 2, sp = 0.3 + Math.random() * 1.6;
          particles.push({ type: 0, x: x + (Math.random() - 0.5) * 22, y: y + (Math.random() - 0.5) * 22, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.9, life: 1, size: 1.5 + Math.random() * 2.5, hue: 255 + Math.random() * 140, alpha: 0.7 + Math.random() * 0.3 });
        }
      } else if (step === 1) {
        for (let i = 0; i < 2; i++) {
          particles.push({ type: 1, x: x + (Math.random() - 0.5) * 18, y: y + (Math.random() - 0.5) * 18, vx: (Math.random() - 0.5) * 0.4, vy: -0.4 - Math.random() * 0.5, life: 1, size: 8 + Math.random() * 9, hue: 210, alpha: 0.18 + Math.random() * 0.10 });
        }
      } else if (step === 2) {
        for (let i = 0; i < 3; i++) {
          const a = Math.random() * Math.PI * 2, sp = 0.6 + Math.random() * 2.2;
          particles.push({ type: 2, x: x + (Math.random() - 0.5) * 14, y: y + (Math.random() - 0.5) * 14, vx: Math.cos(a) * sp * 0.6, vy: Math.sin(a) * sp - 1.5, life: 1, size: 1.2 + Math.random() * 2.5, hue: 12 + Math.random() * 35, alpha: 0.85 + Math.random() * 0.15 });
        }
      } else {
        for (let i = 0; i < 4; i++) {
          const a = Math.random() * Math.PI * 2, sp = 0.5 + Math.random() * 1.8;
          particles.push({ type: 3, x: x + (Math.random() - 0.5) * 20, y: y + (Math.random() - 0.5) * 20, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.3 - 0.4, life: 1, size: 2 + Math.random() * 4, hue: Math.random() * 360, alpha: 0.7 + Math.random() * 0.3 });
        }
      }
    }

    // ── Area effects per step ────────────────────────────────────────────────
    function spawnArea(k: number, w: number, h: number, step: 0 | 1 | 2 | 3) {
      if (particles.length >= MAX_PARTICLES) return;
      const { cx, cy, rx, ry } = areaParams(step, w, h);
      const budget = Math.min(MAX_PARTICLES - particles.length, 1);

      if (step === 0) {
        const n = Math.min(Math.round(k * 85), Math.round(budget * 85));
        for (let i = 0; i < n; i++) {
          const { x, y } = inEllipse(cx, cy, rx, ry);
          const sp = 0.4 + Math.random() * 3.0, d = Math.random() * Math.PI * 2;
          particles.push({ type: 0, x, y, vx: Math.cos(d) * sp, vy: Math.sin(d) * sp - 0.5, life: 1, size: 2 + Math.random() * 6 * k, hue: 255 + Math.random() * 140, alpha: 0.65 + Math.random() * 0.35 });
        }
      } else if (step === 1) {
        const n = Math.min(Math.round(k * 18), Math.round(budget * 18));
        for (let i = 0; i < n; i++) {
          const { x, y } = inEllipse(cx, cy, rx, ry);
          particles.push({ type: 1, x, y, vx: (Math.random() - 0.5) * 0.5, vy: -0.2 - Math.random() * 0.7, life: 1, size: 14 + Math.random() * 24 * k, hue: 210, alpha: 0.07 + Math.random() * 0.06 });
        }
      } else if (step === 2) {
        const n = Math.min(Math.round(k * 65), Math.round(budget * 65));
        for (let i = 0; i < n; i++) {
          const { x, y } = inEllipse(cx, cy, rx, ry);
          particles.push({ type: 2, x, y, vx: (Math.random() - 0.5) * 1.2, vy: -0.5 - Math.random() * 2.5, life: 1, size: 1.5 + Math.random() * 3.5 * k, hue: 12 + Math.random() * 40, alpha: 0.75 + Math.random() * 0.25 });
        }
      } else {
        const n = Math.min(Math.round(k * 55), Math.round(budget * 55));
        for (let i = 0; i < n; i++) {
          const { x, y } = inEllipse(cx, cy, rx, ry);
          const sp = 0.8 + Math.random() * 2.5, a = Math.random() * Math.PI * 2;
          particles.push({ type: 3, x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.4 - 0.3, life: 1, size: 3 + Math.random() * 7 * k, hue: Math.random() * 360, alpha: 0.6 + Math.random() * 0.4 });
        }
      }
    }

    function loop() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const k = getAreaIntensity();
      const w = canvas!.width, h = canvas!.height;
      const step = getStep();

      if (isOver) spawnCursor(mx, my, step);
      if (k > 0) spawnArea(k, w, h, step);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        if (p.type === 0) {
          // Spark: 4-point star
          p.x += p.vx; p.y += p.vy; p.vy += 0.038; p.life -= 0.022;
          if (p.life <= 0) { particles.splice(i, 1); continue; }
          const s = p.size * Math.min(1, p.life * 2.5);
          ctx!.save();
          ctx!.globalAlpha = p.life * p.alpha;
          ctx!.translate(p.x, p.y);
          ctx!.rotate((1 - p.life) * 6);
          ctx!.fillStyle = `hsl(${p.hue}, 100%, 75%)`;
          ctx!.beginPath();
          for (let j = 0; j < 4; j++) {
            const a = (j / 4) * Math.PI * 2, a2 = a + Math.PI / 4;
            ctx!.lineTo(Math.cos(a) * s, Math.sin(a) * s);
            ctx!.lineTo(Math.cos(a2) * s * 0.28, Math.sin(a2) * s * 0.28);
          }
          ctx!.closePath();
          ctx!.fill();
          ctx!.restore();

        } else if (p.type === 1) {
          // Smoke: expanding translucent circle with gentle wobble — long life, large radius
          p.x += p.vx + Math.sin(p.life * 9) * 0.18;
          p.y += p.vy;
          p.size += 0.12;
          p.life -= 0.020; // faster decay than before (was 0.012) to keep count down
          if (p.life <= 0) { particles.splice(i, 1); continue; }
          ctx!.globalAlpha = p.life * p.alpha;
          ctx!.fillStyle = `hsl(${p.hue}, 8%, 72%)`;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx!.fill();

        } else if (p.type === 2) {
          // Ember: two-circle glow (no shadowBlur — that's a full GPU blur pass)
          p.x += p.vx + (Math.random() - 0.5) * 0.35;
          p.y += p.vy;
          p.vy += 0.025;
          p.life -= 0.030;
          if (p.life <= 0) { particles.splice(i, 1); continue; }
          const s = Math.max(0.5, p.size * Math.min(1, p.life * 2));
          // Soft outer halo
          ctx!.globalAlpha = p.life * p.alpha * 0.28;
          ctx!.fillStyle = `hsl(${p.hue}, 100%, 62%)`;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, s * 3, 0, Math.PI * 2);
          ctx!.fill();
          // Bright core
          ctx!.globalAlpha = p.life * p.alpha;
          ctx!.fillStyle = `hsl(${p.hue}, 100%, 85%)`;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, s, 0, Math.PI * 2);
          ctx!.fill();

        } else {
          // Aurora: hue-shifting streak drawn as a velocity trail
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.018;
          p.hue = (p.hue + 1.5) % 360;
          p.life -= 0.022;
          if (p.life <= 0) { particles.splice(i, 1); continue; }
          const s = p.size * Math.min(1, p.life * 2);
          ctx!.globalAlpha = p.life * p.alpha;
          ctx!.strokeStyle = `hsl(${p.hue}, 100%, 75%)`;
          ctx!.lineWidth = Math.max(0.5, s * 0.7);
          ctx!.lineCap = "round";
          ctx!.beginPath();
          ctx!.moveTo(p.x, p.y);
          ctx!.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
          ctx!.stroke();
        }
      }
      ctx!.globalAlpha = 1;

      sparkRafRef.current = requestAnimationFrame(loop);
    }

    sparkRafRef.current = requestAnimationFrame(loop);

    const parent = canvas.parentElement!;
    const onMove  = (e: MouseEvent) => { const r = canvas!.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const onEnter = () => { isOver = true; };
    const onLeave = () => { isOver = false; };
    const onBurst = (e: MouseEvent) => { const r = canvas!.getBoundingClientRect(); spawnCursor(e.clientX - r.left, e.clientY - r.top, getStep()); };

    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseenter", onEnter);
    parent.addEventListener("mouseleave", onLeave);
    parent.addEventListener("click", onBurst);

    return () => {
      cancelAnimationFrame(sparkRafRef.current);
      ro.disconnect();
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseenter", onEnter);
      parent.removeEventListener("mouseleave", onLeave);
      parent.removeEventListener("click", onBurst);
    };
  }, []);


  // ── Mobile canvas (unchanged) ────────────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) return;
    const canvas = mobileCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const video = document.createElement("video");
    video.src = "/assets/videos/hero-morph.mp4";
    video.muted = true; video.loop = true; video.playsInline = true;
    video.load();

    let raf = 0, started = false;
    const drawLoop = () => {
      if (video.readyState >= 2) {
        if (canvas.width !== video.videoWidth && video.videoWidth > 0) {
          canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      raf = requestAnimationFrame(drawLoop);
    };
    const start = () => {
      if (started) return;
      video.play().then(() => { started = true; drawLoop(); }).catch(() => {});
    };
    start();
    document.addEventListener("touchstart", start, { once: true, passive: true });
    return () => { cancelAnimationFrame(raf); video.pause(); document.removeEventListener("touchstart", start); };
  }, []);

  return (
    <>
    {/* ─── MOBILE HERO ────────────────────────────────────────────────── */}
    <section className="md:hidden relative min-h-[100svh] bg-[#F7F6F2] flex flex-col items-center justify-center px-6 text-center overflow-hidden pt-20 pb-16">
      <canvas ref={mobileCanvasRef} className="absolute inset-0 w-full h-full object-contain pointer-events-none" style={{ mixBlendMode: "multiply" }} />
      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0, delay: 0.3, ease }} className="relative z-10 text-[clamp(4rem,16vw,5.5rem)] font-black leading-[0.88] tracking-tighter">
        <span className="block text-[#0A0A0A]">Brief in.</span>
        <span className="block text-black/10">Campaign out.</span>
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.9 }} className="relative z-10 mt-8 text-sm text-black/35 max-w-xs leading-relaxed">
        We take your product and build the visual world around it, at machine speed.
      </motion.p>
      <motion.a href="#portfolio" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.1, ease }} className="relative z-10 mt-10 inline-flex px-9 py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-[#0A0A0A] text-white">
        See the work
      </motion.a>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.5 }} className="absolute bottom-10 z-10 flex flex-col items-center gap-2 text-black/20">
        <span className="text-[9px] tracking-[0.4em] uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} className="w-px h-7 bg-gradient-to-b from-black/20 to-transparent" />
      </motion.div>
    </section>

    {/* ─── DESKTOP SCROLL-SCRUB HERO ──────────────────────────────────── */}
    <div ref={containerRef} style={{ height: "650vh" }} className="relative max-md:hidden">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#F7F6F2] flex items-center justify-center">

        {/* "Brief in." — behind the character */}
        <motion.div style={{ opacity: introOpacity }} className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none select-none">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0, delay: 0.3, ease }} className="text-[clamp(3rem,9vw,8rem)] font-black leading-[0.88] tracking-tighter text-center px-4">
            <span className="block text-black/10">Brief in.</span>
            <span className="block text-transparent select-none">Campaign out.</span>
          </motion.h1>
        </motion.div>

        {/* "Campaign out." — in front of the character */}
        <motion.div style={{ opacity: introOpacity }} className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none select-none">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0, delay: 0.3, ease }} className="text-[clamp(3rem,9vw,8rem)] font-black leading-[0.88] tracking-tighter text-center px-4">
            <span className="block text-transparent select-none">Brief in.</span>
            <span className="block text-[#0A0A0A]">Campaign out.</span>
          </motion.h1>
        </motion.div>

        {/* CHARACTER */}
        <div className="relative z-10 flex-shrink-0 flex items-center justify-center" style={{ perspective: "1200px" }}>
            <motion.div style={{ x: videoX, scale: videoScale, opacity: videoOpacity, rotateY: charRotateY, rotateX: charRotateX }}>
              <div
                ref={videoDivRef}
                className="relative h-[78vh]"
                style={{ aspectRatio: "1928 / 1072", cursor: clickable ? "none" : "default", clipPath: "inset(0 18% 0 18%)" }}
                onClick={handleVideoClick}
                onMouseMove={(e) => {
                  setCursorPos({ x: e.clientX, y: e.clientY });
                  const r = videoDivRef.current?.getBoundingClientRect();
                  if (r) setInCharZone((e.clientX - r.left) / r.width >= 0.22 && (e.clientX - r.left) / r.width <= 0.78);
                }}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => { setHovering(false); setInCharZone(false); }}
              >
<video ref={vidARef} muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-contain" style={{ opacity: 1 }} />
                <video ref={vidBRef} muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-contain" style={{ opacity: 0 }} />
              </div>
            </motion.div>
        </div>

        {/* Sparkle canvas — full hero width, outside multiply so particles aren't clipped */}
        <canvas ref={sparkCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 15 }} />

        {/* Click tooltip — position:fixed, cursor-following, outside blend mode */}
        <AnimatePresence>
          {clickable && hovering && inCharZone && (
            <motion.div
              key="click-tile"
              initial={{ opacity: 0, scale: 0.55, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.55, y: 14 }}
              transition={{ type: "spring", stiffness: 520, damping: 26 }}
              className="pointer-events-none select-none"
              style={{ position: "fixed", left: cursorPos.x, top: cursorPos.y - 64, transform: "translateX(-50%)", zIndex: 50 }}
            >
              {/* Floating wrapper */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="relative flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#0A0A0A] shadow-[0_8px_32px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
                  {/* Left sparkle */}
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                    style={{ display: "inline-block", fontSize: "0.6rem", lineHeight: 1 }}
                    className="text-violet-400"
                  >
                    ✦
                  </motion.span>

                  <span className="text-[10px] tracking-[0.28em] uppercase text-white font-semibold whitespace-nowrap">
                    Click to Transform
                  </span>

                  {/* Right sparkle counter-rotating */}
                  <motion.span
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                    style={{ display: "inline-block", fontSize: "0.6rem", lineHeight: 1 }}
                    className="text-violet-400"
                  >
                    ✦
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* INTRO SUBTITLE */}
        <motion.div style={{ opacity: introOpacity, y: introY }} className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-20 z-20 pointer-events-none">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.9 }} className="text-sm text-black/35 max-w-xs leading-relaxed text-center mb-10">
            We take your product and build the visual world around it, at machine speed.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.2 }} className="flex flex-col items-center gap-2 text-black/20">
            <span className="text-[9px] tracking-[0.4em] uppercase">Scroll</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} className="w-px h-7 bg-gradient-to-b from-black/20 to-transparent" />
          </motion.div>
        </motion.div>

        {/* RIGHT PANEL — Speed */}
        <motion.div style={{ opacity: rightOpacity, x: rightX }} className="absolute left-[62%] top-1/2 -translate-y-1/2 w-[26vw] max-w-[360px] z-20 pointer-events-none">
          <p className="text-[10px] tracking-[0.28em] uppercase text-black/25 mb-4 font-semibold">Speed</p>
          <h2 className="text-[clamp(2rem,3.2vw,3rem)] font-black text-[#0A0A0A] leading-[1.0] mb-5">Weeks of production. Days of delivery.</h2>
          <p className="text-sm text-black/40 leading-relaxed font-light">Traditional shoots take weeks to brief, cast, produce, and retouch. We collapse that timeline without compromising on creative quality.</p>
          <div className="mt-7 w-12 h-px bg-black/25" />
        </motion.div>

        {/* LEFT PANEL — Variations */}
        <motion.div style={{ opacity: leftOpacity, x: leftX }} className="absolute right-[62%] top-1/2 -translate-y-1/2 w-[26vw] max-w-[360px] z-20 pointer-events-none">
          <p className="text-[10px] tracking-[0.28em] uppercase text-black/25 mb-4 font-semibold">Variations</p>
          <h2 className="text-[clamp(2rem,3.2vw,3rem)] font-black text-[#0A0A0A] leading-[1.0] mb-5">One brief.<br />Infinite cuts.</h2>
          <p className="text-sm text-black/40 leading-relaxed font-light">12 social formats, 3 hero banners, a short-form video. One brief covers all of it. We deliver the full suite.</p>
          <div className="mt-7 w-12 h-px bg-black/25" />
        </motion.div>

        {/* OUTRO CTA */}
        <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="absolute top-[85%] left-0 right-0 flex flex-col items-center z-20 pointer-events-none">
          <p className="text-[11px] text-black/25 mb-5 tracking-[0.15em] uppercase">Ready to produce?</p>
          <a href="#cta" className="pointer-events-auto inline-flex px-9 py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-[#0A0A0A] text-white hover:bg-black/85 transition-colors">
            Start a project
          </a>
        </motion.div>

        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#F7F6F2] to-transparent pointer-events-none z-30" />

        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
          {[dot0, dot1, dot2, dot3].map((op, i) => (
            <motion.div key={i} style={{ opacity: op }} className="w-1 h-1 rounded-full bg-black" />
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

