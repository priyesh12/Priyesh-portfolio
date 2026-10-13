'use client';

import { motion, useInView } from 'motion/react';
import { useLayoutEffect, useRef, useState } from 'react';
import { commits } from '@/content/data';
import { Reveal, SectionHeader } from './ui';

const LANE: Record<string, number> = { main: 14, research: 38, industry: 62 };
const DOT_Y = 30;

export function GitLog() {
  const listRef = useRef<HTMLOListElement>(null);
  const inView = useInView(listRef, { once: true, margin: '-10% 0px' });
  const [ys, setYs] = useState<number[]>([]);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const measure = () => {
      const rows = Array.from(el.querySelectorAll<HTMLElement>('[data-row]'));
      setYs(rows.map(r => r.offsetTop + DOT_Y));
      setHeight(el.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Build lane paths. Branches fork from `init` (last row) and merge back into main.
  const paths: { d: string; color: string }[] = [];
  if (ys.length === commits.length) {
    const last = ys.length - 1;
    paths.push({ d: `M${LANE.main} ${ys[0]} V${ys[last]}`, color: 'var(--acc)' });
    const branch = (name: 'research' | 'industry', mergeRow: number, color: string) => {
      const x = LANE[name];
      const yMerge = ys[mergeRow];
      const yFork = ys[last];
      const r = 18;
      paths.push({
        d: `M${LANE.main} ${yFork} C${LANE.main} ${yFork - r}, ${x} ${yFork - r}, ${x} ${yFork - r * 2} V${yMerge + r * 2} C${x} ${yMerge + r}, ${LANE.main} ${yMerge + r}, ${LANE.main} ${yMerge}`,
        color,
      });
    };
    branch('research', commits.findIndex(c => c.merge), 'var(--violet)');
    branch('industry', 0, 'var(--cyan)');
  }

  return (
    <section id="log" className="relative border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
        <SectionHeader
          index="04"
          kicker="CAREER · GIT LOG"
          title={
            <>
              The history, <span className="font-serif font-normal italic text-mute">as a commit graph.</span>
            </>
          }
        >
          Research on one branch, industry on another, and both merged into what I build now.
        </SectionHeader>

        <Reveal>
          <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-line bg-panel/60 px-4 py-3 font-mono text-[12px]">
            <span>
              <span className="text-acct">priyesh@pg-os</span>
              <span className="text-dim">:</span>
              <span className="text-violet">~/career</span>
              <span className="text-dim">$ </span>
              git log --graph --all --decorate
            </span>
            <span className="ml-auto flex gap-4 text-[11px] text-dim">
              <span className="flex items-center gap-1.5">
                <i className="h-2 w-2 rounded-full bg-acc" /> main
              </span>
              <span className="flex items-center gap-1.5">
                <i className="h-2 w-2 rounded-full bg-violet" /> research
              </span>
              <span className="flex items-center gap-1.5">
                <i className="h-2 w-2 rounded-full bg-cyan" /> industry
              </span>
            </span>
          </div>
        </Reveal>

        <div className="relative">
          <svg className="pointer-events-none absolute left-0 top-0 w-[80px]" height={height} aria-hidden>
            {paths.map((p, i) => (
              <motion.path
                key={i}
                d={p.d}
                fill="none"
                stroke={p.color}
                strokeWidth={1.6}
                strokeOpacity={0.75}
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 2.2, delay: 0.2 + i * 0.25, ease: [0.65, 0, 0.35, 1] }}
              />
            ))}
            {ys.map((y, i) => {
              const c = commits[i];
              const x = LANE[c.branch];
              const color = c.branch === 'main' ? 'var(--acc)' : c.branch === 'research' ? 'var(--violet)' : 'var(--cyan)';
              return (
                <motion.g key={c.hash} initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.5 + i * 0.12, type: 'spring', stiffness: 300 }} style={{ originX: `${x}px`, originY: `${y}px` }}>
                  <circle cx={x} cy={y} r={c.head ? 7 : 5} fill="var(--bg)" stroke={color} strokeWidth={2} />
                  {c.head && <circle cx={x} cy={y} r={3} fill={color} />}
                </motion.g>
              );
            })}
          </svg>

          <ol ref={listRef} className="pl-[88px]">
            {commits.map((c, i) => (
              <li key={c.hash} data-row className="group relative border-b border-line pb-8 pt-4 last:border-b-0">
                <Reveal delay={0.05 * i} y={14}>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12px]">
                    <span className="text-acct">{c.hash}</span>
                    {c.head && <span className="rounded border border-acc/50 px-1.5 py-px text-[10px] text-acct">HEAD → main</span>}
                    {c.branch !== 'main' && (
                      <span className={`rounded border px-1.5 py-px text-[10px] ${c.branch === 'research' ? 'border-violet/50 text-violet' : 'border-cyan/50 text-cyan'}`}>
                        origin/{c.branch}
                      </span>
                    )}
                    <span className="text-dim">{c.date}</span>
                  </div>
                  <h3 className="mt-2 text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium tracking-[-0.02em]">
                    {c.title} <span className="text-mute">@ {c.org}</span>
                  </h3>
                  <ul className="mt-3 max-w-3xl space-y-1.5">
                    {c.points.map(pt => (
                      <li key={pt} className="flex gap-3 text-[15px] leading-relaxed text-mute">
                        <span className="select-none font-mono text-dim">+</span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
