import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5">
      <div className="grid-bg absolute inset-0 opacity-70" aria-hidden />
      <div className="relative max-w-xl font-mono">
        <div className="text-[clamp(5rem,20vw,12rem)] font-medium leading-none tracking-[-0.06em] text-fg">404</div>
        <div className="mt-6 rounded-xl border border-line bg-panel/80 p-5 text-[13px] leading-6">
          <div>
            <span className="text-acct">priyesh@pg-os</span>
            <span className="text-dim">:~$ </span>cd {'<this page>'}
          </div>
          <div className="text-hot">cd: no such file or directory</div>
          <div className="text-mute">p(page exists) = 0.000 · survived 0 of 1 permutation tests</div>
        </div>
        <Link href="/" className="mt-8 inline-flex h-11 items-center rounded-full bg-acc px-5 text-[14px] font-medium text-ink">
          cd ~ (home)
        </Link>
      </div>
    </main>
  );
}
