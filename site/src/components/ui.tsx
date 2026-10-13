'use client';

import { motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const GLYPHS = 'アイウエオカキクケコ01ΣΔλ∂∫≈$#%&<>/{}[]';

/** Decodes text from random glyphs once it scrolls into view. */
export function Scramble({ text, className, delay = 0, speed = 28 }: { text: string; className?: string; delay?: number; speed?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduce = useReducedMotion();
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!inView || reduce) return;
    let frame = 0;
    let raf = 0;
    let start = 0;
    const total = text.length;
    const tick = (t: number) => {
      if (!start) start = t;
      if (t - start < delay) {
        raf = requestAnimationFrame(tick);
        return;
      }
      frame++;
      const revealed = Math.floor(frame / (60 / speed) / 1.2);
      let s = '';
      for (let i = 0; i < total; i++) {
        const ch = text[i];
        if (ch === ' ' || i < revealed) s += ch;
        else s += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setOut(s);
      if (revealed < total) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text, delay, speed, reduce]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article';
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}

export function SectionHeader({ index, kicker, title, children }: { index: string; kicker: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="mb-14 grid gap-6 md:mb-20 md:grid-cols-12">
      <div className="md:col-span-4">
        <div className="mono-label flex items-center gap-3">
          <span className="text-acct">{index}</span>
          <span className="h-px w-10 bg-line2" />
          <Scramble text={kicker} />
        </div>
      </div>
      <div className="md:col-span-8">
        <Reveal>
          <h2 className="text-[clamp(2.2rem,5.4vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.035em] text-balance">{title}</h2>
        </Reveal>
        {children && (
          <Reveal delay={0.1}>
            <div className="mt-6 max-w-2xl text-[17px] leading-relaxed text-mute text-pretty">{children}</div>
          </Reveal>
        )}
      </div>
    </header>
  );
}

/** Counts up to `value` when scrolled into view. */
export function Counter({ value, suffix = '', className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1600 + Math.min(1200, Math.log10(value + 1) * 250);
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 4);
      setN(Math.round(value * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);
  return (
    <span ref={ref} className={className}>
      {n.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

export function Corners({ className = '' }: { className?: string }) {
  return (
    <span aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <span className="corner left-0 top-0 border-l border-t" />
      <span className="corner right-0 top-0 border-r border-t" />
      <span className="corner bottom-0 left-0 border-b border-l" />
      <span className="corner bottom-0 right-0 border-b border-r" />
    </span>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-line2 bg-panel2 px-1 font-mono text-[10px] text-mute">
      {children}
    </kbd>
  );
}

export function useIstClock() {
  const [now, setNow] = useState<string>('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}
