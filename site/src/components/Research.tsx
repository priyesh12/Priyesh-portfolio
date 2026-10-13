'use client';

import { papers, profile, researchWork, type Paper } from '@/content/data';
import { Reveal, SectionHeader } from './ui';

const profiles = [
  { label: 'Google Scholar', href: profile.links.scholar, hint: 'citations' },
  { label: 'ResearchGate', href: profile.links.researchgate, hint: 'papers + full texts' },
  { label: 'ORCID', href: profile.links.orcid, hint: '0009-0006-6959-817X' },
];

function Authors({ list }: { list: string[] }) {
  return (
    <p className="text-[13px] leading-relaxed text-dim">
      {list.map((a, i) => (
        <span key={a}>
          {a.includes('Gupta') ? <span className="font-medium text-fg underline decoration-acc decoration-2 underline-offset-[3px]">{a}</span> : a}
          {i < list.length - 1 && ', '}
        </span>
      ))}
    </p>
  );
}

function Featured({ p }: { p: Paper }) {
  return (
    <a href={p.href} target="_blank" rel="noreferrer" className="group block">
      <article className="spot relative overflow-hidden rounded-2xl border border-acc/40 bg-accsoft p-6 md:p-10">
        <div className="absolute -right-14 top-8 rotate-45 bg-acc px-14 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-ink">
          Best Paper
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wider">
          <span className="text-acct">{p.venue}</span>
          <span className="text-dim">·</span>
          <span className="text-mute">{p.date}</span>
          <span className="text-dim">·</span>
          <span className="text-fg">★ {p.badge}</span>
        </div>
        <h3 className="mt-6 max-w-4xl pr-10 text-[clamp(1.4rem,3vw,2.3rem)] font-medium leading-[1.1] tracking-[-0.025em] text-balance">{p.title}</h3>
        <div className="mt-5 max-w-3xl">
          <Authors list={p.authors} />
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-acc/20 pt-5 font-mono text-[11px]">
          <span className="text-mute">
            {p.kind} · {p.publisher}
          </span>
          <span className="text-acct transition-transform duration-300 group-hover:translate-x-1">{p.linkLabel} ↗</span>
        </div>
      </article>
    </a>
  );
}

function Row({ p, i }: { p: Paper; i: number }) {
  return (
    <a href={p.href} target="_blank" rel="noreferrer" className="group block">
      <article className="grid gap-4 border-b border-line py-7 transition-colors hover:bg-panel/50 md:grid-cols-12 md:gap-6 md:px-3">
        <div className="font-mono text-[11px] uppercase tracking-wider md:col-span-3">
          <div className="text-acct">{p.venue}</div>
          <div className="mt-1 text-dim">
            {p.date} · {p.topic}
          </div>
        </div>
        <div className="md:col-span-7">
          <h3 className="text-[18px] font-medium leading-snug tracking-tight text-pretty transition-colors group-hover:text-acct">{p.title}</h3>
          <div className="mt-2">
            <Authors list={p.authors} />
          </div>
          <div className="mt-2 font-mono text-[11px] text-dim">
            {p.kind} · {p.publisher}
          </div>
        </div>
        <div className="font-mono text-[11px] md:col-span-2 md:text-right">
          <span className="inline-flex items-center gap-1 rounded-full border border-line2 px-3 py-1.5 text-mute transition-colors group-hover:border-acc group-hover:text-acct">
            {p.linkLabel.startsWith('DOI') ? 'DOI' : p.linkLabel} ↗
          </span>
          <span className="sr-only">
            {' '}
            paper {i + 1}: {p.linkLabel}
          </span>
        </div>
      </article>
    </a>
  );
}

export function Research() {
  const featured = papers.find(p => p.badge)!;
  const rest = papers.filter(p => p !== featured);

  return (
    <section id="research" className="relative mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
      <SectionHeader
        index="05"
        kicker="RESEARCH · PUBLICATIONS"
        title={
          <>
            Peer-reviewed, <span className="font-serif font-normal italic text-mute">then shipped.</span>
          </>
        }
      >
        Four peer-reviewed papers across speech AI, affective computing, learning analytics and efficient medical imaging,
        published with IEEE, Springer and APSCE. Plus the research that went straight into products.
      </SectionHeader>

      <Reveal>
        <div className="mb-10 flex flex-wrap gap-2">
          {profiles.map(l => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 rounded-full border border-line2 py-2 pl-4 pr-3 text-[13px] transition-colors hover:border-acc"
            >
              <span className="transition-colors group-hover:text-acct">{l.label}</span>
              <span className="hidden font-mono text-[10px] text-dim sm:inline">{l.hint}</span>
              <span className="text-acct">↗</span>
            </a>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <Featured p={featured} />
      </Reveal>

      <div className="mt-6 border-t border-line">
        {rest.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.05} y={14}>
            <Row p={p} i={i + 1} />
          </Reveal>
        ))}
      </div>

      <div className="mt-24">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h3 className="text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-[1.05] tracking-[-0.03em]">
              Research I’ve worked on, <span className="font-serif font-normal italic text-mute">beyond the papers.</span>
            </h3>
            <span className="mono-label">lab · independent · product</span>
          </div>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {researchWork.map((r, i) => (
            <Reveal key={r.title} delay={(i % 3) * 0.06}>
              <article className="spot h-full rounded-2xl border border-line bg-panel/60 p-6 transition-colors hover:border-line2">
                <div className="font-mono text-[11px] uppercase tracking-wider text-acct">{r.where}</div>
                <h4 className="mt-4 text-[17px] font-medium leading-snug tracking-tight">{r.title}</h4>
                <p className="mt-2 text-[14px] leading-relaxed text-mute">{r.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
