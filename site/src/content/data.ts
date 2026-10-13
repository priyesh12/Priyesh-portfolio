// Single source of truth for everything the site says.
// Numbers are quoted from project docs; keep them verifiable.

export const profile = {
  name: 'Priyesh Gupta',
  handle: 'priyesh',
  role: 'AI × Quant Systems Engineer',
  title: 'Founder, AlphaCalendar',
  location: 'India · IST',
  email: 'rajpri8852@gmail.com',
  resume: '/Priyesh_Gupta_Resume.pdf',
  cv: '/Priyesh_Gupta_CV.pdf',
  links: {
    github: 'https://github.com/priyesh12',
    scholar: 'https://scholar.google.com/citations?user=xvheNWEAAAAJ&hl=en',
    researchgate: 'https://www.researchgate.net/profile/Priyesh-Gupta-4',
    orcid: 'https://orcid.org/0009-0006-6959-817X',
    linkedin: 'https://www.linkedin.com/in/priyesh-gupta-bb2949b9/',
    alphacalendar: 'https://alphacalendar.in',
  },
  education: {
    degree: 'B.Tech, Data Science & Artificial Intelligence',
    school: 'IIIT Dharwad',
    year: '2025',
    detail: 'CPI 8.06 / 10',
  },
  motto: 'DATA → RESEARCH → MODELLING → BACKTESTING → PORTFOLIO → RISK → EXECUTION → INFRASTRUCTURE → AI → PRODUCT',
};

export const tickerMetrics = [
  ['alphacalendar.in', 'LIVE'],
  ['data contracts', '171'],
  ['rows in the lake', '84M'],
  ['securities scored daily', '2,367'],
  ['earnings calls read by LLMs', '9,497'],
  ['cost per AI answer', '$0.0013'],
  ['stat tests run · survived', '20,851 · 936'],
  ['option-chain greeks', '<40 ms'],
  ['pre-trade risk check', '18 ms'],
  ['nifty-500 season on local GPU', '2.4 h'],
  ['windows pre-filtered (DTW)', '4M'],
  ['peer-reviewed papers', '4'],
  ['IEEE TALE 2024', 'Best Student Paper'],
] as const;

/* ───────────────────────── AlphaCalendar ───────────────────────── */

export const alpha = {
  url: 'https://alphacalendar.in',
  oneLiner:
    'A research and analytics platform for Indian equities that shows what the data measured, when it became knowable, and how often a pattern really held.',
  pitch:
    'AlphaCalendar organises the Indian market around when things happen: results, management guidance falling due, corporate actions, seasonality and expiries. Every number traces back to its source row and the day it became public, so investors read evidence, not tips.',
  role: 'Founder · sole engineer: data, models, AI, product, infra',
  shipped: 'Live since Oct 2026',
  stats: [
    { value: 171, suffix: '', label: 'versioned data contracts', sub: '49 canonical · 75 intelligence · 47 serving' },
    { value: 84, suffix: 'M', label: 'rows in the point-in-time lake', sub: 'prices back to 1995' },
    { value: 2367, suffix: '', label: 'securities scored every session', sub: 'main board, SME, REITs, InvITs' },
    { value: 9497, suffix: '', label: 'earnings calls read by LLMs', sub: 'across 1,470 companies' },
    { value: 44610, suffix: '', label: 'management promises on a calendar', sub: 'tracked: kept, missed, dropped' },
    { value: 20851, suffix: '', label: 'seasonality tests run', sub: 'only 936 survive FDR correction' },
    { value: 3300, suffix: '+', label: 'automated tests', sub: '2,117 Python · ~1,230 web' },
    { value: 1039, suffix: '', label: 'commits in 7 weeks', sub: '381 merged PRs · ~285k LOC' },
  ],
  screens: [
    { id: 'home', label: 'Overview', src: '/img/ac/home.jpg', path: 'alphacalendar.in' },
    { id: 'market', label: 'Market Map', src: '/img/ac/market.jpg', path: 'alphacalendar.in/market' },
    { id: 'seasonality', label: 'Seasonality', src: '/img/ac/seasonality.jpg', path: 'alphacalendar.in/seasonality' },
    { id: 'index', label: 'Index Hubs', src: '/img/ac/index-nifty_50.jpg', path: 'alphacalendar.in/index/nifty_50' },
    { id: 'features', label: 'Everything inside', src: '/img/ac/features.jpg', path: 'alphacalendar.in/features' },
  ],
  pipeline: [
    { id: 'src', label: 'Public sources', detail: 'NSE · BSE · XBRL filings · AMFI · transcript PDFs · news RSS' },
    { id: 'ingest', label: 'Ingestion', detail: '~30 scrapers, an XBRL CLI and LLM concall extraction, scheduled as systemd tiers' },
    { id: 'raw', label: 'Raw lake', detail: 'Immutable, ~4 GB, Parquet + zstd' },
    { id: 'canon', label: 'Canonical ×49', detail: 'ISIN identity, corporate-action adjustment, available_at stamps' },
    { id: 'intel', label: 'Intelligence ×75', detail: 'Indicators, scores, seasonality, options pricing, embeddings' },
    { id: 'serve', label: 'Serving ×47', detail: 'Per-page JSON payloads with size budgets' },
    { id: 'app', label: 'Next.js 15 app', detail: '104 pages · 123 route handlers · RSC + in-process cache' },
    { id: 'edge', label: 'Cloudflare edge', detail: 'Tunnel, TLS, edge cache; zero inbound ports' },
  ],
  gates: 15,
  modules: [
    ['Market Map', 'Whole market on one wheel: sectors sized by cap, coloured by the day'],
    ['Stock Hub', 'Seven pillars per stock with a chart of dated events'],
    ['Concalls + Promise Ledger', 'LLM-read calls; guidance tracked as kept, missed or quietly dropped'],
    ['Guidance Calendar', '44,610 dated management targets on the day they fall due'],
    ['Seasonality', 'Calendar effects tested against chance, with FDR control'],
    ['Derivatives', 'Index option chains priced against their own smile'],
    ['Macro Exposure', 'Who moves with crude, the rupee, metals and rates'],
    ['Quant Screener', '1,911 securities × 69 fields, each column showing its coverage'],
    ['Ask AI', 'Cited answers from the platform’s own data, streamed step by step'],
    ['Alerts + Letters', 'Rules fire to Telegram; daily, weekly and monthly email letters'],
  ],
  hardProblems: [
    {
      k: 'Point-in-time, enforced',
      v: 'A filing at 19:07 counts from the next session. 93 contracts require an available_at column, a gate checks it on every write, and the reader raises LookaheadError.',
    },
    {
      k: '15 GB build in a 12 GB box',
      v: 'Rebuilt the 6M-row feature table a year at a time: 820 s → 147 s with byte-identical output. cgroups make sure the kernel kills a build, never the site.',
    },
    {
      k: 'RAG at a tenth of a cent',
      v: '256-d int8 embeddings, a flat cosine scan under 1 ms, no vector DB. Deterministic lookups run before the model, tools are read-only, and spend is capped in a ledger.',
    },
    {
      k: 'Statistics to journal standard',
      v: 'Permutation tests with Benjamini–Hochberg control and a published denominator, hypotheses pre-registered in git, plus positive and negative controls.',
    },
    {
      k: 'Options without an assumed rate',
      v: 'Black-76 on a forward and discount factor regressed from put-call parity, bisection IV and a per-expiry smile. Dislocations surface only beyond half the spread.',
    },
    {
      k: 'Taming LLM optimism',
      v: 'Raw concall scores bunched in 65–80, with 15% ties. Van der Waerden rank-normal scores took ties to 0% and “bullish” from 95% to 29%.',
    },
    {
      k: 'Fixing what upstream hides',
      v: 'Caught 18 of 305 split/bonus dates the source never adjusted, which showed up as phantom 50–80% crashes. Restated EPS onto today’s share count.',
    },
    {
      k: 'Production on a ₹0 stack',
      v: 'One free ARM VM behind a Cloudflare Tunnel, exactly-once payment settlement inside a Postgres transaction, and a one-command deploy that smoke-tests before it swaps.',
    },
  ],
  stack: [
    'Next.js 15', 'React 19', 'TypeScript', 'Python 3.14', 'Polars / pandas', 'DuckDB', 'Parquet', 'numba',
    'Supabase Postgres', 'OpenAI', 'Gemini', 'Embeddings + RAG', 'Cloudflare', 'Oracle Cloud ARM', 'systemd', 'Auth.js',
  ],
};

/* ───────────────────────── Systems (projects) ───────────────────────── */

export type Viz = 'rag' | 'smile' | 'bus' | 'xbrl' | 'dtw' | 'forecast' | 'radar' | 'wave';

export type Project = {
  slug: string;
  name: string;
  kind: string;
  pitch: string;
  problem: string;
  built: string[];
  stack: string[];
  metrics: [string, string][];
  viz: Viz;
  tags: string[];
  link?: { href: string; label: string };
  note?: string;
  code?: string;
};

export const projects: Project[] = [
  {
    slug: 'transcript-intelligence',
    name: 'Local Transcript Intelligence',
    kind: 'LLM · RAG · on-device',
    pitch: 'Turns earnings-call transcripts into structured signals on guidance, risk, tone and execution, with no external inference API.',
    problem: 'Management commentary is the richest unstructured signal in equities, but it’s locked in long transcripts and cloud LLMs are slow, costly and leak data.',
    built: [
      'Semantic chunking + local embeddings with FAISS retrieval',
      'Qwen-2.5-7B-Instruct with structured, schema-validated outputs',
      'Cross-quarter comparison of what management said vs. did',
      'DuckDB joins of LLM signals with market data for evaluation',
    ],
    stack: ['Qwen-2.5-7B', 'llama.cpp / Ollama', 'FAISS', 'sentence-transformers', 'DuckDB', '4-bit quant'],
    metrics: [
      ['2.4 h', 'full Nifty-500 earnings season on one consumer GPU'],
      ['0', 'external API calls: fully local inference'],
    ],
    viz: 'rag',
    tags: ['LLMs', 'RAG', 'Python', 'DuckDB', 'Quant research'],
  },
  {
    slug: 'options-lab',
    name: 'Options-Lab',
    kind: 'Derivatives · volatility',
    pitch: 'Volatility-surface fitting and derivatives analytics for Indian index options.',
    problem: 'Retail option tools quote noisy IVs, ignore costs and flag “arbitrage” that fees would eat.',
    built: [
      'Robust IV solver: Newton–Raphson with Brent fallback',
      'Parity-implied forward resolver; 5-parameter raw SVI fit',
      'Vectorised higher-order Greeks, GEX, max-pain, skew anomalies',
      'Indian transaction-cost model; net-of-cost mispricing filters',
    ],
    stack: ['NumPy', 'SciPy', 'numexpr', 'Plotly'],
    metrics: [
      ['<40 ms', 'Greeks for a 2,000-row option chain'],
      ['<0.25', 'vol-pt SVI RMSE across liquid strikes'],
    ],
    viz: 'smile',
    tags: ['Quant research', 'Python', 'Statistics'],
  },
  {
    slug: 'spectrade',
    name: 'Spectrade',
    kind: 'Event-driven execution',
    pitch: 'A broker-independent, event-driven trading and execution platform with strict risk controls.',
    problem: 'Execution code fails at the edges: reconnects, partial fills, duplicate orders. Most backtests never model any of it.',
    built: [
      'Typed async event bus: market data → signal → strategy → risk → OMS → monitor',
      '17-point pre-trade risk gate with explicit order-state machine',
      'Write-ahead journaling for crash-safe recovery',
      'Slippage, fees and partial-fill simulator for realistic paper trading',
    ],
    stack: ['asyncio', 'Pydantic v2', 'Upstox API', 'SQLite', 'Telegram API'],
    metrics: [
      ['18 ms', 'avg risk check on a 500-stock universe'],
      ['42 / 42', 'WebSocket drops recovered, zero orphan orders'],
      ['0.1%', 'charges reconciled vs. broker statements'],
    ],
    note: 'Paper-trading first: live code differs only in the broker adapter.',
    viz: 'bus',
    tags: ['Systems', 'Python', 'Backend'],
  },
  {
    slug: 'nse-fundamentals',
    name: 'NSE Fundamentals',
    kind: 'Data engineering · XBRL',
    pitch: 'An automated XBRL pipeline that turns raw exchange filings into an audited fundamentals lake.',
    problem: 'Indian filings arrive as inconsistent, hierarchical XBRL with shifting taxonomies, fiscal calendars and YTD-vs-quarter ambiguity.',
    built: [
      'Hierarchical XBRL parser with sector-taxonomy classification',
      'Calendar-aware quarter / YTD resolution',
      'Catalog-driven extraction + accounting reconciliation checks',
      'Reusable library with CI schema tests, Ruff and mypy',
    ],
    stack: ['Polars', 'lxml', 'Parquet', 'DuckDB', 'GitHub Actions'],
    metrics: [
      ['100%', 'Nifty-500 filings pass audit: 6,158 + 556 checks'],
      ['85%', 'faster than standard DOM parsing'],
      ['6', 'taxonomies: Ind-AS, banking, NBFC, insurance ×2, shareholding'],
    ],
    code: 'Ticker("INFY").income_statement()',
    viz: 'xbrl',
    tags: ['Data engineering', 'Python', 'DuckDB'],
  },
  {
    slug: 'pattern-matcher',
    name: 'Pattern-Matcher',
    kind: 'Similarity search · DTW',
    pitch: 'A multi-dimensional engine that finds historical analogues of today’s chart across the whole market.',
    problem: 'Naive pattern search is either too slow (DTW on everything) or too shallow (price shape only).',
    built: [
      '7-dimension confluence model: shape, volume, volatility, regime and more',
      'Vectorised cosine pre-filter over 4M windows',
      'C-optimised DTW refinement in parallel',
      'Risk-reward ranking with veto gates',
    ],
    stack: ['NumPy', 'dtaidistance', 'multiprocessing', 'Polars'],
    metrics: [
      ['~1 s', 'per stock after 4M-window pre-filter'],
      ['5 min → 30 s', 'Nifty-500 scan with caching'],
    ],
    viz: 'dtw',
    tags: ['Quant research', 'Python', 'Performance'],
  },
  {
    slug: 'earnings-wave',
    name: 'Earnings-Wave',
    kind: 'Forecasting · valuation',
    pitch: 'Forecasts next-quarter EPS and revenue, then layers seven intrinsic-valuation methods on top.',
    problem: 'Earnings surprises drive Indian stocks, but company scales vary by 1000× and naive models drown in noise.',
    built: [
      'From-scratch histogram gradient boosting + ridge + seasonal-naive ensemble',
      'Walk-forward validation; beat / meet / miss classifier',
      'P/E, P/B, EV/EBITDA, EV/FCF, DDM, revenue & PEG valuation',
      'Content-hash caching for instant reruns',
    ],
    stack: ['scikit-learn', 'GBTs', 'Ridge', 'Polars'],
    metrics: [
      ['31% → 6%', 'revenue forecast MdAPE'],
      ['18 qtrs', 'leak-free walk-forward backtest'],
      ['4 min → 15 s', 'repeat runtime with content-hash caching'],
    ],
    viz: 'forecast',
    tags: ['ML', 'Python', 'Quant research'],
  },
  {
    slug: 'qtrinox',
    name: 'Qtrinox',
    kind: 'Fundamental scoring · backtests',
    pitch: 'Four-pillar fundamental stock evaluation with strictly point-in-time backtesting.',
    problem: 'Most fundamental screens leak the future: they use results before the market could have seen them.',
    built: [
      'Four-pillar scoring with industry peer percentiles',
      'Standalone-quarter cash-flow derivation',
      'Five investor-type screens',
      '45-day results and 21-day shareholding lags to kill lookahead',
    ],
    stack: ['Polars', 'FastAPI', 'Monte Carlo', 'IC analysis'],
    metrics: [
      ['~2.5 min', 'full Nifty-500 scoring pipeline'],
      ['0', 'lookahead: availability-lagged joins'],
    ],
    viz: 'radar',
    tags: ['Quant research', 'Python', 'Backend'],
  },
  {
    slug: 'diarization',
    name: 'Whisper Speaker Diarization',
    kind: 'Research · speech AI',
    pitch: 'An improved diarization pipeline for multilingual Indo-English classrooms. Won Best Student Paper at IEEE TALE 2024.',
    problem: 'Off-the-shelf diarization breaks on noisy, code-switched collaborative-learning audio.',
    built: [
      'PyAnnote + Whisper pipeline tuned for Indo-English speech',
      'Analysis of 140+ hours of student interactions',
      'Multimodal (audio, video, text) engagement and emotion analytics',
      'CRF models for triggers of shared metacognitive regulation',
    ],
    stack: ['PyTorch', 'PyAnnote', 'Whisper', 'OpenCV', 'CRFs'],
    metrics: [
      ['Best Paper', 'IEEE TALE 2024'],
      ['140+ h', 'classroom interaction data analysed'],
    ],
    viz: 'wave',
    tags: ['ML', 'Research', 'Python'],
    link: { href: 'https://doi.org/10.1109/TALE62452.2024.10834319', label: 'Read the paper (IEEE Xplore)' },
  },
];

export const alsoBuilt = [
  { name: 'Buzz-AI', note: 'Local tool-calling LLM agent over 1.5M daily signal rows in DuckDB, with FAISS RAG. Rule: the LLM controls, never calculates', tags: ['LLMs', 'RAG'] },
  { name: 'Nifty Data Scraper', note: 'The backbone lake: 19 idempotent scrapers, ~3.5 GB, 25 years of daily data, 800+ symbols refreshed in under 60 s', tags: ['Data engineering'] },
  { name: 'Trading-Tools', note: 'Market-structure, liquidity and seasonality scanner: ~209 F&O stocks in under 8 s, with permutation tests and HAC SEs', tags: ['Statistics', 'D3.js'] },
  { name: 'Alpha-EMAs', note: '2.4M per-stock EMA backtests in under 10 min with a breadth regime filter and ATR sizing', tags: ['Python', 'Performance'] },
  { name: 'LLaMA-2 for Devanagari', note: 'Fine-tuned LLaMA-2 for Devanagari text with the Hugging Face stack', tags: ['LLMs'] },
  { name: 'Energy-efficient Lung-Nodule AI', note: 'Depthwise-separable CNNs on LIDC-IDRI with pruning + quantisation, 77% higher energy efficiency; published at IEEE INDISCON 2025', tags: ['ML', 'Research'], href: 'https://doi.org/10.1109/INDISCON66021.2025.11254247' },
  { name: 'Online School for the Specially Abled', note: 'Computer-vision adaptive learning; 1st place, DRS Hackathon (48 h)', tags: ['ML'], href: 'https://github.com/PlatJack/DRS-Hackathon-2' },
  { name: 'Emotion Monitor for Crypto Traders', note: 'Well-being-aware trading UX; top-15, HackFest NITTE', tags: ['Backend'], href: 'https://github.com/hackfest-dev/HF24-Nexus' },
  { name: 'TrustBlock', note: 'Decentralised, expert-verified news credibility platform', tags: ['Backend'], href: 'https://github.com/priyesh12/trust-block' },
];

/* ───────────────────────── Career (git log) ───────────────────────── */

export type Commit = {
  hash: string;
  date: string;
  title: string;
  org: string;
  branch: 'main' | 'research' | 'industry';
  head?: boolean;
  merge?: boolean;
  points: string[];
};

export const commits: Commit[] = [
  {
    hash: 'a1fca1e',
    date: '2025 — now',
    title: 'Founder & sole engineer',
    org: 'AlphaCalendar',
    branch: 'main',
    head: true,
    points: [
      'Built a 171-contract point-in-time data platform for Indian equities, from scrapers to served payloads',
      'Shipped LLM extraction over 9,497 earnings calls and a cited RAG assistant at ~$0.0013 per answer',
      'Designed the full stack: Python data plane, Next.js app, payments, auth, alerts and infra on a ₹0 budget',
    ],
  },
  {
    hash: '7bd2c40',
    date: '2025 — 2026',
    title: 'Co-founder & Chief Data Engineer',
    org: 'BazaarBuzz',
    branch: 'industry',
    points: [
      'Led AI-first investment-intelligence systems: backtesting, regime prediction, alpha discovery',
      'Built XBRL fundamentals, transcript intelligence, options analytics and an event-driven execution engine',
    ],
  },
  {
    hash: 'f3e91b0',
    date: 'Jul 2025',
    title: 'merge: graduated',
    org: 'IIIT Dharwad · B.Tech DS & AI',
    branch: 'main',
    merge: true,
    points: ['CPI 8.06 / 10 · Data Science & Artificial Intelligence'],
  },
  {
    hash: 'c08a7d2',
    date: 'Jun 2024 — 2025',
    title: 'Research Intern',
    org: 'IIT Madras',
    branch: 'research',
    points: [
      'Multimodal market prediction: transformer sentiment + news + technicals + fundamentals',
      'Feature-selection and time-series model studies for swing-trading accuracy',
    ],
  },
  {
    hash: '9e14b6f',
    date: 'May 2023 — Aug 2024',
    title: 'Research Associate',
    org: 'IIT Bombay · Educational Technology',
    branch: 'research',
    points: [
      'Whisper + PyAnnote diarization for Indo-English classrooms, Best Student Paper at IEEE TALE 2024',
      'Multimodal emotion recognition across 100+ hours of engagement data',
      'CRF models for SSMR triggers (T4E 2024, Springer) and valence–arousal emotion trajectories (T4E 2025)',
    ],
  },
  {
    hash: '2d5a8c3',
    date: 'Aug 2023 — May 2024',
    title: 'Full-Stack / MLOps Intern',
    org: 'Vocab.AI',
    branch: 'industry',
    points: [
      'Fine-tuned LLaMA-2 and GPT-3.5 for sentiment, topic modelling and conversation scoring',
      'Speaker diarization + voice-emotion models (81% accuracy) behind a React app',
    ],
  },
  {
    hash: '5c71e09',
    date: 'Dec 2023 — Jan 2024',
    title: 'Research Intern',
    org: 'NIT Puducherry',
    branch: 'research',
    points: [
      'Energy-efficient CNNs for lung-nodule classification + segmentation: 77% higher efficiency via pruning + quantisation',
      'Published at IEEE INDISCON 2025',
    ],
  },
  {
    hash: '0000001',
    date: '2021',
    title: 'init',
    org: 'IIIT Dharwad',
    branch: 'main',
    points: ['git init — started B.Tech in Data Science & AI'],
  },
];

/* ───────────────────────── Research ───────────────────────── */

export type Paper = {
  venue: string;
  date: string;
  title: string;
  authors: string[];
  publisher: string;
  kind: string;
  href: string;
  linkLabel: string;
  topic: string;
  badge?: string;
};

// Source: Google Scholar / ORCID (verified Oct 2026). Ordered newest first; the award paper is featured.
export const papers: Paper[] = [
  {
    venue: 'IEEE TALE 2024',
    date: 'Dec 2024',
    badge: 'Best Student Paper',
    title: 'Advancing Speaker Diarization With Whisper Speech Recognition for Different Learning Environments',
    authors: ['Aarsh Desai', 'NVJK Kartik', 'Priyesh Gupta', 'Ashwin T S', 'Manjunath K Vanahalli', 'Ramkumar Rajendran'],
    publisher: 'IEEE · pp. 1–8',
    kind: 'Conference paper',
    href: 'https://doi.org/10.1109/TALE62452.2024.10834319',
    linkLabel: 'DOI 10.1109/TALE62452.2024.10834319',
    topic: 'Speech AI',
  },
  {
    venue: 'T4E 2025',
    date: 'Dec 2025',
    title: 'Exploring Emotional Trajectories through Valence and Arousal in Open-Ended Math Learning Environments',
    authors: ['Aarsh Desai', 'NVJK Kartik', 'Priyesh Gupta', 'Manjunath Vanahalli', 'Ramkumar Rajendran', 'Ashwin T S', 'Gautam Biswas'],
    publisher: 'Asia-Pacific Society for Computers in Education',
    kind: 'Conference paper',
    href: 'https://public.intellimedia.ncsu.edu/pubmgr/pubdb/pdfs/_collaborator/engageAI/desai-t4e-2025.pdf',
    linkLabel: 'PDF',
    topic: 'Affective computing',
  },
  {
    venue: 'IEEE INDISCON 2025',
    date: 'Aug 2025',
    title: 'Energy-Efficient Depthwise Separable CNNs for Classification and Segmentation of Lung Cancer Nodules',
    authors: ['Vivaan Sharma', 'NVJK Kartik', 'Aarsh Desai', 'Priyesh Gupta', 'Manjunath K Vanahalli', 'BM Prabhu Prasad', 'Sanjay S Bankapur', 'GN Girish'],
    publisher: 'IEEE · pp. 1–6',
    kind: 'Conference paper',
    href: 'https://doi.org/10.1109/INDISCON66021.2025.11254247',
    linkLabel: 'DOI 10.1109/INDISCON66021.2025.11254247',
    topic: 'Efficient medical imaging',
  },
  {
    venue: 'T4E 2024',
    date: 'Dec 2024',
    title: 'Unlocking the Triggers: Automating the Identification of Triggers of Socially Shared Metacognitive Regulation in Collaborative Problem-Solving',
    authors: ['NVJK Kartik', 'Priyesh Gupta', 'Vinayak', 'Aarsh Desai', 'Vishwas Badhe', 'T S Ashwin', 'Manjunath Vanahalli', 'Ramkumar Rajendran'],
    publisher: 'Springer Nature Singapore · pp. 43–51',
    kind: 'Book chapter',
    href: 'https://doi.org/10.1007/978-981-95-1734-3_6',
    linkLabel: 'DOI 10.1007/978-981-95-1734-3_6',
    topic: 'Learning analytics',
  },
];

// Research beyond the publications: lab work and the research layer behind AlphaCalendar.
export const researchWork = [
  {
    where: 'IIT Madras · 2024–25',
    title: 'Multimodal swing-trade prediction',
    text: 'Fused transformer-based news and social sentiment with technical and fundamental features to predict Indian equity swings; studied feature selection and time-series model choice.',
  },
  {
    where: 'AlphaCalendar research',
    title: 'Calendar effects under multiple-testing control',
    text: '20,851 seasonality tests with permutation nulls and Benjamini–Hochberg FDR; 936 survived, and the denominator is published alongside them.',
  },
  {
    where: 'AlphaCalendar research',
    title: 'Pre-registered null results',
    text: 'Hypotheses about Hindu-calendar and astronomical market effects were registered in git before testing. None survived correction, and that result is published too.',
  },
  {
    where: 'AlphaCalendar research',
    title: 'Calibrating LLM judgements',
    text: 'LLM scores on 9,497 earnings calls bunched with 15% ties; rank-normal (van der Waerden) scoring removed the ties and cut “bullish” calls from 95% to 29%.',
  },
  {
    where: 'Independent',
    title: 'Local LLMs for financial text',
    text: 'On-device Qwen-2.5-7B with retrieval over earnings transcripts, structured outputs and cross-quarter comparison of management guidance.',
  },
  {
    where: 'IIIT Dharwad',
    title: 'Low-resource and multimodal NLP',
    text: 'Fine-tuning LLaMA-2 for Devanagari text, and multimodal emotion-cause analysis on the MELD dialogue corpus.',
  },
];

export const honours = [
  'Best Student Paper: IEEE TALE 2024',
  'Invited Reviewer: IEEE INDISCON 2025',
  'UG Fellowship: TIH for FinTech, IIT Bhilai',
  '1st Place: DRS Hackathon, IIIT Dharwad',
  'Top-15 Finalist: HackFest, NITTE',
  'MSc Financial Engineering: WorldQuant University (in progress)',
];

/* ───────────────────────── Stack ───────────────────────── */

export const stack: { group: string; items: string[] }[] = [
  { group: 'AI / LLM', items: ['LLMs', 'RAG', 'Embeddings', 'Qwen / LLaMA', 'OpenAI · Gemini', 'llama.cpp', 'FAISS', 'Whisper', 'Fine-tuning', 'Structured outputs'] },
  { group: 'ML', items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'XGBoost / LightGBM', 'SHAP', 'CRFs', '3D CNNs'] },
  { group: 'Quant', items: ['Black-76 / SVI', 'GARCH · Heston', 'Monte Carlo', 'Walk-forward', 'Permutation + FDR', 'DTW'] },
  { group: 'Data', items: ['Polars', 'pandas', 'DuckDB', 'Parquet', 'numba', 'XBRL', 'Data contracts'] },
  { group: 'Backend', items: ['Python', 'FastAPI', 'asyncio', 'Postgres', 'Node.js', 'WebSockets', 'ZeroMQ'] },
  { group: 'Product', items: ['TypeScript', 'Next.js', 'React', 'D3.js', 'SVG charts', 'PWA'] },
  { group: 'Infra', items: ['Linux · systemd', 'Cloudflare', 'Oracle Cloud', 'GitHub Actions', 'uv · Ruff · mypy'] },
];

/* ───────────────────────── Build log ───────────────────────── */

export const buildLog = [
  { m: 'Jan 2025', t: 'Quant as engineering', d: 'Started treating market research as a systems problem.' },
  { m: 'Feb 2025', t: 'No lookahead, ever', d: 'Walk-forward thinking, survivorship bias, reusable backtest infra.' },
  { m: 'Mar 2025', t: 'Vol & live feeds', d: 'Nifty / India VIX range models, ZeroMQ pub-sub over live feeds.' },
  { m: 'Apr 2025', t: 'Millions of backtests', d: 'Per-stock EMA search forced vectorisation, parallelism, caching.' },
  { m: 'May 2025', t: 'Point-in-time data', d: 'Fundamentals keyed to announcement dates; FastAPI services. First commit of the data lake.' },
  { m: 'Jun 2025', t: 'Qtrinox', d: 'Fundamental ranking engine with peer percentiles.' },
  { m: 'Jul 2025', t: 'Graduated', d: 'Nifty-500 data infra with retries and failure tracking.' },
  { m: 'Sep 2025', t: 'Polars + uv', d: 'Rewrote pipelines for speed; started stochastic-calculus prep.' },
  { m: 'Sep–Dec 2025', t: 'MSc, Financial Engineering', d: 'Started at WorldQuant University: copulas, ARMA / GARCH, Black-Scholes, Heston, Merton jumps.' },
  { m: 'Jan 2026', t: 'Composite ranking', d: 'Fundamental + technical + ownership + regime; SHAP / PCA / VIF.' },
  { m: 'Mar 2026', t: 'Stats with teeth', d: 'Seasonality under permutation tests and multiple-testing control.' },
  { m: 'Apr 2026', t: 'Pattern DNA', d: 'Winner signatures, DTW analogues, conviction thresholds.' },
  { m: 'May 2026', t: 'RAG deep dive', d: 'Hybrid BM25 + dense retrieval, RRF, cross-encoders, SSE streaming.' },
  { m: 'Jun 2026', t: 'Libraries, not scripts', d: 'NSE Fundamentals as a package: CI, Ruff, mypy.' },
  { m: 'Jul 2026', t: 'Execution + options', d: 'Event-driven trading engine, transcript intelligence, Options-Lab.' },
  { m: 'Aug 2026', t: 'Platform', d: 'Everything converges into one product.' },
  { m: 'Oct 2026', t: 'alphacalendar.in ships', d: 'Public launch: 1,039 commits in seven weeks.' },
];

export const sections = [
  { id: 'top', label: 'Index' },
  { id: 'about', label: 'About' },
  { id: 'alphacalendar', label: 'AlphaCalendar' },
  { id: 'systems', label: 'Systems' },
  { id: 'log', label: 'Career' },
  { id: 'research', label: 'Research' },
  { id: 'stack', label: 'Stack' },
  { id: 'buildlog', label: 'Build log' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'contact', label: 'Contact' },
];
