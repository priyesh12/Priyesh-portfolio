'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { alsoBuilt, projects, type Project } from '@/content/data';
import { Reveal, SectionHeader } from '../ui';
import { VizCanvas } from './VizCanvas';

function Card({ p, i, onOpen }: { p: Project; i: number; onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  const big = i < 2;
  return (
    <Reveal delay={(i % 2) * 0.08} className={big ? 'md:col-span-3' : 'md:col-span-2'}>
      <motion.button
        layoutId={`card-${p.slug}`}
        onClick={onOpen}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="spot group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line bg-panel/60 text-left transition-colors hover:border-line2"
        aria-label={`Open details for ${p.name}`}
      >
        <div className={`relative w-full border-b border-line bg-bg2/60 ${big ? 'h-56' : 'h-44'}`}>
          <div className="absolute inset-x-0 bottom-0 top-10">
            <VizCanvas viz={p.viz} speed={hover ? 2 : 1} />
          </div>
          <span className="absolute left-3 top-3 font-mono text-[10px] text-dim">SYS.{String(i + 1).padStart(2, '0')}</span>
          <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full border border-line2 text-[13px] text-mute transition-all duration-500 group-hover:rotate-45 group-hover:border-acc group-hover:text-acct">
            +
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="font-mono text-[11px] uppercase tracking-wider text-acct">{p.kind}</div>
          <h3 className="mt-2 text-[22px] font-medium leading-tight tracking-[-0.02em]">{p.name}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-mute">{p.pitch}</p>
          <div className="mt-auto grid grid-cols-2 gap-4 pt-6">
            {p.metrics.slice(0, 2).map(([v, k]) => (
              <div key={k}>
                <div className="text-[20px] font-medium tracking-tight tabular-nums">{v}</div>
                <div className="mt-0.5 text-[12px] leading-snug text-dim">{k}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.button>
    </Reveal>
  );
}

function Detail({ p, onClose }: { p: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-[70] flex items-end justify-center p-0 md:items-center md:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-bg/75 backdrop-blur-md" onClick={onClose} />
      <motion.article
        layoutId={`card-${p.slug}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`dlg-${p.slug}`}
        className="relative max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-t-3xl border border-line2 bg-panel md:rounded-3xl"
        data-lenis-prevent
      >
        <div className="relative h-56 border-b border-line bg-bg2 md:h-72">
          <VizCanvas viz={p.viz} speed={1.2} />
          <button
            onClick={onClose}
            autoFocus
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-line2 bg-panel/80 text-mute backdrop-blur hover:text-fg"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-6 md:p-10">
          <div className="font-mono text-[11px] uppercase tracking-wider text-acct">{p.kind}</div>
          <h3 id={`dlg-${p.slug}`} className="mt-2 text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-none tracking-[-0.03em]">
            {p.name}
          </h3>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-mute">{p.pitch}</p>

          <div className={`mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line ${p.metrics.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
            {p.metrics.map(([v, k]) => (
              <div key={k} className="bg-panel p-4">
                <div className="text-[24px] font-medium tracking-tight tabular-nums">{v}</div>
                <div className="mt-1 text-[12px] text-dim">{k}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div>
              <div className="mono-label mb-3">the problem</div>
              <p className="text-[15px] leading-relaxed text-mute">{p.problem}</p>
              {p.code && (
                <pre className="mt-6 overflow-x-auto rounded-lg border border-line bg-bg2 p-4 font-mono text-[12px]">
                  <span className="text-dim">&gt;&gt;&gt; </span>
                  <span className="text-fg">{p.code}</span>
                </pre>
              )}
              {p.note && <p className="mt-4 font-mono text-[12px] text-dim">// {p.note}</p>}
            </div>
            <div>
              <div className="mono-label mb-3">what I built</div>
              <ul className="space-y-2.5">
                {p.built.map(b => (
                  <li key={b} className="flex gap-3 text-[15px] leading-snug">
                    <span className="mt-[7px] h-1 w-3 shrink-0 bg-acc" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <ul className="flex flex-wrap gap-2">
              {p.stack.map(s => (
                <li key={s} className="rounded-md border border-line px-2.5 py-1 font-mono text-[11px] text-mute">
                  {s}
                </li>
              ))}
            </ul>
            {p.link && (
              <a href={p.link.href} target="_blank" rel="noreferrer" className="font-mono text-[12px] text-acct link-u">
                {p.link.label} ↗
              </a>
            )}
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

export function Systems() {
  const [open, setOpen] = useState<string | null>(null);
  const current = projects.find(p => p.slug === open) ?? null;

  useEffect(() => {
    const onOpen = (e: Event) => setOpen((e as CustomEvent<string>).detail);
    window.addEventListener('open-project', onOpen);
    return () => window.removeEventListener('open-project', onOpen);
  }, []);

  return (
    <section id="systems" className="relative mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
      <SectionHeader
        index="03"
        kicker="SELECTED SYSTEMS"
        title={
          <>
            Systems I’ve built <span className="font-serif font-normal italic text-mute">end to end.</span>
          </>
        }
      >
        The research and engineering that fed into AlphaCalendar: LLMs on earnings calls, volatility surfaces, execution
        engines, filings parsers. Each card is a live sketch of what the system does. Open one for the details.
      </SectionHeader>

      <div className="grid gap-3 md:grid-cols-6">
        {projects.map((p, i) => (
          <Card key={p.slug} p={p} i={i} onOpen={() => setOpen(p.slug)} />
        ))}
      </div>

      <div className="mt-24">
        <Reveal>
          <div className="mono-label mb-6">also built · archive</div>
        </Reveal>
        <div className="border-t border-line">
          {alsoBuilt.map((a, i) => {
            const Row = (
              <div className="group grid gap-2 border-b border-line py-5 transition-colors hover:bg-panel/50 md:grid-cols-12 md:items-baseline md:gap-6 md:px-2">
                <span className="hidden font-mono text-[11px] text-dim md:col-span-1 md:block">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[17px] font-medium tracking-tight md:col-span-3">
                  {a.name}
                  {a.href && <span className="ml-2 text-acct opacity-0 transition-opacity group-hover:opacity-100">↗</span>}
                </span>
                <span className="text-[14px] text-mute md:col-span-6">{a.note}</span>
                <span className="font-mono text-[11px] text-dim md:col-span-2 md:text-right">{a.tags.join(' · ')}</span>
              </div>
            );
            return (
              <Reveal key={a.name} y={10}>
                {a.href ? (
                  <a href={a.href} target="_blank" rel="noreferrer">
                    {Row}
                  </a>
                ) : (
                  Row
                )}
              </Reveal>
            );
          })}
        </div>
      </div>

      <AnimatePresence>{current && <Detail key={current.slug} p={current} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
