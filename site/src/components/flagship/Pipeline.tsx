'use client';

import { motion, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { alpha } from '@/content/data';

/** Animated end-to-end data flow for AlphaCalendar. Hover/focus a node for detail. */
export function Pipeline({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const [active, setActive] = useState(3);
  const [gate, setGate] = useState(-1);

  // gates light up in sequence, then loop
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setGate(g => (g + 1) % (alpha.gates + 6)), 140);
    return () => clearInterval(id);
  }, [inView]);

  const nodes = alpha.pipeline;

  return (
    <div ref={ref} className="relative">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-panel/70 p-5 md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-mute">
          <span className="uppercase tracking-wider">
            <span className="text-acct">●</span> data plane · one-way flow · nothing reads upward
          </span>
          <span className="text-dim">hover a stage</span>
        </div>

        {/* desktop: horizontal flow */}
        <div className="relative hidden xl:block">
          <div className="grid grid-cols-8 gap-3">
            {nodes.map((n, i) => (
              <motion.button
                key={n.id}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className={`relative z-10 flex h-24 flex-col justify-between rounded-xl border p-3 text-left transition-all duration-300 ${
                  active === i ? 'border-acc/70 bg-accsoft' : 'border-line bg-bg2 hover:border-line2'
                }`}
              >
                <span className="font-mono text-[10px] text-dim">{String(i).padStart(2, '0')}</span>
                <span className="break-words text-[13px] font-medium leading-tight">
                  {n.label.split(' ×')[0]}
                  {n.label.includes(' ×') && <span className="block font-mono text-[10px] font-normal text-mute">×{n.label.split(' ×')[1]} datasets</span>}
                </span>
              </motion.button>
            ))}
          </div>
          {/* data bus with travelling packets */}
          <div className="pointer-events-none relative mt-1 h-7" aria-hidden>
            <div className="grid h-3 grid-cols-8 gap-3">
              {nodes.map((n, i) => (
                <span key={n.id} className={`mx-auto w-px transition-colors ${active === i ? 'bg-acc' : 'bg-line2'}`} />
              ))}
            </div>
            <div className="absolute left-[6.25%] right-[6.25%] top-3 h-px bg-line2">
              {inView &&
                Array.from({ length: 6 }, (_, k) => (
                  <span
                    key={k}
                    className="absolute -top-[2px] h-[5px] w-[5px] rounded-full bg-acc shadow-[0_0_12px_var(--acc)]"
                    style={{ animation: `packet ${5 + (k % 3)}s linear ${k * 0.95}s infinite` }}
                  />
                ))}
            </div>
          </div>

          {/* validation harness spanning canonical → serving */}
          <div className="mt-4 grid grid-cols-8 gap-3">
            <div className="col-span-3 col-start-3 rounded-xl border border-dashed border-line2 px-3 py-2.5">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-mute">
                <span>validation harness</span>
                <span className="text-acct">{alpha.gates} gates</span>
              </div>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: alpha.gates }, (_, g) => (
                  <span
                    key={g}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${g <= gate ? 'bg-acc' : 'bg-line2'}`}
                  />
                ))}
              </div>
            </div>
            <div className="col-span-3 flex items-center font-mono text-[10px] leading-relaxed text-dim">
              TOML contracts · SHA-256 lineage · atomic writes · one build lock · available_at on every row
            </div>
          </div>
        </div>

        {/* mobile: vertical flow */}
        <ol className="relative space-y-2 xl:hidden">
          <span className="absolute bottom-4 left-[15px] top-4 w-px bg-line2" aria-hidden />
          {nodes.map((n, i) => (
            <li key={n.id}>
              <button
                onClick={() => setActive(i)}
                className={`relative flex w-full items-center gap-4 rounded-xl border p-3 text-left transition-colors ${
                  active === i ? 'border-acc/70 bg-accsoft' : 'border-line bg-bg2'
                }`}
              >
                <span className={`relative z-10 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${active === i ? 'border-acc bg-acc' : 'border-line2 bg-bg'}`} />
                <span className="font-mono text-[10px] text-dim">{String(i).padStart(2, '0')}</span>
                <span className="text-[14px] font-medium">{n.label}</span>
              </button>
            </li>
          ))}
        </ol>

        {/* readout */}
        <div className="mt-6 rounded-xl border border-line bg-bg2 px-4 py-3 font-mono text-[12px] leading-relaxed" aria-live="polite">
          <span className="text-acct">❯ stage[{active}]</span> <span className="text-fg">{nodes[active].label}</span>
          <span className="text-dim"> // </span>
          <span className="text-mute">{nodes[active].detail}</span>
          <span className="ml-1 inline-block h-3.5 w-1.5 translate-y-0.5 animate-blink bg-acc" />
        </div>
        {!compact && (
          <div className="mt-3 grid gap-2 font-mono text-[11px] text-dim sm:grid-cols-3">
            <span>→ fan-out: Telegram alerts · email letters · Google Calendar / Sheets</span>
            <span>↔ user plane: Supabase Postgres (Mumbai, RLS on)</span>
            <span>↔ Ask AI: embeddings + read-only tools + spend ledger</span>
          </div>
        )}
      </div>
    </div>
  );
}
