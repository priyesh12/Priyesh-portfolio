// Tiny canvas "explainers": each draws what its project actually does.
import type { Viz } from '@/content/data';

export type Colors = { fg: string; mute: string; dim: string; line: string; acc: string; hot: string; violet: string; cyan: string; bg: string; mono: string };
type Draw = (ctx: CanvasRenderingContext2D, t: number, w: number, h: number, c: Colors) => void;

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));

function label(ctx: CanvasRenderingContext2D, c: Colors, s: string, x: number, y: number, color = c.dim, align: CanvasTextAlign = 'left') {
  ctx.font = `10px ${c.mono}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(s, x, y);
}

/* ─ RAG: transcript lines → chunks → embedding space, query retrieves top-k ─ */
const ragPts = (() => {
  const r = rng(9);
  const cs = [
    [0.25, 0.3],
    [0.72, 0.28],
    [0.3, 0.75],
    [0.75, 0.72],
  ];
  return Array.from({ length: 80 }, (_, i) => {
    const cc = cs[i % 4];
    return [cc[0] + (r() - 0.5) * 0.32, cc[1] + (r() - 0.5) * 0.32];
  });
})();
const rag: Draw = (ctx, t, w, h, c) => {
  const lw = w * 0.34;
  // transcript
  const r = rng(3);
  const lines = 14;
  const scroll = (t * 14) % 18;
  for (let i = 0; i < lines + 2; i++) {
    const y = 18 + i * 13 - scroll;
    if (y < 10 || y > h - 10) continue;
    const len = (0.4 + r() * 0.55) * (lw - 24);
    const inChunk = Math.floor((t * 0.8) % 4) === Math.floor(i / 4) % 4;
    ctx.fillStyle = inChunk ? c.acc : c.line;
    ctx.globalAlpha = inChunk ? 0.75 : 1;
    ctx.fillRect(12, y, len, 4);
  }
  ctx.globalAlpha = 1;
  label(ctx, c, 'transcript → chunks', 12, h - 8);
  // arrow
  ctx.strokeStyle = c.dim;
  ctx.setLineDash([2, 3]);
  ctx.beginPath();
  ctx.moveTo(lw, h / 2);
  ctx.lineTo(lw + 22, h / 2);
  ctx.stroke();
  ctx.setLineDash([]);
  // embedding space
  const x0 = lw + 30;
  const sw = w - x0 - 10;
  const sh = h - 26;
  const q = [0.5 + Math.cos(t * 0.45) * 0.3, 0.5 + Math.sin(t * 0.6) * 0.28];
  const d = ragPts.map((p, i) => ({ i, d: (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 })).sort((a, b) => a.d - b.d);
  const top = new Set(d.slice(0, 5).map(x => x.i));
  ctx.strokeStyle = c.acc;
  ctx.globalAlpha = 0.6;
  for (const i of top) {
    ctx.beginPath();
    ctx.moveTo(x0 + q[0] * sw, 8 + q[1] * sh);
    ctx.lineTo(x0 + ragPts[i][0] * sw, 8 + ragPts[i][1] * sh);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ragPts.forEach((p, i) => {
    ctx.fillStyle = top.has(i) ? c.acc : c.mute;
    ctx.globalAlpha = top.has(i) ? 1 : 0.45;
    ctx.beginPath();
    ctx.arc(x0 + p[0] * sw, 8 + p[1] * sh, top.has(i) ? 2.6 : 1.6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  ctx.fillStyle = c.fg;
  ctx.save();
  ctx.translate(x0 + q[0] * sw, 8 + q[1] * sh);
  ctx.rotate(t);
  ctx.fillRect(-3.5, -3.5, 7, 7);
  ctx.restore();
  label(ctx, c, 'query · top-k = 5 · cosine', w - 10, h - 8, c.dim, 'right');
};

/* ─ SVI smile fitting to noisy market IVs ─ */
const smilePts = (() => {
  const r = rng(21);
  return Array.from({ length: 26 }, (_, i) => {
    const k = -1 + (i / 25) * 2;
    return [k, 0.2 + 0.13 * k * k - 0.07 * k + (r() - 0.5) * 0.008];
  });
})();
const smile: Draw = (ctx, t, w, h, c) => {
  const cyc = (t % 6) / 6;
  const p = ease(clamp(cyc / 0.6));
  const X = (k: number) => 16 + ((k + 1) / 2) * (w - 32);
  const Y = (v: number) => h - 22 - ((v - 0.12) / 0.32) * (h - 40);
  ctx.strokeStyle = c.line;
  ctx.beginPath();
  ctx.moveTo(16, h - 22);
  ctx.lineTo(w - 16, h - 22);
  ctx.moveTo(X(0), 10);
  ctx.lineTo(X(0), h - 22);
  ctx.stroke();
  const fit = (k: number) => 0.27 * (1 - p) + (0.2 + 0.13 * k * k - 0.07 * k) * p;
  // residuals
  ctx.strokeStyle = c.hot;
  ctx.globalAlpha = 0.35 * (1 - p) + 0.08;
  for (const [k, v] of smilePts) {
    ctx.beginPath();
    ctx.moveTo(X(k), Y(v));
    ctx.lineTo(X(k), Y(fit(k)));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  for (const [k, v] of smilePts) {
    ctx.fillStyle = c.mute;
    ctx.beginPath();
    ctx.arc(X(k), Y(v), 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = c.acc;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 60; i++) {
    const k = -1 + (i / 60) * 2;
    if (i === 0) ctx.moveTo(X(k), Y(fit(k)));
    else ctx.lineTo(X(k), Y(fit(k)));
  }
  ctx.stroke();
  ctx.lineWidth = 1;
  const rmse = Math.sqrt(smilePts.reduce((s, [k, v]) => s + (v - fit(k)) ** 2, 0) / smilePts.length) * 100;
  label(ctx, c, `σ(k) · raw SVI · RMSE ${rmse.toFixed(2)} vol-pts`, 16, h - 6);
  label(ctx, c, 'log-moneyness →', w - 16, h - 6, c.dim, 'right');
};

/* ─ event bus with a risk gate ─ */
const busNames = ['MD', 'SIG', 'STRAT', 'RISK', 'OMS', 'MON'];
const bus: Draw = (ctx, t, w, h, c) => {
  const y = h / 2 - 4;
  const xs = busNames.map((_, i) => 26 + (i / (busNames.length - 1)) * (w - 52));
  ctx.strokeStyle = c.line;
  ctx.beginPath();
  ctx.moveTo(xs[0], y);
  ctx.lineTo(xs[xs.length - 1], y);
  ctx.stroke();
  // packets
  const r = rng(5);
  let passed = 0;
  let rejected = 0;
  for (let k = 0; k < 40; k++) {
    const born = k * 0.42;
    const reject = r() < 0.18;
    const age = ((t - born) % 16.8 + 16.8) % 16.8;
    const speed = (w - 52) / 3.2;
    let x = xs[0] + age * speed;
    let py = y;
    let a = 1;
    let col = c.acc;
    if (reject && x > xs[3]) {
      const over = (x - xs[3]) / speed;
      x = xs[3];
      py = y + over * over * 120;
      a = clamp(1 - over * 1.5);
      col = c.hot;
      if (over < 0.6) rejected++;
    } else if (x > xs[xs.length - 1]) continue;
    else if (x > xs[3]) passed++;
    if (a <= 0) continue;
    ctx.globalAlpha = a;
    ctx.fillStyle = col;
    ctx.fillRect(x - 3, py - 3, 6, 6);
  }
  ctx.globalAlpha = 1;
  xs.forEach((x, i) => {
    const isRisk = i === 3;
    ctx.fillStyle = c.bg;
    ctx.strokeStyle = isRisk ? c.acc : c.dim;
    ctx.beginPath();
    ctx.roundRect(x - 18, y - 11, 36, 22, 5);
    ctx.fill();
    ctx.stroke();
    label(ctx, c, busNames[i], x, y + 3, isRisk ? c.acc : c.mute, 'center');
  });
  label(ctx, c, '17-point gate · journal before send', 12, h - 8);
  label(ctx, c, `pass ${passed} · block ${rejected}`, w - 12, h - 8, c.dim, 'right');
};

/* ─ XBRL tree → audited table ─ */
const tags = ['<xbrli:context id="FY26Q1">', '  <period> 2026-04-01..06-30', '<in-capmkt:RevenueFromOperations>', '<in-capmkt:ProfitLossForPeriod>', '<in-capmkt:BasicEarningsPerShare>', '<in-capmkt:Equity>'];
const xbrl: Draw = (ctx, t, w, h, c) => {
  const cyc = t % 7;
  const n = Math.floor(cyc * 2);
  ctx.font = `9.5px ${c.mono}`;
  tags.forEach((s, i) => {
    ctx.fillStyle = i < n ? (i === n - 1 ? c.acc : c.mute) : c.line;
    ctx.textAlign = 'left';
    ctx.fillText(s.length > 26 ? s.slice(0, 25) + '…' : s, 12, 20 + i * 15);
  });
  const tx = w * 0.58;
  const cw = (w - tx - 12) / 3;
  for (let r = 0; r < 6; r++) {
    for (let k = 0; k < 3; k++) {
      const filled = r * 3 + k < (cyc - 1.5) * 5;
      ctx.strokeStyle = c.line;
      ctx.strokeRect(tx + k * cw, 10 + r * 15, cw, 15);
      if (filled) {
        ctx.fillStyle = k === 2 ? c.acc : c.mute;
        if (k === 2) {
          ctx.font = `10px ${c.mono}`;
          ctx.fillText('✓', tx + k * cw + cw / 2 - 3, 21 + r * 15);
        } else ctx.fillRect(tx + k * cw + 4, 15 + r * 15, cw * (0.4 + ((r * 7 + k * 3) % 5) / 10), 4);
      }
    }
  }
  label(ctx, c, 'parse → resolve quarter/YTD → reconcile', 12, h - 8);
  label(ctx, c, 'audit ✓', w - 12, h - 8, c.acc, 'right');
};

/* ─ DTW alignment ─ */
const dtwA = Array.from({ length: 48 }, (_, i) => Math.sin(i / 5) * 0.6 + Math.sin(i / 2.3) * 0.25 + i * 0.012);
const dtw: Draw = (ctx, t, w, h, c) => {
  const n = dtwA.length;
  const warp = (i: number) => {
    const u = i / (n - 1);
    return clamp(u + 0.12 * Math.sin(u * Math.PI * 2 + 0.6)) * (n - 1);
  };
  const sample = (x: number) => {
    const i = Math.floor(x);
    const f = x - i;
    return dtwA[Math.min(n - 1, i)] * (1 - f) + dtwA[Math.min(n - 1, i + 1)] * f;
  };
  const X = (i: number) => 14 + (i / (n - 1)) * (w - 28);
  const top = (v: number) => 30 - v * 16;
  const bot = (v: number) => h - 40 - v * 16;
  const prog = clamp(((t % 5) / 5) * 1.4);
  // links
  ctx.strokeStyle = c.acc;
  for (let i = 0; i < n; i += 2) {
    if (i / n > prog) break;
    const j = warp(i);
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.moveTo(X(i), top(dtwA[i]));
    ctx.lineTo(X(j), bot(sample(j) * 0.95 + 0.04));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = c.fg;
  ctx.beginPath();
  dtwA.forEach((v, i) => (i ? ctx.lineTo(X(i), top(v)) : ctx.moveTo(X(i), top(v))));
  ctx.stroke();
  ctx.strokeStyle = c.mute;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const j = warp(i);
    const v = sample(j) * 0.95 + 0.04;
    i ? ctx.lineTo(X(j), bot(v)) : ctx.moveTo(X(j), bot(v));
  }
  ctx.stroke();
  ctx.lineWidth = 1;
  label(ctx, c, 'today', 14, 12, c.fg);
  label(ctx, c, 'historical analogue', 14, h - 18, c.mute);
  label(ctx, c, `4M windows → cosine → DTW`, w - 14, h - 8, c.dim, 'right');
};

/* ─ earnings forecast with shrinking band ─ */
const fHist = [3.1, 3.4, 3.2, 3.8, 4.1, 3.9, 4.4, 4.7, 4.5, 5.0];
const forecast: Draw = (ctx, t, w, h, c) => {
  const cyc = (t % 5.5) / 5.5;
  const all = [...fHist, 5.3];
  const bw = (w - 40) / all.length;
  const Y = (v: number) => h - 22 - (v / 6.4) * (h - 40);
  all.forEach((v, i) => {
    const x = 20 + i * bw;
    if (i < fHist.length) {
      ctx.fillStyle = c.line;
      ctx.fillRect(x + 3, Y(v), bw - 6, h - 22 - Y(v));
    } else {
      const band = 1.6 * (1 - ease(clamp(cyc / 0.7))) + 0.25;
      ctx.fillStyle = c.acc;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(x + 3, Y(v + band), bw - 6, Y(v - band) - Y(v + band));
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.acc;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(x + 3, Y(v), bw - 6, h - 22 - Y(v));
      ctx.setLineDash([]);
      if (cyc > 0.75) {
        ctx.fillStyle = c.fg;
        ctx.beginPath();
        ctx.arc(x + bw / 2, Y(5.42), 3.5, 0, Math.PI * 2);
        ctx.fill();
        label(ctx, c, 'beat', x + bw / 2, Y(5.42) - 8, c.fg, 'center');
      }
    }
  });
  label(ctx, c, 'EPS · walk-forward ensemble', 20, h - 6);
  label(ctx, c, 'next Q →', w - 20, h - 6, c.acc, 'right');
};

/* ─ four-pillar radar morph ─ */
const radarSets = [
  [0.82, 0.64, 0.9, 0.55],
  [0.45, 0.88, 0.52, 0.8],
  [0.7, 0.4, 0.66, 0.92],
];
const radarAxes = ['earnings', 'balance', 'cash', 'ownership'];
const radar: Draw = (ctx, t, w, h, c) => {
  const cx = w / 2;
  const cy = h / 2 - 4;
  const R = Math.min(w, h) * 0.36;
  const i = Math.floor(t / 3) % radarSets.length;
  const j = (i + 1) % radarSets.length;
  const f = ease(clamp(((t % 3) - 2) / 1));
  const v = radarSets[i].map((a, k) => a + (radarSets[j][k] - a) * f);
  ctx.strokeStyle = c.line;
  for (let ring = 1; ring <= 4; ring++) {
    ctx.beginPath();
    for (let k = 0; k <= 4; k++) {
      const ang = (k / 4) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(ang) * R * (ring / 4);
      const y = cy + Math.sin(ang) * R * (ring / 4);
      k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
  }
  ctx.beginPath();
  v.forEach((a, k) => {
    const ang = (k / 4) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(ang) * R * a;
    const y = cy + Math.sin(ang) * R * a;
    k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = c.acc;
  ctx.globalAlpha = 0.16;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = c.acc;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.lineWidth = 1;
  radarAxes.forEach((a, k) => {
    const ang = (k / 4) * Math.PI * 2 - Math.PI / 2;
    label(ctx, c, a, cx + Math.cos(ang) * (R + 14), cy + Math.sin(ang) * (R + 12) + 3, c.mute, 'center');
  });
  label(ctx, c, 'peer percentile · point-in-time', 12, h - 8);
};

/* ─ diarization: waveform coloured by speaker ─ */
const wave: Draw = (ctx, t, w, h, c) => {
  const cols = [c.fg, c.acc, c.violet];
  const bars = Math.floor((w - 24) / 4);
  const off = t * 18;
  const mid = h / 2 - 6;
  for (let i = 0; i < bars; i++) {
    const g = i + off;
    const seg = Math.floor(g / 22);
    const spk = (seg * 7 + (seg >> 2)) % 3;
    const amp = (Math.abs(Math.sin(g * 0.37) * Math.sin(g * 0.11 + seg)) * 0.8 + 0.12) * (h * 0.32);
    ctx.fillStyle = cols[spk];
    ctx.globalAlpha = spk === 0 ? 0.55 : 0.9;
    ctx.fillRect(12 + i * 4, mid - amp, 2, amp * 2);
  }
  ctx.globalAlpha = 1;
  ['SPK_0', 'SPK_1', 'SPK_2'].forEach((s, i) => {
    ctx.fillStyle = cols[i];
    ctx.fillRect(12 + i * 62, h - 14, 6, 6);
    label(ctx, c, s, 22 + i * 62, h - 8, c.mute);
  });
  label(ctx, c, 'whisper + pyannote', w - 12, h - 8, c.dim, 'right');
};

export const DRAWS: Record<Viz, Draw> = { rag, smile, bus, xbrl, dtw, forecast, radar, wave };
