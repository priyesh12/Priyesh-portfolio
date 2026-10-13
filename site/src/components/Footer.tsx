'use client';

import { motion } from 'motion/react';
import { useApp } from './Providers';
import { useIstClock } from './ui';

const WORD = 'PRIYESH GUPTA';

export function Footer() {
  const clock = useIstClock();
  const { scrollTo } = useApp();
  return (
    <footer className="relative overflow-hidden border-t border-line pt-14">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 font-mono text-[11px] text-dim md:px-10">
        <span>© 2026 Priyesh Gupta · designed & engineered from scratch</span>
        <span>Next.js 16 · Three.js · GLSL · Motion · Tailwind 4</span>
        <span>{clock} IST</span>
        <button onClick={() => scrollTo(0)} className="text-mute transition-colors hover:text-acct">
          back to top ↑
        </button>
      </div>
      <div className="mt-10 select-none px-3 pb-2" aria-hidden>
        <div className="flex justify-between text-[clamp(3rem,13.4vw,13.5rem)] font-semibold leading-[0.8] tracking-[-0.06em]">
          {WORD.split('').map((ch, i) => (
            <motion.span
              key={i}
              initial={{ y: '100%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.035, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: '-8%', color: 'var(--acc-text)' }}
              className="inline-block text-fg/90"
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </div>
      </div>
    </footer>
  );
}
