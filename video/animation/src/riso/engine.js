// engine.js — "RISO LIVE" compositor for Happy Birthday to Me (Self-Supervised).
//
// Every frame is a pure async function of t. Scenes draw in full colour onto two 2D layers:
//   IMG  (ctx `I`): plates, video frames, cutout stickers, painted shapes. It gets SEPARATED into four riso inks
//                   (fluoro pink, blue, yellow, navy) and HALFTONED with rotated dot screens.
//   SPOT (ctx `S`): typography, HUD, vector graphics drawn in exact ink colours. It prints as solid ink
//                   (no halftone) with ink grain and misregistration. Paper-coloured pixels knock out the image.
// The WebGL pass (riso()) multiplies the inks over a paper texture, so everything looks printed.
//
// Scene API (see fx.js for the helpers):
//   shots([[t0, fn, opts], ...])   fn = async (t, lt, dur) => {...}   opts.tin = ['dots'|'tear'|'slide'|'flash'|'cut', seconds]
//   await IMG(path) · await FRAME(clipId, seconds) · cover(I, img, cam) · INK.pink etc.
const W = window.CANVAS_W || 1920, H = window.CANVAS_H || 1080, FPS = 24;   // poster.html sets CANVAS_W/H for banners and thumbnails
const DUR = PROJECT.duration, BPM = PROJECT.bpm, BEAT = 60 / BPM, OFF = PROJECT.offset || 0, BOIL = 12;
const TAU = Math.PI * 2;
const INK = { paper: '#F4EDDB', pink: '#FF4FA3', blue: '#2D5BD6', yellow: '#FFD83A', navy: '#25224A', white: '#F4EDDB' };

// ---------------- math & timing ----------------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, x) => a + (b - a) * x;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const easeIn = x => clamp(x) ** 3;
const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
const easeInOut = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const backOut = (x, s = 1.9) => { x = clamp(x); return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
const elasticOut = x => { x = clamp(x); return x === 0 || x === 1 ? x : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * TAU / 3) + 1; };
const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const hashS = s => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0) / 4294967296; };
const kf = (t, keys, e = ease) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) {
    const [t0, v0] = keys[i - 1], [t1, v1] = keys[i], k = e((t - t0) / (t1 - t0));
    return Array.isArray(v0) ? v0.map((v, j) => lerp(v, v1[j], k)) : lerp(v0, v1, k);
  }
  return keys[keys.length - 1][1];
};
const bpOf = t => (t - OFF) / BEAT;
const beatN = t => Math.floor(bpOf(t));
// 1 on each beat, decaying; k = sharpness
const pulse = (t, k = 6) => { const b = SONG.beats; let i = 0, lo = 0, hi = b.length - 1; while (lo <= hi) { const m = (lo + hi) >> 1; if (b[m] <= t) { i = m; lo = m + 1; } else hi = m - 1; } return t < b[0] ? 0 : Math.exp(-(t - b[i]) * k); };
const pulseDown = (t, k = 4) => { const b = SONG.downbeats; let last = -99; for (const x of b) { if (x <= t) last = x; else break; } return Math.exp(-(t - last) * k); };
const lastBeat = t => { let last = 0; for (const x of SONG.beats) { if (x <= t) last = x; else break; } return last; };
const boilT = t => Math.floor(t * BOIL);
// hand-made wobble that changes 12x per second, stable per key
const boil = (t, key, a = 1) => (hashS(key + '|' + boilT(t)) * 2 - 1) * a;
// deterministic random stream
function rng(seed) { let s = Math.floor(hashS(seed) * 2147483646) + 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

// ---------------- canvases ----------------
function mkCanvas(w = W, h = H) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
const LAYERS = [0, 1].map(() => ({ img: mkCanvas(), spot: mkCanvas() }));
let I = LAYERS[0].img.getContext('2d'), S = LAYERS[0].spot.getContext('2d');
const maskC = mkCanvas(), MASK = maskC.getContext('2d');
const tmpC = mkCanvas(), TMP = tmpC.getContext('2d');

// ---------------- assets ----------------
const CACHE = new Map();
const IMG = (src) => {
  if (CACHE.has(src)) { const v = CACHE.get(src); CACHE.delete(src); CACHE.set(src, v); return v; }
  const p = new Promise((ok, bad) => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => bad(new Error('missing ' + src)); im.src = src; })
;
  CACHE.set(src, p);
  if (CACHE.size > 400) CACHE.delete(CACHE.keys().next().value);
  return p;
};
// clips: assets/clips/<id>/f0001.jpg ... (24 fps), CLIPS[id] = frame count (clips.js)
const FRAME = (id, s, loop = false) => {
  const n = (CLIPS[id]) || 1; let f = Math.floor(s * FPS);
  f = loop ? ((f % n) + n) % n : clamp(f, 0, n - 1);
  return IMG(`assets/clips/${id}/f${String(f + 1).padStart(4, '0')}.jpg`);
};

// ---------------- drawing basics ----------------
// draw img to cover the frame; cam = {x, y (0..1 focus in image), z zoom, r rotation, dx, dy (px)}
function cover(g, img, cam = {}) {
  const z = cam.z ?? 1, fx = cam.x ?? .5, fy = cam.y ?? .5;
  const s = Math.max(W / img.width, H / img.height) * z, w = img.width * s, h = img.height * s;
  let x = W / 2 - fx * w, y = H / 2 - fy * h;
  x = w >= W ? clamp(x, W - w, 0) : (W - w) / 2; y = h >= H ? clamp(y, H - h, 0) : (H - h) * (cam.ay ?? .5);
  if (w < W - 2 || h < H - 2) {   // smaller than the frame: a print pasted on the paper, with a hard shadow
    g.save(); g.fillStyle = INK.navy; g.fillRect(x + 14, y + 16, w, h); g.restore();
  }
  g.save();
  if (cam.r) { g.translate(W / 2, H / 2); g.rotate(cam.r); g.translate(-W / 2, -H / 2); }
  g.drawImage(img, x + (cam.dx || 0), y + (cam.dy || 0), w, h);
  g.restore();
}
function fillAll(g, col) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.fillStyle = col; g.fillRect(0, 0, W, H); g.restore(); }
function clearAll(g) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H); g.restore(); }

// ---------------- timeline ----------------
const SHOTS = [];
function shots(list) { SHOTS.push(...list.map(([t0, fn, o]) => ({ t0, fn, o: o || {} }))); SHOTS.sort((a, b) => a.t0 - b.t0); }
const LOOPS = {};
let OVERLAYS = [];   // async (t) => {} drawn after shots on top (lyric bar, HUD)
let POST = { punch: 0, shake: [0, 0], dot: 7, grain: 1, mis: 1, misKick: 1, flash: 0, flashCol: INK.yellow, bypass: 0, invert: 0, mono: 0, monoCol: INK.pink };
let CUR = null;      // current shot info {i, lt, dur}

async function drawShot(i, t, set) {
  const sh = SHOTS[i]; I = LAYERS[set].img.getContext('2d'); S = LAYERS[set].spot.getContext('2d');
  fillAll(I, INK.paper); clearAll(S);
  I.save(); S.save();
  const end = i + 1 < SHOTS.length ? SHOTS[i + 1].t0 : DUR;
  CUR = { i, lt: t - sh.t0, dur: end - sh.t0, t0: sh.t0 };
  await sh.fn(t, t - sh.t0, end - sh.t0);
  I.restore(); S.restore();
}
function shotIndex(t) { let i = 0; while (i + 1 < SHOTS.length && t >= SHOTS[i + 1].t0) i++; return i; }

// transition masks: draw white where the NEW shot shows, p = 0..1
const TRANS = {
  cut: (g, p) => { if (p > 0) fillAll(g, '#fff'); },
  flash: (g, p) => fillAll(g, '#fff'),
  reprint: (g, p) => fillAll(g, '#fff'),
  dots: (g, p, seed) => {    // halftone dot grow, sweeping diagonally
    const cell = 64, cols = Math.ceil(W / cell) + 1, rows = Math.ceil(H / cell) + 1; g.fillStyle = '#fff';
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const d = (c / cols * .7 + r / rows * .3), k = clamp((p * 1.6 - d * .6) / .4);
      if (k <= 0) continue; const rad = k * cell * .75;
      g.beginPath(); g.arc(c * cell + (r % 2) * cell / 2, r * cell, rad, 0, TAU); g.fill();
    }
  },
  tear: (g, p, seed) => { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(-10, -10); for (const [x, y] of tearPts(p, seed)) g.lineTo(x, y); g.lineTo(-10, H + 20); g.closePath(); g.fill(); },
  slide: (g, p) => { const x = lerp(W, 0, easeInOut(p)); g.fillStyle = '#fff'; g.fillRect(x, 0, W, H); },
  up: (g, p) => { const y = lerp(H, 0, easeOut(p)); g.fillStyle = '#fff'; g.fillRect(0, y, W, H); },
  iris: (g, p) => { g.fillStyle = '#fff'; g.beginPath(); g.arc(W / 2, H / 2, easeIn(p) * 1200, 0, TAU); g.fill(); },
  stripes: (g, p) => { g.fillStyle = '#fff'; const n = 9; for (let i = 0; i < n; i++) { const k = easeOut(clamp(p * 1.5 - i / n * .5)); g.fillRect(0, i * H / n, W * k, H / n + 1); } },
};

// the torn edge line (shared by the mask and the paper edge drawn on top)
function tearPts(p, seed) { const x = lerp(-200, W + 200, easeInOut(p)), R = rng('tear' + seed), P = []; for (let y = -10; y <= H + 20; y += 18) P.push([x + (R() - .5) * 60 + Math.sin(y * .01) * 40, y]); return P; }
const EDGES = {
  tear: (g, p, seed) => {   // a strip of torn paper with a navy shadow along the seam
    const P = tearPts(p, seed); g.save();
    g.strokeStyle = INK.navy; g.globalAlpha = .9; g.lineWidth = 16; g.beginPath(); P.forEach(([x, y], i) => i ? g.lineTo(x + 10, y + 6) : g.moveTo(x + 10, y + 6)); g.stroke();
    g.globalAlpha = 1; g.strokeStyle = INK.paper; g.lineWidth = 22; g.beginPath(); P.forEach(([x, y], i) => i ? g.lineTo(x - 2, y) : g.moveTo(x - 2, y)); g.stroke(); g.restore();
  },
};
async function drawWorld(t) {
  POST = { punch: 0, shake: [0, 0], dot: 7, grain: 1, mis: 1, misKick: 1, flash: 0, flashCol: INK.yellow, bypass: 0, invert: 0, mono: 0, monoCol: INK.pink };
  if (window.LOOP) { I = LAYERS[0].img.getContext('2d'); S = LAYERS[0].spot.getContext('2d'); fillAll(I, INK.paper); clearAll(S); await window.LOOP(t); }
  else if (!SHOTS.length) { I = LAYERS[0].img.getContext('2d'); S = LAYERS[0].spot.getContext('2d'); fillAll(I, INK.paper); clearAll(S); }
  else {
    const i = shotIndex(t), sh = SHOTS[i], tin = sh.o.tin, lt = t - sh.t0;
    if (tin && i > 0 && lt < tin[1] && tin[0] !== 'cut' && tin[0] !== 'reprint') {
      const p = lt / tin[1];
      const post0 = { ...POST };
      await drawShot(i - 1, t, 1); const postA = POST; POST = { ...post0 };
      await drawShot(i, t, 0);
      // mask: where the new shot shows
      clearAll(MASK); MASK.save(); TRANS[tin[0]](MASK, p, i); MASK.restore();
      for (const L of ['img', 'spot']) {
        // TMP = old layer with the mask cut out, then draw it UNDER the new one
        const nc = LAYERS[0][L].getContext('2d');
        nc.save(); nc.globalCompositeOperation = 'destination-in'; nc.drawImage(maskC, 0, 0); nc.restore();
        const oc = LAYERS[1][L].getContext('2d'); oc.save(); oc.globalCompositeOperation = 'destination-out'; oc.drawImage(maskC, 0, 0); oc.restore();
        nc.save(); nc.globalCompositeOperation = 'destination-over'; nc.drawImage(LAYERS[1][L], 0, 0); nc.restore();
      }
      if (EDGES[tin[0]]) EDGES[tin[0]](LAYERS[0].spot.getContext('2d'), p, i);
      if (tin[0] === 'flash') POST.flash = Math.max(POST.flash, 1 - p);
      if (postA.flash > POST.flash * .5) { POST.flash = Math.max(POST.flash, postA.flash * (1 - p)); POST.flashCol = postA.flashCol; }
      if (postA.mono) { POST.mono = postA.mono * (1 - p); POST.monoCol = postA.monoCol; }
      I = LAYERS[0].img.getContext('2d'); S = LAYERS[0].spot.getContext('2d');
    } else {
      await drawShot(i, t, 0);
      if (tin && tin[0] === 'flash' && lt < tin[1]) POST.flash = Math.max(POST.flash, 1 - lt / tin[1]);
      if (tin && tin[0] === 'reprint' && lt < 3 / FPS) { POST.mono = 1; POST.monoCol = lt < 1.5 / FPS ? (sh.o.c1 || INK.pink) : (sh.o.c2 || INK.blue); }
    }
  }
  I = LAYERS[0].img.getContext('2d'); S = LAYERS[0].spot.getContext('2d');
  for (const o of OVERLAYS) { I.save(); S.save(); await o(t); I.restore(); S.restore(); }
}

// ---------------- riso print pass (WebGL2) ----------------
const outC = mkCanvas(); let GL, PROG, TEX = {};
const VS = `#version 300 es
in vec2 p; out vec2 uv; void main(){ uv = p*.5+.5; uv.y = 1.-uv.y; gl_Position = vec4(p,0,1); }`;
const FS = `#version 300 es
precision highp float;
in vec2 uv; out vec4 o;
uniform sampler2D img, spot, paper, noise;
uniform vec2 res; uniform float dot, t, grain, mis, punch, flash, bypass, invert;
uniform vec2 shake; uniform vec3 flashCol, monoCol; uniform float mono;
uniform vec3 inkP, inkB, inkY, inkK, paperC;
uniform mat3 inv3; uniform vec2 off[4];
vec3 D(vec3 c){ return -log(clamp(c/paperC, .02, 1.)); }
vec2 rot(vec2 v, float a){ float c=cos(a), s=sin(a); return vec2(c*v.x-s*v.y, s*v.x+c*v.y); }
vec3 srcAt(vec2 u){
  // gentle blur (kills source halftone → no moiré)
  vec2 px = 1./res; vec3 c = vec3(0.);
  c += texture(img, u).rgb*.4;
  c += texture(img, u+vec2(1.5,0)*px).rgb*.15; c += texture(img, u-vec2(1.5,0)*px).rgb*.15;
  c += texture(img, u+vec2(0,1.5)*px).rgb*.15; c += texture(img, u-vec2(0,1.5)*px).rgb*.15;
  return c;
}
vec4 sep(vec3 c){
  vec3 d = D(c), dK = D(inkK);
  float k = clamp(min(d.r/dK.r, min(d.g/dK.g, d.b/dK.b)) * 1.05 - .08, 0., 1.);
  vec3 r = d - k*dK;
  vec3 a = clamp(inv3 * r, 0., 1.2);
  return vec4(a, k);
}
float screen(vec2 fragPx, float cov, float ang, float cell){
  cov = clamp(cov, 0., 1.);
  if (cov < .02) return 0.;
  vec2 q = rot(fragPx, ang) / cell; vec2 f = fract(q) - .5;
  float r = sqrt(cov) * .72; float d = length(f);
  float aa = 1.2 / cell;
  float v = 1. - smoothstep(r - aa, r + aa, d);
  return mix(v, 1., smoothstep(.82, .97, cov));
}
float nz(vec2 u){ return texture(noise, u).r; }
void main(){
  vec2 frag = uv*res;
  vec2 u0 = (uv - .5) / (1. + punch) + .5 + shake/res;
  vec3 paperT = texture(paper, uv).rgb;
  // per-ink misregistration: sample at offsets
  vec4 cP = sep(srcAt(u0 + off[0]*mis/res)), cB = sep(srcAt(u0 + off[1]*mis/res)), cY = sep(srcAt(u0 + off[2]*mis/res)), cK = sep(srcAt(u0 + off[3]*mis/res));
  float g1 = mix(1., .78 + .3*nz(uv*3.1), grain), g2 = mix(1., .78 + .3*nz(uv*2.7 + vec2(.3,.7)), grain);
  float g3 = mix(1., .8 + .28*nz(uv*3.3 + vec2(.6,.1)), grain), g4 = mix(1., .82 + .25*nz(uv*2.3 + vec2(.2,.9)), grain);
  float aP = screen(frag + off[0]*mis, cP.x, .2618, dot) * g1;
  float aB = screen(frag + off[1]*mis, cB.y, 1.309, dot) * g2;
  float aY = screen(frag + off[2]*mis, cY.z, 0., dot) * g3;
  float aK = screen(frag + off[3]*mis, cK.w, .7854, dot*.85) * g4;
  vec3 col = paperT;
  if (mono > 0.) {
    vec3 sc0 = srcAt(u0); vec3 q0 = sc0/paperC; float lum = q0.r*.3 + q0.g*.55 + q0.b*.15;
    float aM = screen(frag, clamp((1.-lum)*1.25, 0., 1.), .7854, dot) * g1;
    vec3 monoPrint = paperT * mix(vec3(1.), monoCol/paperC, aM);
    aP *= 1.-mono; aB *= 1.-mono; aY *= 1.-mono; aK *= 1.-mono;
    col = mix(col, monoPrint, mono);
  }
  col *= mix(vec3(1.), inkY/paperC, clamp(aY,0.,1.));
  col *= mix(vec3(1.), inkP/paperC, clamp(aP,0.,1.));
  col *= mix(vec3(1.), inkB/paperC, clamp(aB,0.,1.));
  col *= mix(vec3(1.), inkK/paperC, clamp(aK,0.,1.));
  if (bypass > 0.) col = mix(col, texture(img, u0).rgb * paperT/paperC, bypass);
  // spot layer: solid inks, slight misregistration, ink grain; paper-coloured pixels knock out
  vec4 s = texture(spot, uv + vec2(.7,-.5)/res*mis);
  if (s.a > .003) {
    // spot inks print opaque, as if the image were knocked out under them (legible type, clean colours)
    vec3 sc = s.rgb / s.a;
    float gs = mix(1., .88 + .16*nz(uv*4.1 + vec2(.9,.4)), grain);
    vec3 printed = paperT * mix(vec3(1.), sc/paperC, gs);
    col = mix(col, printed, s.a);
  }
  if (flash > 0.) col = mix(col, paperT * flashCol/paperC, flash);
  if (invert > 0.) col = mix(col, vec3(1.)-col*.9, invert);
  o = vec4(col, 1.);
}`;
function hex3(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
function inv3x3(m) { // m: column-major [a0 b0 c0, a1 b1 c1, a2 b2 c2] as 3 column vectors
  const [a, b, c, d, e, f, g, h, i] = m; const A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g;
  const det = a * A + b * B + c * C;
  return [A, -(b * i - c * h), b * f - c * e, B, a * i - c * g, -(a * f - c * d), C, -(a * h - b * g), a * e - b * d].map(v => v / det);
}
function initGL() {
  outC.width = W; outC.height = H;
  GL = outC.getContext('webgl2', { preserveDrawingBuffer: true, premultipliedAlpha: false });
  const sh = (type, src) => { const s = GL.createShader(type); GL.shaderSource(s, src); GL.compileShader(s); if (!GL.getShaderParameter(s, GL.COMPILE_STATUS)) throw new Error(GL.getShaderInfoLog(s)); return s; };
  PROG = GL.createProgram(); GL.attachShader(PROG, sh(GL.VERTEX_SHADER, VS)); GL.attachShader(PROG, sh(GL.FRAGMENT_SHADER, FS)); GL.linkProgram(PROG);
  if (!GL.getProgramParameter(PROG, GL.LINK_STATUS)) throw new Error(GL.getProgramInfoLog(PROG));
  GL.useProgram(PROG);
  const buf = GL.createBuffer(); GL.bindBuffer(GL.ARRAY_BUFFER, buf); GL.bufferData(GL.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), GL.STATIC_DRAW);
  const loc = GL.getAttribLocation(PROG, 'p'); GL.enableVertexAttribArray(loc); GL.vertexAttribPointer(loc, 2, GL.FLOAT, false, 0, 0);
  ['img', 'spot', 'paper', 'noise'].forEach((n, k) => {
    const tx = GL.createTexture(); GL.activeTexture(GL.TEXTURE0 + k); GL.bindTexture(GL.TEXTURE_2D, tx);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR); GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    const wrap = n === 'noise' ? GL.REPEAT : GL.CLAMP_TO_EDGE;
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, wrap); GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, wrap);
    GL.uniform1i(GL.getUniformLocation(PROG, n), k); TEX[n] = { tx, unit: k };
  });
  GL.pixelStorei(GL.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  upload('paper', makePaper()); upload('noise', makeNoise());
  const u = n => GL.getUniformLocation(PROG, n);
  const P = hex3(INK.paper), ink = k => hex3(INK[k]);
  GL.uniform3fv(u('paperC'), P); GL.uniform3fv(u('inkP'), ink('pink')); GL.uniform3fv(u('inkB'), ink('blue')); GL.uniform3fv(u('inkY'), ink('yellow')); GL.uniform3fv(u('inkK'), ink('navy'));
  const d = k => hex3(INK[k]).map((v, j) => -Math.log(Math.max(v / P[j], .02)));
  const m = [...d('pink'), ...d('blue'), ...d('yellow')];   // columns = inks
  GL.uniformMatrix3fv(u('inv3'), false, inv3x3(m));
  GL.uniform2f(u('res'), W, H);
}
function upload(n, canvas) { GL.activeTexture(GL.TEXTURE0 + TEX[n].unit); GL.bindTexture(GL.TEXTURE_2D, TEX[n].tx); GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, canvas); }
function riso(t) {
  upload('img', LAYERS[0].img); upload('spot', LAYERS[0].spot);
  const u = n => GL.getUniformLocation(PROG, n);
  GL.uniform1f(u('dot'), POST.dot); GL.uniform1f(u('t'), boilT(t)); GL.uniform1f(u('grain'), POST.grain); GL.uniform1f(u('mis'), POST.mis * (1 + 3.5 * POST.misKick * pulseDown(t, 7) + (POST.jolt || 0)));
  GL.uniform1f(u('punch'), POST.punch); GL.uniform2fv(u('shake'), POST.shake); GL.uniform1f(u('flash'), POST.flash); GL.uniform3fv(u('flashCol'), hex3(POST.flashCol));
  GL.uniform1f(u('bypass'), POST.bypass); GL.uniform1f(u('mono'), POST.mono); GL.uniform3fv(u('monoCol'), hex3(POST.monoCol)); GL.uniform1f(u('invert'), POST.invert);
  // misregistration drifts a little per shot and boils slightly
  const b = boilT(t), sid = CUR ? CUR.i : 0, o = [];
  for (let k = 0; k < 4; k++) o.push((hash(sid * 7 + k) - .5) * 5 + (hash(b * 3 + k) - .5) * .35, (hash(sid * 11 + k + 50) - .5) * 4 + (hash(b * 5 + k + 9) - .5) * .35);
  o[6] = 0; o[7] = 0;  // navy is the key plate: keep it registered
  GL.uniform2fv(u('off[0]'), o);
  GL.viewport(0, 0, W, H); GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4);
}
function makePaper() {
  const c = mkCanvas(), g = c.getContext('2d'), R = rng('paper');
  g.fillStyle = INK.paper; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 60; i++) { const x = R() * W, y = R() * H, r = 150 + R() * 400, gr = g.createRadialGradient(x, y, 0, x, y, r), a = .05 * R(); gr.addColorStop(0, `rgba(150,120,80,${a})`); gr.addColorStop(1, 'rgba(150,120,80,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
  g.lineWidth = 1;
  for (let i = 0; i < 2500; i++) { const x = R() * W, y = R() * H, l = 4 + R() * 22, a = R() * TAU; g.strokeStyle = `rgba(110,88,60,${.03 + R() * .06})`; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + .6) * l * .5, y + Math.sin(a + .6) * l * .5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  const id = g.getImageData(0, 0, W, H), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const v = R() < .5 ? R() * R() * 22 : 0; d[i] -= v; d[i + 1] -= v; d[i + 2] -= v * 1.1; }
  g.putImageData(id, 0, 0);
  const vg = g.createRadialGradient(W / 2, H / 2, H * .5, W / 2, H / 2, H * 1.1); vg.addColorStop(0, 'rgba(90,70,50,0)'); vg.addColorStop(1, 'rgba(90,70,50,.22)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  return c;
}
function makeNoise() {
  const n = 512, c = mkCanvas(n, n), g = c.getContext('2d'), R = rng('noise');
  // blotchy ink-coverage noise: layered soft blobs + fine speckle
  g.fillStyle = '#808080'; g.fillRect(0, 0, n, n);
  for (let i = 0; i < 900; i++) { const x = R() * n, y = R() * n, r = 2 + R() * 30, v = Math.floor(R() * 255); for (const [ox, oy] of [[0, 0], [n, 0], [-n, 0], [0, n], [0, -n]]) { const gr = g.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, r); gr.addColorStop(0, `rgba(${v},${v},${v},.35)`); gr.addColorStop(1, `rgba(${v},${v},${v},0)`); g.fillStyle = gr; g.fillRect(x + ox - r, y + oy - r, 2 * r, 2 * r); } }
  const id = g.getImageData(0, 0, n, n), d = id.data; for (let i = 0; i < d.length; i += 4) { const s = R() < .08 ? -90 * R() : 0; d[i] = d[i + 1] = d[i + 2] = clamp(d[i] + s, 0, 255); }
  g.putImageData(id, 0, 0); return c;
}

// ---------------- render hooks (render.mjs contract) ----------------
let T = 0;
window.renderAt = async (t, type = 'image/png', q = .92) => { T = t; await drawWorld(t); riso(t); return outC.toDataURL(type, q); };
window.renderSheet = async (times, cols = 3, w = 640, crop = null) => {
  const [, , cw, ch] = crop || [0, 0, W, H], h = Math.round(w * ch / cw), rows = Math.ceil(times.length / cols), sc = mkCanvas(cols * w, rows * h);
  const c = sc.getContext('2d'), ms = [];
  for (let i = 0; i < times.length; i++) {
    const t0 = performance.now(); await drawWorld(times[i]); riso(times[i]); ms.push(Math.round(performance.now() - t0));
    const x = (i % cols) * w, y = Math.floor(i / cols) * h, [cx, cy] = crop || [0, 0];
    c.drawImage(outC, cx, cy, cw, ch, x, y, w, h);
    if (window.GRID) { // review aid: a 100 px coordinate grid in frame pixels
      const sx = w / cw, sy = h / ch; c.save(); c.lineWidth = 1; c.font = '11px monospace';
      for (let gx = Math.ceil(cx / 100) * 100; gx <= cx + cw; gx += 100) { c.strokeStyle = gx % 500 ? 'rgba(0,200,0,.35)' : 'rgba(0,160,0,.8)'; c.beginPath(); c.moveTo(x + (gx - cx) * sx, y); c.lineTo(x + (gx - cx) * sx, y + h); c.stroke(); if (gx % 200 === 0) { c.fillStyle = '#0a0'; c.fillText(gx, x + (gx - cx) * sx + 2, y + 36); } }
      for (let gy = Math.ceil(cy / 100) * 100; gy <= cy + ch; gy += 100) { c.strokeStyle = gy % 500 ? 'rgba(0,200,0,.35)' : 'rgba(0,160,0,.8)'; c.beginPath(); c.moveTo(x, y + (gy - cy) * sy); c.lineTo(x + w, y + (gy - cy) * sy); c.stroke(); if (gy % 200 === 0) { c.fillStyle = '#0a0'; c.fillText(gy, x + 2, y + (gy - cy) * sy - 2); } }
      c.restore();
    }
    c.fillStyle = 'rgba(0,0,0,.65)'; c.fillRect(x, y, 84, 24); c.fillStyle = '#fff'; c.font = '15px sans-serif'; c.fillText(times[i].toFixed(2) + 's', x + 6, y + 17);
  }
  return { url: sc.toDataURL('image/jpeg', .9), ms };
};
window.gpuInfo = () => { const e = GL.getExtension('WEBGL_debug_renderer_info'); return e ? GL.getParameter(e.UNMASKED_RENDERER_WEBGL) : GL.getParameter(GL.RENDERER); };

window.addEventListener('load', async () => {
  initGL();
  await Promise.all(['700px "Hook"', '700px "Serif"', 'italic 400px "Serif"', '40px "Pixel"', '40px "Mono"'].map(f => document.fonts.load(f)));
  if (window.PRELOAD) await Promise.all(PRELOAD.map(IMG));
  window.ready = true;
  if (!location.search.includes('render')) devUI();
});
function devUI() {
  const view = document.getElementById('out'), vx = view.getContext('2d'), s = document.getElementById('scrub'), lab = document.getElementById('tt');
  s.max = window.LOOP ? window.LOOP.len : DUR;
  let busy = false, want = null;
  const go = async () => { if (busy) return; busy = true; while (want != null) { const t = want; want = null; const t0 = performance.now(); await drawWorld(t); riso(t); vx.drawImage(outC, 0, 0); lab.textContent = `${t.toFixed(2)}s  ·  ${Math.round(performance.now() - t0)} ms/frame`; } busy = false; };
  s.addEventListener('input', () => { want = +s.value; go(); });
  want = +(new URLSearchParams(location.search).get('t') || 0); s.value = want; go();
}
