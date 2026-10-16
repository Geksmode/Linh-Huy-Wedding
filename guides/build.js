// Génère les guides PDF (un par cérémonie et par langue) à partir de content.js.
// Usage : node guides/build.js   (nécessite playwright + Chromium)
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const content = require('./content');

const root = path.resolve(__dirname, '..');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fileUrl = f => 'file://' + path.join(root, f);

const css = `
@import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap");
@font-face{font-family:"First Encounter";src:url("${fileUrl('FirstEncounter.otf')}") format("opentype")}
@page{size:A4;margin:16mm 16mm 18mm}
:root{--lacquer:#C8322B;--lacquer-50:#FBE7E4;--marigold:#F2A33A;--marigold-50:#FEF1DD;--jade:#2F8466;--jade-50:#E1F1EA;
--lotus-50:#FDE8EC;--gold:#B8893B;--paper:#FDF5E8;--sand:#EBD6BD;--ink:#3B1730;--body:#4E2A40;--muted:#7A5A52}
*{box-sizing:border-box}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;font:400 10.5pt/1.5 "Playfair Display",Georgia,serif;color:var(--body)}
.label{font:600 7.5pt "Be Vietnam Pro",sans-serif;letter-spacing:.2em;text-transform:uppercase;color:var(--lacquer)}
.cover{position:relative;background:var(--paper);border-radius:14px;padding:22px 26px 22px;overflow:hidden;border:1px solid var(--sand)}
.cover:after{content:"";position:absolute;right:-40px;top:-40px;width:180px;height:180px;border-radius:50%;background:var(--lacquer-50)}
.cover>*{position:relative;z-index:1}
.brand{font:34pt/1 "First Encounter","Playfair Display",cursive;color:var(--lacquer);margin:6px 0 10px}
.cover h1{margin:0;font:500 26pt/1.1 "Playfair Display",serif;color:var(--ink)}
.cover h1 em{font-style:italic;color:var(--lacquer);font-weight:400}
.meta{display:flex;gap:22px;margin-top:14px;flex-wrap:wrap;font:500 9pt/1.4 "Be Vietnam Pro",sans-serif;color:var(--ink)}
.meta span{display:block;font-weight:400;color:var(--muted)}
.intro{margin:18px 2px 0;font-size:11pt;line-height:1.6}
.intro:first-letter{font-size:1.6em;color:var(--lacquer)}
.ess{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:16px}
.ess div{background:var(--marigold-50);border-radius:10px;padding:9px 12px;break-inside:avoid}
.ess b{display:block;font:600 7.5pt "Be Vietnam Pro",sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#B96F12;margin-bottom:2px}
.ess p{margin:0;font-size:9.5pt;line-height:1.45;color:var(--ink)}
.symbol{margin-top:12px;border-left:3px solid var(--gold);padding:4px 0 4px 14px;font-size:9.5pt;break-inside:avoid}
.symbol b{font:600 italic 10.5pt "Playfair Display",serif;color:var(--ink)}
h2{font:500 17pt/1.2 "Playfair Display",serif;color:var(--ink);margin:24px 0 4px;break-after:avoid}
h2 small{display:block;margin-bottom:4px}
.legend{font:400 8pt "Be Vietnam Pro",sans-serif;color:var(--muted);margin-bottom:12px}
.legend i{display:inline-block;width:9px;height:9px;border-radius:2px;margin:0 4px -1px 10px}
ol.tl{list-style:none;margin:0;padding:0}
ol.tl li{display:grid;grid-template-columns:52px 16px 1fr;column-gap:10px;break-inside:avoid}
.t{text-align:right;font:600 9.5pt/1.5 "Be Vietnam Pro",sans-serif;color:var(--lacquer);padding-top:1px}
.t.soft{color:var(--sand)}
.rail{position:relative}
.rail:before{content:"";position:absolute;left:7px;top:6px;bottom:-6px;width:2px;background:var(--sand)}
li:last-child .rail:before{display:none}
.rail:after{content:"";position:absolute;left:2px;top:4px;width:12px;height:12px;border-radius:50%;background:var(--c);box-shadow:0 0 0 3px #fff}
.ev{padding-bottom:13px}
.ev h3{margin:0 0 3px;font:500 12pt/1.3 "Playfair Display",serif;color:var(--ink)}
.ev p{margin:0;font-size:9.5pt;line-height:1.5}
.ev .you{margin-top:5px;background:var(--jade-50);border-radius:6px;padding:5px 9px;color:#1D5A44}
.ev .you b{font:600 7pt "Be Vietnam Pro",sans-serif;letter-spacing:.16em;text-transform:uppercase;margin-right:6px}
.boxes{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px}
.box{border:1px solid var(--sand);border-radius:12px;padding:12px 14px;break-inside:avoid;background:#fff}
.box h4{margin:0 0 6px;font:500 12pt "Playfair Display",serif;color:var(--ink)}
.box ul{margin:0;padding-left:15px;font-size:9pt;line-height:1.45}
.box li{margin-bottom:3px}.box li::marker{color:var(--lacquer)}
.lex{break-inside:avoid;background:var(--lotus-50);border-radius:12px;padding:12px 16px;margin-top:10px}
.lex h4{margin:0;font:500 12pt "Playfair Display",serif;color:var(--ink)}
.lex .hint{font:400 8pt "Be Vietnam Pro",sans-serif;color:var(--muted);margin:2px 0 8px}
.lex table{width:100%;border-collapse:collapse;font-size:9pt}
.lex td{padding:4px 6px;border-top:1px solid rgba(184,68,90,.18);vertical-align:top}
.lex td:first-child{font-weight:600;color:var(--ink);white-space:nowrap}
.lex td:nth-child(2){font:italic 8.5pt "Playfair Display",serif;color:var(--muted);white-space:nowrap}
.end{margin-top:18px;text-align:center;font:26pt "First Encounter","Playfair Display",cursive;color:var(--lacquer)}
`;

const hues = ['#C8322B', '#F2A33A', '#EE7A8E', '#2F8466', '#B8893B'];

function render(lang, day, idx) {
  const c = lang.common, s = lang.sides;
  const sides = idx === 0 ? [s.table, s.codes, s.weather] : [s.gift, s.table, s.codes, s.weather];
  const steps = day.steps.map((st, i) => `<li style="--c:${hues[i % hues.length]}">
    <div class="t${st.time ? '' : ' soft'}">${st.time ? esc(st.time) : '·'}</div><div class="rail"></div>
    <div class="ev"><h3>${esc(st.title)}</h3><p>${esc(st.what)}</p>
    <p class="you"><b>${esc(c.yourPart)}</b>${esc(st.you)}</p></div></li>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(c.brand)} · ${esc(day.title)}</title><style>${css}</style></head><body>
  <section class="cover">
    <div class="label">${esc(c.tagline)} · ${esc(day.dayLabel)}</div>
    <div class="brand">${esc(c.brand)}</div>
    <h1>${esc(day.title)} · <em>${esc(day.viTitle)}</em></h1>
    <div class="meta"><div>${esc(day.dayLabel)}<span>${esc(day.steps.find(x => x.time && x.time >= '09').time)}</span></div>
      <div>${esc(c.venue)}<span>${esc(c.venueAddr)}</span></div></div>
  </section>
  <p class="intro">${esc(day.intro)}</p>
  <div class="ess">${day.essentials.map(([k, v]) => `<div><b>${esc(k)}</b><p>${esc(v)}</p></div>`).join('')}</div>
  <div class="symbol"><b>${esc(day.symbolTitle)}</b> — ${esc(day.symbol)}</div>
  <h2><small class="label">${esc(day.dayLabel)}</small>${esc(c.whatHappens)}</h2>
  <ol class="tl">${steps}</ol>
  <div class="boxes">${sides.map(b => `<div class="box"><h4>${esc(b.title)}</h4><ul>${b.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</div>
  <div class="lex"><h4>${esc(c.lexTitle)}</h4><div class="hint">${esc(c.lexHint)}</div><table>
    ${c.lexicon.map(([vi, pr, tr]) => `<tr><td>${esc(vi)}</td><td>(${esc(pr)})</td><td>${esc(tr)}</td></tr>`).join('')}</table></div>
  <div class="end">Trăm năm hạnh phúc</div>
  </body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const lang of Object.values(content)) {
    for (const [i, day] of lang.days.entries()) {
      const out = path.join(__dirname, `guide-${lang.file}-${i + 1}-${day.slug}.pdf`);
      const html = path.join(__dirname, '.tmp.html');
      fs.writeFileSync(html, render(lang, day, i));
      await page.goto('file://' + html, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true,
        displayHeaderFooter: true, headerTemplate: '<span></span>',
        footerTemplate: `<div style="width:100%;font:7pt sans-serif;color:#7A5A52;text-align:center">${esc(lang.common.footer)} · <span class="pageNumber"></span>/<span class="totalPages"></span></div>` });
      fs.unlinkSync(html);
      console.log('✓', path.relative(root, out));
    }
  }
  await browser.close();
})();
