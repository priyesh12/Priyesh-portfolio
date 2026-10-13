import fs from 'node:fs';
import { createRequire } from 'node:module';
import { chromium } from 'playwright-core';
import * as C from './content.mjs';

const require = createRequire(import.meta.url);
const {
  AlignmentType, BorderStyle, Document, ExternalHyperlink, LevelFormat, Packer, Paragraph, TabStopType, TextRun,
} = require('docx');

const OUT = process.argv[2] ?? '.';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const pick = (bullets, cv) => bullets.filter(b => cv || typeof b === 'string').map(b => (typeof b === 'string' ? b : b.text));

/* ───────────── HTML → PDF ───────────── */

function html(kind) {
  const cv = kind === 'cv';
  const s = cv
    ? { body: 10.4, line: 1.42, margin: '16mm 17mm', h: 11, name: 24, gap: 9 }
    : { body: 9.3, line: 1.24, margin: '9mm 12mm', h: 10, name: 20, gap: 4.5 };
  const sec = (t, inner) => `<section><h2>${t}</h2>${inner}</section>`;
  const exp = C.experience
    .map(
      e => `<div class="item"><div class="row"><span><b>${esc(e.role)}</b>, ${esc(e.org)}</span><span class="date">${esc(e.dates)}</span></div>
      ${cv ? `<div class="sub">${esc(e.where)}</div>` : ''}
      <ul>${pick(e.bullets, cv).map(b => `<li>${esc(b)}</li>`).join('')}</ul></div>`
    )
    .join('');
  const projects = C.projects
    .map(p => `<li><b>${esc(p.name)}</b> (${esc(p.tech)}): ${esc(p.text)}</li>`)
    .join('');
  const edu = C.education
    .map(e => `<div class="item"><div class="row"><span><b>${esc(e.school)}</b>${esc(e.detail ?? '')}</span><span class="date">${esc(e.dates)}</span></div>${e.degree ? `<div>${esc(e.degree)}</div>` : ''}</div>`)
    .join('');
  const skills = C.skills.map(([k, v]) => `<div class="skill"><b>${k}:</b> ${esc(v)}</div>`).join('');

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${C.header.name} ${cv ? 'CV' : 'Resume'}</title>
<style>
@page { size: A4; margin: ${s.margin}; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: ${s.body}pt; line-height: ${s.line}; color: #111; }
h1 { font-size: ${s.name}pt; margin: 0; letter-spacing: -0.3px; }
.title { font-size: ${s.body + 1}pt; margin-top: 2px; color: #222; }
.contact { margin-top: 3px; color: #333; }
.contact a { color: #333; text-decoration: none; }
h2 { break-after: avoid; font-size: ${s.h}pt; text-transform: uppercase; letter-spacing: 0.6px; margin: ${s.gap + 3}px 0 ${s.gap - 2}px; padding-bottom: 2px; border-bottom: 1px solid #111; }
.item { margin-bottom: ${s.gap - 1}px; break-inside: avoid; }
.row { display: flex; justify-content: space-between; gap: 12px; }
.date { white-space: nowrap; }
.sub { color: #444; font-style: italic; }
ul { margin: 2px 0 0; padding-left: 15px; }
li { margin: 1px 0; }
.skill { margin: 1px 0; }
p { margin: 0; }
</style></head><body>
<header>
  <h1>${C.header.name}</h1>
  <div class="title">${esc(C.header.title)}</div>
  <div class="contact">${C.header.contact.filter(([, , cvOnly]) => cv || !cvOnly).map(([t, h]) => (h ? `<a href="${h}">${esc(t)}</a>` : esc(t))).join(' | ')}</div>
</header>
${sec('Summary', `<p>${esc(cv ? C.summary.cv : C.summary.resume)}</p>`)}
${cv ? '' : sec('Skills', skills)}
${sec('Experience', exp)}
${cv ? sec('Selected Projects', `<ul>${projects}</ul>`) : ''}
${sec('Education', edu)}
${sec(cv ? 'Publications' : 'Publications & Awards', cv
    ? `<ul>${C.publications.map(p => `<li>${esc(p).replace('P. Gupta', '<b>P. Gupta</b>')}</li>`).join('')}</ul>`
    : `<ul>${C.pubsShort.map(p => `<li>${esc(p)}</li>`).join('')}<li>${esc(C.awardsShort)}</li></ul>`)}
${cv ? sec('Awards & Service', `<ul>${C.awards.map(a => `<li>${esc(a)}</li>`).join('')}</ul>`) : ''}
${cv ? sec('Skills', skills) : ''}
</body></html>`;
}

/* ───────────── DOCX ───────────── */

function docx(kind) {
  const cv = kind === 'cv';
  const size = cv ? 21 : 19; // half-points
  const W = 11906; // A4 width (DXA)
  const margin = cv ? 1000 : 720;
  const content = W - margin * 2;
  const runs = (text, opts = {}) => new TextRun({ text, size, font: 'Arial', ...opts });
  const heading = t =>
    new Paragraph({
      spacing: { before: cv ? 200 : 120, after: 60 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '111111', space: 1 } },
      children: [runs(t.toUpperCase(), { bold: true, size: size + 2 })],
    });
  const bullet = text => new Paragraph({ numbering: { reference: 'b', level: 0 }, spacing: { after: 20 }, children: [runs(text)] });
  const rowLine = (left, leftRest, right) =>
    new Paragraph({
      tabStops: [{ type: TabStopType.RIGHT, position: content }],
      spacing: { before: 60, after: 10 },
      keepNext: true,
      children: [runs(left, { bold: true }), runs(leftRest), runs(`\t${right}`)],
    });

  const children = [
    new Paragraph({ children: [runs(C.header.name, { bold: true, size: cv ? 44 : 40 })] }),
    new Paragraph({ children: [runs(C.header.title, { size: size + 2 })] }),
    new Paragraph({
      spacing: { after: 60 },
      children: C.header.contact
        .filter(([, , cvOnly]) => cv || !cvOnly)
        .flatMap(([t, h], i) => {
          const sep = i ? [runs(' | ')] : [];
          return [...sep, h ? new ExternalHyperlink({ link: h, children: [runs(t)] }) : runs(t)];
        }),
    }),
    heading('Summary'),
    new Paragraph({ children: [runs(cv ? C.summary.cv : C.summary.resume)] }),
  ];
  const skillParas = () => C.skills.map(([k, v]) => new Paragraph({ spacing: { after: 20 }, children: [runs(`${k}: `, { bold: true }), runs(v)] }));
  if (!cv) children.push(heading('Skills'), ...skillParas());
  children.push(heading('Experience'));
  for (const e of C.experience) {
    children.push(rowLine(e.role, `, ${e.org}`, e.dates));
    if (cv) children.push(new Paragraph({ children: [runs(e.where, { italics: true })] }));
    pick(e.bullets, cv).forEach(b => children.push(bullet(b)));
  }
  if (cv) {
    children.push(heading('Selected Projects'));
    C.projects.forEach(p =>
      children.push(new Paragraph({ numbering: { reference: 'b', level: 0 }, spacing: { after: 20 }, children: [runs(p.name, { bold: true }), runs(` (${p.tech}): ${p.text}`)] }))
    );
  }
  children.push(heading('Education'));
  for (const e of C.education) {
    children.push(rowLine(e.school, e.detail ?? '', e.dates));
    if (e.degree) children.push(new Paragraph({ children: [runs(e.degree)] }));
  }
  if (cv) {
    children.push(heading('Publications'));
    C.publications.forEach(p => {
      const [pre, post] = p.split('P. Gupta');
      children.push(new Paragraph({ numbering: { reference: 'b', level: 0 }, spacing: { after: 40 }, children: [runs(pre), runs('P. Gupta', { bold: true }), runs(post)] }));
    });
    children.push(heading('Awards & Service'));
    C.awards.forEach(a => children.push(bullet(a)));
    children.push(heading('Skills'), ...skillParas());
  } else {
    children.push(heading('Publications & Awards'));
    C.pubsShort.forEach(p => children.push(bullet(p)));
    children.push(bullet(C.awardsShort));
  }

  return new Document({
    creator: C.header.name,
    title: `${C.header.name} ${cv ? 'CV' : 'Resume'}`,
    styles: { default: { document: { run: { font: 'Arial', size } } } },
    numbering: {
      config: [
        {
          reference: 'b',
          levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 300, hanging: 220 } } } }],
        },
      ],
    },
    sections: [{ properties: { page: { size: { width: W, height: 16838 }, margin: { top: margin, bottom: margin, left: margin, right: margin } } }, children }],
  });
}

/* ───────────── run ───────────── */

const browser = await chromium.launch({ executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser' });
for (const [kind, file] of [
  ['resume', 'Priyesh_Gupta_Resume'],
  ['cv', 'Priyesh_Gupta_CV'],
]) {
  const page = await browser.newPage();
  await page.setContent(html(kind), { waitUntil: 'load' });
  await page.pdf({ path: `${OUT}/${file}.pdf`, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await page.close();
  fs.writeFileSync(`${OUT}/${file}.docx`, await Packer.toBuffer(docx(kind)));
  console.log('wrote', file);
}
await browser.close();
