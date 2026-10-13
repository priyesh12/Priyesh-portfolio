'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { profile, tickerMetrics } from '@/content/data';
import { useApp } from '../Providers';
import { Kbd, useIstClock } from '../ui';
import { FORMATIONS } from './ParticleField';

const ParticleField = dynamic(() => import('./ParticleField').then(m => m.ParticleField), { ssr: false });

const ease = [0.16, 1, 0.3, 1] as const;

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: '110%', rotate: 2 }}
        animate={{ y: '0%', rotate: 0 }}
        transition={{ duration: 1.2, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const { theme, scrollTo, setPaletteOpen } = useApp();
  const [formation, setFormation] = useState(0);
  const [stats, setStats] = useState({ fps: 60, x: 0, y: 0 });
  const jumpRef = useRef<((i: number) => void) | null>(null);
  const ref = useRef<HTMLElement>(null);
  const clock = useIstClock();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const fieldOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const fieldScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);

  return (
    <section ref={ref} id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden" aria-label="Introduction">
      <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
      <motion.div style={{ opacity: fieldOpacity, scale: fieldScale }} className="absolute inset-0">
        <ParticleField theme={theme} onFormation={setFormation} onStats={setStats} jumpRef={jumpRef} />
      </motion.div>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_60%,var(--bg)_0%,transparent_55%)] opacity-90"
        aria-hidden
      />

      {/* HUD frame */}
      <div className="pointer-events-none absolute inset-x-4 bottom-24 top-24 hidden md:block lg:inset-x-8" aria-hidden>
        <span className="corner left-0 top-0 border-l border-t" />
        <span className="corner right-0 top-0 border-r border-t" />
        <span className="corner bottom-0 left-0 border-b border-l" />
        <span className="corner bottom-0 right-0 border-b border-r" />
      </div>

      <div className="absolute right-6 top-28 z-10 hidden w-64 font-mono text-[11px] text-mute md:block lg:right-12">
        <div className="mb-2 flex items-center justify-between text-dim">
          <span>FIELD</span>
          <span>
            {String(formation + 1).padStart(2, '0')} / {String(FORMATIONS.length).padStart(2, '0')}
          </span>
        </div>
        <div className="space-y-1">
          {FORMATIONS.map((f, i) => (
            <button
              key={f.id}
              onClick={() => jumpRef.current?.(i)}
              className={`group flex w-full items-center gap-2 text-left transition-colors ${i === formation ? 'text-fg' : 'hover:text-fg'}`}
            >
              <span className={`h-px transition-all duration-700 ${i === formation ? 'w-6 bg-acc' : 'w-2 bg-line2 group-hover:w-4'}`} />
              <span className="uppercase tracking-wider">{f.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 text-dim">{FORMATIONS[formation].meta}</div>
      </div>

      <div className="absolute bottom-28 right-6 z-10 hidden space-y-1 text-right font-mono text-[10.5px] text-dim md:block lg:right-12">
        <div>
          {Number.isFinite(stats.x) ? (
            <>
              x <span className="text-mute">{stats.x.toFixed(3)}</span> · y <span className="text-mute">{stats.y.toFixed(3)}</span>
            </>
          ) : (
            <span>move cursor to perturb the field</span>
          )}
        </div>
        <div>
          {Math.min(stats.fps, 120)} fps · webgl · 26k pts
        </div>
        <div>{clock} IST</div>
      </div>

      {/* copy */}
      <motion.div style={{ y: textY }} className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-5 pb-28 pt-32 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mono-label mb-8 flex flex-wrap items-center gap-x-3 gap-y-2"
        >
          <span className="rounded-full border border-line2 px-2.5 py-1 text-fg">{profile.name}</span>
          <span className="text-dim">/</span>
          <span>{profile.role}</span>
          <span className="text-dim">/</span>
          <span className="text-acct">{profile.title}</span>
        </motion.div>

        <h1 className="max-w-[15ch] text-[clamp(3rem,9.2vw,8.6rem)] font-medium leading-[0.9] tracking-[-0.05em]">
          <Line delay={0.35}>I build machines</Line>
          <Line delay={0.5}>
            that{' '}
            <span className="font-serif text-[1.08em] font-normal italic tracking-[-0.02em] text-acct">read</span>{' '}
            markets.
          </Line>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease }}
          className="mt-8 max-w-xl text-[clamp(1rem,1.4vw,1.2rem)] leading-relaxed text-mute text-pretty"
        >
          I design end-to-end AI and quant systems: point-in-time data lakes, LLM pipelines that cite their sources, and
          statistics that survive a permutation test. I built and shipped{' '}
          <a href={profile.links.alphacalendar} target="_blank" rel="noreferrer" className="link-u text-fg">
            AlphaCalendar
          </a>{' '}
          solo, and before it did applied AI research at IIT Bombay and IIT Madras.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.15, ease }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <button
            onClick={() => scrollTo('#alphacalendar')}
            className="group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full bg-acc px-6 text-[14px] font-medium text-ink"
          >
            <span className="relative z-10">See the flagship</span>
            <span className="relative z-10 transition-transform duration-500 group-hover:translate-y-0.5">↓</span>
            <span className="absolute inset-0 -translate-x-full bg-white/40 transition-transform duration-700 group-hover:translate-x-0" />
          </button>
          <a
            href={profile.links.alphacalendar}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-line2 px-5 text-[14px] transition-colors hover:border-fg/40 hover:bg-panel2"
          >
            alphacalendar.in <span className="text-acct">↗</span>
          </a>
          <button onClick={() => setPaletteOpen(true)} className="ml-1 hidden items-center gap-2 text-[13px] text-mute transition-colors hover:text-fg sm:flex">
            or press <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </button>
        </motion.div>
      </motion.div>

      <Ticker />
    </section>
  );
}

function Ticker() {
  const row = [...tickerMetrics, ...tickerMetrics];
  return (
    <div className="relative z-10 border-y border-line bg-bg/60 backdrop-blur-sm" aria-label="Key numbers">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row.map(([k, v], i) => (
          <div key={i} className="flex items-center gap-3 whitespace-nowrap px-6 py-3.5 font-mono text-[12px]" aria-hidden={i >= tickerMetrics.length}>
            <span className="text-dim">▲</span>
            <span className="uppercase tracking-wider text-mute">{k}</span>
            <span className="text-fg">{v}</span>
            <span className="ml-3 h-3 w-px bg-line2" />
          </div>
        ))}
      </div>
    </div>
  );
}
