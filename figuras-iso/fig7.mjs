// Figura 7 · Banco de calibres: una pista por tradición sobre una regla logarítmica,
// mordazas en el mínimo y el máximo, banda clara para el rango ampliado y un cursor en el n previsto.
import { k, S, L, D, basePlate, labelPlate, frontText, plateMarkup, round } from "./lib.mjs";

export function build(SIZES) {
  const W = 760, H = 246, AZ = 90, EL = 40;
  const N = SIZES.length, PITCH = 19;
  const X0 = -150, LEN = 330, X1 = X0 + LEN;
  const lx = (v) => X0 + (Math.log(v) / Math.log(70)) * LEN;
  const yRow = (i) => -((N - 1) / 2) * PITCH + i * PITCH;
  const NAME = { x: -258, w: 96 };
  const RAIL = { x: -160, w: 350 };
  const RULER = { x: -160, y: yRow(N - 1) + 11, w: 350, d: 9, r: 1, h: 5 };
  const BACK = { x: -160, y: yRow(0) - 17, w: 350, d: 7, r: 1.4, h: 7 };
  const PLATE = { x: -270, y: BACK.y - 8, w: 492, d: RULER.y + RULER.d + 8 - (BACK.y - 8), r: 8 };
  const GLASS_Z = 10.8;

  const P = k.fitProjection([...k.boxCorners(PLATE, -14, 0), [RAIL.x, BACK.y, 12], [RAIL.x + RAIL.w, RULER.y + RULER.d, 12]], W, H, { pad: 10, azimuth: AZ, elevation: EL });
  const at = (p) => k.iso(p, P);

  const v = (x, y, z = 0) => { const [a, b] = k.axisVector(P, [x, y, z]); return `translate(${round(a)} ${round(b)})`; };
  const defs = [
    `<g id="iso7-rail">${S(k.slabOf({ x: RAIL.x, y: -2.2, w: RAIL.w, d: 4.4, r: 1 }, 0, 3, P, 3, 0.3), { tone: "mid" })}</g>`,
    `<g id="iso7-stop">${S(k.slabOf({ x: RAIL.x + RAIL.w - 6, y: -4, w: 6, d: 8, r: 1.2 }, 0, 7, P, 3, 0.4), { tone: "mid" })}${D([at([RAIL.x + RAIL.w - 3, 0, 7])], { size: 0.45 })}</g>`,
    `<g id="iso7-jaw">${S(k.slabOf({ x: -2.2, y: -6, w: 4.4, d: 12, r: 0.9 }, 3, 7, P, 2, 0.4), { tone: "mid" })}${L(k.ring(0, 3, 1.2, 10, P, 12), { tone: "lo" })}${D([at([0, 3, 10])], { size: 0.5 })}</g>`,
  ];
  const out = [basePlate(P, PLATE, { h: 9, foot: 4, footInset: 26 })];
  out.push(labelPlate(P, { x: PLATE.x + 12, y: RULER.y - 2, w: 70, d: 13, r: 1.4 }));

  // carril trasero del cursor y su carro (va antes que las pistas)
  out.push(S(k.slabOf(BACK, 0, BACK.h, P, 3, 0.6), { tone: "lo", inner: L(k.sideSeam(BACK, 3.5, P, 3), { tone: "faint" }) }));
  out.push(L(k.lineOnTop([BACK.x, BACK.y + BACK.d / 2], [BACK.x + BACK.w, BACK.y + BACK.d / 2], BACK.h, P), { tone: "faint" }));
  out.push(D([RAIL.x + 5, RAIL.x + RAIL.w - 5].map((x) => at([x, BACK.y + 1.6, BACK.h])), { size: 0.45 }));
  const carBack = { x: -5, y: BACK.y - 1.6, w: 10, d: 10.2, r: 1.4 };
  const cursorBack = [
    S(k.slabOf(carBack, BACK.h, GLASS_Z - BACK.h, P, 3, 0.4), { tone: "mid" }),
    D([at([0, BACK.y + BACK.d / 2 + 1.6, GLASS_Z])], { size: 0.45 }),
  ].join("");
  out.push(`<g data-part="curB" data-fade style="opacity:.45">${cursorBack}</g>`);

  const rows = [];
  SIZES.forEach((s, i) => {
    const y = yRow(i);
    const g = [];
    // bloque con el nombre grabado
    const name = { x: NAME.x, y: y - 4, w: NAME.w, d: 8, r: 1.4 };
    g.push(`<g data-name>${S(k.slabOf(name, 0, 6, P, 3, 0.5), { tone: "mid" })}</g>`);
    g.push(frontText(P, name.x + name.w - 3, name.y + name.d, 1.5, s.c, { size: 4.2, tone: "hi", anchor: "end" }));
    g.push(D([at([name.x + 3.4, y, 6])], { size: 0.45 }));
    // riel
    g.push(`<use href="#iso7-rail" transform="${v(0, y)}"/>`);
    const stop = { x: RAIL.x + RAIL.w - 6, y: y - 4, w: 6, d: 8, r: 1.2 };
    let moving = "";
    if (s.min == null) {
      // va del extremo del riel a la cara del tope (ambos dibujados con <use>, que el control de líneas no ve)
      g.push(L(k.lineOnTop([RAIL.x, y], [stop.x, y], 3, P), { tone: "lo", dotted: true, free: true }));
    } else {
      const e = s.ext || [s.min, s.max];
      if (s.ext) {
        const band = { x: lx(e[0]) - 2.2, y: y - 2.1, w: lx(e[1]) - lx(e[0]) + 4.4, d: 4.2, r: 2 };
        g.push(`<path class="iso-ext" d="${k.onTop(k.ringOf(band, 4), 3, P, true)}"/>`);
      }
      const jaw = (x) => `<use href="#iso7-jaw" transform="${v(x, y)}"/>`;
      const a = lx(s.min), b = lx(s.max);
      const sleeve = { x: a + 2.2, y: y - 4, w: b - a - 4.4, d: 8, r: 2.6 };
      moving =
        `<g data-jaw="a" data-x="${round(a)}">${jaw(a)}</g>` +
        `<g data-sleeve>${S(k.slabOf(sleeve, 3, 4.4, P, 4, 0.5), { tone: "mid", className: "iso-range" })}</g>` +
        `<g data-jaw="b" data-x="${round(b)}">${jaw(b)}</g>`;
    }
    g.push(moving);
    g.push(`<use href="#iso7-stop" transform="${v(0, y)}"/>`);
    rows.push(`<g data-row="${s.k}" data-i="${i}">${g.join("")}</g>`);
  });
  out.push(...rows);

  // regla logarítmica con números grabados en su cara frontal
  out.push(S(k.slabOf(RULER, 0, RULER.h, P, 3, 0.5), { tone: "mid" }));
  const minor = [], major = [];
  const MAJ = [1, 2, 3, 5, 10, 20, 30, 50];
  for (const v of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70]) {
    const x = lx(v), big = MAJ.includes(v);
    (big ? major : minor).push(k.lineOnTop([x, RULER.y], [x, RULER.y + (big ? 4.4 : 2.4)], RULER.h, P));
  }
  out.push(L(minor.join(""), { tone: "lo" }), L(major.join(""), { tone: "hi" }));
  MAJ.forEach((v) => out.push(frontText(P, lx(v), RULER.y + RULER.d, 1.1, String(v), { size: 3.8, tone: "hi", anchor: "middle" })));
  out.push(D([RULER.x + 3, RULER.x + RULER.w - 3].map((x) => at([x, RULER.y + 6.5, RULER.h])), { size: 0.45 }));

  // marcas de lectura (se escriben en vivo)
  out.push(`<g data-part="marks"></g>`);

  // carro delantero, vidrio y línea del cursor
  const carFront = { x: -4, y: RULER.y - 2, w: 8, d: 12.5, r: 1.2 };
  const glass = { x: -3.2, y: BACK.y + 0.6, w: 6.4, d: RULER.y + 8 - (BACK.y + 0.6), r: 1.6 };
  const cursorFront = [
    S(k.slabOf(carFront, RULER.h, GLASS_Z - RULER.h, P, 3, 0.4), { tone: "mid" }),
    S(k.slabOf(glass, GLASS_Z, 1.1, P, 4, 0.3), { tone: "lo", className: "iso-glass", crease: "none" }),
    `<path class="iso-line" data-tone="warn" style="stroke-width:1.1" d="${k.lineOnTop([0, glass.y], [0, glass.y + glass.d], GLASS_Z + 1.1, P)}"/>`,
    D([at([0, RULER.y + 8.8, GLASS_Z + 1.1])], { size: 0.5, tone: "hi" }),
  ].join("");
  out.push(`<g data-part="curF" data-fade style="opacity:.45">${cursorFront}</g>`);

  // zonas sensibles de cada pista
  SIZES.forEach((s, i) => {
    const y = yRow(i);
    const quad = [[NAME.x, y - 8.5, 4], [RAIL.x + RAIL.w, y - 8.5, 4], [RAIL.x + RAIL.w, y + 8.5, 4], [NAME.x, y + 8.5, 4]].map(at);
    out.push(`<path class="iso-hit" data-hit="${s.k}" role="button" tabindex="0" aria-label="${s.c}" d="${k.pathOf(quad, true)}"/>`);
  });

  const geo = { P, N, X0, LEN, rows: SIZES.map((s, i) => ({ k: s.k, y: yRow(i), min: s.min, max: s.max, ext: s.ext || null })), RAIL, GLASS_Z, top: 7.4 };
  const html = plateMarkup({
    id: "isoFig7",
    fig: "Fig. 7",
    title: "Banco de calibres de tamaño",
    hint: "Pase el cursor sobre la escala · clic en una pista para elegir el diseño",
    readout: "",
    label: "Banco de calibres: una pista por tradición sobre una regla logarítmica de 1 a 70 casos. En cada pista, dos mordazas marcan el mínimo y el máximo del rango; una banda clara indica el rango ampliado. Un cursor con línea naranja señala el tamaño previsto.",
    width: W,
    height: H,
    body: `<defs>${defs.join("")}</defs>` + out.join(""),
    keys: [
      { mark: "c1", label: "Manguito entre mordazas: rango de la tabla" },
      { mark: "flat", label: "Banda clara: rango ampliado" },
      { mark: "warn", label: "Cursor: tamaño previsto" },
      { mark: "lit", label: "Pista resaltada: diseño elegido" },
    ],
    caption: `<b>Figura 7.</b> Tamaño mínimo y máximo por tradición (escala logarítmica). Manguito entre mordazas: rango de la tabla; banda clara: rango ampliado (fenomenología: 5–25 según Polkinghorne, y teoría fundamentada: hasta 60, ambos en Creswell y Poth, 2024; grupos de enfoque: 6–12 según Barraza, 2023, p. 56). El cursor marca el tamaño previsto; al pasar el puntero sobre la escala muestra qué rangos contienen cada valor. Haga clic en una pista para elegir el diseño.`,
  });

  const css = `
.iso-svg .iso-range>.iso-top{fill:color-mix(in srgb,var(--accent) 58%,var(--surface))}
.iso-svg .iso-range>.iso-shade{fill:color-mix(in srgb,var(--accent) 74%,var(--surface))}
.iso-svg .iso-range>.iso-shade[data-shade="0"],.iso-svg .iso-range>.iso-shade[data-shade="1"]{fill:color-mix(in srgb,var(--accent) 88%,var(--surface))}
.iso-svg .iso-range>.iso-edge{stroke:color-mix(in srgb,var(--accent) 80%,var(--ink))}
.iso-svg [data-row][data-on] .iso-range>.iso-top{fill:var(--accent)}
.iso-svg [data-row][data-on] .iso-range>.iso-shade{fill:color-mix(in srgb,var(--accent) 82%,var(--ink))}
.iso-svg .iso-ext{fill:color-mix(in srgb,var(--accent) 26%,var(--surface));stroke:color-mix(in srgb,var(--accent) 55%,var(--surface));stroke-width:.6}
.iso-svg [data-row][data-on] [data-name]>.iso-solid>.iso-top{fill:var(--anatomy-lit-top)}
.iso-svg .iso-mark{fill:var(--warn);stroke:var(--surface);stroke-width:.8}
.iso-svg .iso-mark[data-in="ext"]{fill:var(--surface);stroke:var(--warn);stroke-width:1}
`;

  const live = `
(function(){
  const fig=document.getElementById("isoFig7");if(!fig)return;
  const G=${JSON.stringify(geo)},P=G.P,svg=fig.querySelector("svg"),stage=fig.querySelector(".iso-stage"),readout=fig.querySelector("[data-readout]");
  const lx=v=>G.X0+Math.log(v)/Math.log(70)*G.LEN, vOf=x=>Math.exp((x-G.X0)/G.LEN*Math.log(70));
  const rowsEl=[...svg.querySelectorAll("[data-row]")], marks=svg.querySelector('[data-part="marks"]');
  const curB=svg.querySelector('[data-part="curB"]'),curF=svg.querySelector('[data-part="curF"]');
  const jaws=[...svg.querySelectorAll("[data-jaw]")].map(el=>({el,side:el.dataset.jaw,x:+el.dataset.x,row:+el.closest("[data-row]").dataset.i}));
  const sleeves=[...svg.querySelectorAll("[data-sleeve]")];
  let cx=lx(1),target=cx,preview=null,intro=1,shown=false,t0=0;
  const S=ISOF.f7={};
  const fmt=v=>v>=10?String(Math.round(v)):String(Math.round(v*10)/10).replace(".",",");
  function text(){
    const n=parseInt(document.getElementById("nPrev").value,10)||0,cur=document.getElementById("diseno").value,r=G.rows.find(q=>q.k===cur),z=SIZES.find(q=>q.k===cur);
    if(preview!=null){const v=preview,inn=G.rows.filter(q=>q.min!=null&&v>=q.min&&v<=q.max).map(q=>SIZES.find(s=>s.k===q.k).c),ext=G.rows.filter(q=>q.ext&&(v<q.min||v>q.max)&&v>=q.ext[0]&&v<=q.ext[1]).map(q=>SIZES.find(s=>s.k===q.k).c);
      return "Cursor en "+fmt(v)+": "+(inn.length?"dentro de "+inn.join(", "):"ningún rango de la tabla")+(ext.length?" · ampliado: "+ext.join(", "):"");}
    if(!r||!z)return"";
    if(r.min==null)return z.c+": sin rango fijo"+(n?" · n previsto = "+n:"");
    const inside=n>=r.min&&n<=r.max,inExt=r.ext&&n>=r.ext[0]&&n<=r.ext[1];
    return z.c+": "+r.min+"–"+r.max+(r.ext?" (ampliado "+r.ext[0]+"–"+r.ext[1]+")":"")+(n?" · n previsto = "+n+", "+(inside?"dentro del rango":inExt?"solo en el rango ampliado":"fuera del rango"):" · indique el tamaño previsto");
  }
  function drawMarks(v){
    marks.replaceChildren();if(v==null)return;
    G.rows.forEach(r=>{if(r.min==null)return;let z=null,kind="";
      if(v>=r.min&&v<=r.max){z=G.top;kind="in"}else if(r.ext&&v>=r.ext[0]&&v<=r.ext[1]){z=3;kind="ext"}
      if(z==null)return;const[x,y]=ISO.iso([lx(v),r.y,z],P);marks.append(ISO.svgEl("circle",{cx:x.toFixed(1),cy:y.toFixed(1),r:kind==="in"?1.9:1.6,class:"iso-mark","data-in":kind}));});
  }
  function draw(){
    const t=ISO.tr(P,[cx,0,0]);curB.setAttribute("transform",t);curF.setAttribute("transform",t);
    const e=ISO.ease(intro);
    jaws.forEach(j=>{const local=ISO.ease(Math.max(0,Math.min(1,intro*1.6-j.row*0.07))),from=j.side==="a"?G.X0:G.X0+G.LEN;j.el.setAttribute("transform",ISO.tr(P,[(from-j.x)*(1-local),0,0]))});
    sleeves.forEach((el,i)=>el.style.opacity=String(e<1?Math.max(0,intro*1.6-0.6-i*0.05):1));
    const n=parseInt(document.getElementById("nPrev").value,10)||0;
    drawMarks(preview!=null?preview:(n?Math.min(70,Math.max(1,n)):null));
    const txt=text();if(readout.textContent!==txt)readout.textContent=txt;
  }
  const run=ISO.loop(stage,(dt,calm)=>{
    if(!shown){shown=true;t0=performance.now();intro=calm?1:0}
    if(intro<1)intro=calm?1:Math.min(1,(performance.now()-t0)/1600);
    cx=ISO.follow(cx,target,dt,0.22,calm);if(Math.abs(cx-target)<0.02)cx=target;
    draw();return intro<1||cx!==target;
  });
  S.update=function(){
    const cur=document.getElementById("diseno").value,n=parseInt(document.getElementById("nPrev").value,10)||0;
    rowsEl.forEach(el=>el.toggleAttribute("data-on",el.dataset.row===cur));
    svg.querySelectorAll("[data-hit]").forEach(h=>h.setAttribute("aria-pressed",String(h.dataset.hit===cur)));
    const on=preview!=null||n>0;curB.style.opacity=curF.style.opacity=on?"1":".45";
    if(preview==null)target=n?lx(Math.min(70,Math.max(1,n))):G.X0;
    draw();run();
  };
  svg.querySelectorAll("[data-hit]").forEach(h=>{const pick=()=>{document.getElementById("diseno").value=h.dataset.hit;renderGauge();save()};h.addEventListener("click",pick);h.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();pick()}})});
  stage.addEventListener("pointermove",e=>{const b=svg.getBoundingClientRect(),vb=svg.viewBox.baseVal,sx=(e.clientX-b.left)/b.width*vb.width,sy=(e.clientY-b.top)/b.height*vb.height;
    const o=ISO.iso([0,0,G.top],P),u=ISO.vec(P,[1,0,0]),w=ISO.vec(P,[0,1,0]),det=u[0]*w[1]-u[1]*w[0],dx=sx-o[0],dy=sy-o[1],X=(dx*w[1]-dy*w[0])/det;
    if(X<G.X0-6||X>G.X0+G.LEN+4){if(preview!=null){preview=null;S.update()}return}
    const xc=Math.max(G.X0,Math.min(G.X0+G.LEN,X));preview=Math.max(1,Math.min(70,vOf(xc)));target=xc;S.update();});
  stage.addEventListener("pointerleave",()=>{preview=null;S.update()});
})();
`;
  return { html, css, live };
}
