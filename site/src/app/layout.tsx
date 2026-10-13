import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { CommandPalette } from '@/components/CommandPalette';
import { Nav } from '@/components/Nav';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });
const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
});

const siteUrl = 'https://priyeshgupta.netlify.app';
const description =
  'Priyesh Gupta: AI × quant systems engineer and founder of AlphaCalendar, a live research engine for Indian equities with 84M rows, 171 data contracts and LLMs reading 9,497 earnings calls. Four peer-reviewed papers; IEEE TALE 2024 Best Student Paper.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Priyesh Gupta | AI × Quant Systems Engineer',
    template: '%s | Priyesh Gupta',
  },
  description,
  authors: [{ name: 'Priyesh Gupta' }],
  keywords: [
    'Priyesh Gupta',
    'AlphaCalendar',
    'AI engineer',
    'quant developer',
    'LLM',
    'RAG',
    'data engineering',
    'Indian stock market',
    'machine learning',
  ],
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Priyesh Gupta',
    title: 'Priyesh Gupta | I build machines that read markets',
    description,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Priyesh Gupta, AI × Quant Systems Engineer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Priyesh Gupta | I build machines that read markets',
    description,
    images: ['/og.png'],
  },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#060607',
  width: 'device-width',
  initialScale: 1,
};

const themeScript = `(function(){try{var t=localStorage.getItem('pg.theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Priyesh Gupta',
  url: siteUrl,
  jobTitle: 'Founder, AlphaCalendar',
  alumniOf: 'Indian Institute of Information Technology Dharwad',
  sameAs: [
    'https://github.com/priyesh12',
    'https://www.linkedin.com/in/priyesh-gupta-bb2949b9/',
    'https://scholar.google.com/citations?user=xvheNWEAAAAJ',
    'https://www.researchgate.net/profile/Priyesh-Gupta-4',
    'https://orcid.org/0009-0006-6959-817X',
    'https://alphacalendar.in',
  ],
  award: 'IEEE TALE 2024 Best Student Paper',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-acc focus:px-3 focus:py-2 focus:text-ink"
          >
            Skip to content
          </a>
          <Nav />
          {children}
          <CommandPalette />
          <div className="grain" aria-hidden />
        </Providers>
      </body>
    </html>
  );
}
