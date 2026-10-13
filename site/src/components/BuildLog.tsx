'use client';

import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { buildLog } from '@/content/data';
import { Reveal, Scramble } from './ui';

/** Pinned horizontal scroll through the build log (desktop); a plain list on small screens. */
export function BuildLog() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, v => -v * dist);
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useMotionValueEvent(scrollYProgress, 'change', v => setActive(Math.min(buildLog.length - 1, Math.floor(v * buildLog.length))));

  useEffect(() => {
    const measure = () => {
      const t = trackRef.current;
      if (!t) return;
      setDist(Math.max(0, t.scrollWidth - window.innerWidth + 80));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <section id="buildlog" className="relative border-t border-line">
      {/* desktop: pinned horizontal */}
      <div ref={wrapRef} className="relative hidden md:block" style={{ height: `calc(100vh + ${dist}px)` }}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="mx-auto mb-12 flex w-full max-w-[1400px] items-end justify-between px-10">
            <div>
              <div className="mono-label flex items-center gap-3">
                <span className="text-acct">07</span>
                <span className="h-px w-10 bg-line2" />
                <Scramble text="BUILD LOG · 2025 → 2026" />
              </div>
              <h2 className="mt-6 text-[clamp(2.2rem,5vw,4.4rem)] font-medium leading-[0.98] tracking-[-0.035em]">
                Twenty-two months, <span className="font-serif font-normal italic text-mute">one direction.</span>
              </h2>
            </div>
            <div className="text-right font-mono text-[12px] text-dim">
              <div className="text-[44px] leading-none tracking-tight text-fg tabular-nums">{buildLog[active].m.split(' ').slice(-1)[0]}</div>
              <div className="mt-2">{buildLog[active].m}</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-0 right-0 top-[7px] h-px bg-line2" />
            <motion.div style={{ width: fill }} className="absolute left-0 top-[7px] h-px bg-acc shadow-[0_0_12px_var(--acc)]" />
            <motion.div ref={trackRef} style={{ x }} className="flex gap-5 pl-10 pr-10 will-change-transform">
              {buildLog.map((e, i) => (
                <div key={e.m + e.t} className="w-[300px] shrink-0">
                  <div className={`h-[15px] w-[15px] rounded-full border-2 transition-colors duration-300 ${i <= active ? 'border-acc bg-acc' : 'border-line2 bg-bg'}`} />
                  <div
                    className={`mt-6 rounded-2xl border p-6 transition-all duration-500 ${
                      i === active ? 'border-acc/50 bg-accsoft' : 'border-line bg-panel/60'
                    }`}
                  >
                    <div className="font-mono text-[11px] uppercase tracking-wider text-acct">{e.m}</div>
                    <div className="mt-3 text-[20px] font-medium leading-tight tracking-tight">{e.t}</div>
                    <p className="mt-2 text-[14px] leading-relaxed text-mute">{e.d}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* mobile: vertical */}
      <div className="px-5 py-28 md:hidden">
        <div className="mono-label flex items-center gap-3">
          <span className="text-acct">07</span>
          <span className="h-px w-10 bg-line2" />
          BUILD LOG
        </div>
        <h2 className="mt-6 text-[2.2rem] font-medium leading-none tracking-[-0.035em]">
          Twenty-two months, <span className="font-serif font-normal italic text-mute">one direction.</span>
        </h2>
        <ol className="relative mt-12 space-y-8 border-l border-line2 pl-6">
          {buildLog.map(e => (
            <Reveal as="li" key={e.m + e.t} y={12} className="relative">
              <span className="absolute -left-[29px] top-1 h-[9px] w-[9px] rounded-full bg-acc" />
              <div className="font-mono text-[11px] uppercase tracking-wider text-acct">{e.m}</div>
              <div className="mt-1 text-[18px] font-medium">{e.t}</div>
              <p className="mt-1 text-[14px] text-mute">{e.d}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
