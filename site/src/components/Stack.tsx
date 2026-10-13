'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { stack } from '@/content/data';
import { Reveal, SectionHeader } from './ui';

// Where each skill has actually been used. Skills without an entry are simply listed.
const usedIn: Record<string, string[]> = {
  LLMs: ['AlphaCalendar · concall extraction', 'Transcript Intelligence', 'Buzz-AI', 'Vocab.AI'],
  RAG: ['AlphaCalendar · Ask AI', 'Transcript Intelligence', 'Buzz-AI'],
  Embeddings: ['AlphaCalendar · int8 256-d', 'Transcript Intelligence'],
  'Qwen / LLaMA': ['Transcript Intelligence', 'LLaMA-2 Devanagari', 'Vocab.AI'],
  'OpenAI · Gemini': ['AlphaCalendar'],
  'llama.cpp': ['Transcript Intelligence'],
  FAISS: ['Transcript Intelligence', 'Buzz-AI'],
  Whisper: ['IEEE TALE paper', 'Vocab.AI'],
  'Fine-tuning': ['LLaMA-2 Devanagari', 'Vocab.AI'],
  'Structured outputs': ['Transcript Intelligence', 'AlphaCalendar'],
  PyTorch: ['Diarization research', 'Lung-nodule 3D CNNs'],
  TensorFlow: ['Emotion recognition', 'DRS Hackathon'],
  'scikit-learn': ['Earnings-Wave', 'Qtrinox'],
  CRFs: ['T4E 2024 paper'],
  '3D CNNs': ['Lung-nodule research'],
  'Black-76 / SVI': ['Options-Lab', 'AlphaCalendar · derivatives'],
  'Permutation + FDR': ['AlphaCalendar · seasonality', 'Trading-Tools'],
  'Walk-forward': ['Earnings-Wave', 'Pattern-Matcher', 'Qtrinox'],
  DTW: ['Pattern-Matcher'],
  'Monte Carlo': ['Options-Lab', 'Qtrinox'],
  Polars: ['NSE Fundamentals', 'Trading-Tools', 'Earnings-Wave'],
  DuckDB: ['AlphaCalendar', 'Transcript Intelligence', 'Buzz-AI'],
  Parquet: ['AlphaCalendar · data lake', 'Nifty Data Scraper'],
  XBRL: ['NSE Fundamentals', 'AlphaCalendar'],
  'Data contracts': ['AlphaCalendar · 171 TOML contracts'],
  asyncio: ['Spectrade'],
  FastAPI: ['Qtrinox', 'Alpha-EMAs'],
  Postgres: ['AlphaCalendar · user plane'],
  'Next.js': ['AlphaCalendar', 'this site'],
  TypeScript: ['AlphaCalendar · ~150k LOC', 'this site'],
  'D3.js': ['Trading-Tools'],
  Cloudflare: ['AlphaCalendar · tunnel + edge'],
  'Linux · systemd': ['AlphaCalendar · scheduled tiers'],
};

export function Stack() {
  const [hover, setHover] = useState<string | null>(null);
  const uses = hover ? usedIn[hover] : null;

  return (
    <section id="stack" className="relative border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
        <SectionHeader
          index="06"
          kicker="STACK · TOOLCHAIN"
          title={
            <>
              Tools, <span className="font-serif font-normal italic text-mute">and where they’ve shipped.</span>
            </>
          }
        >
          Hover or tap a skill to see where I’ve actually used it.
        </SectionHeader>

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-8 xl:grid-cols-3">
            {stack.map((g, gi) => (
              <Reveal key={g.group} delay={(gi % 3) * 0.06}>
                <div>
                  <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-dim">
                    <span className="text-acct">[{g.group.toLowerCase()}]</span>
                    <span className="h-px flex-1 bg-line" />
                  </div>
                  <ul className="flex flex-wrap gap-1.5">
                    {g.items.map(s => {
                      const has = !!usedIn[s];
                      const on = hover === s;
                      return (
                        <li key={s}>
                          <button
                            onMouseEnter={() => setHover(s)}
                            onFocus={() => setHover(s)}
                            onClick={() => setHover(s)}
                            className={`rounded-md border px-2.5 py-1.5 font-mono text-[12px] transition-all duration-200 ${
                              on
                                ? 'border-acc bg-acc text-ink'
                                : has
                                  ? 'border-line2 text-fg hover:border-acc/60'
                                  : 'border-line text-mute'
                            }`}
                          >
                            {s}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <AnimatePresence>
                    {hover && g.items.includes(hover) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden lg:hidden"
                        aria-live="polite"
                      >
                        <div className="mt-3 rounded-xl border border-acc/40 bg-accsoft p-4 font-mono text-[12px]">
                          {uses ? (
                            <ul className="space-y-1.5">
                              {uses.map(u => (
                                <li key={u} className="flex gap-2 text-mute">
                                  <span className="text-acct">→</span>
                                  {u}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-mute">
                              <span className="text-fg">{hover}</span> is part of my everyday toolkit.
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28 rounded-2xl border border-line bg-panel/70 p-6 font-mono text-[13px]" aria-live="polite">
              <div className="flex items-center justify-between text-[11px] text-dim">
                <span>grep -r “{hover ?? '…'}” ~/work</span>
                <span className="h-2 w-2 animate-pulse-dot rounded-full bg-acc" />
              </div>
              <div className="mt-5 min-h-[180px]">
                <AnimatePresence mode="wait">
                  <motion.div key={hover ?? 'none'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                    {!hover && <p className="text-mute">Pick a skill on the left.</p>}
                    {hover && uses && (
                      <>
                        <p className="text-fg">
                          {uses.length} match{uses.length > 1 ? 'es' : ''} for <span className="text-acct">{hover}</span>
                        </p>
                        <ul className="mt-4 space-y-2">
                          {uses.map((u, i) => (
                            <motion.li key={u} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-2 text-mute">
                              <span className="text-acct">→</span>
                              {u}
                            </motion.li>
                          ))}
                        </ul>
                      </>
                    )}
                    {hover && !uses && (
                      <p className="text-mute">
                        <span className="text-fg">{hover}</span> is part of my everyday toolkit across projects.
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
