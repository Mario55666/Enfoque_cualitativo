// Figura 4 · Sorteo y criba: a la izquierda, una tómbola con el marco muestral completo
// (36 fichas) y un brazo que extrae 8 al azar; a la derecha, una cinta trae casos sin
// marco muestral y una compuerta desvía a la bandeja los que cumplen el criterio.
import { k, S, L, D, byDepth, basePlate, labelPlate, plateMarkup, round } from "./lib.mjs";

export function build() {
  const W = 760, H = 330, AZ = 64, EL = 36;
  const C = [-112, -4], R = 48, NT = 36, NPICK = 8;
  const TT = { r: 58, h: 6 };
  const BELT = { x: 0, y: -15, w: 182, d: 30, r: 2, z: 16 };
  const GATE_X = 104, TRAY = { x: GATE_X - 34, y: 30, w: 72, d: 24, r: 2 }, BIN = { x: 186, y: -19, w: 30, d: 38, r: 2 };
  const PLATE = { x: -186, y: -74, w: 420, d: 146, r: 8 };
  const P = k.fitProjection([...k.boxCorners(PLATE, -14, 0), [GATE_X, -20, 44], [C[0], C[1], 30]], W, H, { pad: 12, azimuth: AZ, elevation: EL });
  const at = (p) => k.iso(p, P);
  const v = (x, y, z = 0) => { const [a, b] = k.axisVector(P, [x, y, z]); return `translate(${round(a)} ${round(b)})`; };
  const tokenAt = (i, r = R) => { const a = (i / NT) * Math.PI * 2; return [C[0] + r * Math.sin(a), C[1] - r * Math.cos(a)]; };

  const defs = [
    `<g id="iso4-tok">${S(k.cylinder(0, 0, 3.2, TT.h + 2, 3.4, P, 16, 0.3), { tone: "mid" })}</g>`,
    `<g id="iso4-tokP">${S(k.cylinder(0, 0, 3.2, TT.h + 2, 3.4, P, 16, 0.3), { tone: "mid", className: "iso-pick iso-pickL" })}</g>`,
  ];
  // casos de la cinta: cubo, prisma hexagonal y cilindro (este cumple el criterio)
  const shapes = {
    k: () => S(k.slabOf({ x: -4.6, y: -4.6, w: 9.2, d: 9.2, r: 0.8 }, 0, 8.4, P, 2, 0.4), { tone: "mid" }),
    h: () => S(k.cylinder(0, 0, 5.2, 0, 8, P, 6, 0.4), { tone: "mid" }),
    c: (cls) => S(k.cylinder(0, 0, 4.8, 0, 8.6, P, 20, 0.4), { tone: "mid", className: cls }),
  };
  defs.push(`<g id="iso4-k">${shapes.k()}</g>`, `<g id="iso4-h">${shapes.h()}</g>`, `<g id="iso4-c">${shapes.c("iso-pickN")}</g>`);

  const out = [basePlate(P, PLATE, { h: 10, foot: 4, footInset: 24 })];
  out.push(labelPlate(P, { x: PLATE.x + 10, y: PLATE.y + PLATE.d - 22, w: 56, d: 12, r: 1.4 }));
  // separador entre estaciones
  out.push(S(k.slabOf({ x: -32, y: PLATE.y + 8, w: 3, d: PLATE.d - 16, r: 1 }, 0, 1.6, P, 2), { tone: "lo", crease: "none" }));

  // tómbola: plato con 36 alojamientos, marcas de grado, disco interior, eje y perilla
  out.push(`<path class="iso-halo" d="${k.haloOf({ x: C[0] - TT.r, y: C[1] - TT.r, w: TT.r * 2, d: TT.r * 2, r: TT.r }, 0, 2, P)}" style="filter:blur(5px)"/>`);
  out.push(S(k.cylinder(C[0], C[1], TT.r + 3, 0, 2, P, 72, 0.6), { tone: "lo" }));
  out.push(S(k.cylinder(C[0], C[1], TT.r, 2, TT.h, P, 72, 0.8), { tone: "mid", inner: L(k.sideArc(C[0], C[1], TT.r, 5, P, 48), { tone: "faint" }) }));
  const tk = k.radialTicks(C[0], C[1], TT.r - 1.2, NT, 9, TT.h + 2, [1.4, 2.8], P);
  out.push(L(tk.minor, { tone: "lo" }), L(tk.major, { tone: "mid" }));
  out.push(L(Array.from({ length: NT }, (_, i) => { const [x, y] = tokenAt(i); return k.ring(x, y, 4.2, TT.h + 2, P, 12); }).join(""), { tone: "faint" }));
  const toks = byDepth(P, Array.from({ length: NT }, (_, i) => i), (i) => [...tokenAt(i), 0]);
  // fichas del fondo, disco y eje, fichas del frente (el disco interior queda entre ambas filas)
  const back = toks.filter((i) => tokenAt(i)[1] < C[1] - 8 || tokenAt(i)[0] < C[0] - 30);
  const front = toks.filter((i) => !back.includes(i));
  const tokUse = (i) => { const [x, y] = tokenAt(i); return `<use href="#iso4-tok" data-tok="${i}" transform="${v(x, y)}"/>`; };
  out.push(`<g data-part="toksB">${back.map(tokUse).join("")}</g>`);
  out.push(S(k.cylinder(C[0], C[1], 34, TT.h + 2, 2, P, 56, 0.5), { tone: "mid" }));
  out.push(L(k.ring(C[0], C[1], 30, TT.h + 4, P, 48), { tone: "faint" }));
  out.push(S(k.cylinder(C[0], C[1], 6, TT.h + 4, 8, P, 28), { tone: "mid" }));
  out.push(L(k.knurl(C[0], C[1], 6, TT.h + 6, TT.h + 12, 24, P), { tone: "lo" }));
  out.push(`<g data-part="toksF">${front.map(tokUse).join("")}</g>`);
  out.push(`<g data-part="arm"><path class="iso-line" data-tone="lit" style="stroke-width:2.2" d=""/><path class="iso-line" data-tone="lit" style="stroke-width:1.2" d=""/><circle r="1.6" class="iso-armtip"/></g>`);
  out.push(S(k.cylinder(C[0], C[1], 3.2, TT.h + 12, 2.4, P, 20), { tone: "hi", lit: true }));
  // bandeja de la muestra probabilística
  const PT = { x: C[0] - 40, y: C[1] + TT.r + 8, w: 80, d: 12, r: 2 };
  out.push(S(k.slabOf(PT, 0, 2.4, P, 3, 0.4), { tone: "mid" }));
  out.push(L(Array.from({ length: NPICK - 1 }, (_, j) => { const x = PT.x + (PT.w / NPICK) * (j + 1); return k.lineOnTop([x, PT.y], [x, PT.y + PT.d], 2.4, P); }).join(""), { tone: "faint" }));
  out.push(`<g data-part="sample">${Array.from({ length: NPICK }, (_, j) => `<use href="#iso4-tokP" data-s="${j}" style="opacity:0" transform="${v(PT.x + (PT.w / NPICK) * (j + 0.5), PT.y + PT.d / 2, -TT.h - 2 + 2.4)}"/>`).join("")}</g>`);

  // criba: patas, cinta, empujador, compuerta con plantilla, bandeja y cubo de descarte
  for (const [x, y] of byDepth(P, [[BELT.x + 10, BELT.y + 4], [BELT.x + BELT.w - 10, BELT.y + 4], [BELT.x + 10, BELT.y + BELT.d - 4], [BELT.x + BELT.w - 10, BELT.y + BELT.d - 4]], ([x, y]) => [x, y, 0])) {
    out.push(S(k.slabOf({ x: x - 2.4, y: y - 2.4, w: 4.8, d: 4.8, r: 0.8 }, 0, BELT.z - 4, P, 2), { tone: "mid" }));
  }
  out.push(S(k.slabOf(BELT, BELT.z - 4, 3, P, 3, 0.4), { tone: "mid", inner: L(k.sideSeam(BELT, BELT.z - 2.5, P, 3), { tone: "faint" }) }));
  const beltTop = { x: BELT.x + 2, y: BELT.y + 1.5, w: BELT.w - 4, d: BELT.d - 3, r: 1.4 };
  out.push(S(k.slabOf(beltTop, BELT.z - 1, 1, P, 3), { tone: "lo", className: "iso-belt" }));
  const clipPts = k.ringOf(beltTop, 3).map(([x, y]) => at([x, y, BELT.z]));
  defs.push(`<clipPath id="iso4-belt"><path d="${k.pathOf(clipPts, true)}"/></clipPath>`);
  const cleats = [];
  for (let x = beltTop.x - 12; x <= beltTop.x + beltTop.w + 12; x += 12) cleats.push(k.lineOnTop([x, beltTop.y], [x, beltTop.y + beltTop.d], BELT.z, P));
  // los tacos sobrantes quedan fuera del recorte de la cinta; los visibles terminan en sus bordes
  out.push(`<g clip-path="url(#iso4-belt)"><g data-part="cleats">${L(cleats.join(""), { tone: "faint", free: true })}</g></g>`);
  // empujador (detrás de la cinta) con su vástago recortado fuera del cilindro
  const HOUS = { x: GATE_X - 5, y: BELT.y - 22, w: 10, d: 12, r: 2 };
  out.push(S(k.slabOf({ x: HOUS.x - 3, y: HOUS.y - 2, w: HOUS.w + 6, d: HOUS.d + 2, r: 1.2 }, 0, BELT.z - 2, P, 2, 0.4), { tone: "mid" }));
  out.push(S(k.slabOf(HOUS, BELT.z - 2, 9, P, 3, 0.5), { tone: "mid" }));
  const face = HOUS.y + HOUS.d;
  const rodClip = [[GATE_X - 9, face, 0], [GATE_X + 9, face, 0], [GATE_X + 9, face + 40, 0], [GATE_X - 9, face + 40, 0], [GATE_X - 9, face, 30], [GATE_X + 9, face, 30], [GATE_X + 9, face + 40, 30], [GATE_X - 9, face + 40, 30]].map(at);
  defs.push(`<clipPath id="iso4-rod"><path d="${hull(rodClip)}"/></clipPath>`);
  const rod = [
    S(k.slabOf({ x: GATE_X - 1.4, y: face - 16, w: 2.8, d: 16, r: 1.2 }, BELT.z + 2.4, 2.8, P, 3), { tone: "hi", crease: "none" }),
    S(k.slabOf({ x: GATE_X - 4.5, y: face, w: 9, d: 2.4, r: 0.8 }, BELT.z + 0.6, 6.4, P, 2, 0.3), { tone: "hi", lit: true }),
  ].join("");
  out.push(`<g clip-path="url(#iso4-rod)"><g data-part="rod">${rod}</g></g>`);
  // casos en la cinta (en vivo)
  out.push(S(k.slabOf(TRAY, 0, 2.4, P, 3, 0.4), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(TRAY, 2.4), 2.4, P, 3), { tone: "faint" }));
  out.push(`<g data-part="items"></g>`);
  // compuerta: postes, travesaño y plantilla con el criterio (un círculo)
  const GY0 = BELT.y - 4, GY1 = BELT.y + BELT.d + 2;
  const gpost = (y) => S(k.slabOf({ x: GATE_X + 8, y: y - 1.6, w: 3.2, d: 3.2, r: 0.8 }, 0, 34, P, 2, 0.3), { tone: "mid" });
  out.splice(out.length - 1, 0, gpost(GY0));
  out.push(gpost(GY1));
  out.push(S(k.slabOf({ x: GATE_X + 7, y: GY0 - 2.6, w: 5.2, d: GY1 - GY0 + 5.2, r: 1 }, 34, 3, P, 3, 0.4), { tone: "mid" }));
  const tpl = { x: GATE_X + 7.2, y: BELT.y + 2, w: 1.2, d: BELT.d - 4, r: 0.3 };
  out.push(S(k.slabOf(tpl, 22, 12, P, 2), { tone: "mid", crease: "none" }));
  out.push(L(k.sideRing([GATE_X + 8.5, BELT.y + BELT.d / 2, 28], 3.8, "x", P, 18), { tone: "hi" }));
  // bandeja de la muestra dirigida y cubo de descarte
  out.push(S(k.slabOf(BIN, 0, BELT.z - 3, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(BIN, 4, P, 3), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(BIN, 2), BELT.z - 3, P, 3), { tone: "lo" }));

  // patrón fijo de 12 casos por ciclo: c cumple el criterio
  const STREAM = ["k", "c", "h", "c", "k", "h", "c", "k", "c", "h", "k", "c"];
  const geo = { P, C, R, NT, NPICK, TT, STREAM, BELT, GATE_X, TRAY, PT, BINX: BIN.x, face, arm: { z: TT.h + 14 } };

  const html = plateMarkup({
    id: "isoFig4",
    fig: "Fig. 4",
    title: "Sorteo y criba",
    hint: "Pase el puntero para pausar · elija un lado para leerlo",
    readout: "",
    label: "Dos estaciones sobre una placa. A la izquierda, una tómbola con 36 fichas, el marco muestral completo: un brazo gira y se detiene al azar; cada ficha extraída pasa a la bandeja hasta completar 8. A la derecha, una cinta trae casos de tres formas sin marco muestral; una compuerta con la plantilla del criterio y un empujador desvían a la bandeja los cilindros, que cumplen el criterio, y los demás caen al cubo de descarte.",
    width: W,
    height: H,
    body: `<defs>${defs.join("")}</defs>` + out.join(""),
    keys: [
      { mark: "c1", label: "Probabilístico: azar sobre el marco completo", data: "0" },
      { mark: "c2", label: "Dirigido: el criterio decide", data: "1" },
    ],
    caption: `<b>Figura 4.</b> Lógica de selección en cada tipo de muestreo. En el probabilístico, el azar opera sobre un marco muestral completo: cada ficha tiene una probabilidad conocida y distinta de cero de salir. En el dirigido no hay marco: los casos llegan del campo y el investigador incorpora los que cumplen el criterio del planteamiento (aquí, el cilindro: p. ej., haber vivido la experiencia). La lectura indica también el tipo de muestra elegido en el árbol.`,
  });

  const css = `
.iso-svg .iso-armtip{fill:var(--anatomy-lit)}
.iso-belt>.iso-top{fill:color-mix(in srgb,var(--ink) 9%,var(--surface))}
`;

  const live = `
(function(){
  const fig=document.getElementById("isoFig4");if(!fig)return;
  const G=${JSON.stringify(geo)},P=G.P,svg=fig.querySelector("svg"),stage=fig.querySelector(".iso-stage"),readout=fig.querySelector("[data-readout]");
  const toks=[...svg.querySelectorAll("[data-tok]")].sort((a,b)=>a.dataset.tok-b.dataset.tok),sample=[...svg.querySelectorAll("[data-s]")];
  const arm=svg.querySelector('[data-part="arm"]'),armL=arm.children[0],armF=arm.children[1],armT=arm.children[2];
  const items=svg.querySelector('[data-part="items"]'),rod=svg.querySelector('[data-part="rod"]'),cleats=svg.querySelector('[data-part="cleats"]');
  const keys=[...fig.querySelectorAll(".iso-key")];
  const cl=t=>Math.max(0,Math.min(1,t)),E=ISO.ease,TAU=Math.PI*2;
  const tokXY=(i,r=G.R)=>{const a=i/G.NT*TAU;return[G.C[0]+r*Math.sin(a),G.C[1]-r*Math.cos(a)]};
  // sorteo: 8 extracciones sin reposición, distintas en cada ciclo
  const DRAW=1.25,GAP=0.3,HOLD=1.8,RESET=0.7,LCYC=G.NPICK*(DRAW+GAP)+HOLD+RESET;
  let picks=[],lcycle=-1,lt=0,angle0=0;
  const rnd=(()=>{let s=20261104;return()=>(s=(s*1103515245+12345)%2147483648)/2147483648})();
  function newDraw(){const pool=[...Array(G.NT).keys()];picks=[];for(let j=0;j<G.NPICK;j++)picks.push(pool.splice(Math.floor(rnd()*pool.length),1)[0])}
  // criba: un caso cada 0,9 s a 30 u/s; los cilindros se desvían a la bandeja
  const GAPR=1,SPEED=28,RCYC=G.STREAM.length*GAPR+7.5;
  const nodes=G.STREAM.map((t,i)=>{const u=ISO.svgEl("use",{href:"#iso4-"+t});items.append(u);return u});
  const slotsR=[];{let n=0;G.STREAM.forEach((t,i)=>{slotsR[i]=t==="c"?n++:-1})}
  const nMatch=slotsR.filter(s=>s>=0).length;
  let focus=null,paused=false,clock=0,sel="";
  function drawLeft(t){
    const c=Math.floor(t/LCYC);if(c!==lcycle){lcycle=c;newDraw()}
    const u=t-c*LCYC,step=Math.min(G.NPICK-1,Math.floor(u/(DRAW+GAP))),f=cl((u-step*(DRAW+GAP))/DRAW);
    const resetting=u>G.NPICK*(DRAW+GAP)+HOLD;
    let done=0,ang;
    if(u<G.NPICK*(DRAW+GAP)){done=step+(f>=1?1:0);const prev=step?picks[step-1]/G.NT*TAU:0,target=picks[step]/G.NT*TAU+TAU*2;ang=prev+(target-prev)*(1-Math.pow(1-f,3))}
    else{done=G.NPICK;ang=picks[G.NPICK-1]/G.NT*TAU}
    const back=resetting?cl((u-G.NPICK*(DRAW+GAP)-HOLD)/RESET):0;
    toks.forEach((el,i)=>{const j=picks.indexOf(i),on=j>=0&&j<done&&!resetting;const lift=on?6:0;const[x,y]=tokXY(i);el.setAttribute("transform",ISO.tr(P,[x,y,lift]));const h=on?"#iso4-tokP":"#iso4-tok";if(el.getAttribute("href")!==h)el.setAttribute("href",h)});
    sample.forEach((el,j)=>{el.style.opacity=String(j<done?1-back:0)});
    const tip=[G.C[0]+G.R*Math.sin(ang),G.C[1]-G.R*Math.cos(ang)];
    const hub=[G.C[0]+3.2*Math.sin(ang),G.C[1]-3.2*Math.cos(ang)];
    armL.setAttribute("d",ISO.path([ISO.iso([hub[0],hub[1],G.arm.z],P),ISO.iso([tip[0],tip[1],G.arm.z],P)]));
    armF.setAttribute("d",ISO.path([ISO.iso([tip[0],tip[1],G.arm.z],P),ISO.iso([tip[0],tip[1],G.TT.h+6.8],P)]));
    const T=ISO.iso([tip[0],tip[1],G.TT.h+6.8],P);armT.setAttribute("cx",T[0].toFixed(1));armT.setAttribute("cy",T[1].toFixed(1));
    return {done,resetting};
  }
  function drawRight(t){
    const c=Math.floor(t/RCYC),u=t-c*RCYC,X0=G.BELT.x+4,Z=G.BELT.z;
    let push=0,inTray=0,out=0;
    nodes.forEach((el,i)=>{
      const age=u-i*GAPR,type=G.STREAM[i];let x=X0+age*SPEED,y=0,z=Z,o=age<0?0:1;
      const tg=(G.GATE_X-X0)/SPEED;
      if(type==="c"&&age>tg){const a=age-tg;x=G.GATE_X;const py=E(cl(a/0.45));y=py*26;if(a<0.6)push=Math.max(push,Math.sin(Math.PI*cl(a/0.6)));
        if(a>0.45){const d=cl((a-0.45)/0.35),s=slotsR[i];x=G.GATE_X+(G.TRAY.x+9+s*13.5-G.GATE_X)*d;y=26+(G.TRAY.y+G.TRAY.d/2-26)*d;z=Z-(Z-2.4)*d;}
        if(a>0.8)inTray++;}
      else if(x>G.BINX+4){o=Math.max(0,1-(x-G.BINX-4)/10);z=Z-(x-G.BINX-4)*0.8;if(age>0)out+=x>G.BINX+8?1:0}
      if(u>RCYC-1.2&&type==="c")o=Math.max(0,(RCYC-u)/1.2);
      el.setAttribute("transform",ISO.tr(P,[x,y,z]));el.style.opacity=String(o);
    });
    rod.setAttribute("transform",ISO.tr(P,[0,push*12,0]));
    cleats.setAttribute("transform",ISO.tr(P,[(u*SPEED)%12,0,0]));
    return {inTray,out};
  }
  function setReadout(L,R){
    const left="Al azar: "+L.done+" de "+G.NPICK+" fichas extraídas de un marco de "+G.NT+" (p = "+G.NPICK+"/"+G.NT+" para cada una)";
    const right="Por criterio: "+R.inTray+" casos a la bandeja, "+R.out+" descartados";
    const tail=sel?" · árbol: "+sel:"";
    const txt=focus===0?left:focus===1?right+tail:left+" · "+right;
    if(readout.textContent!==txt)readout.textContent=txt;
  }
  function draw(t){setReadout(drawLeft(t),drawRight(t))}
  const run=ISO.loop(stage,(dt,calm)=>{if(calm){draw(G.NPICK*(DRAW+GAP)+0.2+LCYC*0);return false}if(!paused)clock+=dt;draw(clock);return true});
  ISOF.f4={update(){if(typeof muestraSel==="function"&&document.querySelector('input[name=int]:checked')){const s=muestraSel();sel=s.o.t+(s.vol?" + voluntarios":"")}draw(clock);run()}};
  stage.addEventListener("pointerenter",()=>{paused=true});stage.addEventListener("pointerleave",()=>{paused=false;run()});
  keys.forEach((b,i)=>b.addEventListener("click",()=>{focus=focus===i?null:i;keys.forEach((x,j)=>x.setAttribute("aria-pressed",String(focus===j)));draw(clock)}));
})();
`;
  return { html, css, live };
}

function hull(pts) {
  const q = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const p of q) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of q.reverse()) { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return k.pathOf(lo.slice(0, -1).concat(up.slice(0, -1)), true);
}
