// Figura 3 · Cascada de clasificación: una cortadora separa la transcripción en unidades,
// las unidades se reparten en 8 casillas (códigos) y bajan por canaletas a 4 bandejas
// (subcategorías) y a 2 cajones (macrocategorías), donde un puente las relaciona (modelo).
import { k, S, L, D, byDepth, basePlate, labelPlate, face, frontText, plateMarkup, round } from "./lib.mjs";

export function build() {
  const W = 760, H = 380, AZ = 60, EL = 34;
  const PLATE = { x: -178, y: -80, w: 398, d: 150, r: 8 };
  const SH = [
    { y: -66, d: 30, z: 48 },
    { y: -36, d: 30, z: 30 },
    { y: -6, d: 30, z: 12 },
  ];
  const SX = -150, SW = 340, ST = 3; // estante: x, ancho, espesor
  const TX = -140, TW = 280, TD = 22, WALL = 8, LIP = 3;
  const CELLS = [8, 4, 2];
  const inner = { x0: TX + 2, x1: TX + TW - 2 };
  const cellW = (t) => (inner.x1 - inner.x0) / CELLS[t];
  const cellX = (t, c) => inner.x0 + cellW(t) * (c + 0.5);
  const trayY = (t) => SH[t].y + 4;
  const top = (t) => SH[t].z + ST;
  const pileY = (t) => trayY(t) + 11;

  // asignación fija: 24 unidades, 3 por código; código → subcategoría (c>>1) → macrocategoría (c>>2)
  const ORDER = [5, 0, 3, 7, 1, 6, 2, 4, 0, 5, 3, 6, 1, 7, 2, 4, 6, 0, 5, 3, 1, 7, 4, 2];
  const seen = Array(8).fill(0);
  const SLIPS = ORDER.map((code, i) => ({ i, code, layer: seen[code]++ }));
  const pile1 = (c) => cellX(0, c);
  const pile2 = (c) => cellX(1, c >> 1) + ((c & 1) ? 15 : -15);
  const pile3 = (c) => cellX(2, c >> 2) + [-48, -16, 16, 48][c & 3];
  const STRIP = { x: -144, y: 35, w: 288, d: 8 };
  const stripX = (i) => STRIP.x + 6 + i * 12;

  const P = k.fitProjection([...k.boxCorners(PLATE, -14, 0), [-150, -66, 70], [190, -66, 70], [0, -40, 92]], W, H, { pad: 12, azimuth: AZ, elevation: EL });
  const at = (p) => k.iso(p, P);
  const v = (x, y, z = 0) => { const [a, b] = k.axisVector(P, [x, y, z]); return `translate(${round(a)} ${round(b)})`; };
  const defs = [];
  const out = [basePlate(P, PLATE, { h: 10, foot: 4, footInset: 24 })];
  out.push(labelPlate(P, { x: PLATE.x + PLATE.w - 64, y: PLATE.y + 8, w: 52, d: 12, r: 1.4 }));

  // postes, estantes y bandejas, de atrás hacia delante
  for (const s of SH) defs.push(`<g id="iso3-post${s.z}">${S(k.cylinder(0, 0, 2.4, 0, s.z, P, 18), { tone: "mid", crease: "none" })}${L(k.sideArc(0, 0, 2.4, 4, P, 10), { tone: "faint" })}</g>`);
  const post = (x, y, z1) => `<use href="#iso3-post${z1}" transform="${v(x, y)}"/>`;
  const tray = (t) => {
    const y0 = trayY(t), z0 = top(t), n = CELLS[t], g = [];
    g.push(S(k.slabOf({ x: TX, y: y0, w: TW, d: TD, r: 1.2 }, z0, 1.2, P, 3, 0.4), { tone: "mid" }));
    g.push(S(k.slabOf({ x: TX, y: y0, w: TW, d: 2, r: 0.6 }, z0, WALL, P, 2, 0.3), { tone: "mid" }));
    g.push(S(k.slabOf({ x: TX, y: y0, w: 2, d: TD, r: 0.6 }, z0, WALL, P, 2, 0.3), { tone: "mid" }));
    for (let c = 1; c < n; c++) {
      const x = inner.x0 + cellW(t) * c;
      g.push(S(k.slabOf({ x: x - 0.9, y: y0 + 2, w: 1.8, d: TD - 4, r: 0.4 }, z0 + 1.2, 5, P, 2), { tone: "mid" }));
    }
    g.push(S(k.slabOf({ x: TX + TW - 2, y: y0, w: 2, d: TD, r: 0.6 }, z0, WALL, P, 2, 0.3), { tone: "mid" }));
    g.push(S(k.slabOf({ x: TX, y: y0 + TD - 2, w: TW, d: 2, r: 0.6 }, z0, LIP, P, 2, 0.3), { tone: "mid" }));
    g.push(D(k.corners({ x: TX, y: y0, w: TW, d: TD }, 1).filter((_, i) => i < 2).map(([x, y]) => at([x, y, z0 + WALL])), { size: 0.4 }));
    return g.join("");
  };
  const shelf = (t) => {
    const s = SH[t], plan = { x: SX, y: s.y, w: SW, d: s.d, r: 1.6 };
    return S(k.slabOf(plan, s.z, ST, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(plan, s.z + 1.5, P, 3), { tone: "faint" }) }) +
      D([SX + 6, SX + SW - 6].map((x) => at([x, s.y + s.d - 2.4, s.z + ST])), { size: 0.45 });
  };
  const chute = (a, b, w, z0 = 0) => {
    // canaleta inclinada: fondo y dos laterales bajos, de a (arriba) a b (abajo)
    const h = 1.6, [ax, ay, az] = a, [bx, by, bz] = b, hw = w / 2;
    const fl = [[ax - hw, ay, az], [ax + hw, ay, az], [bx + hw, by, bz], [bx - hw, by, bz]];
    const side = (s) => [[ax + s * hw, ay, az], [bx + s * hw, by, bz], [bx + s * hw, by, bz + h], [ax + s * hw, ay, az + h]];
    return `<g class="iso-chute">${face(P, side(-1), { shade: 1 })}${face(P, fl, { shade: 3 })}${face(P, side(1), { shade: 2 })}</g>`;
  };

  // carteles de código en el canto del estante 1 y tarjetas de aserto detrás de la pared trasera
  const tags = [], cards = [];
  for (let c = 0; c < 8; c++) {
    const x = cellX(0, c), s = SH[0], y = s.y + s.d;
    const tx = x - 11, plan = { x: tx - 5, y: y, w: 10, d: 0.6, r: 0.2 };
    const lines = [0.34, 0.66].map((f, j) => k.segment([tx - 3.6, y + 0.6, s.z + ST * f], [tx - 3.6 + [6.4, 4.4][j], y + 0.6, s.z + ST * f], P)).join("");
    tags.push(`<g data-tag="${c}">${S(k.slabOf(plan, s.z + 0.3, ST - 0.6, P, 2), { tone: "lo", crease: "none" })}<path class="iso-line" data-tone="lit" data-free="end" data-ink style="opacity:0" d="${lines}"/></g>`);
    const cy = trayY(0) - 1.6;
    const card = { x: x - 8, y: cy, w: 16, d: 1.2, r: 0.3 }, cz = top(0) + WALL - 3, wz = top(0) + WALL;
    const rules = [1.2, 2.6, 3.9].map((dz, j) => k.segment([x - 6.4, cy + 1.2, wz + dz], [x - 6.4 + [11.6, 8.4, 10][j], cy + 1.2, wz + dz], P)).join("");
    cards.push(`<g data-card="${c}">${S(k.slabOf(card, cz, 7.8, P, 2), { tone: "mid", crease: "none" })}<path class="iso-line" data-tone="lit" data-free="end" data-ink style="opacity:0" d="${rules}"/></g>`);
  }

  // letreros de nivel al extremo derecho de cada estante
  const LEVEL = [["CÓDIGOS", "1.er nivel · 8"], ["SUBCATEGORÍAS", "2.º nivel · 4"], ["MACROCATEGORÍAS", "3.er nivel · 2"]];
  const sign = (t) => {
    const s = SH[t], y = s.y + s.d - 7, z = top(t), plan = { x: 144, y, w: 44, d: 1.4, r: 0.3 };
    return [
      S(k.slabOf({ x: 150, y: y - 1.6, w: 4, d: 4.6, r: 0.6 }, z, 1.6, P, 2), { tone: "mid" }),
      S(k.slabOf({ x: 180, y: y - 1.6, w: 4, d: 4.6, r: 0.6 }, z, 1.6, P, 2), { tone: "mid" }),
      S(k.slabOf(plan, z + 1.6, 11, P, 2, 0.3), { tone: "mid", crease: "none" }),
      frontText(P, plan.x + 2.2, y + plan.d, z + 8.2, LEVEL[t][0], { size: 3.7, tone: "hi" }),
      frontText(P, plan.x + 2.2, y + plan.d, z + 4, LEVEL[t][1], { size: 3.1, tone: "mid" }),
    ].join("");
  };

  // estante 1 (atrás)
  const posts = (t, front) => byDepth(P, [[-146, SH[t].y + 3], [186, SH[t].y + 3], [20, SH[t].y + 3]].concat(front ? [[-146, SH[t].y + SH[t].d - 3], [186, SH[t].y + SH[t].d - 3]] : []), ([x, y]) => [x, y, 0]).map(([x, y]) => post(x, y, SH[t].z)).join("");
  out.push(posts(0, true));
  out.push(shelf(0));
  out.push(`<g data-part="cards">${cards.join("")}</g>`);
  out.push(tray(0));
  out.push(tags.join(""));
  out.push(sign(0));
  // estante 2
  out.push(posts(1, true));
  out.push(shelf(1));
  out.push(tray(1));
  out.push(sign(1));
  const CH1 = [], CH2 = [];
  for (let c = 0; c < 8; c++) {
    const a = [pile1(c), trayY(0) + TD, top(0) + LIP + 0.2], b = [pile2(c), trayY(1) + 1.4, top(1) + WALL + 0.3];
    CH1.push({ a, b });
    out.push(chute(a, b, 7));
  }
  // estante 3
  out.push(posts(2, true));
  out.push(shelf(2));
  out.push(tray(2));
  out.push(sign(2));
  for (let c = 0; c < 8; c++) {
    const a = [pile2(c), trayY(1) + TD, top(1) + LIP + 0.2], b = [pile3(c), trayY(2) + 1.4, top(2) + WALL + 0.3];
    CH2.push({ a, b });
    out.push(chute(a, b, 7));
  }
  // puente del modelo: relaciones entre las dos macrocategorías
  const bz = top(2) + 1.2;
  const bridge = [
    S(k.cylinder(cellX(2, 0), trayY(2) + 4.2, 1.8, bz, 14, P, 16), { tone: "mid" }),
    S(k.cylinder(cellX(2, 1), trayY(2) + 4.2, 1.8, bz, 14, P, 16), { tone: "mid" }),
    S(k.slabOf({ x: cellX(2, 0), y: trayY(2) + 2.6, w: cellX(2, 1) - cellX(2, 0), d: 3.2, r: 1.2 }, bz + 14, 2.4, P, 3, 0.4), { tone: "hi", lit: true }),
    S(k.cylinder(0, trayY(2) + 4.2, 3.4, bz + 16.4, 1.6, P, 24), { tone: "mid" }),
    D([at([0, trayY(2) + 4.2, bz + 18])], { size: 0.55, tone: "hi" }),
  ].join("");
  out.push(`<g data-part="bridge" style="opacity:0">${bridge}</g>`);

  // tapete de corte con su cuadrícula y la tira de la transcripción
  const MAT = { x: -158, y: 29, w: 316, d: 22, r: 2 };
  out.push(S(k.slabOf(MAT, 0, 1, P, 4, 0.4), { tone: "lo" }));
  const grid = [];
  for (let x = MAT.x + 4; x <= MAT.x + MAT.w - 4; x += 12) grid.push(k.lineOnTop([x, MAT.y], [x, MAT.y + MAT.d], 1, P));
  for (const y of [MAT.y + 3.5, MAT.y + MAT.d - 3.5]) grid.push(k.lineOnTop([MAT.x, y], [MAT.x + MAT.w, y], 1, P));
  out.push(L(grid.join(""), { tone: "faint" }));
  out.push(`<clipPath id="iso3-strip"><path data-clip d=""/></clipPath>`);
  const stripRules = [0.35, 0.65].map((f) => k.lineOnTop([STRIP.x + 2, STRIP.y + STRIP.d * f], [STRIP.x + STRIP.w - 2, STRIP.y + STRIP.d * f], 1.8, P)).join("");
  const scores = Array.from({ length: 23 }, (_, i) => k.lineOnTop([STRIP.x + 12 * (i + 1), STRIP.y], [STRIP.x + 12 * (i + 1), STRIP.y + STRIP.d], 1.8, P)).join("");
  out.push(`<g data-part="strip" clip-path="url(#iso3-strip)">${S(k.slabOf({ ...STRIP, r: 0.6 }, 1, 0.8, P, 2), { tone: "hi" })}${L(stripRules, { tone: "lo", free: true })}${L(scores, { tone: "faint", dashed: true })}</g>`);

  // riel y carro de la cortadora
  const RAIL = { x: -164, y: 56, w: 328, d: 6, r: 1.2 };
  out.push(S(k.slabOf(RAIL, 0, 4, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(RAIL, 2, P, 3), { tone: "faint" }) }));
  for (const x of [RAIL.x - 5, RAIL.x + RAIL.w]) {
    out.push(S(k.slabOf({ x, y: 53, w: 5, d: 12, r: 1 }, 0, 8, P, 2, 0.4), { tone: "mid" }));
    out.push(D([at([x + 2.5, 56, 8]), at([x + 2.5, 62, 8])], { size: 0.45 }));
  }

  // unidades (se mueven en vivo); se dibujan en el origen
  for (const c of [1, 2]) {
    const body = S(k.slabOf({ x: -5.6, y: -4, w: 11.2, d: 8, r: 0.5 }, 0, 0.8, P, 2), { tone: "lo", crease: "none" });
    const band = `<path class="iso-c${c}b" d="${k.onTop([[-5.6, -4], [-3.2, -4], [-3.2, 4], [-5.6, 4]], 0.8, P, true)}"/>`;
    const rules = [-1.6, 0.6, 2.4].map((y, j) => k.lineOnTop([-2.2, y], [-2.2 + [6.6, 5, 6][j], y], 0.8, P)).join("");
    defs.push(`<g id="iso3-slip${c}">${body}${band}<path class="iso-line" data-tone="faint" data-free="end" d="${rules}"/></g>`);
  }
  const slipSvg = (s) => `<use href="#iso3-slip${s.code < 4 ? 1 : 2}" data-slip="${s.i}" style="opacity:0"/>`;
  out.push(`<g data-part="slips">${SLIPS.map(slipSvg).join("")}</g>`);

  // carro de la cortadora: brazo sobre la tira y cuchilla
  const head = [
    S(k.slabOf({ x: -8, y: 52, w: 16, d: 13, r: 2 }, 4, 6, P, 3, 0.5), { tone: "mid" }),
    S(k.slabOf({ x: -1.8, y: 34, w: 3.6, d: 20, r: 0.9 }, 7, 3, P, 2, 0.3), { tone: "mid" }),
    S(k.cylinder(0, 38.4, 2.6, 1.9, 5.2, P, 20), { tone: "hi", lit: true }),
    S(k.cylinder(0, 59, 3.4, 10, 4, P, 24), { tone: "mid" }),
    L(k.knurl(0, 59, 3.4, 10, 14, 20, P), { tone: "lo" }),
    D([at([-5, 63, 10]), at([5, 63, 10])], { size: 0.45 }),
  ].join("");
  out.push(`<g data-part="head">${head}</g>`);

  const geo = {
    P,
    slips: SLIPS.map((s) => ({
      code: s.code,
      layer: s.layer,
      s0: [stripX(s.i), STRIP.y + 4, 1.05],
      p1: [pile1(s.code) + [-1.4, 1.2, -0.3][s.layer], pileY(0) + [0.8, -0.9, 0.2][s.layer], top(0) + 1.2 + s.layer * 0.8],
      p2: [pile2(s.code) + [-1, 1.1, 0][s.layer], pileY(1) + [0.6, -0.7, 0.3][s.layer], top(1) + 1.2 + s.layer * 0.8],
      p3: [pile3(s.code) + [0.8, -1, 0.2][s.layer], pileY(2) + [-0.5, 0.8, 0][s.layer], top(2) + 1.2 + s.layer * 0.8],
    })),
    ch1: CH1.map(({ a, b }) => ({ a, b })),
    ch2: CH2.map(({ a, b }) => ({ a, b })),
    strip: STRIP,
  };

  const STEPS = [
    ["Segmentación", "el corpus se divide en 24 unidades temáticas o situacionales"],
    ["Primer agrupamiento", "las unidades con el mismo significado empírico se reúnen en 8 casillas"],
    ["Codificación inicial", "cada casilla recibe su código y el memo de la regla"],
    ["Redacción del aserto", "una síntesis anclada en la evidencia de cada grupo"],
    ["Agrupamiento de 2.º y 3.er nivel", "8 códigos bajan a 4 subcategorías y luego a 2 macrocategorías"],
    ["Modelo final", "un puente relaciona las 2 macrocategorías"],
  ];

  const html = plateMarkup({
    id: "isoFig3",
    fig: "Fig. 3",
    title: "Cascada de clasificación",
    hint: "Elija un paso para verlo · pase el puntero para pausar",
    readout: "Paso 1 · Segmentación: el corpus se divide en 24 unidades temáticas o situacionales",
    label: "Cascada de clasificación sobre una placa: delante, una cortadora corre sobre un riel y separa la transcripción en 24 unidades; cada unidad se reparte en una de las 8 casillas del estante superior, que llevan cartel de código y tarjeta de aserto; por canaletas, las unidades bajan a 4 bandejas y luego a 2 cajones, donde un puente relaciona las dos macrocategorías.",
    width: W,
    height: H,
    stage: ` tabindex="0" aria-label="Figura 3 animada: use las teclas de flecha para pasar de un paso a otro"`,
    body: `<defs>${defs.join("")}</defs>` + out.join(""),
    keys: STEPS.map((s, i) => ({ mark: i === 5 ? "lit" : "flat", label: `${i < 5 ? i + 1 + " · " : ""}${s[0]}`, data: String(i) })),
    caption: `<b>Figura 3.</b> Procedimiento de construcción de la matriz (pasos 1–5) y reducción progresiva de los datos por niveles de agrupamiento. La cortadora segmenta la transcripción; cada unidad va a la casilla de su significado empírico (código y memo en el cartel, aserto en la tarjeta); por las canaletas, los 8 códigos bajan a 4 subcategorías y a 2 macrocategorías, que un puente relaciona en el modelo final. El color de la franja indica la macrocategoría a la que llegará cada unidad. Las cantidades son ilustrativas.`,
  });

  const css = `
.iso-c1b{fill:var(--iso-c1)}
.iso-c2b{fill:var(--iso-c2)}
.iso-svg .iso-chute>.iso-top{fill:var(--anatomy-top)}
.iso-svg :is([data-tag],[data-card])[data-on]>.iso-solid>:is(.iso-top,.iso-shade){fill:var(--anatomy-lit-top)}
.iso-svg :is([data-tag],[data-card])[data-on]>.iso-solid>.iso-edge{stroke:var(--anatomy-lit)}
`;

  const live = `
(function(){
  const fig=document.getElementById("isoFig3");if(!fig)return;
  const G=${JSON.stringify(geo)},P=G.P,svg=fig.querySelector("svg"),stage=fig.querySelector(".iso-stage"),readout=fig.querySelector("[data-readout]");
  const STEPS=${JSON.stringify(STEPS)};
  const T=[0,2.6,6.2,8.2,10.2,13.6,16.4,19.4,20.4];
  const slips=[...svg.querySelectorAll("[data-slip]")],tags=[...svg.querySelectorAll("[data-tag]")],cards=[...svg.querySelectorAll("[data-card]")];
  const head=svg.querySelector('[data-part="head"]'),strip=svg.querySelector('[data-part="strip"]'),clip=svg.querySelector("#iso3-strip [data-clip]"),bridge=svg.querySelector('[data-part="bridge"]');
  const keys=[...fig.querySelectorAll(".iso-key")];
  const hull=pts=>{const q=[...pts].sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lo=[],up=[];for(const p of q){while(lo.length>1&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p)}for(const p of q.reverse()){while(up.length>1&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p)}return lo.slice(0,-1).concat(up.slice(0,-1))};
  const lerp=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t),cl=t=>Math.max(0,Math.min(1,t)),E=ISO.ease;
  const order=G.slips.map((s,i)=>i).sort((a,b)=>G.slips[a].code-G.slips[b].code||G.slips[a].layer-G.slips[b].layer);
  const rank=[];order.forEach((i,r)=>rank[i]=r);
  function slipAt(i,t){
    const s=G.slips[i];
    // 1. corte: la unidad aparece cuando la cuchilla pasa
    const cutAt=T[0]+(s.s0[0]-G.strip.x)/G.strip.w*(T[1]-T[0]);
    if(t<cutAt)return{p:s.s0,o:0};
    if(t<T[1])return{p:s.s0,o:1};
    // 2. reparto en arco hacia su casilla
    const d0=T[1]+rank[i]*0.13,f=cl((t-d0)/0.7);
    if(t<T[4]){if(f<1){const q=lerp(s.s0,s.p1,E(f));q[2]+=Math.sin(Math.PI*f)*30;return{p:q,o:1}}return{p:s.p1,o:1}}
    // 3. bajada por la canaleta de su casilla al nivel 2
    const c=G.ch1[s.code],l0=T[4]+s.code*0.3+(2-s.layer)*0.12;
    if(t<T[5]){const u=(t-l0)/0.8;if(u<=0)return{p:s.p1,o:1};if(u<0.3)return{p:lerp(s.p1,c.a,E(u/0.3)),o:1};if(u<0.75)return{p:lerp(c.a,c.b,(u-0.3)/0.45),o:1};if(u<1)return{p:lerp(c.b,s.p2,E((u-0.75)/0.25)),o:1};return{p:s.p2,o:1}}
    // 4. bajada al nivel 3 por la canaleta ancha de su bandeja
    const d=s.code>>1,w=G.ch2[s.code],a=w.a,b=w.b,m0=T[5]+d*0.5+(s.code&1)*0.18+(2-s.layer)*0.1;
    const fade=t>T[7]?1-cl((t-T[7])/(T[8]-T[7])):1;
    const u=(t-m0)/0.9;
    if(u<=0)return{p:s.p2,o:1};if(u<0.3)return{p:lerp(s.p2,a,E(u/0.3)),o:1};if(u<0.75)return{p:lerp(a,b,(u-0.3)/0.45),o:1};if(u<1)return{p:lerp(b,s.p3,E((u-0.75)/0.25)),o:1};
    return{p:s.p3,o:fade};
  }
  const START=[T[0],T[1],T[2],T[3],T[4],T[6]];
  function stepOf(t){for(let i=START.length-1;i>=0;i--)if(t>=START[i])return i;return 0}
  let clock=0,paused=false,last=-1;
  function draw(t){
    slips.forEach((el,i)=>{const r=slipAt(i,t);el.setAttribute("transform",ISO.tr(P,r.p));el.style.opacity=String(r.o)});
    // cuchilla y tira sin cortar
    const L0=G.strip.x-10,R0=G.strip.x+G.strip.w+10;
    const hx=t<T[1]?L0+(R0-L0)*cl((t-T[0])/(T[1]-T[0])):t<T[7]?R0:R0+(L0-R0)*E(cl((t-T[7])/(T[8]-T[7])));
    head.setAttribute("transform",ISO.tr(P,[hx,0,0]));
    const x0=t<T[1]?hx:G.strip.x-20,x1=G.strip.x+G.strip.w+20,y0=G.strip.y-4,y1=G.strip.y+G.strip.d+4;
    clip.setAttribute("d",ISO.path(hull([[x0,y0,0],[x1,y0,0],[x1,y1,0],[x0,y1,0],[x0,y0,6],[x1,y0,6],[x1,y1,6],[x0,y1,6]].map(p=>ISO.iso(p,P))),true));
    strip.style.opacity=String(t<T[1]?1:t<T[7]?0:cl((t-T[7])/(T[8]-T[7])));
    tags.forEach((el,c)=>{const on=t>=T[2]+c*0.22&&t<T[8];el.toggleAttribute("data-on",on);el.querySelector("[data-ink]").style.opacity=on?"1":"0"});
    cards.forEach((el,c)=>{const on=t>=T[3]+c*0.2&&t<T[8];el.toggleAttribute("data-on",on);el.querySelector("[data-ink]").style.opacity=on?"1":"0"});
    const bf=t<T[6]?0:t>T[7]?1-cl((t-T[7])/0.6):E(cl((t-T[6])/0.8));
    bridge.style.opacity=String(bf);bridge.setAttribute("transform",ISO.tr(P,[0,0,-6*(1-bf)]));
    const st=stepOf(t);
    if(st!==last){last=st;readout.textContent=(st<5?"Paso "+(st+1)+" · ":"")+STEPS[st][0]+": "+STEPS[st][1];keys.forEach((b,i)=>b.setAttribute("aria-pressed",String(i===st)))}
  }
  const END=T[T.length-1];
  const run=ISO.loop(stage,(dt,calm)=>{
    if(calm){draw(T[7]-0.01);return false}
    if(!paused){clock+=dt;if(clock>=END)clock=0}
    draw(clock);return true;
  });
  const STOP=[T[1],T[2],T[3],T[4],T[6],T[7]];
  keys.forEach((b,i)=>b.addEventListener("click",()=>{clock=ISO.still.matches?STOP[i]-0.01:START[i];draw(clock);run()}));
  stage.addEventListener("pointerenter",()=>{paused=true});stage.addEventListener("pointerleave",()=>{paused=false;run()});
  stage.addEventListener("keydown",e=>{const s=stepOf(clock);let n=null;if(e.key==="ArrowRight"||e.key==="ArrowDown")n=Math.min(5,s+1);if(e.key==="ArrowLeft"||e.key==="ArrowUp")n=Math.max(0,s-1);if(n===null)return;e.preventDefault();clock=ISO.still.matches?STOP[n]-0.01:START[n];draw(clock);run()});
  draw(ISO.still.matches?T[7]-0.01:0);
})();
`;
  return { html, css, live };
}
