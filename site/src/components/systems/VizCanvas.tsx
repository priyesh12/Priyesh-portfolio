'use client';

import { useEffect, useRef } from 'react';
import type { Viz } from '@/content/data';
import { useApp } from '../Providers';
import { DRAWS, type Colors } from './viz';

function readColors(): Colors {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string) => s.getPropertyValue(n).trim();
  return {
    fg: v('--fg'),
    mute: v('--mute'),
    dim: v('--dim'),
    line: v('--line2'),
    acc: v('--acc-text'),
    hot: v('--hot'),
    violet: v('--violet'),
    cyan: v('--cyan'),
    bg: v('--bg2'),
    mono: getComputedStyle(document.body).getPropertyValue('--font-geist-mono').trim() || 'monospace',
  };
}

export function VizCanvas({ viz, speed = 1, className = '' }: { viz: Viz; speed?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const speedRef = useRef(speed);
  const { theme } = useApp();
  speedRef.current = speed;

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const colors = readColors();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);

    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    let raf = 0;
    let t = 2.2;
    let last = performance.now();
    const draw = DRAWS[viz];
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      if (!reduce) t += dt * speedRef.current;
      ctx.clearRect(0, 0, w, h);
      draw(ctx, t, w, h, colors);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [viz, theme]);

  return <canvas ref={ref} className={`block h-full w-full ${className}`} aria-hidden />;
}
