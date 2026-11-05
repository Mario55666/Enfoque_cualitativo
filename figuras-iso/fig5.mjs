// Figura 5 · Rieles de casos: cada riel es el continuo de una categoría, con 15 casos;
// los émbolos levantan los casos que cada criterio incorpora. El riel delantero muestra
// el tipo de muestra elegido en el árbol de decisión.
import { k, S, L, D, basePlate, labelPlate, frontText, plateMarkup, round } from "./lib.mjs";

export function build(CRIT_BASE) {
  const W = 760, H = 215, AZ = 90, EL = 46;
  const NP = 15, X0 = -116, STEP = 20, X1 = X0 + STEP * (NP - 1);
  const px = (i) => X0 + i * STEP;
  const ROWS = CRIT_BASE.length + 1;
  const rowY = (r) => (r < CRIT_BASE.length ? -50 + r * 20 : -50 + CRIT_BASE.length * 20 + 10);
  const NAME = { x: -254, w: 110 };
  const RAIL = { x: X0 - 14, w: X1 - X0 + 28 };
  const FY = rowY(ROWS - 1);
  const RULER = { x: RAIL.x, y: FY + 13, w: RAIL.w, d: 8, r: 1 };
  const PLATE = { x: -266, y: -66, w: 476, d: RULER.y + RULER.d + 8 + 66, r: 8 };
  const LIFT = 6, PR = 3.6, PH = 4;

  const P = k.fitProjection([...k.boxCorners(PLATE, -14, 0), [X0, -50, 16], [X1, FY, 16]], W, H, { pad: 10, azimuth: AZ, elevation: EL });
  const at = (p) => k.iso(p, P);
  const out = [basePlate(P, PLATE, { h: 9, foot: 4, footInset: 26 })];
  out.push(labelPlate(P, { x: PLATE.x + 12, y: RULER.y - 3, w: 74, d: 13, r: 1.4 }));
  // banco de la selección actual (riel delantero)
  out.push(S(k.slabOf({ x: NAME.x - 4, y: FY - 9, w: RAIL.x + RAIL.w + 32 - NAME.x, d: 18, r: 2 }, 0, 1.2, P, 3, 0.3), { tone: "lo", className: "iso-sel" }));

  const v = (x, y, z = 0) => { const [a, b] = k.axisVector(P, [x, y, z]); return `translate(${round(a)} ${round(b)})`; };
  const defs = [
    ...[["", ""], ["A", "iso-pick"], ["N", "iso-pick iso-pickN"], ["AL", "iso-pick iso-pickL"], ["NL", "iso-pick iso-pickN iso-pickL"]].map(([id, cls]) =>
      `<g id="iso5-puck${id}">${S(k.cylinder(0, 0, PR, 3, PH, P, 22, 0.4), { tone: "mid", className: cls || undefined })}${D([at([0, 0, 3 + PH])], { size: 0.4, tone: "lo" })}</g>`),
    `<g id="iso5-pin">${S(k.cylinder(0, 0, 1.1, 3 - LIFT, LIFT + 0.2, P, 12), { tone: "mid", crease: "none" })}</g>`,
  ];
  for (let r = 0; r < ROWS; r++) {
    const y = rowY(r), front = r === ROWS - 1, g = [];
    const name = { x: NAME.x, y: y - 4, w: NAME.w, d: 8, r: 1.4 };
    g.push(`<g data-name>${S(k.slabOf(name, 0, 6, P, 3, 0.5), { tone: "mid" })}</g>`);
    const label = front ? "Selección actual" : CRIT_BASE[r][1];
    g.push(k.faceTextSvg(k.sideMatrix([name.x + name.w - 3, name.y + name.d], 1.6, P, "left"), label, { size: 4.2, tone: "hi", anchor: "end" }).replace("<text ", front ? '<text data-label ' : "<text "));
    g.push(D([at([name.x + 3.4, y, 6])], { size: 0.45 }));
    // riel con alojamientos
    const rail = { x: RAIL.x, y: y - 2.6, w: RAIL.w, d: 5.2, r: 1.2 };
    g.push(S(k.slabOf(rail, 0, 3, P, 3, 0.3), { tone: "mid" }));
    g.push(L(Array.from({ length: NP }, (_, i) => k.ring(px(i), y, PR + 0.5, 3, P, 18)).join(""), { tone: "faint" }));
    for (const x of [rail.x - 5, rail.x + rail.w]) {
      g.push(S(k.slabOf({ x, y: y - 4, w: 5, d: 8, r: 1 }, 0, 7, P, 2, 0.4), { tone: "mid" }));
      g.push(D([at([x + 2.5, y, 7])], { size: 0.45 }));
    }
    // émbolos (recortados por encima del riel) y casos
    const clip = `iso5-c${r}`, top = at([0, y, 3])[1];
    defs.push(`<clipPath id="${clip}"><rect x="-50" y="-50" width="${W + 100}" height="${round(top + 50)}"/></clipPath>`);
    const pins = [], pucks = [];
    for (let i = 0; i < NP; i++) {
      const x = px(i);
      pins.push(`<use href="#iso5-pin" data-pin="${i}" transform="${v(x, y)}"/>`);
      pucks.push(`<use href="#iso5-puck" data-puck="${i}" transform="${v(x, y)}"/>`);
    }
    g.push(`<g clip-path="url(#${clip})">${pins.join("")}</g>`);
    g.push(`<g data-pucks>${pucks.join("")}</g>`);
    if (front) {
      g.push(`<g data-part="chain"></g>`);
      // bandeja de voluntarios al final del riel
      const tray = { x: rail.x + rail.w + 8, y: y - 6, w: 20, d: 12, r: 2 };
      g.push(S(k.slabOf(tray, 0, 2.4, P, 3, 0.4), { tone: "mid" }));
      g.push(`<g data-part="vol" style="opacity:0">${[tray.x + 6, tray.x + 14].map((x) => S(k.cylinder(x, y, 3, 2.4, 3.2, P, 18, 0.3), { tone: "mid", className: "iso-pick" })).join("")}</g>`);
    }
    out.push(`<g data-row="${r}"${front ? " data-front" : ""}>${g.join("")}</g>`);
  }

  // regla del continuo: polo bajo, núcleo y polo alto
  out.push(S(k.slabOf(RULER, 0, 4, P, 3, 0.5), { tone: "mid" }));
  const ticks = Array.from({ length: NP }, (_, i) => k.lineOnTop([px(i), RULER.y], [px(i), RULER.y + (i === 0 || i === 7 || i === 14 ? 4.6 : 2.6)], 4, P));
  out.push(L(ticks.filter((_, i) => i % 7).join(""), { tone: "lo" }), L(ticks.filter((_, i) => !(i % 7)).join(""), { tone: "hi" }));
  out.push(frontText(P, px(0) - 2, RULER.y + RULER.d, 1.1, "polo bajo", { size: 3.4, tone: "hi" }));
  out.push(frontText(P, px(7), RULER.y + RULER.d, 1.1, "núcleo", { size: 3.4, tone: "hi", anchor: "middle" }));
  out.push(frontText(P, px(14) + 2, RULER.y + RULER.d, 1.1, "polo alto", { size: 3.4, tone: "hi", anchor: "end" }));

  for (let r = 0; r < ROWS; r++) {
    const y = rowY(r);
    const quad = [[NAME.x, y - 9, 4], [RAIL.x + RAIL.w + 4, y - 9, 4], [RAIL.x + RAIL.w + 4, y + 9, 4], [NAME.x, y + 9, 4]].map(at);
    out.push(`<path class="iso-hit" data-hit="${r}" role="button" tabindex="0" aria-label="${r < ROWS - 1 ? CRIT_BASE[r][1] : "Selección actual"}" d="${k.pathOf(quad, true)}"/>`);
  }

  const geo = { P, NP, X0, STEP, LIFT, PH, rows: Array.from({ length: ROWS }, (_, r) => rowY(r)) };
  const html = plateMarkup({
    id: "isoFig5",
    fig: "Fig. 5",
    title: "Rieles de casos",
    hint: "Pase el puntero por un riel para verlo · el riel delantero sigue al árbol",
    readout: "",
    label: "Rieles de casos: cinco rieles paralelos con 15 casos cada uno sobre el continuo de una categoría, del polo bajo al polo alto. En cada riel, unos émbolos levantan los casos que incorpora el criterio: típicos al centro, extremos en los polos, variación máxima a lo largo del continuo y muestreo teórico para contrastar supuestos. El riel delantero muestra el tipo de muestra elegido en el árbol de decisión.",
    width: W,
    height: H,
    body: `<defs>${defs.join("")}</defs>` + out.join(""),
    keys: CRIT_BASE.map((c, r) => ({ mark: "c1", label: c[1], data: String(r) })).concat([{ mark: "c2", label: "Selección actual", data: String(ROWS - 1) }]),
    caption: `<b>Figura 5.</b> Criterios de representatividad conceptual sobre el continuo de una categoría. Cada riel lleva 15 casos ordenados del polo bajo al polo alto; los émbolos levantan los casos que incorpora cada criterio. El riel delantero reproduce el tipo de muestra elegido en el árbol de decisión: si no es uno de los cuatro criterios base, muestra su propio patrón; en la bola de nieve, un hilo une cada caso con el siguiente, y la bandeja del extremo recibe a los voluntarios cuando se marca que es difícil obtener casos.`,
  });

  const css = `
.iso-svg .iso-sel>.iso-top{fill:color-mix(in srgb,var(--node-soft) 80%,var(--surface))}
.iso-svg .iso-sel>.iso-shade{fill:color-mix(in srgb,var(--node) 40%,var(--surface))}
.iso-pick>.iso-top{fill:color-mix(in srgb,var(--accent) 62%,var(--surface))}
.iso-pick>.iso-shade{fill:color-mix(in srgb,var(--accent) 86%,var(--surface))}
.iso-pick>.iso-edge{stroke:color-mix(in srgb,var(--accent) 80%,var(--ink))}
.iso-pickN>.iso-top{fill:color-mix(in srgb,var(--node) 70%,var(--surface))}
.iso-pickN>.iso-shade{fill:var(--node)}
.iso-pickN>.iso-edge{stroke:color-mix(in srgb,var(--node) 50%,var(--ink))}
.iso-pickL>.iso-edge{stroke:var(--anatomy-lit);stroke-width:1.1}
.iso-svg [data-row][data-on] [data-name]>.iso-solid>.iso-top{fill:var(--anatomy-lit-top)}
.iso-svg [data-row][data-on] [data-name]>.iso-solid>.iso-edge{stroke:var(--anatomy-lit)}
.iso-svg [data-part="chain"] path{fill:none;stroke:var(--warn);stroke-width:1.1;stroke-linecap:round}
`;

  const live = `
(function(){
  const fig=document.getElementById("isoFig5");if(!fig)return;
  const G=${JSON.stringify(geo)},P=G.P,svg=fig.querySelector("svg"),stage=fig.querySelector(".iso-stage"),readout=fig.querySelector("[data-readout]");
  const rowsEl=[...svg.querySelectorAll("[data-row]")],FRONT=rowsEl.length-1,keys=[...fig.querySelectorAll(".iso-key")];
  const label=svg.querySelector("[data-label]"),chain=svg.querySelector('[data-part="chain"]'),vol=svg.querySelector('[data-part="vol"]');
  const pucks=rowsEl.map(r=>[...r.querySelectorAll("[data-puck]")]),pins=rowsEl.map(r=>[...r.querySelectorAll("[data-pin]")]);
  const st=rowsEl.map(()=>Array.from({length:G.NP},()=>({z:0,v:0})));
  let picks=null,front={label:"",desc:"",chain:false,vol:false};
  let active=FRONT,since=0,hover=null,clock=0;
  function current(){
    if(!picks){picks=rowsEl.map((_,r)=>r<FRONT?CRIT_BASE[r][3]:[]);rowsEl.forEach((_,r)=>st[r].forEach((s,i)=>{if(picks[r].includes(i))s.z=G.LIFT}))}
    if(typeof muestraSel!=="function"||!document.querySelector('input[name=int]:checked'))return;
    const s=muestraSel(),cur=s.o.t,b=CRIT_BASE.find(r=>r[0]===cur),x=CRIT_EXTRA[cur];
    const lab=b?b[1]:cur.replace(/^Muestra (de |en |por )?/,"").replace(/^./,c=>c.toUpperCase());
    front={label:lab,desc:b?b[2]:(x?x[0]:s.o.d),chain:/cadena/.test(cur),vol:s.vol,base:b?CRIT_BASE.indexOf(b):-1,name:cur};
    picks[FRONT]=b?b[3]:(x?x[1]:[]);
  }
  function text(r){
    if(r===FRONT)return"Selección actual · "+front.label+": "+front.desc+" · "+picks[FRONT].length+" casos"+(front.vol?" + voluntarios":"");
    const c=CRIT_BASE[r];return c[1]+": "+c[2]+" · "+c[3].length+" casos"+(front.base===r?" (es la selección actual)":"");
  }
  function draw(t){
    rowsEl.forEach((row,r)=>{
      const on=r===(hover??active);row.toggleAttribute("data-on",on||(r===front.base&&r!==FRONT&&false));
      pucks[r].forEach((el,i)=>{const s=st[r][i],t=ISO.tr(P,[G.X0+i*G.STEP,G.rows[r],s.z]);el.setAttribute("transform",t);pins[r][i].setAttribute("transform",t);
        const pk=picks[r].includes(i),href=pk?"#iso5-puck"+(r===FRONT?"N":"A")+(on?"L":""):"#iso5-puck";if(el.getAttribute("href")!==href)el.setAttribute("href",href)});
    });
    chain.replaceChildren();
    if(front.chain){const pk=[...picks[FRONT]].sort((a,b)=>a-b),y=G.rows[FRONT];
      for(let j=0;j<pk.length-1;j++){const a=pk[j],b=pk[j+1],za=st[FRONT][a].z+3+G.PH,zb=st[FRONT][b].z+3+G.PH,A=ISO.iso([G.X0+a*G.STEP,y,za],P),B=ISO.iso([G.X0+b*G.STEP,y,zb],P),M=ISO.iso([G.X0+(a+b)/2*G.STEP,y,Math.max(za,zb)+7],P);
        chain.append(ISO.svgEl("path",{d:"M"+A[0].toFixed(1)+" "+A[1].toFixed(1)+"Q"+M[0].toFixed(1)+" "+M[1].toFixed(1)+" "+B[0].toFixed(1)+" "+B[1].toFixed(1)}));
        chain.append(ISO.svgEl("circle",{cx:B[0].toFixed(1),cy:B[1].toFixed(1),r:"1.3",fill:"var(--warn)"}));}}
    vol.style.opacity=front.vol?"1":"0";
    const show=hover??active,txt=text(show);if(readout.textContent!==txt)readout.textContent=txt;
    keys.forEach((b,i)=>b.setAttribute("aria-pressed",String(i===show)));
  }
  const run=ISO.loop(stage,(dt,calm)=>{
    clock+=dt;
    if(hover==null&&!calm&&clock-since>3.2){active=(active+1)%rowsEl.length;since=clock}
    let moving=false;
    rowsEl.forEach((_,r)=>{const sel=r===(hover??active);
      st[r].forEach((s,i)=>{const pick=picks[r].includes(i);
        // los casos elegidos suben; en el riel activo, en ola de izquierda a derecha
        let want=pick?G.LIFT:0;if(sel&&pick){const age=clock-since-i*0.06;if(age>0&&age<0.5)want+=3*Math.sin(Math.PI*age/0.5)}
        if(calm){s.z=want;s.v=0;return}
        for(let k=0;k<3;k++){s.v+=((want-s.z)*260-s.v*24)*dt/3;s.z+=s.v*dt/3}
        if(Math.abs(want-s.z)>0.01||Math.abs(s.v)>0.01)moving=true;});});
    draw(clock);return !calm||moving;
  });
  ISOF.f5={update(){current();if(label)label.textContent=front.label?cut(front.label,26):"Selección actual";draw(clock);run()}};
  svg.querySelectorAll("[data-hit]").forEach(h=>{const r=+h.dataset.hit;h.addEventListener("pointerenter",()=>{hover=r;since=clock;run()});h.addEventListener("focus",()=>{hover=r;since=clock;run()});h.addEventListener("pointerleave",()=>{hover=null;since=clock});h.addEventListener("blur",()=>{hover=null})});
  keys.forEach((b,i)=>b.addEventListener("click",()=>{active=i;since=clock;hover=null;run()}));
})();
`;
  return { html, css, live };
}
