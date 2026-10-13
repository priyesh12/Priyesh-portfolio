import type { Metadata } from 'next';
import Link from 'next/link';
import { BrowserFrame } from '@/components/flagship/Flagship';
import { Pipeline } from '@/components/flagship/Pipeline';
import { Footer } from '@/components/Footer';
import { Counter, Reveal } from '@/components/ui';
import { alpha } from '@/content/data';

export const metadata: Metadata = {
  title: 'AlphaCalendar: engineering case study',
  description:
    'How Priyesh Gupta built AlphaCalendar solo: a point-in-time data platform with 171 contracts and 84M rows, LLM extraction over 9,497 earnings calls, RAG at a tenth of a cent per answer, all on a ₹0 stack.',
};

const chapters = [
  {
    id: 'problem',
    k: '01',
    title: 'The problem',
    body: [
      'Indian market data is scattered across exchange APIs, XBRL filings, fund disclosures and PDF transcripts. Retail tools join it loosely, ignore when each number actually became public, and present patterns without asking whether they beat chance.',
      'AlphaCalendar starts from the opposite premise. The calendar is the interface: results, guidance falling due, corporate actions, expiries and seasonality, each placed on the day it becomes knowable and each traceable to its source row.',
    ],
  },
  {
    id: 'data',
    k: '02',
    title: 'A contract-first data platform',
    body: [
      'A one-way file lake in four layers: raw → canonical (49 datasets) → intelligence (75) → serving (47). It uses Parquet with zstd, partitions by year, and has no database server for market data.',
      'Every dataset has a TOML contract. Writes are atomic (temp file then rename), every dataset carries a SHA-256 lineage manifest, and the build graph is derived from the contracts themselves. Fifteen validation gates run on every write, and determinism is proven: 6.03M rows came out byte-identical on macOS and Linux ARM.',
      'Point-in-time is enforced, not promised. 93 contracts require an available_at column and the reader raises LookaheadError. A filing at 19:07 counts from the next session, and fundamentals join on announcement date.',
    ],
  },
  {
    id: 'ai',
    k: '03',
    title: 'AI that cites, and costs almost nothing',
    body: [
      'LLMs extract guidance, risks and tone from 9,497 earnings calls across 1,470 companies. The guidance becomes 44,610 dated promises, which the platform tracks as kept, missed, walked back or quietly dropped.',
      'Ask AI is RAG built from scratch: a 14,711-chunk corpus, 256-dimensional int8 embeddings and a flat cosine scan in under 1 ms, with no vector database. Deterministic lookups run before the model, six read-only tools are available, and every passage the model read is shown to the reader. Mean cost is about $0.0013 per answer, under a hard $5/day ledger.',
      'LLMs are optimistic graders. Raw concall scores bunched into a 65–80 band with 15% ties. Van der Waerden rank-normal scoring removed the ties and cut “bullish” from 95% of calls to 29%.',
    ],
  },
  {
    id: 'stats',
    k: '04',
    title: 'Statistics that survive scrutiny',
    body: [
      '20,851 seasonality tests were run under permutation testing with Benjamini–Hochberg false-discovery control. 936 survived, and the denominator is published.',
      'Hypotheses are pre-registered in git, with a test that fails if a registry entry postdates its build. Positive controls (turn-of-month, p = 0.0005) and negative controls (random labels) keep the machinery honest.',
      'Options are priced with Black-76 on a forward and discount factor regressed from put-call parity, so no risk-free rate is assumed. IV comes from bisection, with a smile per expiry. Dislocations only surface when they exceed half the bid-ask spread.',
    ],
  },
  {
    id: 'infra',
    k: '05',
    title: 'Production on a ₹0 stack',
    body: [
      'The site and the whole pipeline run on one free Ampere ARM VM (2 OCPU, 12 GB) behind a Cloudflare Tunnel, with zero inbound web ports. The 6M-row feature table rebuilds a year at a time, cut from 820 s to 147 s with byte-identical output, and cgroup weights make sure the kernel kills a build, never the site.',
      'Deploys are one command: stream the archive, build at lowest priority, swap only on success, then smoke-test. Payments settle exactly once inside a Postgres transaction with HMAC verification. Sign-in is Google-only, and plan limits are cut server-side so locked data never reaches the browser.',
    ],
  },
];

export default function AlphaCalendarCase() {
  return (
    <>
      <main id="main" className="relative">
        <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[90vh] opacity-60" aria-hidden />
        <section className="relative mx-auto max-w-[1400px] px-5 pb-16 pt-36 md:px-10 md:pt-44">
          <Link href="/#alphacalendar" className="font-mono text-[12px] text-mute transition-colors hover:text-acct">
            ← back to index
          </Link>
          <div className="mono-label mt-10">case study · founder & sole engineer · 2025 → now</div>
          <h1 className="mt-6 text-[clamp(3rem,10vw,9rem)] font-medium leading-[0.86] tracking-[-0.06em]">
            Alpha<span className="font-serif font-normal italic tracking-[-0.03em] text-acct">Calendar</span>
          </h1>
          <p className="mt-8 max-w-2xl text-[clamp(1.1rem,1.8vw,1.4rem)] leading-relaxed text-mute text-pretty">{alpha.oneLiner}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={alpha.url} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center rounded-full bg-acc px-6 text-[14px] font-medium text-ink">
              Visit alphacalendar.in ↗
            </a>
          </div>
        </section>

        <section className="relative mx-auto max-w-[1180px] px-5 md:px-10">
          <Reveal>
            <BrowserFrame />
          </Reveal>
        </section>

        <section className="mx-auto mt-24 max-w-[1400px] px-5 md:px-10">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
            {alpha.stats.map(s => (
              <div key={s.label} className="bg-bg p-6">
                <div className="text-[clamp(1.8rem,3.6vw,3rem)] font-medium leading-none tracking-[-0.04em] tabular-nums">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-3 text-[14px]">{s.label}</div>
                <div className="mt-1 font-mono text-[11px] text-dim">{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto mt-24 grid max-w-[1400px] gap-12 px-5 md:px-10 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <nav className="sticky top-28 space-y-2 font-mono text-[12px]" aria-label="Chapters">
              {chapters.map(c => (
                <a key={c.id} href={`#${c.id}`} className="flex gap-3 text-mute transition-colors hover:text-fg">
                  <span className="text-acct">{c.k}</span>
                  {c.title}
                </a>
              ))}
              <a href="#architecture" className="flex gap-3 text-mute transition-colors hover:text-fg">
                <span className="text-acct">06</span>Architecture
              </a>
            </nav>
          </aside>
          <article className="space-y-24 lg:col-span-9">
            {chapters.map(c => (
              <Reveal key={c.id}>
                <section id={c.id} className="scroll-mt-28">
                  <div className="font-mono text-[12px] text-acct">{c.k}</div>
                  <h2 className="mt-3 text-[clamp(1.8rem,3.4vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.03em]">{c.title}</h2>
                  <div className="mt-6 max-w-3xl space-y-5 text-[17px] leading-[1.7] text-mute">
                    {c.body.map(p => (
                      <p key={p.slice(0, 32)}>{p}</p>
                    ))}
                  </div>
                </section>
              </Reveal>
            ))}
            <section id="architecture" className="scroll-mt-28">
              <div className="font-mono text-[12px] text-acct">06</div>
              <h2 className="mb-8 mt-3 text-[clamp(1.8rem,3.4vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.03em]">Architecture</h2>
              <Pipeline />
              <ul className="mt-8 flex flex-wrap gap-2">
                {alpha.stack.map(s => (
                  <li key={s} className="rounded-md border border-line px-2.5 py-1 font-mono text-[11px] text-mute">
                    {s}
                  </li>
                ))}
              </ul>
            </section>
            <div className="rounded-2xl border border-line bg-panel/60 p-8">
              <p className="text-[clamp(1.2rem,2vw,1.6rem)] leading-snug tracking-tight">
                1,039 commits and 381 merged PRs in seven weeks, about 285k lines of Python and TypeScript, and ~3,300 tests,
                built by one person.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/#contact" className="inline-flex h-11 items-center rounded-full border border-line2 px-5 text-[14px] hover:bg-panel2">
                  Talk to me about it →
                </Link>
              </div>
              <p className="mt-6 font-mono text-[10px] text-dim">AlphaCalendar is a research tool, not investment advice. Figures as of Oct 2026.</p>
            </div>
          </article>
        </div>
        <div className="h-32" />
      </main>
      <Footer />
    </>
  );
}
