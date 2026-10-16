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
@page{size:A4;margin:13mm 15mm 15mm}
:root{--lacquer:#C8322B;--lacquer-50:#FBE7E4;--marigold:#F2A33A;--marigold-50:#FEF1DD;--jade:#2F8466;--jade-50:#E1F1EA;
--lotus-50:#FDE8EC;--gold:#B8893B;--paper:#FDF5E8;--sand:#EBD6BD;--ink:#3B1730;--body:#4E2A40;--muted:#7A5A52}
*{box-sizing:border-box}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;font:400 10.5pt/1.5 "Playfair Display",Georgia,serif;color:var(--body)}
.label{font:600 7.5pt "Be Vietnam Pro",sans-serif;letter-spacing:.2em;text-transform:uppercase;color:var(--lacquer)}
.cover{position:relative;background:var(--paper);border-radius:14px;padding:14px 22px 14px;overflow:hidden;border:1px solid var(--sand)}
.cover:after{content:"";position:absolute;right:-40px;top:-40px;width:180px;height:180px;border-radius:50%;background:var(--lacquer-50)}
.cover>*{position:relative;z-index:1}
.brand{font:28pt/1 "First Encounter","Playfair Display",cursive;color:var(--lacquer);margin:4px 0 6px}
.cover h1{margin:0;font:500 22pt/1.1 "Playfair Display",serif;color:var(--ink)}
.cover h1 em{font-style:italic;color:var(--lacquer);font-weight:400}
.meta{display:flex;gap:22px;margin-top:8px;flex-wrap:wrap;font:500 9pt/1.4 "Be Vietnam Pro",sans-serif;color:var(--ink)}
.meta span{display:block;font-weight:400;color:var(--muted)}
.intro{margin:12px 2px 0;font-size:10pt;line-height:1.5}
.intro:first-letter{font-size:1.6em;color:var(--lacquer)}
.ess{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.ess div{background:var(--marigold-50);border-radius:10px;padding:7px 11px;break-inside:avoid}
.ess b{display:block;font:600 7.5pt "Be Vietnam Pro",sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#B96F12;margin-bottom:2px}
.ess p{margin:0;font-size:9pt;line-height:1.4;color:var(--ink)}
.symbol{margin-top:10px;border-left:3px solid var(--gold);padding:2px 0 2px 12px;font-size:9pt;line-height:1.45;break-inside:avoid}
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
.opt .ev{border:1.5px dashed var(--sand);border-radius:10px;padding:8px 11px 9px;margin-bottom:13px}
.opt .t{color:var(--muted)}.opt .rail:after{background:#fff;box-shadow:0 0 0 2px var(--c) inset,0 0 0 3px #fff}
.tag{display:inline-block;font:600 7pt "Be Vietnam Pro",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#fff;background:var(--muted);border-radius:20px;padding:2px 8px;margin-bottom:4px}
.routes{margin-top:10px;break-inside:avoid}
.routes h4{margin:0 0 6px;font:500 12pt "Playfair Display",serif;color:var(--ink)}
.routes>div{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.routes>div>div{border:1.5px solid var(--sand);border-radius:10px;padding:7px 11px}
.routes>div>div:first-child{border-style:dashed}
.routes b{display:block;font:600 8pt "Be Vietnam Pro",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--lacquer);margin-bottom:2px}
.routes p{margin:0;font-size:9pt;line-height:1.4;color:var(--ink)}
.boxes{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px}
.box{border:1px solid var(--sand);border-radius:12px;padding:9px 11px;break-inside:avoid;background:#fff}
.box h4{margin:0 0 4px;font:500 11pt "Playfair Display",serif;color:var(--ink)}
.box ul{margin:0;padding-left:13px;font-size:8.5pt;line-height:1.38}
.box li{margin-bottom:2px}.box li::marker{color:var(--lacquer)}
.lex{break-inside:avoid;background:var(--lotus-50);border-radius:12px;padding:9px 14px;margin-top:8px}
.lex h4{margin:0;font:500 11pt "Playfair Display",serif;color:var(--ink)}
.lex .hint{font:400 7.5pt "Be Vietnam Pro",sans-serif;color:var(--muted);margin:1px 0 5px}
.lexg{display:grid;grid-template-columns:1fr 1fr;column-gap:18px;font-size:8.5pt;line-height:1.3}
.lexg div{border-top:1px solid rgba(184,68,90,.18);padding:3px 0}
.lexg b{color:var(--ink);font-weight:600}.lexg i{color:var(--muted);font-size:8.5pt}
.lexg span{display:block;color:var(--body)}
.pg{transform-origin:top left}
.verso{break-before:page}
.verso h2{margin-top:0}
.end{margin-top:10px;text-align:center;font:26pt "First Encounter","Playfair Display",cursive;color:var(--lacquer)}
`;

const hues = ['#C8322B', '#F2A33A', '#EE7A8E', '#2F8466', '#B8893B'];

function render(lang, day, idx) {
  const c = lang.common, s = lang.sides;
  const sides = [s.table, s.codes, s.weather];
  const steps = day.steps.map((st, i) => `<li class="${st.optional ? 'opt' : ''}" style="--c:${hues[i % hues.length]}">
    <div class="t${st.time ? '' : ' soft'}">${st.time ? esc(st.time) : '·'}</div><div class="rail"></div>
    <div class="ev">${st.optional ? `<span class="tag">${esc(st.optional)}</span>` : ''}<h3>${esc(st.title)}</h3><p>${esc(st.what)}</p>
    <p class="you"><b>${esc(c.yourPart)}</b>${esc(st.you)}</p></div></li>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(c.brand)} · ${esc(day.title)}</title><style>${css}</style></head><body>
  <section class="pg">
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
  ${day.routes ? `<div class="routes"><h4>${esc(day.routes.title)}</h4><div>${day.routes.items.map(([k, v]) => `<div><b>${esc(k)}</b><p>${esc(v)}</p></div>`).join('')}</div></div>` : ''}
  <div class="boxes">${sides.map(b => `<div class="box"><h4>${esc(b.title)}</h4><ul>${b.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</div>
  <div class="lex"><h4>${esc(c.lexTitle)}</h4><div class="hint">${esc(c.lexHint)}</div><div class="lexg">
    ${c.lexicon.map(([vi, pr, tr]) => `<div><b>${esc(vi)}</b> <i>(${esc(pr)})</i><span>${esc(tr)}</span></div>`).join('')}</div></div>
  </section>
  <section class="pg verso">
  <h2><small class="label">${esc(day.dayLabel)} · ${esc(day.viTitle)}</small>${esc(c.whatHappens)}</h2>
  <ol class="tl">${steps}</ol>
  <div class="end">Trăm năm hạnh phúc</div>
  </section>
  </body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  // Largeur du contenu A4 (210 mm − 2 × 15 mm de marges) pour mesurer les hauteurs comme à l'impression.
  const page = await browser.newPage({ viewport: { width: Math.round(180 * 96 / 25.4), height: 1000 } });
  await page.emulateMedia({ media: 'print' });
  for (const lang of Object.values(content)) {
    for (const [i, day] of lang.days.entries()) {
      const out = path.join(__dirname, `guide-${lang.file}-${i + 1}-${day.slug}.pdf`);
      const html = path.join(__dirname, '.tmp.html');
      fs.writeFileSync(html, render(lang, day, i));
      await page.goto('file://' + html, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      // Recto-verso : chaque section doit tenir sur une page A4 (contenu ≈ 269 mm) ; sinon on la réduit.
      const zooms = await page.evaluate(() => {
        const max = 269 * 96 / 25.4 - 4;
        return [...document.querySelectorAll('.pg')].map(el => {
          const z = Math.min(1, max / el.scrollHeight);
          if (z < 1) el.style.zoom = z;
          return z.toFixed(2);
        });
      });
      await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true,
        displayHeaderFooter: true, headerTemplate: '<span></span>',
        footerTemplate: `<div style="width:100%;font:7pt sans-serif;color:#7A5A52;text-align:center">${esc(lang.common.footer)} · <span class="pageNumber"></span>/<span class="totalPages"></span></div>` });
      fs.unlinkSync(html);
      console.log('✓', path.relative(root, out), 'zoom', zooms.join(' / '));
    }
  }
  await browser.close();
})();
