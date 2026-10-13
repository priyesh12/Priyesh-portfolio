'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

const LINES = [
  ['pg-os 2026.10', 'boot'],
  ['mounting point-in-time lake', '84M rows'],
  ['loading data contracts', '171 ✓'],
  ['warming embeddings', 'int8 · 256-d'],
  ['alphacalendar.in', 'online'],
];

/** One-time-per-session boot sequence. Skippable, and skipped for reduced motion. */
export function Boot() {
  const [show, setShow] = useState(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem('pg.booted') === '1';
      sessionStorage.setItem('pg.booted', '1');
    } catch {}
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setShow(true);
    const ids = LINES.map((_, i) => setTimeout(() => setN(i + 1), 120 + i * 190));
    const done = setTimeout(() => setShow(false), 120 + LINES.length * 190 + 380);
    const skip = () => setShow(false);
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('pointerdown', skip, { once: true });
    return () => {
      ids.forEach(clearTimeout);
      clearTimeout(done);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end bg-bg p-6 md:p-12"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden
        >
          <div className="w-full max-w-md font-mono text-[12px] leading-7">
            {LINES.slice(0, n).map(([a, b], i) => (
              <motion.div key={a} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between gap-6">
                <span className="text-mute">
                  <span className="text-dim">[{(i * 0.19).toFixed(2).padStart(5, '0')}]</span> {a}
                </span>
                <span className={i === LINES.length - 1 ? 'text-acct' : 'text-fg'}>{b}</span>
              </motion.div>
            ))}
            <div className="mt-4 h-px w-full overflow-hidden bg-line2">
              <motion.div className="h-full bg-acc" initial={{ width: '0%' }} animate={{ width: `${(n / LINES.length) * 100}%` }} transition={{ duration: 0.2 }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
