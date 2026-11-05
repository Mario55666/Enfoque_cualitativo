// Utilidades comunes de las figuras isométricas (kit «anatomy»).
import * as k from "file:///C:/Users/Mario/.claude/skills/anatomy/kit/iso-kit.mjs";

export { k };

export const S = (paths, style) => k.solidSvg(paths, style);
export const L = (d, style) => k.lineSvg(d, style);
export const D = (points, style) => k.dotsSvg(points, style);

export const byDepth = (P, list, at = (o) => o) =>
  [...list].sort((a, b) => k.depthOf(at(a), P) - k.depthOf(at(b), P));

// placa base sobre patas, con ranura, tornillos y halo (receta de craft.md)
export function basePlate(P, PLATE, { h = 10, foot = 4, footInset = 22 } = {}) {
  const at = (p) => k.iso(p, P);
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -h - foot, h, P)}"/>`];
  const feet = byDepth(P, k.corners(PLATE, footInset), ([x, y]) => [x, y, 0]);
  for (const [x, y] of feet) {
    out.push(S(k.cylinder(x, y, 6.4, -h - foot, 1.4, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5, -h - foot + 1.4, foot - 1.4, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -h, h, P, 8, 1.4), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  return out.join("");
}

// placa de identificación con tres líneas de texto simuladas
export function labelPlate(P, plan, z = 0) {
  const out = [S(k.slabOf(plan, z, 0.8, P, 3), { tone: "lo", crease: "none" })];
  out.push(L(k.planOutline(k.insetPlan(plan, 1.4), z + 0.8, P, 3), { tone: "faint" }));
  const x0 = plan.x + 3.4, w = plan.w - 6.8;
  [0.3, 0.52, 0.74].forEach((f, i) => {
    const y = plan.y + plan.d * f;
    out.push(L(k.lineOnTop([x0, y], [x0 + w * [0.9, 0.62, 0.78][i], y], z + 0.8, P), { tone: "lo", free: true }));
  });
  return out.join("");
}

// cara plana cualquiera en 3D, sombreada según hacia dónde mira
export function face(P, pts, { shade = 2, top = false, edge = "lo" } = {}) {
  const d = k.pathOf(pts.map((p) => k.iso(p, P)), true);
  const cls = top ? `class="iso-top"` : `class="iso-shade" data-shade="${shade}"`;
  return `<path class="iso-fill" d="${d}"/><path ${cls} d="${d}"/><path class="iso-line" data-tone="${edge}" d="${d}"/>`;
}

// texto grabado en la cara frontal (+y) de un bloque
export const frontText = (P, x, y, z, text, { size = 3.6, tone = "mid", anchor = "start" } = {}) =>
  k.faceTextSvg(k.sideMatrix([x, y], z, P, "left"), text, { size, tone, anchor });

// texto grabado sobre una cara superior
export const topText = (P, x, y, z, text, { size = 3.2, tone = "mid", anchor = "middle" } = {}) =>
  k.faceTextSvg(k.topMatrix([x, y], z, P, "x"), text, { size, tone, anchor });

export const tr = (P, by) => k.translateAlong(P, by);
export const round = (v, n = 2) => Math.round(v * 10 ** n) / 10 ** n;

// esquinas de la tarjeta y la leyenda, con los nombres de la página
export function plateMarkup({ id, fig, title, hint, readout, label, body, keys = [], caption, width, height, stage = "" }) {
  const svg = `<svg class="iso-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">${body}</svg>`;
  const keyHtml = keys.length
    ? `<div class="iso-keys" role="group" aria-label="Partes de la figura">${keys.map((key) => `<button type="button" class="iso-key"${key.data ? ` data-key="${key.data}"` : ""}><span class="iso-swatch" data-mark="${key.mark}"></span>${key.label}</button>`).join("")}</div>`
    : "";
  return `<figure class="fig iso-fig" id="${id}">
      <div class="iso iso-plate">
        <div class="iso-plate-corners" aria-hidden="true"><span class="iso-plate-corner" data-corner="fig">${fig}</span><span class="iso-plate-corner" data-corner="title">${title}</span><span class="iso-plate-corner" data-corner="hint">${hint}</span></div>
        <div class="scroll"><div class="iso-stage"${stage}>${svg}</div></div>
        <p class="iso-readout" data-readout aria-live="polite">${readout}</p>
      </div>
      ${keyHtml}
      <figcaption>${caption}</figcaption></figure>`;
}

// estilos: el kit, con sus tonos derivados de los tokens de la página
export const THEME_CSS = `
.iso-fig .iso{
  --anatomy-card:var(--surface);--anatomy-paper:var(--surface);--anatomy-text:var(--muted);--anatomy-strong:var(--ink);--anatomy-muted:var(--muted);
  --anatomy-face:var(--surface);--anatomy-top:var(--surface);
  --anatomy-shade-0:color-mix(in srgb,var(--surface) 80%,var(--ink));--anatomy-shade-1:color-mix(in srgb,var(--surface) 85%,var(--ink));
  --anatomy-shade-2:color-mix(in srgb,var(--surface) 90%,var(--ink));--anatomy-shade-3:color-mix(in srgb,var(--surface) 95%,var(--ink));
  --anatomy-lit-top:color-mix(in srgb,var(--accent-soft) 70%,var(--surface));--anatomy-lit-shade:color-mix(in srgb,var(--accent-soft) 82%,var(--accent));
  --anatomy-hi:var(--ink);--anatomy-mid:color-mix(in srgb,var(--muted) 78%,var(--surface));--anatomy-lo:color-mix(in srgb,var(--muted) 46%,var(--surface));
  --anatomy-faint:color-mix(in srgb,var(--muted) 24%,var(--surface));--anatomy-lit:var(--accent);
  --anatomy-halo:var(--ink);--anatomy-halo-opacity:.16;--anatomy-dot:var(--ink);
  --anatomy-mono:var(--f-mono);--anatomy-weight:.6px;
  --iso-warn:var(--warn);--iso-c1:var(--accent);--iso-c2:var(--node);--iso-c3:var(--ok);
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .iso-fig .iso{
  --anatomy-face:color-mix(in srgb,var(--surface) 93%,var(--ink));--anatomy-top:color-mix(in srgb,var(--surface) 90%,var(--ink));
  --anatomy-shade-0:color-mix(in srgb,var(--surface) 66%,#000);--anatomy-shade-1:color-mix(in srgb,var(--surface) 74%,#000);
  --anatomy-shade-2:color-mix(in srgb,var(--surface) 82%,#000);--anatomy-shade-3:color-mix(in srgb,var(--surface) 90%,#000);
  --anatomy-lit-top:color-mix(in srgb,var(--accent-soft) 80%,var(--accent));--anatomy-lit-shade:var(--accent-soft);
  --anatomy-mid:color-mix(in srgb,var(--muted) 70%,var(--surface));--anatomy-lo:color-mix(in srgb,var(--muted) 42%,var(--surface));
  --anatomy-faint:color-mix(in srgb,var(--muted) 22%,var(--surface));--anatomy-halo:#000;--anatomy-halo-opacity:.7}}
:root[data-theme="dark"] .iso-fig .iso{
  --anatomy-face:color-mix(in srgb,var(--surface) 93%,var(--ink));--anatomy-top:color-mix(in srgb,var(--surface) 90%,var(--ink));
  --anatomy-shade-0:color-mix(in srgb,var(--surface) 66%,#000);--anatomy-shade-1:color-mix(in srgb,var(--surface) 74%,#000);
  --anatomy-shade-2:color-mix(in srgb,var(--surface) 82%,#000);--anatomy-shade-3:color-mix(in srgb,var(--surface) 90%,#000);
  --anatomy-lit-top:color-mix(in srgb,var(--accent-soft) 80%,var(--accent));--anatomy-lit-shade:var(--accent-soft);
  --anatomy-mid:color-mix(in srgb,var(--muted) 70%,var(--surface));--anatomy-lo:color-mix(in srgb,var(--muted) 42%,var(--surface));
  --anatomy-faint:color-mix(in srgb,var(--muted) 22%,var(--surface));--anatomy-halo:#000;--anatomy-halo-opacity:.7}
.iso-fig .iso-plate{position:relative;padding:0 2px 4px;background:transparent;box-shadow:none}
.iso-fig .iso-plate-corners{position:static;display:flex;flex-wrap:wrap;justify-content:space-between;gap:2px 14px;margin-bottom:4px}
.iso-fig .iso-plate-corner{position:static;font-size:11px;white-space:normal}
.iso-fig .iso-plate-corner[data-corner="hint"]{order:3;flex-basis:100%;text-transform:none;letter-spacing:.02em}
.iso-fig .iso-readout{margin:6px 0 0;text-align:right;font-family:var(--f-mono);font-size:12px;color:var(--ink);font-variant-numeric:tabular-nums;min-height:1.5em}
.iso-fig .scroll>.iso-stage{min-width:640px}
.iso-fig .iso-stage{outline:none;border-radius:6px}
.iso-fig .iso-stage:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.iso-fig svg.iso-svg{display:block;width:100%;height:auto}
.iso-fig .iso-keys{display:flex;flex-wrap:wrap;gap:6px 8px;margin:10px 0 0}
.iso-fig .iso-key{display:inline-flex;align-items:center;gap:7px;font:inherit;font-size:12.5px;font-weight:500;color:var(--muted);background:var(--bg);border:1px solid var(--line);border-radius:99px;padding:4px 10px;cursor:pointer}
.iso-fig .iso-key:hover,.iso-fig .iso-key[aria-pressed="true"]{color:var(--accent);border-color:var(--accent);background:var(--accent-soft);filter:none}
.iso-fig .iso-key .iso-swatch{width:12px;height:8px;border-radius:2px;background:var(--anatomy-mid,var(--muted))}
.iso-fig .iso-key .iso-swatch[data-mark="lit"]{background:var(--accent)}
.iso-fig .iso-key .iso-swatch[data-mark="warn"]{background:var(--warn)}
.iso-fig .iso-key .iso-swatch[data-mark="c1"]{background:var(--accent)}
.iso-fig .iso-key .iso-swatch[data-mark="c2"]{background:var(--node)}
.iso-fig .iso-key .iso-swatch[data-mark="c3"]{background:var(--ok)}
.iso-fig .iso-key .iso-swatch[data-mark="flat"]{background:var(--line)}
.iso-fig figcaption{margin-top:10px}
.iso-svg .iso-line[data-tone="warn"]{stroke:var(--iso-warn)}
.iso-svg .iso-hit{fill:transparent;cursor:pointer;outline:none}
.iso-svg .iso-hit:focus-visible{stroke:var(--accent);stroke-width:1.2;fill:color-mix(in srgb,var(--accent) 6%,transparent)}
.iso-svg .iso-c1>.iso-top,.iso-svg .iso-c1>.iso-shade{fill:var(--iso-c1)}
.iso-svg .iso-c2>.iso-top,.iso-svg .iso-c2>.iso-shade{fill:var(--iso-c2)}
.iso-svg .iso-c3>.iso-top,.iso-svg .iso-c3>.iso-shade{fill:var(--iso-c3)}
.iso-svg .iso-glass>.iso-fill{fill:color-mix(in srgb,var(--accent-soft) 40%,transparent)}
.iso-svg .iso-glass>.iso-top,.iso-svg .iso-glass>.iso-shade{fill:color-mix(in srgb,var(--accent) 10%,transparent)}
.iso-svg [data-fade]{transition:opacity .45s ease}
@media (prefers-reduced-motion:reduce){.iso-svg [data-fade]{transition:none}}
`;

// motor en vivo común: proyección, transformaciones y bucle que solo corre en pantalla
export const RUNTIME = `
const ISOF={};
const ISO=(()=>{
  const RAD=Math.PI/180,UNIT=Math.sqrt(1.6);
  const cam=P=>{const a=(P.azimuth??45)*RAD,e=(P.elevation??30)*RAD;return{sinA:Math.sin(a),cosA:Math.cos(a),sinE:Math.sin(e),cosE:Math.cos(e),k:P.scale*UNIT}};
  const iso=([x,y,z],P)=>{const{sinA,cosA,sinE,cosE,k}=cam(P);return[P.origin[0]+(x*sinA-y*cosA)*k,P.origin[1]+((x*cosA+y*sinA)*sinE-z*cosE)*k]};
  const vec=(P,by)=>{const o=iso([0,0,0],P),m=iso(by,P);return[m[0]-o[0],m[1]-o[1]]};
  const f2=v=>Math.round(v*100)/100,t1=v=>Math.round(v*10)/10;
  const tr=(P,by)=>{const[x,y]=vec(P,by);return"translate("+f2(x)+" "+f2(y)+")"};
  const path=(pts,closed)=>pts.map(([x,y],i)=>(i?"L":"M")+t1(x)+" "+t1(y)).join("")+(closed?"Z":"");
  const onTop=(pts,z,P,closed)=>path(pts.map(([x,y])=>iso([x,y,z],P)),closed);
  const still=matchMedia("(prefers-reduced-motion: reduce)");
  const follow=(c,t,dt,s,calm)=>calm?t:c+(t-c)*(1-Math.exp(-dt/s));
  const ease=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
  function loop(stage,tick){
    let frame=0,last=0,visible=false;
    function step(now){const dt=last?Math.min((now-last)/1000,1/30):1/60;last=now;const more=tick(dt,still.matches);frame=visible&&more?requestAnimationFrame(step):0;}
    const run=()=>{if(!frame&&visible){last=0;frame=requestAnimationFrame(step)}};
    if("IntersectionObserver"in window)new IntersectionObserver(es=>{visible=es[es.length-1].isIntersecting;if(visible)run()},{rootMargin:"80px 0px"}).observe(stage);else{visible=true;run()}
    return run;
  }
  const svgEl=(tag,attrs)=>{const el=document.createElementNS("http://www.w3.org/2000/svg",tag);for(const a in attrs)el.setAttribute(a,attrs[a]);return el};
  return{iso,vec,tr,path,onTop,still,follow,ease,loop,svgEl};
})();
`;
