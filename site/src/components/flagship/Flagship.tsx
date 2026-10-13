'use client';

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { alpha } from '@/content/data';
import { Corners, Counter, Reveal, Scramble } from '../ui';
import { Pipeline } from './Pipeline';

export function BrowserFrame() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const screens = alpha.screens;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI(v => (v + 1) % screens.length), 4200);
    return () => clearInterval(id);
  }, [paused, screens.length]);

  return (
    <div
      className="overflow-hidden rounded-xl border border-line2 bg-panel shadow-[0_60px_160px_-40px_rgba(0,0,0,0.7)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center gap-3 border-b border-line bg-panel2 px-3 py-2.5 md:px-4">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-line bg-bg2 px-3 py-1 font-mono text-[11px] text-mute">
          <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          <AnimatePresence mode="wait">
            <motion.span
              key={screens[i].path}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="truncate"
            >
              {screens[i].path}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-acc/40 px-2 py-0.5 font-mono text-[10px] text-acct sm:flex">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-acc" /> LIVE
        </span>
      </div>
      <div className="relative aspect-[16/10] bg-bg2">
        <AnimatePresence initial={false}>
          <motion.img
            key={screens[i].src}
            src={screens[i].src}
            alt={`AlphaCalendar: ${screens[i].label}`}
            initial={{ opacity: 0, scale: 1.03, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full object-cover object-top"
            loading="lazy"
          />
        </AnimatePresence>
      </div>
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-t border-line bg-panel2 p-1.5" role="tablist" aria-label="AlphaCalendar screens">
        {screens.map((s, k) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={k === i}
            onClick={() => setI(k)}
            className={`relative shrink-0 overflow-hidden rounded-md px-3 py-2.5 font-mono text-[11px] transition-colors sm:py-1.5 ${
              k === i ? 'bg-bg2 text-fg' : 'text-mute hover:text-fg'
            }`}
          >
            {s.label}
            {k === i && !paused && (
              <motion.span
                key={`bar-${i}`}
                className="absolute inset-x-0 bottom-0 h-px origin-left bg-acc"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 4.2, ease: 'linear' }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Flagship() {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'center center'] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 32, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.84, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 80, 0]);

  return (
    <section id="alphacalendar" className="relative overflow-hidden border-t border-line py-28 md:py-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,var(--acc-soft),transparent)]" aria-hidden />
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        {/* title block */}
        <div className="mono-label flex flex-wrap items-center gap-3">
          <span className="text-acct">02</span>
          <span className="h-px w-10 bg-line2" />
          <Scramble text="FLAGSHIP · FOUNDER & SOLE ENGINEER" />
        </div>
        <div className="mt-8 grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <Reveal>
              <h2 className="text-[clamp(3.2rem,11vw,10rem)] font-medium leading-[0.86] tracking-[-0.06em]">
                Alpha<span className="font-serif font-normal italic tracking-[-0.03em] text-acct">Calendar</span>
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-4">
            <Reveal delay={0.1}>
              <p className="text-[17px] leading-relaxed text-mute text-pretty">{alpha.oneLiner}</p>
              <div className="mt-5 flex flex-wrap gap-2 font-mono text-[11px]">
                <span className="rounded-full border border-acc/40 px-2.5 py-1 text-acct">● {alpha.shipped}</span>
                <span className="rounded-full border border-line px-2.5 py-1 text-mute">Indian equities</span>
                <span className="rounded-full border border-line px-2.5 py-1 text-mute">solo-built</span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* product frame */}
        <div ref={frameRef} className="mt-16 [perspective:1600px] md:mt-24">
          <motion.div style={{ rotateX, scale, y, transformOrigin: 'center top' }} className="relative mx-auto max-w-[1180px]">
            <BrowserFrame />
          </motion.div>
        </div>

        <Reveal className="mx-auto mt-14 max-w-3xl text-center">
          <p className="text-[clamp(1.15rem,2vw,1.6rem)] leading-snug tracking-tight text-pretty">{alpha.pitch}</p>
        </Reveal>

        {/* numbers */}
        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:mt-28 lg:grid-cols-4">
          {alpha.stats.map((s, i) => (
            <Reveal key={s.label} delay={(i % 4) * 0.06} className="spot bg-bg p-5 md:p-7">
              <div className="font-mono text-[10px] text-dim">{String(i + 1).padStart(2, '0')}</div>
              <div className="mt-6 text-[clamp(2rem,4.2vw,3.4rem)] font-medium leading-none tracking-[-0.04em] tabular-nums">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-3 text-[14px] leading-snug">{s.label}</div>
              <div className="mt-1 font-mono text-[11px] text-dim">{s.sub}</div>
            </Reveal>
          ))}
        </div>

        {/* architecture */}
        <div className="mt-28 grid gap-10 md:mt-36 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <div className="mono-label mb-4">architecture</div>
              <h3 className="text-[clamp(1.8rem,3.2vw,2.8rem)] font-medium leading-[1.02] tracking-[-0.03em]">
                From a raw exchange file to a cited answer, one way down.
              </h3>
              <p className="mt-5 text-[15px] leading-relaxed text-mute">
                Every dataset has a contract. Every row says when it became knowable. Every write passes the same fifteen
                gates. The UI computes nothing financial; it only reads what the pipeline has already proven.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <Reveal delay={0.1}>
              <Pipeline />
            </Reveal>
          </div>
        </div>

        {/* modules */}
        <div className="mt-28 md:mt-36">
          <Reveal>
            <div className="mono-label mb-6">what ships · {alpha.modules.length} of ~40 surfaces</div>
          </Reveal>
          <div className="grid border-t border-line md:grid-cols-2">
            {alpha.modules.map(([k, v], i) => (
              <Reveal key={k} delay={(i % 2) * 0.05}>
                <div className="group flex items-baseline gap-5 border-b border-line py-5 md:pr-10 md:even:pl-10">
                  <span className="font-mono text-[11px] text-dim transition-colors group-hover:text-acct">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="text-[18px] font-medium tracking-tight transition-transform duration-500 group-hover:translate-x-1">{k}</div>
                    <div className="mt-1 text-[14px] text-mute">{v}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* hard problems */}
        <div className="mt-28 md:mt-36">
          <Reveal>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <h3 className="max-w-2xl text-[clamp(1.8rem,3.2vw,2.8rem)] font-medium leading-[1.02] tracking-[-0.03em]">
                Hard problems, <span className="font-serif font-normal italic text-mute">actually solved.</span>
              </h3>
              <span className="mono-label">engineering log · selected</span>
            </div>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {alpha.hardProblems.map((p, i) => (
              <Reveal key={p.k} delay={(i % 4) * 0.06}>
                <article className="spot group relative h-full rounded-2xl border border-line bg-panel/60 p-6 transition-colors hover:border-line2">
                  <Corners className="opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="font-mono text-[11px] text-acct">P.{String(i + 1).padStart(2, '0')}</div>
                  <h4 className="mt-5 text-[17px] font-medium leading-snug tracking-tight">{p.k}</h4>
                  <p className="mt-3 text-[14px] leading-relaxed text-mute">{p.v}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* stack + CTA */}
        <div className="mt-20 flex flex-col gap-10 border-t border-line pt-10 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex max-w-3xl flex-wrap gap-2">
            {alpha.stack.map(s => (
              <li key={s} className="rounded-md border border-line bg-panel/50 px-2.5 py-1 font-mono text-[11px] text-mute">
                {s}
              </li>
            ))}
          </ul>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/work/alphacalendar/"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-line2 px-5 text-[14px] transition-colors hover:bg-panel2"
            >
              Read the case study <span className="text-acct">→</span>
            </Link>
            <a
              href={alpha.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-acc px-6 text-[14px] font-medium text-ink transition-transform hover:-translate-y-0.5"
            >
              Visit alphacalendar.in ↗
            </a>
          </div>
        </div>
        <p className="mt-6 font-mono text-[10px] text-dim">AlphaCalendar is a research tool, not investment advice. Figures as of Oct 2026.</p>
      </div>
    </section>
  );
}
