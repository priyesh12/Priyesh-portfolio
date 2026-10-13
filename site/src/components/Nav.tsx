'use client';

import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { profile } from '@/content/data';
import { useApp } from './Providers';
import { Kbd } from './ui';

const links = [
  { href: '#alphacalendar', label: 'AlphaCalendar' },
  { href: '#systems', label: 'Systems' },
  { href: '#log', label: 'Career' },
  { href: '#research', label: 'Research' },
  { href: '#contact', label: 'Contact' },
];

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`relative grid place-items-center rounded-[9px] border border-line2 bg-panel font-mono text-[13px] font-semibold tracking-[-0.06em] ${className}`}
    >
      <span>
        pg<span className="animate-blink text-acct">_</span>
      </span>
    </span>
  );
}

export function Nav() {
  const { setPaletteOpen, toggleTheme, theme, scrollTo } = useApp();
  const pathname = usePathname();
  const onHome = pathname === '/';
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', y => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 480);
    setScrolled(y > 24);
  });

  const go = (e: React.MouseEvent, href: string) => {
    if (!onHome) return;
    e.preventDefault();
    scrollTo(href);
  };

  return (
    <motion.header
      animate={{ y: hidden ? -90 : 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`mx-auto mt-3 flex h-14 max-w-[1400px] items-center justify-between gap-4 rounded-2xl border px-3 transition-[background,border-color,backdrop-filter] duration-500 md:mx-6 md:px-4 lg:mx-auto ${
          scrolled ? 'border-line bg-bg/70 backdrop-blur-xl' : 'border-transparent bg-transparent'
        } mx-3`}
      >
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Priyesh Gupta: home">
          <Logo className="h-9 w-9 text-fg transition-transform duration-500 group-hover:rotate-[-6deg]" />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="text-[13px] font-medium tracking-tight">{profile.name}</span>
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">AI × Quant Systems</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {links.map(l => (
            <a
              key={l.href}
              href={onHome ? l.href : `/${l.href}`}
              onClick={e => go(e, l.href)}
              className="rounded-lg px-3 py-2 text-[13px] text-mute transition-colors hover:bg-panel2 hover:text-fg"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={profile.links.alphacalendar}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] text-mute transition-colors hover:border-line2 hover:text-fg md:flex"
          >
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-acc" />
            shipping alphacalendar.in
          </a>
          <button
            onClick={toggleTheme}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-mute transition-colors hover:border-line2 hover:text-fg"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex h-9 items-center gap-2 rounded-lg border border-line bg-panel/60 pl-3 pr-2 text-[12px] text-mute transition-colors hover:border-line2 hover:text-fg"
            aria-label="Open menu and command palette"
          >
            <span className="flex items-center gap-2 pr-1 sm:hidden">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h10" />
              </svg>
              Menu
            </span>
            <span className="hidden sm:inline">Command</span>
            <span className="hidden gap-0.5 sm:flex">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </span>
          </button>
        </div>
      </div>
      <motion.div style={{ scaleX: progress }} className="mx-auto mt-2 h-px max-w-[1400px] origin-left bg-acc/70" />
    </motion.header>
  );
}
