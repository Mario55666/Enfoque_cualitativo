// Construye las figuras isométricas y las inserta en ../index2.html.
// Uso: node figuras-iso/build.mjs   (desde «Web ver universal»)
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { k, THEME_CSS, RUNTIME } from "./lib.mjs";
import * as fig3 from "./fig3.mjs";
import * as fig4 from "./fig4.mjs";
import * as fig5 from "./fig5.mjs";
import * as fig7 from "./fig7.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const PAGE = join(HERE, "..", process.argv[2] || "index2.html");
let html = readFileSync(PAGE, "utf8");

// datos de la página que fijan la geometría
const sizesSrc = html.match(/const SIZES=(\[[\s\S]*?\n\]);/);
if (!sizesSrc) throw new Error("No se encontró SIZES en la página");
const SIZES = Function(`return ${sizesSrc[1]}`)();

const critSrc = html.match(/const CRIT_BASE=(\[.*?\]);\n/);
if (!critSrc) throw new Error("No se encontró CRIT_BASE en la página");
const CRIT_BASE = Function(`return ${critSrc[1]}`)();

const figs = { 3: fig3.build(), 4: fig4.build(), 5: fig5.build(CRIT_BASE), 7: fig7.build(SIZES) };

// reemplaza un bloque entre marcadores; la primera vez, reemplaza el elemento original
function block(name, content, locate) {
  const open = `<!-- ISO:${name} -->`, close = `<!-- /ISO:${name} -->`;
  const i = html.indexOf(open);
  if (i >= 0) {
    const j = html.indexOf(close, i);
    html = html.slice(0, i) + open + content + close + html.slice(j + close.length);
    return;
  }
  const [a, b] = locate();
  html = html.slice(0, a) + open + content + close + html.slice(b);
}
const figureAround = (marker) => () => {
  const pos = html.indexOf(marker);
  if (pos < 0) throw new Error(`No se encontró ${marker}`);
  return [html.lastIndexOf("<figure", pos), html.indexOf("</figure>", pos) + "</figure>".length];
};

const css = k.ISO_CSS + THEME_CSS + Object.values(figs).map((f) => f.css).join("");
block("css", `<style id="iso-css">${css}</style>`, () => {
  const at = html.indexOf("</style>") + "</style>".length;
  return [at, at];
});
block("fig3", figs[3].html, figureAround('aria-label="Cinco pasos: segmentación'));
block("fig4", figs[4].html, figureAround('id="figProb"'));
block("fig5", figs[5].html, figureAround('id="figCrit"'));
block("fig7", figs[7].html, figureAround('id="figSize"'));
block("live", `<script id="iso-live">${RUNTIME}${Object.values(figs).map((f) => f.live).join("")}</script>\n`, () => {
  const at = html.indexOf("<script>\nconst $=");
  if (at < 0) throw new Error("No se encontró el script principal");
  return [at, at];
});

// el script principal delega en las figuras nuevas
const hook = (fn, call) => {
  const head = `function ${fn}(){`;
  const guard = `${head}if(typeof ISOF!=="undefined"&&ISOF.${call}){ISOF.${call}.update();return}`;
  if (!html.includes(guard)) html = html.replace(head, guard);
};
html = html.replace(/if\(window\.isoFig\d\)\{isoFig\d\.update\(\);return\}/g, "");
hook("renderSizeChart", "f7");
hook("renderCrit", "f5");
hook("renderProb", "f4");
html = html.replace('if($("figCrit"))renderCrit();', 'if($("figCrit")||$("isoFig5"))renderCrit();');
html = html.replace('if($("figProb"))renderProb();', 'if($("figProb")||$("isoFig4"))renderProb();');
html = html.replace('document.querySelectorAll("figure.fig,.hero,.timeline")', 'document.querySelectorAll("figure.fig:not(.iso-fig),.hero,.timeline")');

// la página se sirve sin cabecera: sin estas líneas, un servidor local muestra mal los acentos
// y el móvil la maqueta a 980 px
const HEAD = '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n';
html = HEAD + html.replace(/^<meta charset="utf-8">\n(<meta name="viewport"[^>]*>\n)?/, "");

writeFileSync(PAGE, html);
console.log("escrito", PAGE, (html.length / 1024).toFixed(1) + " KB");
