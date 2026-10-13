'use client';

import { useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { honours, profile } from '@/content/data';
import { useApp } from './Providers';
import { Reveal, SectionHeader } from './ui';

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);

function DitherPortrait() {
  const { theme } = useApp();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: '-15% 0px' });
  const [lens, setLens] = useState({ x: -999, y: -999, on: false });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.src = '/img/me.jpg';
    let raf = 0;
    img.onload = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      const cell = 5;
      const cols = Math.floor(W / cell);
      const rows = Math.floor(H / cell);
      const off = document.createElement('canvas');
      off.width = cols;
      off.height = rows;
      const octx = off.getContext('2d')!;
      // cover-fit
      const s = Math.max(cols / img.width, rows / img.height);
      const dw = img.width * s;
      const dh = img.height * s;
      octx.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
      const data = octx.getImageData(0, 0, cols, rows).data;
      // auto-levels: stretch the 4th–96th luminance percentiles to full range
      const lum: number[] = [];
      for (let i = 0; i < data.length; i += 4) lum.push((0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255);
      const sorted = [...lum].sort((a, b) => a - b);
      const lo = sorted[Math.floor(sorted.length * 0.04)];
      const hi = sorted[Math.floor(sorted.length * 0.96)];
      const css = getComputedStyle(document.documentElement);
      const fg = css.getPropertyValue('--fg').trim();
      const acc = css.getPropertyValue('--acc-text').trim();
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let row = reduce ? rows : 0;
      const draw = () => {
        const upto = Math.min(rows, row);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        for (let y = 0; y < upto; y++) {
          for (let x = 0; x < cols; x++) {
            const i = (y * cols + x) * 4;
            let l = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
            l = Math.min(1, Math.max(0, (l - lo) / (hi - lo)));
            l = l * l * (3 - 2 * l);
            const on = theme === 'dark' ? l > BAYER[(y % 4) * 4 + (x % 4)] : l < BAYER[(y % 4) * 4 + (x % 4)];
            if (!on) continue;
            ctx.fillStyle = (x * 7 + y * 13) % 97 === 0 ? acc : fg;
            ctx.globalAlpha = y > upto - 6 ? 1 : 0.82;
            ctx.beginPath();
            ctx.arc(x * cell + cell / 2, y * cell + cell / 2, cell * 0.42, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        // scan head
        if (upto < rows) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = acc;
          ctx.fillRect(0, upto * cell, W, 1.5);
          row += 2.2;
          raf = requestAnimationFrame(draw);
        }
      };
      draw();
    };
    return () => cancelAnimationFrame(raf);
  }, [inView, theme]);

  const onMove = (e: React.PointerEvent) => {
    const r = wrapRef.current!.getBoundingClientRect();
    setLens({ x: e.clientX - r.left, y: e.clientY - r.top, on: true });
  };

  const mask = revealed
    ? 'none'
    : `radial-gradient(circle 110px at ${lens.x}px ${lens.y}px, #000 60%, transparent 100%)`;

  return (
    <div
      ref={wrapRef}
      onPointerMove={onMove}
      onPointerLeave={() => setLens(l => ({ ...l, on: false }))}
      onClick={() => setRevealed(v => !v)}
      className="group relative aspect-[4/5] w-full cursor-crosshair overflow-hidden rounded-2xl border border-line bg-bg2"
      role="img"
      aria-label="Portrait of Priyesh Gupta, rendered as a 1-bit dither. Hover to reveal the photo."
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/me.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
        style={{
          WebkitMaskImage: mask,
          maskImage: mask,
          opacity: lens.on || revealed ? 1 : 0,
        }}
      />
      {lens.on && !revealed && (
        <div
          className="pointer-events-none absolute h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-acc/60"
          style={{ left: lens.x, top: lens.y }}
        >
          <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-acct">
            decoding…
          </span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-bg/95 via-bg/70 to-transparent p-4 pt-10 font-mono text-[10px] uppercase tracking-wider text-mute sm:flex-row sm:items-center sm:justify-between">
        <span>subject: priyesh.jpg</span>
        <span>{revealed ? 'decoded · tap to re-encode' : '1-bit · bayer 4×4 · hover / tap'}</span>
      </div>
    </div>
  );
}

const facts: [string, string][] = [
  ['Now', 'Founder, AlphaCalendar'],
  ['Based', 'India · IST (UTC+5:30)'],
  ['Studying', 'MSc Financial Engineering, WorldQuant University'],
  ['Degree', 'B.Tech DS & AI, IIIT Dharwad ’25'],
  ['Focus', 'LLM systems · quant research · data platforms'],
  ['Award', 'IEEE TALE 2024 Best Student Paper'],
  ['Open to', 'AI / quant engineering roles, collaborations'],
];

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
      <SectionHeader index="01" kicker="README.md" title={<>Engineer by training. <span className="font-serif italic font-normal text-mute">Researcher</span> by temperament.</>} />
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Reveal>
            <DitherPortrait />
          </Reveal>
        </div>
        <div className="md:col-span-7 md:pl-6">
          <Reveal>
            <div className="space-y-6 text-[clamp(1.05rem,1.35vw,1.25rem)] leading-[1.65] text-mute text-pretty">
              <p>
                <span className="text-fg">I’m Priyesh.</span> I work where machine learning meets markets, and I build whole
                systems rather than notebooks: scrapers that don’t miss a filing, models that can’t peek at the future,
                LLM pipelines that cite their sources, and products people actually use.
              </p>
              <p>
                Right now that’s <span className="text-fg">AlphaCalendar</span>, a research platform for Indian equities
                that I designed, built and shipped alone. Before it I did applied AI research at{' '}
                <span className="text-fg">IIT Bombay</span>, <span className="text-fg">IIT Madras</span> and{' '}
                <span className="text-fg">NIT Puducherry</span>, across speech, multimodal learning analytics and efficient
                vision models. That work produced four peer-reviewed papers (IEEE, Springer, APSCE), including the Best
                Student Paper at IEEE TALE 2024.
              </p>
              <p>
                The thing I care about more than any model is <span className="text-fg">honest evaluation</span>. If a
                pattern doesn’t survive a permutation test, it doesn’t ship.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-12 divide-y divide-line border-y border-line font-mono text-[13px]">
              {facts.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[110px_1fr] gap-4 py-3.5 transition-colors hover:bg-panel/60 sm:grid-cols-[140px_1fr]">
                  <dt className="uppercase tracking-wider text-dim">{k}</dt>
                  <dd className="text-fg">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10">
              <div className="mono-label mb-4">pipeline.motto</div>
              <p className="flex flex-wrap gap-x-1.5 gap-y-1 font-mono text-[12px] leading-6 text-mute">
                {profile.motto.split(' → ').map((w, i, a) => (
                  <span key={w} className="whitespace-nowrap">
                    <span className="text-fg/90 transition-colors hover:text-acct">{w}</span>
                    {i < a.length - 1 && <span className="pl-1.5 text-acct">→</span>}
                  </span>
                ))}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="mt-10 flex flex-wrap gap-2">
              {honours.map(h => (
                <li key={h} className="rounded-full border border-line px-3 py-1.5 text-[12px] text-mute">
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
