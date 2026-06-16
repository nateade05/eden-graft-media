"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { copy } from "@/content/copy";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface Char { solo: string; trans: string; auto?: boolean; }

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

const CHAR_X = ["0vw", "-22vw", "22vw", "0vw"] as const;
const STEPS = 4;
const SCROLL_THRESHOLD = 80;
const LOCK_MS = 950;
const HERO_ZONE_PX = 80;

export default function Hero() {
  const heroRef         = useRef<HTMLDivElement>(null);
  const mobileCanvasRef = useRef<HTMLCanvasElement>(null);
  const vidARef         = useRef<HTMLVideoElement>(null);
  const vidBRef         = useRef<HTMLVideoElement>(null);
  const rampRafRef      = useRef(0);
  const activeRef       = useRef<"a" | "b">("a");
  const phaseRef        = useRef<"solo" | "trans">("solo");
  const idxRef          = useRef(0);
  const pendingRef      = useRef(false);
  const videoDivRef     = useRef<HTMLDivElement>(null);
  const videoExtRef     = useRef<string>(".webm");

  const [clickable, setClickable]           = useState(false);
  const [hovering, setHovering]             = useState(false);
  const [transforming, setTransforming]     = useState(false);
  const [isSafari, setIsSafari]             = useState(false);
  const barDivRef                           = useRef<HTMLDivElement>(null);
  const transformBarRafRef                  = useRef(0);
  const clickTimeRef                        = useRef(0);
  const transitionStartRef                  = useRef<number | null>(null);
  const predictedTransMsRef                 = useRef(4000);
  const [cursorPos, setCursorPos]       = useState({ x: 0, y: 0 });
  const [inCharZone, setInCharZone]     = useState(false);

  const mouseX      = useMotionValue(0);
  const mouseY      = useMotionValue(0);
  const charRotateY = useSpring(useTransform(mouseX, [-1, 1], [-6, 6]), { stiffness: 55, damping: 22 });
  const charRotateX = useSpring(useTransform(mouseY, [-1, 1], [3, -3]), { stiffness: 55, damping: 22 });

  const [step, setStep] = useState(0);
  const stepRef         = useRef(0);
  const accRef          = useRef(0);
  const lockedRef       = useRef(false);
  const touchStartY     = useRef(0);

  const advanceStep = useCallback((dir: 1 | -1) => {
    if (lockedRef.current) return;
    const next = stepRef.current + dir;
    if (next < 0 || next >= STEPS) return;
    // Snap page to top when backing out of the step-3 extended zone
    if (stepRef.current === STEPS - 1 && dir === -1 && window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    lockedRef.current = true;
    stepRef.current   = next;
    setStep(next);
    accRef.current    = 0;
    setTimeout(() => { lockedRef.current = false; }, LOCK_MS);
  }, []);

  // ── Wheel / touch interception ────────────────────────────────────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth < 768) return;
      if (window.scrollY > HERO_ZONE_PX) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      if (stepRef.current === 0 && dir === -1) return;
      if (stepRef.current === STEPS - 1 && dir === 1) return;
      e.preventDefault();
      if (lockedRef.current) { accRef.current = 0; return; }
      accRef.current += e.deltaY;
      if (Math.abs(accRef.current) >= SCROLL_THRESHOLD) advanceStep(dir);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (window.scrollY > HERO_ZONE_PX) return;
      const dy = touchStartY.current - e.touches[0].clientY;
      if (Math.abs(dy) < SCROLL_THRESHOLD) return;
      const dir = dy > 0 ? 1 : -1;
      if (stepRef.current === 0 && dir === -1) return;
      if (stepRef.current === STEPS - 1 && dir === 1) return;
      e.preventDefault();
      advanceStep(dir);
      touchStartY.current = e.touches[0].clientY;
    };

    document.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      document.removeEventListener("wheel", onWheel);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, [advanceStep]);

  // ── Mouse tracking ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // ── Transform bar — two-phase: creeps from click, locks to video at transition ─
  useEffect(() => {
    if (!transforming) {
      cancelAnimationFrame(transformBarRafRef.current);
      if (barDivRef.current) barDivRef.current.style.width = "0%";
      return;
    }
    const tick = () => {
      const now = performance.now();
      let t: number;
      if (transitionStartRef.current !== null) {
        if (phaseRef.current === "trans") {
          // Transition video playing — drive from its currentTime
          const vid = activeRef.current === "a" ? vidARef.current : vidBRef.current;
          if (vid && isFinite(vid.duration) && vid.duration > 0) {
            const preMs = transitionStartRef.current - clickTimeRef.current;
            const totalMs = preMs + vid.duration * 1000;
            t = Math.min((preMs + vid.currentTime * 1000) / totalMs, 1);
          } else {
            t = 1;
          }
        } else {
          t = 1; // transition ended, pin to full
        }
      } else {
        // Pre-transition: elapsed / (elapsed + predicted T_trans) — creeps naturally
        const elapsedMs = now - clickTimeRef.current;
        t = elapsedMs / (elapsedMs + predictedTransMsRef.current);
      }
      if (barDivRef.current) barDivRef.current.style.width = (Math.pow(t, 2.5) * 100) + "%";
      transformBarRafRef.current = requestAnimationFrame(tick);
    };
    transformBarRafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(transformBarRafRef.current);
  }, [transforming]);

  // ── Detect Safari early so JSX renders the correct branch before video setup ──
  useEffect(() => {
    const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    videoExtRef.current = safari ? ".mp4" : ".webm";
    setIsSafari(safari);
  }, []);

  // ── Double-buffer video state machine ─────────────────────────────────────────
  // Depends on isSafari so it runs AFTER the correct JSX branch is in the DOM,
  // ensuring vidARef/vidBRef point to the right video elements.
  useEffect(() => {
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    const vidA = vidARef.current;
    const vidB = vidBRef.current;
    if (!vidA || !vidB) return;

    const activeVid   = () => activeRef.current === "a" ? vidA : vidB;
    const inactiveVid = () => activeRef.current === "a" ? vidB : vidA;

    const v = (path: string) => path + videoExtRef.current;

    const isMp4 = videoExtRef.current === ".mp4";

    function preload(vid: HTMLVideoElement, src: string) {
      vid.playbackRate = 1; vid.src = v(src); vid.loop = false; vid.preload = "auto"; vid.load();
      if (!isMp4) {
        // GPU pre-warm for VP9 alpha (webm only): play one rVFC frame then park so the
        // alpha plane is in the compositor before playAndCommit swaps.
        const warm = () => {
          vid.play().then(() => {
            if ("requestVideoFrameCallback" in (vid as any)) {
              (vid as any).requestVideoFrameCallback(() => vid.pause());
            } else {
              requestAnimationFrame(() => vid.pause());
            }
          }).catch(() => {});
        };
        vid.addEventListener("canplay", warm, { once: true });
      }
    }

    function playAndCommit(from: HTMLVideoElement, to: HTMLVideoElement, onCommit: () => void) {
      to.play().catch(() => {});
      // Show `to` first, then hide `from` on the next rAF — ensures one is always
      // visible to the compositor and eliminates the Chrome single-frame gap.
      const commit = () => {
        to.style.opacity = "1";
        requestAnimationFrame(() => { from.style.opacity = "0"; onCommit(); });
      };
      if (isMp4) {
        // Plain MP4 — no alpha plane to sync, single rAF is enough
        requestAnimationFrame(commit);
      } else if ("requestVideoFrameCallback" in to) {
        // 3 frames: luminance ready on frame 1, alpha synced by frame 2, frame 3 is the safety
        (to as any).requestVideoFrameCallback(() => {
          (to as any).requestVideoFrameCallback(() => {
            (to as any).requestVideoFrameCallback(commit);
          });
        });
      } else {
        requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(commit))));
      }
    }

    activeRef.current = "a"; phaseRef.current = "trans"; idxRef.current = 0; pendingRef.current = false;
    vidA.src = v(CYCLE[0].trans); vidA.loop = false; vidA.preload = "auto"; vidA.load();
    vidA.play().catch(() => {});
    preload(vidB, CYCLE[1].solo);

    function handleEnded(this: HTMLVideoElement) {
      if (this !== activeVid()) return;
      if (phaseRef.current === "solo") {
        if (pendingRef.current) {
          pendingRef.current = false; phaseRef.current = "trans";
          const from = this; const to = inactiveVid();
          activeRef.current = activeRef.current === "a" ? "b" : "a";
          transitionStartRef.current = performance.now();
          playAndCommit(from, to, () => {
            from.playbackRate = 1;
            const nextIdx = (idxRef.current + 1) % CYCLE.length;
            preload(inactiveVid(), CYCLE[nextIdx].solo);
          });
        } else {
          this.currentTime = 0; this.play().catch(() => {});
        }
      } else {
        phaseRef.current = "solo"; idxRef.current = (idxRef.current + 1) % CYCLE.length;
        const char = CYCLE[idxRef.current]; const from = this; const to = inactiveVid();
        activeRef.current = activeRef.current === "a" ? "b" : "a";
        playAndCommit(from, to, () => {
          cancelAnimationFrame(rampRafRef.current); from.playbackRate = 1;
          if (char.auto) {
            pendingRef.current = true; preload(inactiveVid(), char.trans); setClickable(false);
          } else {
            to.loop = true; pendingRef.current = false;
            preload(inactiveVid(), char.trans); setTransforming(false); setClickable(true);
          }
        });
      }
    }

    vidA.addEventListener("ended", handleEnded);
    vidB.addEventListener("ended", handleEnded);
    return () => {
      vidA.removeEventListener("ended", handleEnded);
      vidB.removeEventListener("ended", handleEnded);
      vidA.pause(); vidB.pause();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSafari]);

  // ── Click handler ─────────────────────────────────────────────────────────────
  const handleVideoClick = useCallback(() => {
    if (!clickable || pendingRef.current || phaseRef.current !== "solo") return;
    pendingRef.current = true; setClickable(false);
    const act  = activeRef.current === "a" ? vidARef.current : vidBRef.current;
    const inact = activeRef.current === "a" ? vidBRef.current : vidARef.current;
    if (act) {
      act.loop = false;
      const remaining = act.duration > 0 ? act.duration - act.currentTime : 1;
      const T_trans   = inact && inact.duration > 0 && isFinite(inact.duration) ? inact.duration : 4;
      const T = remaining + T_trans;
      clickTimeRef.current = performance.now();
      transitionStartRef.current = null;
      predictedTransMsRef.current = T_trans * 1000;
      setTransforming(true);
      const A = 0.6 * Math.min(1, remaining / 1.5);
      const clickTime = performance.now();
      const rampTick = () => {
        const t = Math.min(1, (performance.now() - clickTime) / (T * 1000));
        const cur = activeRef.current === "a" ? vidARef.current : vidBRef.current;
        if (cur) cur.playbackRate = 1 + A * 0.5 * (1 - Math.cos(2 * Math.PI * t));
        if (t < 1) rampRafRef.current = requestAnimationFrame(rampTick);
      };
      rampRafRef.current = requestAnimationFrame(rampTick);
    }
    const char = CYCLE[idxRef.current];
    if (inact) {
      inact.loop = false;
      const ext = videoExtRef.current;
      const transSrc = char.trans + ext;
      if (!inact.src.endsWith(char.trans.split("/").pop()! + ext)) {
        inact.src = transSrc; inact.preload = "auto"; inact.load();
      }
    }
  }, [clickable]);

  // ── Mobile canvas ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) return;
    const canvas = mobileCanvasRef.current;
    if (!canvas) return;

    // Safari can't blend a canvas via mix-blend-mode when sibling motion elements
    // create GPU compositor layers. Detect Safari and fall back to luma-key pixel
    // compositing instead, which doesn't rely on CSS blending at all.
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const ctx = canvas.getContext("2d", { willReadFrequently: isSafariBrowser });
    if (!ctx) return;
    if (isSafariBrowser) canvas.style.mixBlendMode = "normal";

    const video = document.createElement("video");
    video.src = "/assets/videos/hero-morph.mp4";
    video.muted = true; video.loop = true; video.playsInline = true; video.load();
    let raf = 0, started = false, lastTime = -1;

    const drawLoop = () => {
      if (video.readyState >= 2 && video.currentTime !== lastTime) {
        lastTime = video.currentTime;
        if (canvas.width !== video.videoWidth && video.videoWidth > 0) {
          canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (isSafariBrowser) {
          const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const d = id.data;
          for (let i = 0; i < d.length; i += 4) {
            // Luma key: punch out white/near-white background pixels
            const luma = (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000;
            if (luma > 240) {
              d[i + 3] = 0;
            } else if (luma > 200) {
              d[i + 3] = Math.round(255 * (240 - luma) / 40);
            }
          }
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.putImageData(id, 0, 0);
        }
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
        <span className="block text-[#0A0A0A]">{copy.hero.headlineLine1}</span>
        <span className="block text-black/10">{copy.hero.headlineLine2}</span>
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.9 }} className="relative z-10 mt-8 text-sm text-black/35 max-w-xs leading-relaxed">
        {copy.hero.subtitle}
      </motion.p>
      <motion.a href="#portfolio" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.1, ease }} className="relative z-10 mt-10 inline-flex px-9 py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-[#0A0A0A] text-white">
        {copy.hero.mobileCta}
      </motion.a>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.5 }} className="absolute bottom-10 z-10 flex flex-col items-center gap-2 text-black/20">
        <span className="text-[9px] tracking-[0.4em] uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} className="w-px h-7 bg-gradient-to-b from-black/20 to-transparent" />
      </motion.div>
    </section>

    {/* ─── DESKTOP STEP HERO ──────────────────────────────────────────── */}
    <motion.div
      ref={heroRef}
      className="relative max-md:hidden"
      animate={{ height: step === 3 ? "200vh" : "100vh" }}
      transition={{ duration: 0.9, ease }}
    >
    <div className="sticky top-0 h-screen overflow-hidden bg-[#F7F6F2] flex items-center justify-center">

      {isSafari ? (
        <>
          {/* Safari: full-bleed raw video, all text in front */}
          <div
            className="absolute inset-0 z-10"
            style={{ cursor: clickable ? "none" : "default" }}
            onClick={handleVideoClick}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <video ref={vidARef} muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 1 }} />
            <video ref={vidBRef} muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0 }} />
          </div>
          <AnimatePresence>
            {step === 0 && (
              <motion.div
                key="intro-text"
                className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none select-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.9, ease }}
              >
                <h1 className="text-[clamp(3rem,9vw,8rem)] font-black leading-[0.88] tracking-tighter text-center px-4">
                  <span className="block text-[#0A0A0A]">{copy.hero.headlineLine1}</span>
                  <span className="block text-black/20">{copy.hero.headlineLine2}</span>
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <>
          {/* Non-Safari: original depth-split with alpha webm */}
          <AnimatePresence>
            {step === 0 && (
              <motion.div
                key="intro-behind"
                className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none select-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.9, ease }}
              >
                <h1 className="text-[clamp(3rem,9vw,8rem)] font-black leading-[0.88] tracking-tighter text-center px-4">
                  <span className="block text-black/10">{copy.hero.headlineLine1}</span>
                  <span className="block text-transparent select-none">{copy.hero.headlineLine2}</span>
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="relative z-10 flex-shrink-0 flex items-center justify-center" style={{ perspective: "1200px" }}>
            <motion.div
              animate={{ x: CHAR_X[step], scale: 1, opacity: 1 }}
              initial={{ scale: 0.9, opacity: 0 }}
              style={{ rotateY: charRotateY, rotateX: charRotateX }}
              transition={{
                x:       { type: "spring", stiffness: 50, damping: 22 },
                scale:   { duration: 1.2, ease },
                opacity: { duration: 1.0, ease },
              }}
            >
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
                <video ref={vidARef} muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-contain" style={{ opacity: 1, willChange: "opacity", transform: "translateZ(0)" }} />
                <video ref={vidBRef} muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-contain" style={{ opacity: 0, willChange: "opacity", transform: "translateZ(0)" }} />
              </div>
            </motion.div>
          </div>
          <AnimatePresence>
            {step === 0 && (
              <motion.div
                key="intro-front"
                className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none select-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.9, ease }}
              >
                <h1 className="text-[clamp(3rem,9vw,8rem)] font-black leading-[0.88] tracking-tighter text-center px-4">
                  <span className="block text-transparent select-none">{copy.hero.headlineLine1}</span>
                  <span className="block text-[#0A0A0A]">{copy.hero.headlineLine2}</span>
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Step 0: subtitle + scroll indicator */}
      <AnimatePresence>
        {step === 0 && (
          <motion.div
            key="intro-bottom"
            className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-20 z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
          >
            <p className="text-sm text-black/35 max-w-xs leading-relaxed text-center mb-10">
              {copy.hero.subtitle}
            </p>
            <div className="flex flex-col items-center gap-2 text-black/20">
              <span className="text-[9px] tracking-[0.4em] uppercase">Scroll</span>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} className="w-px h-7 bg-gradient-to-b from-black/20 to-transparent" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 1: Right panel — Speed */}
      <AnimatePresence>
        {step === 1 && (
          <motion.div
            key="right-panel"
            className="absolute left-[62%] top-1/2 -translate-y-1/2 w-[26vw] max-w-[360px] z-20 pointer-events-none"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 28 }}
            transition={{ duration: 0.85, ease }}
          >
            <p className="text-[10px] tracking-[0.28em] uppercase text-black/25 mb-4 font-semibold">{copy.hero.speed.overline}</p>
            <h2 className="text-[clamp(2rem,3.2vw,3rem)] font-black text-[#0A0A0A] leading-[1.0] mb-5">{copy.hero.speed.headline}</h2>
            <p className="text-sm text-black/40 leading-relaxed font-light">{copy.hero.speed.body}</p>
            <div className="mt-7 w-12 h-px bg-black/25" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2: Left panel — Variations */}
      <AnimatePresence>
        {step === 2 && (
          <motion.div
            key="left-panel"
            className="absolute right-[62%] top-1/2 -translate-y-1/2 w-[26vw] max-w-[360px] z-20 pointer-events-none"
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.85, ease }}
          >
            <p className="text-[10px] tracking-[0.28em] uppercase text-black/25 mb-4 font-semibold">{copy.hero.variations.overline}</p>
            <h2 className="text-[clamp(2rem,3.2vw,3rem)] font-black text-[#0A0A0A] leading-[1.0] mb-5">{copy.hero.variations.headlineLine1}<br />{copy.hero.variations.headlineLine2}</h2>
            <p className="text-sm text-black/40 leading-relaxed font-light">{copy.hero.variations.body}</p>
            <div className="mt-7 w-12 h-px bg-black/25" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 3: CTA */}
      <AnimatePresence>
        {step === 3 && (
          <motion.div
            key="cta"
            className="absolute top-[85%] left-0 right-0 flex flex-col items-center z-20 pointer-events-none"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.8, ease }}
          >
            <p className="text-[11px] text-black/25 mb-5 tracking-[0.15em] uppercase">{copy.hero.outroCta.prompt}</p>
            <a href="#cta" className="pointer-events-auto inline-flex px-9 py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-[#0A0A0A] text-white hover:bg-black/85 transition-colors">
              {copy.hero.outroCta.button}
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transform cursor / loader */}
      <AnimatePresence>
        {clickable && hovering && (isSafari || inCharZone) && (
          <motion.div
            key="pill"
            className="pointer-events-none select-none flex flex-col items-center"
            style={{ position: "fixed", left: cursorPos.x, top: cursorPos.y, transform: "translate(-50%, -50%)", zIndex: 50 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                <circle cx="19" cy="19" r="17" stroke="#D2647F" strokeWidth="1" opacity="0.5" />
                <circle cx="19" cy="19" r="2" fill="#D2647F" />
                <line x1="19" y1="3" x2="19" y2="10" stroke="#D2647F" strokeWidth="0.75" opacity="0.6" />
                <line x1="19" y1="28" x2="19" y2="35" stroke="#D2647F" strokeWidth="0.75" opacity="0.6" />
                <line x1="3" y1="19" x2="10" y2="19" stroke="#D2647F" strokeWidth="0.75" opacity="0.6" />
                <line x1="28" y1="19" x2="35" y2="19" stroke="#D2647F" strokeWidth="0.75" opacity="0.6" />
              </svg>
            </motion.div>
            <span style={{ fontSize: "9px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#D2647F", opacity: 0.85, marginTop: "6px", whiteSpace: "nowrap" }}>Transform</span>
          </motion.div>
        )}
        {transforming && (
          <motion.div
            key="loader"
            className="pointer-events-none select-none flex flex-col items-center"
            style={{ position: "fixed", left: cursorPos.x, top: cursorPos.y, transform: "translate(-50%, -50%)", zIndex: 50, gap: "24px" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div style={{ width: 180, height: 2, background: "rgba(210,100,127,0.15)", borderRadius: 999, overflow: "hidden" }}>
              <div
                ref={barDivRef}
                style={{ height: "100%", background: "#D2647F", borderRadius: 999, width: "0%" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {["T","R","A","N","S","F","O","R","M","I","N","G"].map((letter, i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.18, 1, 0.18] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.09 }}
                  style={{ fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#D2647F", display: "inline-block" }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#F7F6F2] to-transparent pointer-events-none z-30" />

      {/* Step dots */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            animate={{ opacity: step === i ? 1 : 0.15 }}
            transition={{ duration: 0.3 }}
            className="w-1 h-1 rounded-full bg-black"
          />
        ))}
      </div>
    </div>
    </motion.div>
    </>
  );
}
