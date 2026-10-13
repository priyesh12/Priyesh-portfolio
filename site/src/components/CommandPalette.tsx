'use client';

import { AnimatePresence, motion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { profile, projects, sections } from '@/content/data';
import { useApp } from './Providers';
import { Kbd } from './ui';

type Item = { id: string; group: string; label: string; hint?: string; run: () => void };

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, scrollTo, toggleTheme, theme } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = () => setPaletteOpen(false);

  const goSection = (id: string) => {
    close();
    if (pathname !== '/') {
      router.push(`/#${id}`);
      return;
    }
    setTimeout(() => scrollTo(`#${id}`), 60);
  };

  const items: Item[] = useMemo(
    () => [
      ...sections.map(s => ({ id: `s-${s.id}`, group: 'Navigate', label: s.label, hint: `#${s.id}`, run: () => goSection(s.id) })),
      {
        id: 'case',
        group: 'Navigate',
        label: 'AlphaCalendar engineering case study',
        hint: '/work/alphacalendar',
        run: () => {
          close();
          router.push('/work/alphacalendar/');
        },
      },
      ...projects.map(p => ({
        id: `p-${p.slug}`,
        group: 'Systems',
        label: p.name,
        hint: p.kind,
        run: () => {
          goSection('systems');
          setTimeout(() => window.dispatchEvent(new CustomEvent('open-project', { detail: p.slug })), 900);
        },
      })),
      { id: 'ac', group: 'Actions', label: 'Open alphacalendar.in', hint: '↗', run: () => (close(), window.open(profile.links.alphacalendar, '_blank')) },
      { id: 'resume', group: 'Actions', label: 'Download résumé (PDF)', hint: '1 page', run: () => (close(), window.open(profile.resume, '_blank')) },
      { id: 'cv', group: 'Actions', label: 'Download full CV (PDF)', hint: 'detailed', run: () => (close(), window.open(profile.cv, '_blank')) },
      {
        id: 'copy',
        group: 'Actions',
        label: 'Copy email address',
        hint: profile.email,
        run: () => {
          navigator.clipboard?.writeText(profile.email);
          setToast('Email copied to clipboard');
          close();
        },
      },
      { id: 'theme', group: 'Actions', label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`, hint: '◐', run: () => (toggleTheme(), close()) },
      { id: 'term', group: 'Actions', label: 'Open the terminal', hint: '$_', run: () => goSection('terminal') },
      { id: 'gh', group: 'Links', label: 'GitHub', hint: 'priyesh12', run: () => (close(), window.open(profile.links.github, '_blank')) },
      { id: 'scholar', group: 'Links', label: 'Google Scholar', hint: '4 papers', run: () => (close(), window.open(profile.links.scholar, '_blank')) },
      { id: 'rg', group: 'Links', label: 'ResearchGate', hint: 'Priyesh-Gupta-4', run: () => (close(), window.open(profile.links.researchgate, '_blank')) },
      { id: 'orcid', group: 'Links', label: 'ORCID', hint: '0009-0006-6959-817X', run: () => (close(), window.open(profile.links.orcid, '_blank')) },
      { id: 'li', group: 'Links', label: 'LinkedIn', hint: 'in/priyesh-gupta', run: () => (close(), window.open(profile.links.linkedin, '_blank')) },
      { id: 'mail', group: 'Links', label: 'Email Priyesh', hint: 'mailto', run: () => (close(), (window.location.href = `mailto:${profile.email}`)) },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, pathname]
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items
      .map(it => {
        const hay = `${it.label} ${it.hint ?? ''} ${it.group}`.toLowerCase();
        let score = hay.includes(s) ? 100 - hay.indexOf(s) : -1;
        if (score < 0) {
          // subsequence fuzzy match
          let j = 0;
          for (const c of hay) if (c === s[j]) j++;
          score = j === s.length ? 10 : -1;
        }
        return { it, score };
      })
      .filter(x => x.score >= 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.it);
  }, [q, items]);

  useEffect(() => {
    if (paletteOpen) {
      setQ('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [paletteOpen]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(a => Math.min(filtered.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(a => Math.max(0, a - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filtered[active]?.run();
    } else if (e.key === 'Escape') {
      close();
    }
  };

  let lastGroup = '';

  return (
    <>
      <AnimatePresence>
        {paletteOpen && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-start justify-center px-3 pt-[10vh] sm:px-4 sm:pt-[14vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="absolute inset-0 bg-bg/70 backdrop-blur-md" onClick={close} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={{ y: 16, scale: 0.97, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 8, scale: 0.98, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line2 bg-panel shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)]"
              onKeyDown={onKey}
            >
              <div className="flex items-center gap-3 border-b border-line px-4">
                <span className="font-mono text-acct">❯</span>
                <input
                  ref={inputRef}
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Jump to a section, project or action…"
                  className="h-14 min-w-0 flex-1 bg-transparent text-[16px] outline-none sm:text-[15px] placeholder:text-dim focus-visible:outline-none"
                  aria-label="Search commands"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="palette-list"
                  aria-activedescendant={filtered[active] ? `cmd-${filtered[active].id}` : undefined}
                />
                <span className="hidden sm:inline-flex">
                  <Kbd>esc</Kbd>
                </span>
                <button onClick={close} className="grid h-10 w-10 place-items-center rounded-lg text-mute sm:hidden" aria-label="Close menu">
                  ✕
                </button>
              </div>
              <div ref={listRef} id="palette-list" role="listbox" className="max-h-[52vh] overflow-y-auto p-2" data-lenis-prevent>
                {filtered.length === 0 && <p className="px-3 py-8 text-center font-mono text-sm text-mute">no matches for “{q}”</p>}
                {filtered.map((it, i) => {
                  const header = it.group !== lastGroup ? it.group : null;
                  lastGroup = it.group;
                  return (
                    <div key={it.id}>
                      {header && <div className="mono-label px-3 pb-1.5 pt-3 !text-[10px]">{header}</div>}
                      <button
                        id={`cmd-${it.id}`}
                        data-idx={i}
                        role="option"
                        aria-selected={i === active}
                        onMouseMove={() => setActive(i)}
                        onClick={it.run}
                        className={`flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left text-[14px] transition-colors ${
                          i === active ? 'bg-accsoft text-fg' : 'text-mute'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className={`h-1.5 w-1.5 rounded-full ${i === active ? 'bg-acc' : 'bg-line2'}`} />
                          {it.label}
                        </span>
                        {it.hint && <span className="truncate font-mono text-[11px] text-dim">{it.hint}</span>}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[10px] text-dim">
                <span className="hidden items-center gap-2 sm:flex">
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd> navigate <Kbd>↵</Kbd> run
                </span>
                <span className="sm:hidden">tap to run</span>
                <span>pg-os · command</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            role="status"
            className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full border border-line2 bg-panel px-4 py-2 font-mono text-xs"
          >
            <span className="text-acct">✓</span> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
