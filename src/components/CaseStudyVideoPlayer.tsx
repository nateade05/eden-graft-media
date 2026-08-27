"use client";

import { useRef, useEffect, useState, useCallback } from "react";

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}

// Only one CaseStudyVideoPlayer may play at a time across the whole page.
// When several are stacked close together (e.g. three tracks on the Music
// case study), scrolling can put two of them above the naive "40% visible"
// bar at once — whichever crossed last used to win, which on a fast scroll
// could skip the middle one entirely. Instead every instance reports its
// live intersection ratio into this registry, and the single most-visible
// one is (re)selected on every change — a strict "most in frame wins."
// A manual click pins that choice until its own video scrolls out of view,
// so it isn't immediately overridden by a more-visible neighbour.
const MIN_RATIO = 0.4;
type Entry = { ratio: number; manuallyPaused: boolean };
const registry = new Map<HTMLVideoElement, Entry>();
let pinned: HTMLVideoElement | null = null;

function recompute() {
  if (pinned) {
    const rec = registry.get(pinned);
    if (rec && rec.ratio >= MIN_RATIO) {
      for (const el of registry.keys()) {
        if (el === pinned) { if (el.paused) el.play().catch(() => {}); }
        else if (!el.paused) el.pause();
      }
      return;
    }
    pinned = null; // scrolled out — release the pin, fall through to auto-select
  }

  let winner: HTMLVideoElement | null = null;
  let best = MIN_RATIO;
  for (const [el, rec] of registry) {
    if (rec.manuallyPaused) continue;
    if (rec.ratio > best) { best = rec.ratio; winner = el; }
  }
  for (const el of registry.keys()) {
    if (el === winner) { if (el.paused) el.play().catch(() => {}); }
    else if (!el.paused) el.pause();
  }
}

// Every 10% step, not just one fixed threshold, so recompute() always has a
// current ratio to compare rather than a stale "was it above 40%" boolean.
const RATIO_THRESHOLDS = Array.from({ length: 11 }, (_, i) => i / 10);

export default function CaseStudyVideoPlayer({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scrubbing = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    registry.set(el, { ratio: 0, manuallyPaused: false });

    const obs = new IntersectionObserver(
      ([e]) => {
        const rec = registry.get(el);
        if (!rec) return;
        rec.ratio = e.intersectionRatio;
        recompute();
      },
      { threshold: RATIO_THRESHOLDS }
    );
    obs.observe(el);

    // On first mobile touch: if the player is in view, start it immediately.
    // This handler runs synchronously inside the touchstart gesture context,
    // so iOS allows play() even for unmuted video.
    const onUnlock = () => {
      const rec = registry.get(el);
      if (!rec || rec.manuallyPaused) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        pinned = el;
        recompute();
      }
    };
    window.addEventListener("videoUnlock", onUnlock, { once: true });

    return () => {
      obs.disconnect();
      window.removeEventListener("videoUnlock", onUnlock);
      registry.delete(el);
      if (pinned === el) pinned = null;
      recompute();
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTime = () => setCurrentTime(el.currentTime);
    const onMeta = () => setDuration(el.duration);
    const onEnded = () => setPlaying(false);
    // Native 'pause' is the single source of truth for the playing indicator —
    // it fires whether the pause was a click, scroll-out, or another player
    // claiming playback, so the icon/state never drifts out of sync.
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnded);
    el.addEventListener("pause", onPause);
    el.addEventListener("play", onPlay);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("play", onPlay);
    };
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = muted;
  }, [muted]);

  const toggle = useCallback(() => {
    const el = ref.current;
    const rec = el && registry.get(el);
    if (!el || !rec) return;
    if (el.paused) {
      rec.manuallyPaused = false;
      pinned = el;
      recompute();
    } else {
      rec.manuallyPaused = true;
      if (pinned === el) pinned = null;
      el.pause();
    }
  }, []);

  const toggleMute = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setMuted((m) => !m);
  }, []);

  const seekTo = useCallback((e: React.PointerEvent) => {
    const track = trackRef.current;
    const el = ref.current;
    if (!track || !el || !el.duration) return;
    const r = track.getBoundingClientRect();
    el.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * el.duration;
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    scrubbing.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    seekTo(e);
  }, [seekTo]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (scrubbing.current) seekTo(e);
  }, [seekTo]);

  const onPointerUp = useCallback(() => { scrubbing.current = false; }, []);

  const enterFullscreen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    containerRef.current?.requestFullscreen?.();
  }, []);

  const pct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black group cursor-pointer" onClick={toggle}>
      <video ref={ref} playsInline poster={poster} className="w-full h-full object-contain">
        <source src={src} type="video/mp4" />
      </video>

      {/* Bottom control bar — always visible on mobile, hover-only on desktop */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-10 bg-gradient-to-t from-black/70 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          {/* Play/pause */}
          <button onClick={toggle} className="flex-shrink-0 text-white/80 hover:text-white transition-colors">
            {playing
              ? <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="1" width="4" height="14" rx="1" /><rect x="10" y="1" width="4" height="14" rx="1" /></svg>
              : <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3 1.5L14 8L3 14.5V1.5Z" /></svg>}
          </button>

          {/* Scrub track */}
          <div
            ref={trackRef}
            className="relative flex-1 h-1 bg-white/20 rounded-full cursor-pointer group/track"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <div className="absolute inset-y-0 left-0 bg-white rounded-full" style={{ width: `${pct}%` }} />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow -translate-x-1/2 opacity-100 lg:opacity-0 lg:group-hover/track:opacity-100 transition-opacity"
              style={{ left: `${pct}%` }}
            />
          </div>

          {/* Time */}
          <span className="flex-shrink-0 text-[11px] text-white/55 tabular-nums">
            {fmt(currentTime)}{duration ? ` / ${fmt(duration)}` : ""}
          </span>

          {/* Mute */}
          <button onClick={toggleMute} className="flex-shrink-0 text-white/60 hover:text-white transition-colors">
            {muted ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 5.5v5h3l4 3V2.5L4 5.5H1z"/>
                <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M10.5 5.5l4 5M14.5 5.5l-4 5"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 5.5v5h3l4 3V2.5L4 5.5H1z"/>
                <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M10 5.5a3.5 3.5 0 0 1 0 5M11.5 3.5a6 6 0 0 1 0 9"/>
              </svg>
            )}
          </button>

          {/* Fullscreen */}
          <button onClick={enterFullscreen} className="flex-shrink-0 text-white/60 hover:text-white transition-colors">
            {isFullscreen
              ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 1H1v4M9 1h4v4M5 13H1v-4M9 13h4v-4" /></svg>
              : <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" /></svg>}
          </button>
        </div>
      </div>
    </div>
  );
}
