'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { profile } from '@/content/data';
import { Reveal, SectionHeader } from './ui';

type Status = { kind: 'idle' } | { kind: 'sending'; t0: number } | { kind: 'ok'; ms: number } | { kind: 'err'; ms: number };

const SERVICE = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

function Json({ name, email, message }: { name: string; email: string; message: string }) {
  const str = (s: string, ph: string) =>
    s ? <span className="text-acct">&quot;{s.replace(/"/g, '\\"')}&quot;</span> : <span className="text-dim">&quot;{ph}&quot;</span>;
  return (
    <pre className="whitespace-pre-wrap break-words font-mono text-[12.5px] leading-6">
      <span className="text-violet">POST</span> <span className="text-fg">/v1/hello</span> <span className="text-dim">HTTP/1.1</span>
      {'\n'}
      <span className="text-dim">Host: priyeshgupta.netlify.app</span>
      {'\n'}
      <span className="text-dim">Content-Type: application/json</span>
      {'\n\n'}
      <span className="text-mute">{'{'}</span>
      {'\n  '}
      <span className="text-cyan">&quot;from&quot;</span>
      <span className="text-mute">: </span>
      {str(name, 'your name')}
      <span className="text-mute">,</span>
      {'\n  '}
      <span className="text-cyan">&quot;reply_to&quot;</span>
      <span className="text-mute">: </span>
      {str(email, 'you@company.com')}
      <span className="text-mute">,</span>
      {'\n  '}
      <span className="text-cyan">&quot;message&quot;</span>
      <span className="text-mute">: </span>
      {str(message.length > 220 ? message.slice(0, 220) + '…' : message, 'what are we building?')}
      {'\n'}
      <span className="text-mute">{'}'}</span>
    </pre>
  );
}

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [copied, setCopied] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status.kind === 'sending') return;
    const t0 = performance.now();
    setStatus({ kind: 'sending', t0 });
    try {
      if (!SERVICE || !TEMPLATE || !KEY) throw new Error('email service not configured');
      const emailjs = (await import('@emailjs/browser')).default;
      await emailjs.send(
        SERVICE,
        TEMPLATE,
        { from_name: `${name} <${email}>`, reply_to: email, message: `${message}\n\n— ${name} (${email})` },
        { publicKey: KEY }
      );
      setStatus({ kind: 'ok', ms: Math.round(performance.now() - t0) });
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus({ kind: 'err', ms: Math.round(performance.now() - t0) });
    }
  };

  const input =
    'w-full rounded-lg border border-line bg-bg2 px-4 py-3 text-[16px] outline-none sm:text-[15px] transition-colors placeholder:text-dim focus:border-acc/70';

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70vh] bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,var(--acc-soft),transparent)]" aria-hidden />
      <div className="relative mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
        <SectionHeader
          index="09"
          kicker="CONTACT · OPEN CHANNEL"
          title={
            <>
              Building something hard? <span className="font-serif font-normal italic text-acct">Let’s talk.</span>
            </>
          }
        >
          I’m open to AI and quant engineering roles, research collaborations and ambitious products. Send a request
          below, or email me directly.
        </SectionHeader>

        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal>
            <form onSubmit={submit} className="flex h-full flex-col gap-4 rounded-2xl border border-line bg-panel/70 p-6 md:p-8">
              <div className="mono-label">request body</div>
              <label className="block">
                <span className="mb-1.5 block font-mono text-[11px] text-mute">from</span>
                <input className={input} required maxLength={120} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-[11px] text-mute">reply_to</span>
                <input className={input} required type="email" maxLength={200} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" />
              </label>
              <label className="block flex-1">
                <span className="mb-1.5 block font-mono text-[11px] text-mute">message</span>
                <textarea className={`${input} min-h-[150px] resize-y`} required maxLength={4000} value={message} onChange={e => setMessage(e.target.value)} placeholder="What are we building?" />
              </label>
              <button
                type="submit"
                disabled={status.kind === 'sending'}
                className="group mt-2 inline-flex h-12 items-center justify-center gap-3 rounded-full bg-acc px-6 font-medium text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {status.kind === 'sending' ? 'Sending…' : 'Send request'}
                <span className="font-mono text-[12px] opacity-60">⏎</span>
              </button>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-4">
              <div className="rounded-2xl border border-line bg-panel/70 p-6 md:p-8">
                <div className="mono-label mb-4">live preview</div>
                <Json name={name} email={email} message={message} />
              </div>
              <div className="min-h-[120px] rounded-2xl border border-line bg-bg2 p-6 font-mono text-[12.5px] leading-6" aria-live="polite">
                <div className="mono-label mb-3">response</div>
                <AnimatePresence mode="wait">
                  {status.kind === 'idle' && (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-dim">
                      awaiting request<span className="ml-1 inline-block h-3.5 w-1.5 translate-y-0.5 animate-blink bg-dim" />
                    </motion.div>
                  )}
                  {status.kind === 'sending' && (
                    <motion.div key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-mute">
                      ⠋ connecting to priyesh…
                    </motion.div>
                  )}
                  {status.kind === 'ok' && (
                    <motion.div key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div>
                        <span className="text-acct">HTTP/1.1 200 OK</span> <span className="text-dim">· {status.ms} ms</span>
                      </div>
                      <div className="text-mute">{'{ "status": "delivered", "next": "Priyesh will reply by email" }'}</div>
                    </motion.div>
                  )}
                  {status.kind === 'err' && (
                    <motion.div key="err" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div>
                        <span className="text-hot">HTTP/1.1 503 Service Unavailable</span> <span className="text-dim">· {status.ms} ms</span>
                      </div>
                      <div className="text-mute">
                        fallback →{' '}
                        <a className="text-fg underline underline-offset-4" href={`mailto:${profile.email}`}>
                          {profile.email}
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-16 flex flex-col gap-8 border-t border-line pt-10">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(profile.email);
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              }}
              className="group max-w-full self-start text-left"
              aria-label="Copy email address"
            >
              <div className="mono-label mb-2">{copied ? '✓ copied' : 'click to copy'}</div>
              <div className="break-all text-[clamp(1.6rem,6vw,4.4rem)] font-medium leading-[1.05] tracking-[-0.04em] transition-colors group-hover:text-acct sm:break-normal">
                {profile.email}
              </div>
            </button>
            <div className="flex flex-wrap gap-2">
              {[
                ['LinkedIn', profile.links.linkedin],
                ['GitHub', profile.links.github],
                ['Google Scholar', profile.links.scholar],
                ['ResearchGate', profile.links.researchgate],
                ['ORCID', profile.links.orcid],
                ['AlphaCalendar', profile.links.alphacalendar],
                ['Résumé', profile.resume],
                ['CV', profile.cv],
              ].map(([l, h]) => (
                <a key={l} href={h} target="_blank" rel="noreferrer" className="rounded-full border border-line2 px-4 py-2 text-[13px] transition-colors hover:border-acc hover:text-acct">
                  {l} ↗
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
