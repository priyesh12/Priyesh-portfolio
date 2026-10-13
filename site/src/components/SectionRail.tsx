'use client';

import { useEffect, useState } from 'react';
import { sections } from '@/content/data';
import { useApp } from './Providers';

/** Right-edge index of sections; highlights the one in view. */
export function SectionRail() {
  const { scrollTo } = useApp();
  const [active, setActive] = useState('top');

  useEffect(() => {
    const els = sections.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav aria-label="Sections" className={`fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-500 xl:block ${active === 'top' ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
      <ul className="group/rail flex flex-col items-end gap-2.5 rounded-xl py-2 pl-3 transition-colors hover:bg-bg/80 hover:backdrop-blur">
        {sections.map((s, i) => {
          const on = active === s.id;
          return (
            <li key={s.id}>
              <button onClick={() => scrollTo(`#${s.id}`)} className="group flex items-center gap-3" aria-label={s.label} aria-current={on ? 'true' : undefined}>
                <span className={`font-mono text-[10px] uppercase tracking-wider transition-all duration-300 ${on ? 'text-fg' : 'text-dim'} opacity-0 group-hover/rail:opacity-100`}>
                  {String(i).padStart(2, '0')} {s.label}
                </span>
                <span className={`h-px transition-all duration-500 ${on ? 'w-8 bg-acc' : 'w-3 bg-line2 group-hover:w-5'}`} />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
