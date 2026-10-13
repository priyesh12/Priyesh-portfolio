'use client';

import { useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { alpha, commits, papers, profile, projects, stack } from '@/content/data';
import { useApp } from './Providers';
import { Reveal, SectionHeader } from './ui';

type Line = { id: number; kind: 'in' | 'out'; node: React.ReactNode };

const PROMPT = (
  <>
    <span className="text-acct">priyesh@pg-os</span>
    <span className="text-dim">:</span>
    <span className="text-violet">~</span>
    <span className="text-dim">$ </span>
  </>
);

const COMMANDS = ['help', 'whoami', 'ls', 'cat', 'open', 'alphacalendar', 'stack', 'experience', 'papers', 'neofetch', 'contact', 'resume', 'theme', 'clear', 'history', 'date', 'echo', 'sudo', 'exit'];

const ascii = String.raw`
 ██████╗  ██████╗
 ██╔══██╗██╔════╝
 ██████╔╝██║  ███╗
 ██╔═══╝ ██║   ██║
 ██║     ╚██████╔╝
 ╚═╝      ╚═════╝ `;

export function Terminal() {
  const { toggleTheme, scrollTo } = useApp();
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState('');
  const [hist, setHist] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const idRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const push = (kind: Line['kind'], node: React.ReactNode) => setLines(l => [...l, { id: idRef.current++, kind, node }]);

  useEffect(() => {
    push(
      'out',
      <span className="text-mute">
        pg-os 2026.10 (tty1). Type <span className="text-fg">help</span> to look around, or try{' '}
        <span className="text-fg">neofetch</span>.
      </span>
    );
  }, []);

  // first time the terminal scrolls into view, type a command for the visitor
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-30% 0px' });
  const autoRan = useRef(false);
  useEffect(() => {
    if (!inView || autoRan.current) return;
    autoRan.current = true;
    const cmd = 'neofetch';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      run(cmd);
      return;
    }
    const ids: ReturnType<typeof setTimeout>[] = [];
    cmd.split('').forEach((_, i) => ids.push(setTimeout(() => setValue(cmd.slice(0, i + 1)), 400 + i * 85)));
    ids.push(
      setTimeout(() => {
        setValue('');
        run(cmd);
      }, 400 + cmd.length * 85 + 350)
    );
    return () => ids.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines]);

  const run = (raw: string) => {
    const input = raw.trim();
    push('in', <>{PROMPT}<span className="text-fg">{input}</span></>);
    if (!input) return;
    setHist(h => [...h, input]);
    setHIdx(-1);
    const [cmd, ...args] = input.split(/\s+/);
    const arg = args.join(' ').toLowerCase();

    switch (cmd.toLowerCase()) {
      case 'help':
        push(
          'out',
          <div className="grid grid-cols-[130px_1fr] gap-x-4 gap-y-0.5">
            {[
              ['whoami', 'who is this'],
              ['ls', 'list systems I’ve built'],
              ['cat <name>', 'details on a system (tab completes)'],
              ['alphacalendar', 'the flagship, in numbers'],
              ['experience', 'git log, abridged'],
              ['papers', '4 publications + links'],
              ['stack', 'toolchain'],
              ['neofetch', 'system info'],
              ['contact', 'reach me'],
              ['resume', 'open résumé PDF'],
              ['theme', 'toggle light / dark'],
              ['clear', 'clear screen'],
            ].map(([c, d]) => (
              <span key={c} className="contents">
                <span className="text-acct">{c}</span>
                <span className="text-mute">{d}</span>
              </span>
            ))}
          </div>
        );
        break;
      case 'whoami':
        push(
          'out',
          <span>
            <span className="text-fg">{profile.name}</span>, {profile.role.toLowerCase()}. Founder of AlphaCalendar. Ex applied-AI
            researcher (IIT Bombay, IIT Madras). Builds data → models → LLMs → product, alone if necessary.
          </span>
        );
        break;
      case 'ls':
        push(
          'out',
          <div className="grid gap-x-6 sm:grid-cols-2">
            <span className="text-acct">alphacalendar/</span>
            {projects.map(p => (
              <span key={p.slug} className="text-fg">
                {p.slug}/ <span className="text-dim">{p.kind.toLowerCase()}</span>
              </span>
            ))}
          </div>
        );
        break;
      case 'cat':
      case 'open': {
        if (!arg) {
          push('out', <span className="text-hot">usage: {cmd} &lt;name&gt; (try `ls`)</span>);
          break;
        }
        if (arg.startsWith('alpha')) {
          run('alphacalendar');
          return;
        }
        const p = projects.find(p => p.slug.startsWith(arg.replace(/\/$/, '')) || p.name.toLowerCase().includes(arg));
        if (!p) {
          push('out', <span className="text-hot">cat: {arg}: no such system</span>);
          break;
        }
        push(
          'out',
          <div>
            <div className="text-fg"># {p.name}</div>
            <div className="text-mute">{p.pitch}</div>
            {p.metrics.map(([v, k]) => (
              <div key={k}>
                <span className="text-acct">{v.padEnd(12, ' ')}</span>
                <span className="text-mute">{k}</span>
              </div>
            ))}
            <div className="text-dim">stack: {p.stack.join(', ')}</div>
            <button
              className="mt-1 text-acct underline-offset-4 hover:underline"
              onClick={() => {
                scrollTo('#systems');
                setTimeout(() => window.dispatchEvent(new CustomEvent('open-project', { detail: p.slug })), 900);
              }}
            >
              → open full card
            </button>
          </div>
        );
        break;
      }
      case 'alphacalendar':
        push(
          'out',
          <div>
            <div className="text-fg">alphacalendar.in · {alpha.shipped.toLowerCase()}</div>
            {alpha.stats.map(s => (
              <div key={s.label}>
                <span className="text-acct">{(s.value.toLocaleString('en-IN') + s.suffix).padEnd(10, ' ')}</span>
                <span className="text-mute">{s.label}</span>
              </div>
            ))}
            <a href={alpha.url} target="_blank" rel="noreferrer" className="text-acct underline-offset-4 hover:underline">
              → visit
            </a>
          </div>
        );
        break;
      case 'experience':
      case 'git':
        push(
          'out',
          <div>
            {commits.map(c => (
              <div key={c.hash}>
                <span className="text-acct">* {c.hash}</span> <span className="text-fg">{c.title}</span>{' '}
                <span className="text-mute">@ {c.org}</span> <span className="text-dim">({c.date})</span>
              </div>
            ))}
          </div>
        );
        break;
      case 'papers':
        push(
          'out',
          <div>
            {papers.map(p => (
              <div key={p.title} className="mb-1">
                <span className="text-acct">[{p.venue}]</span> <span className="text-fg">{p.title}</span>
                {p.badge && <span className="text-acct"> ★ {p.badge}</span>}{' '}
                <a href={p.href} target="_blank" rel="noreferrer" className="text-cyan hover:underline">
                  {p.linkLabel.startsWith('DOI') ? 'doi' : 'pdf'} ↗
                </a>
              </div>
            ))}
            <div className="text-dim">
              more:{' '}
              <a className="text-fg hover:underline" href={profile.links.scholar} target="_blank" rel="noreferrer">scholar</a> ·{' '}
              <a className="text-fg hover:underline" href={profile.links.researchgate} target="_blank" rel="noreferrer">researchgate</a> ·{' '}
              <a className="text-fg hover:underline" href={profile.links.orcid} target="_blank" rel="noreferrer">orcid</a>
            </div>
          </div>
        );
        break;
      case 'stack':
        push(
          'out',
          <div>
            {stack.map(g => (
              <div key={g.group}>
                <span className="text-acct">{g.group.padEnd(10, ' ')}</span>
                <span className="text-mute">{g.items.join(' · ')}</span>
              </div>
            ))}
          </div>
        );
        break;
      case 'neofetch':
        push(
          'out',
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
            <pre className="text-[10px] leading-[1.15] text-acct">{ascii}</pre>
            <div className="leading-6">
              <div>
                <span className="text-acct">priyesh</span>@<span className="text-acct">pg-os</span>
              </div>
              <div className="text-dim">───────────────</div>
              {[
                ['OS', 'pg-os 2026.10 (founder edition)'],
                ['Host', 'AlphaCalendar · alphacalendar.in'],
                ['Kernel', 'python 3.14 + typescript'],
                ['Uptime', 'since 2021, no reboots'],
                ['Packages', '171 data contracts, ~285k LOC'],
                ['Shell', 'zsh + uv + git'],
                ['GPU', 'whatever runs Qwen in 4-bit'],
                ['Memory', '84M rows, point-in-time'],
                ['Award', 'IEEE TALE 2024 Best Student Paper'],
              ].map(([k, v]) => (
                <div key={k}>
                  <span className="text-acct">{k}</span>
                  <span className="text-dim">: </span>
                  <span className="text-fg">{v}</span>
                </div>
              ))}
              <div className="mt-2 flex gap-1">
                {['bg-fg', 'bg-acc', 'bg-violet', 'bg-cyan', 'bg-hot', 'bg-mute', 'bg-dim'].map(c => (
                  <span key={c} className={`h-3 w-6 ${c}`} />
                ))}
              </div>
            </div>
          </div>
        );
        break;
      case 'contact':
      case 'email':
        push(
          'out',
          <div>
            <div>
              <span className="text-acct">email    </span>
              <a className="text-fg hover:underline" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </div>
            <div>
              <span className="text-acct">linkedin </span>
              <a className="text-fg hover:underline" href={profile.links.linkedin} target="_blank" rel="noreferrer">
                in/priyesh-gupta
              </a>
            </div>
            <div>
              <span className="text-acct">scholar  </span>
              <a className="text-fg hover:underline" href={profile.links.scholar} target="_blank" rel="noreferrer">
                google scholar
              </a>
            </div>
            <div>
              <span className="text-acct">orcid    </span>
              <a className="text-fg hover:underline" href={profile.links.orcid} target="_blank" rel="noreferrer">
                0009-0006-6959-817X
              </a>
            </div>
            <div>
              <span className="text-acct">github   </span>
              <a className="text-fg hover:underline" href={profile.links.github} target="_blank" rel="noreferrer">
                priyesh12
              </a>
            </div>
          </div>
        );
        break;
      case 'resume':
      case 'cv':
        window.open(cmd === 'cv' ? profile.cv : profile.resume, '_blank');
        push('out', <span className="text-mute">opening {cmd === 'cv' ? 'CV' : 'résumé'} in a new tab…</span>);
        break;
      case 'theme':
        toggleTheme();
        push('out', <span className="text-mute">theme toggled.</span>);
        break;
      case 'clear':
        setLines([]);
        break;
      case 'history':
        push('out', <div>{[...hist, input].map((h, i) => <div key={i} className="text-mute">{String(i + 1).padStart(4, ' ')}  {h}</div>)}</div>);
        break;
      case 'date':
        push('out', <span>{new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>);
        break;
      case 'echo':
        push('out', <span>{args.join(' ')}</span>);
        break;
      case 'sudo':
        if (arg.includes('hire')) {
          push('out', <span className="text-acct">[sudo] permission granted. Opening a channel to Priyesh…</span>);
          setTimeout(() => (window.location.href = `mailto:${profile.email}?subject=Let%E2%80%99s%20talk`), 700);
        } else push('out', <span className="text-hot">priyesh is not in the sudoers file. This incident will be reported. (try: sudo hire priyesh)</span>);
        break;
      case 'exit':
        push('out', <span className="text-mute">There is no exit. Only `contact`.</span>);
        break;
      case 'rm':
        push('out', <span className="text-hot">rm: refusing: this portfolio has no backups (kidding, it’s in git)</span>);
        break;
      default:
        push('out', <span className="text-hot">command not found: {cmd}. Try `help`.</span>);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(value);
      setValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!hist.length) return;
      const i = hIdx < 0 ? hist.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(i);
      setValue(hist[i]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hIdx < 0) return;
      const i = hIdx + 1;
      if (i >= hist.length) {
        setHIdx(-1);
        setValue('');
      } else {
        setHIdx(i);
        setValue(hist[i]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const parts = value.split(' ');
      if (parts.length === 1) {
        const m = COMMANDS.filter(c => c.startsWith(parts[0]));
        if (m.length === 1) setValue(m[0] + ' ');
        else if (m.length > 1) push('out', <span className="text-mute">{m.join('  ')}</span>);
      } else {
        const pool = ['alphacalendar', ...projects.map(p => p.slug)];
        const m = pool.filter(s => s.startsWith(parts[1]));
        if (m.length === 1) setValue(`${parts[0]} ${m[0]}`);
        else if (m.length > 1) push('out', <span className="text-mute">{m.join('  ')}</span>);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const chips = ['neofetch', 'alphacalendar', 'ls', 'cat options-lab', 'sudo hire priyesh'];

  return (
    <section ref={sectionRef} id="terminal" className="relative border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
        <SectionHeader
          index="08"
          kicker="INTERACTIVE · TTY1"
          title={
            <>
              Or skip the scrolling <span className="font-serif font-normal italic text-mute">and ask the shell.</span>
            </>
          }
        />
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-line2 bg-[#07080a] text-[#d9dbd6] shadow-[0_50px_140px_-40px_rgba(0,0,0,0.6)] light:bg-[#0c0d10]" onClick={() => inputRef.current?.focus()}>
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 font-mono text-[11px] text-white/40">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </div>
              <span className="truncate px-2">priyesh@pg-os — zsh — 120×32</span>
              <span className="hidden sm:inline">⌃L clear</span>
            </div>
            <div ref={bodyRef} className="h-[420px] overflow-y-auto p-4 font-mono text-[12px] leading-6 sm:h-[440px] sm:p-5 sm:text-[13px] [--fg:#ecedea] [--mute:#8d9097] [--dim:#565960] [--acc-text:#c6ff3d] [--acc:#c6ff3d] [--violet:#a594ff] [--hot:#ff6a3d] [--cyan:#5ee6ff]" data-lenis-prevent>
              {lines.map(l => (
                <div key={l.id} className={l.kind === 'out' ? 'mb-2 whitespace-pre-wrap break-words' : 'break-words'}>
                  {l.node}
                </div>
              ))}
              <div className="flex items-center">
                {PROMPT}
                <input
                  ref={inputRef}
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  onKeyDown={onKey}
                  className="min-w-0 flex-1 bg-transparent text-[16px] text-fg caret-acc outline-none sm:text-[13px]"
                  aria-label="Terminal input"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
              </div>
            </div>
            <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3">
              {chips.map(c => (
                <button
                  key={c}
                  onClick={e => {
                    e.stopPropagation();
                    run(c);
                  }}
                  className="shrink-0 rounded-md border border-white/10 px-2.5 py-1 font-mono text-[11px] text-white/60 transition-colors hover:border-[#c6ff3d]/60 hover:text-[#c6ff3d]"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
