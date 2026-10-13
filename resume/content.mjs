// Single source for résumé (1 page) and CV (long form). `cv: true` items appear only in the CV.

export const header = {
  name: 'Priyesh Gupta',
  title: 'AI & Quant Systems Engineer | Founder, AlphaCalendar',
  // [text, href, cvOnly?]
  contact: [
    ['India'],
    ['rajpri8852@gmail.com', 'mailto:rajpri8852@gmail.com'],
    ['linkedin.com/in/priyesh-gupta-bb2949b9', 'https://www.linkedin.com/in/priyesh-gupta-bb2949b9/'],
    ['github.com/priyesh12', 'https://github.com/priyesh12'],
    ['priyeshgupta.netlify.app', 'https://priyeshgupta.netlify.app'],
    ['Google Scholar', 'https://scholar.google.com/citations?user=xvheNWEAAAAJ&hl=en'],
    ['ORCID 0009-0006-6959-817X', 'https://orcid.org/0009-0006-6959-817X', true],
    ['ResearchGate', 'https://www.researchgate.net/profile/Priyesh-Gupta-4', true],
  ],
};

export const summary = {
  resume:
    'AI and quant systems engineer who builds end-to-end data, machine-learning and LLM products. Founder and sole engineer of AlphaCalendar (alphacalendar.in), a live research platform for Indian equities: 171 versioned data contracts, an 84M-row point-in-time data lake, LLM extraction over 9,497 earnings calls and a cited RAG assistant at ~$0.0013 per answer. Former applied-AI researcher at IIT Bombay and IIT Madras with 4 peer-reviewed papers, including the IEEE TALE 2024 Best Student Paper.',
  cv:
    'AI and quant systems engineer who builds end-to-end data, machine-learning and LLM products, from scrapers and data contracts through statistical models and retrieval-augmented generation to a shipped web product. Founder and sole engineer of AlphaCalendar (alphacalendar.in), a live research and analytics platform for Indian equities built on a 171-contract, 84M-row point-in-time data platform with LLM extraction over 9,497 earnings calls. Previously co-founder and chief data engineer at BazaarBuzz, and an applied-AI researcher at IIT Bombay, IIT Madras and NIT Puducherry, with four peer-reviewed papers (IEEE, Springer, APSCE) including the IEEE TALE 2024 Best Student Paper. Currently pursuing an MSc in Financial Engineering at WorldQuant University. Known for rigorous evaluation: point-in-time correctness, walk-forward validation and multiple-testing control.',
};

export const skills = [
  ['Languages', 'Python, C++, Rust, Go, TypeScript, SQL, JavaScript, R'],
  ['AI / LLM', 'LLMs, RAG, embeddings, vector search, tool calling, structured outputs, OpenAI API, Gemini, Qwen, LLaMA, llama.cpp, FAISS, LangChain, Hugging Face, Whisper, fine-tuning'],
  ['Machine Learning', 'PyTorch, TensorFlow, scikit-learn, XGBoost, LightGBM, forecasting, NLP, speech, computer vision, SHAP'],
  ['Quant & Statistics', 'Walk-forward backtesting, point-in-time data, permutation tests, Benjamini-Hochberg FDR, options pricing (Black-76, Black-Scholes, SVI, Greeks), Monte Carlo, ARMA/GARCH, DTW'],
  ['Data Engineering', 'Polars, pandas, NumPy, SciPy, DuckDB, Parquet, PostgreSQL, ETL pipelines, data contracts, data validation, XBRL parsing, web scraping'],
  ['Backend, Web & Infra', 'Next.js, React, Node.js, FastAPI, asyncio, REST APIs, WebSockets, Linux, Cloudflare, Oracle Cloud, Supabase, Git, GitHub Actions'],
];

export const experience = [
  {
    role: 'Founder & Sole Engineer',
    org: 'AlphaCalendar (alphacalendar.in)',
    where: 'India',
    dates: 'May 2025 – Present',
    bullets: [
      'Built and launched (Oct 2026) a research platform for Indian equities end to end: data pipelines, quant models, LLM features, Next.js app, payments and infra.',
      'Architected a contract-first, point-in-time data platform of 171 versioned datasets (~84M rows) with 15 validation gates, SHA-256 lineage and lookahead prevention enforced in code.',
      'Shipped LLM extraction over 9,497 earnings calls (1,470 companies), turning guidance into 44,610 tracked management promises; built a cited RAG assistant with int8 embeddings and read-only tools at ~$0.0013 per answer under a hard spend cap.',
      'Ran 20,851 seasonality tests with permutation testing and Benjamini-Hochberg FDR control (936 survived).',
      'Cut the 6M-row feature build from 820 s to 147 s with byte-identical output; run the site and pipeline on a single free ARM VM behind Cloudflare Tunnel at ₹0 hosting cost.',
      { cv: true, text: 'Maintain ~3,300 automated tests (2,117 Python, ~1,230 web) across ~285k lines of Python and TypeScript; 1,039 commits and 381 merged pull requests in the seven weeks before launch.' },
      { cv: true, text: 'Implemented Google sign-in, server-side plan enforcement and exactly-once payment settlement inside a Postgres transaction with HMAC-verified webhooks.' },
    ],
  },
  {
    role: 'Co-founder & Chief Data Engineer',
    org: 'BazaarBuzz',
    where: 'India',
    dates: 'Jan 2025 – 2026',
    bullets: [
      { cv: true, text: 'Built an automated XBRL fundamentals pipeline (Polars, lxml, DuckDB) covering 750+ companies and up to 25 years, passing 100% of audit checks on Nifty-500 filings and parsing 85% faster than DOM-based parsing.' },
      'Built on-device transcript intelligence with Qwen-2.5-7B, FAISS and sentence-transformers, processing a full Nifty-500 earnings season in 2.4 hours on one consumer GPU with no external APIs.',
      'Engineered an event-driven execution platform (asyncio, Pydantic) with a 17-point pre-trade risk gate: 18 ms average risk check and zero orphan orders across 42 simulated WebSocket disconnects.',
      { cv: true, text: 'Built options analytics with a robust IV solver and raw SVI surface fitting (Greeks for a 2,000-row chain in under 40 ms) and a DTW pattern-search engine over 4M historical windows (~1 s per stock).' },
      { cv: true, text: 'Built an EPS and revenue forecasting ensemble with walk-forward validation, reducing revenue forecast MdAPE from 31% to 6%.' },
    ],
  },
  {
    role: 'Research Intern',
    org: 'IIT Madras',
    where: 'Chennai, India',
    dates: 'Jun 2024 – 2025',
    bullets: [
      'Researched multimodal stock prediction fusing transformer sentiment, news, technicals and fundamentals.',
      { cv: true, text: 'Studied time-series model optimisation and robust feature selection to improve the accuracy and reliability of swing-trading predictions.' },
    ],
  },
  {
    role: 'Research Associate, Educational Technology',
    org: 'IIT Bombay',
    where: 'Mumbai, India',
    dates: 'May 2023 – Aug 2024',
    bullets: [
      'Improved speaker diarization for Indo-English classrooms with Whisper and PyAnnote across 140+ hours of interactions; won Best Student Paper at IEEE TALE 2024.',
      'Built multimodal emotion recognition (88% accuracy) and CRF models for regulation triggers (T4E 2024, T4E 2025).',
    ],
  },
  {
    role: 'Full-Stack & MLOps Intern',
    org: 'Vocab.AI',
    where: 'Remote',
    dates: 'Aug 2023 – May 2024',
    bullets: [
      'Fine-tuned LLaMA-2 and GPT-3.5 Turbo for sentiment and conversation scoring; shipped diarization and voice-emotion models (81% accuracy) via REST APIs and React.',
      { cv: true, text: 'Integrated an automated QA system into customer-service workflows for real-time monitoring and analytics.' },
    ],
  },
  {
    role: 'Research Intern',
    org: 'NIT Puducherry',
    where: 'Puducherry, India',
    dates: 'Dec 2023 – Jan 2024',
    bullets: [
      'Built energy-efficient CNNs for lung-nodule segmentation (77% more efficient); published at IEEE INDISCON 2025.',
    ],
  },
];

export const projects = [
  {
    name: 'Local Transcript Intelligence',
    tech: 'Qwen-2.5-7B, llama.cpp, FAISS, DuckDB',
    text: 'On-device LLM + RAG pipeline that turns earnings-call transcripts into structured signals on guidance, risk, tone and execution, with cross-quarter comparison.',
  },
  {
    name: 'Options-Lab',
    tech: 'NumPy, SciPy, numexpr',
    text: 'Volatility-surface fitting (raw SVI) and derivatives analytics for Indian index options with net-of-cost mispricing filters; Greeks for 2,000 rows in under 40 ms.',
  },
  {
    name: 'Spectrade',
    tech: 'asyncio, Pydantic v2, SQLite',
    text: 'Broker-independent event-driven trading engine with write-ahead journaling, order-state machine, 17-point risk gate and realistic paper-trading simulator.',
  },
  {
    name: 'NSE Fundamentals',
    tech: 'Polars, lxml, Parquet',
    text: 'Python package reading official exchange XBRL filings across six taxonomies with reconciliation audits (6,158 + 556 checks passing on Nifty-500).',
  },
  {
    name: 'Pattern-Matcher',
    tech: 'NumPy, dtaidistance',
    text: '7-dimension historical-analogue engine: vectorised cosine pre-filter over 4M windows then parallel DTW; Nifty-500 scan cut from ~5 min to under 30 s.',
  },
  {
    name: 'Earnings-Wave',
    tech: 'scikit-learn, Polars',
    text: 'EPS and revenue forecasting with a from-scratch histogram gradient-boosting ensemble, beat/meet/miss classification and seven valuation methods.',
  },
];

export const education = [
  {
    school: 'WorldQuant University',
    detail: ', MSc in Financial Engineering (in progress)',
    degree: '',
    dates: 'Sep 2025 – Present',
  },
  {
    school: 'Indian Institute of Information Technology (IIIT) Dharwad',
    degree: 'B.Tech, Data Science and Artificial Intelligence; CPI 8.06/10',
    dates: '2021 – 2025',
  },
];

// IEEE-style, newest first. Sourced from Google Scholar / ORCID.
export const publications = [
  'A. Desai, N. V. J. K. Kartik, P. Gupta, M. Vanahalli, R. Rajendran, T. S. Ashwin and G. Biswas, "Exploring Emotional Trajectories through Valence and Arousal in Open-Ended Math Learning Environments," in Proc. Int. Conf. on Technology for Education (T4E 2025), Asia-Pacific Society for Computers in Education, Dec. 2025.',
  'V. Sharma, N. V. J. K. Kartik, A. Desai, P. Gupta, M. K. Vanahalli, B. M. P. Prasad, S. S. Bankapur and G. N. Girish, "Energy-Efficient Depthwise Separable CNNs for Classification and Segmentation of Lung Cancer Nodules," in Proc. 2025 IEEE 6th India Council Int. Subsections Conf. (INDISCON), pp. 1–6, Aug. 2025, doi: 10.1109/INDISCON66021.2025.11254247.',
  'A. Desai, N. V. J. K. Kartik, P. Gupta, T. S. Ashwin, M. K. Vanahalli and R. Rajendran, "Advancing Speaker Diarization With Whisper Speech Recognition for Different Learning Environments," in Proc. 2024 IEEE Int. Conf. on Teaching, Assessment and Learning for Engineering (TALE), pp. 1–8, Dec. 2024, doi: 10.1109/TALE62452.2024.10834319. Best Student Paper Award.',
  'N. V. J. K. Kartik, P. Gupta, Vinayak, A. Desai, V. Badhe, T. S. Ashwin, M. Vanahalli and R. Rajendran, "Unlocking the Triggers: Automating the Identification of Triggers of Socially Shared Metacognitive Regulation in Collaborative Problem-Solving," in Technology for Education (T4E 2024), Springer Nature Singapore, pp. 43–51, doi: 10.1007/978-981-95-1734-3_6.',
];

export const pubsShort = [
  'Advancing Speaker Diarization With Whisper Speech Recognition, IEEE TALE 2024 (Best Student Paper)',
  'Energy-Efficient Depthwise Separable CNNs for Lung Cancer Nodules, IEEE INDISCON 2025',
  'Emotional Trajectories through Valence and Arousal in Math Learning, T4E 2025 (APSCE)',
  'Automating Identification of Socially Shared Metacognitive Regulation Triggers, T4E 2024 (Springer)',
];

export const awardsShort = 'IEEE INDISCON 2025 Reviewer; UG Fellow, TIH FinTech (IIT Bhilai); 1st, DRS Hackathon; Top-15, HackFest NITTE';

export const awards = [
  'Best Student Paper, IEEE TALE 2024',
  'Invited Reviewer, IEEE INDISCON 2025',
  'UG Fellowship, TIH for FinTech, IIT Bhilai',
  '1st Place, DRS Hackathon, IIIT Dharwad',
  'Top-15 Finalist, HackFest, NITTE',
];
