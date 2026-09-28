// common.js — shared helpers for the chapter files.
const PL = (id, seed = 5) => `../plates/img/${id}_s${seed}.png`;
const STK = name => `assets/stk/${name}.png`;
// time of the n-th display word in lyric line li that starts with `word`
function wt(li, word, n = 0) {
  const L = LYR[li]; let c = 0; const q = norm(word);
  for (const w of L.words) if (norm(w.w).startsWith(q)) { if (c++ === n) return w.s; }
  console.warn('no word', li, word); return L.start;
}
const we = (li, word, n = 0) => { const L = LYR[li]; let c = 0; const q = norm(word); for (const w of L.words) if (norm(w.w).startsWith(q)) { if (c++ === n) return w.e; } return L.end; };
// a camera keyframed over the shot
const camAt = (o, lt, dur) => { const k = (o.ease || easeInOut)(lt / dur), c0 = o.cam0 || { z: 1.04 }, c1 = o.cam1 || { z: 1.14 }, c = {}; for (const key of ['x', 'y', 'z', 'r']) if (c0[key] != null || c1[key] != null) c[key] = lerp(c0[key] ?? (key === 'z' ? 1 : key === 'r' ? 0 : .5), c1[key] ?? c0[key] ?? (key === 'z' ? 1 : key === 'r' ? 0 : .5), k); return c; };
// plays the LTX clip for a plate if it exists (from `off` seconds, at `speed`), else the still with a camera move
const BANDED = new Set(['p39_whale', 'c2_drive', 'b48_grounded', 'f_party', 'p44_answerkey']);
async function plateOrClip(id, lt, dur, o = {}) {
  try { return await plateOrClip0(id, lt, dur, o); } finally { if (BANDED.has(id)) { I.save(); I.fillStyle = INK.paper; I.fillRect(0, H - 92, W, 92); I.fillStyle = INK.navy; I.fillRect(0, H - 94, W, 4); I.restore(); } }
}
async function plateOrClip0(id, lt, dur, o = {}) {
  const c = camAt(o, lt, dur);
  const cut = (typeof CUTS !== 'undefined' && CUTS[id]) || {};
  if (CLIPS[id] && !o.still && !cut.still) {
    let ct = lt * (cut.speed ?? o.speed ?? 1); if (cut.pp) { const m = ct % (2 * cut.pp); ct = m < cut.pp ? m : 2 * cut.pp - m; }   // ping-pong the clean stretch
    const img = await FRAME(id, (cut.off ?? o.off ?? 0) + ct); cover(I, img, c);
  }
  else {
    let img; try { img = await IMG(PL(id, o.seed)); } catch (e) { CACHE.delete(PL(id, o.seed)); fillAll(I, INK.blue); text(S, 'missing ' + id, W / 2, H / 2, { size: 60, font: F.mono, col: INK.paper }); return; }
    cover(I, img, c);
  }
}
// beat punch: zoom kick on beats while active
function beatPunch(t, amt = .02, k = 7) { POST.punch = Math.max(POST.punch, amt * pulse(t, k)); }
function downPunch(t, amt = .035) { POST.punch = Math.max(POST.punch, amt * pulseDown(t, 6)); }
// flood the image layer with a solid ink
function flood(col) { fillAll(I, col); }
// sections where the karaoke bar is off (hook type carries the words)
const BAR_OFF = [[0, 12.3], [31.6, 43.9], [82.7, 95.0], [120.8, 134.6], [172.4, 184.55], [193.1, 999]];
const barOn = t => !BAR_OFF.some(([a, b]) => t >= a && t < b);
// typewriter text on the spot layer
function typeOn(t, s, x, y, t0, cps, o = {}) {
  const n = Math.floor(clamp((t - t0) * cps, 0, s.length)); if (t < t0) return 0;
  const shown = s.slice(0, n) + ((Math.floor(t * 3) % 2 === 0 || n < s.length) && o.cursor !== false ? '▌' : '');
  text(S, shown, x, y, { size: o.size || 48, font: o.font || F.mono, align: o.align || 'left', col: o.col || INK.navy, knock: o.knock });
  return n;
}
// a hand-drawn bar chart bar
function inkBar(g, x, y, w, h, col, t, key) { g.fillStyle = col; roughRect(g, x, y - h, w, h, t, key, 2.5); g.fill(); g.strokeStyle = INK.navy; g.lineWidth = 4; roughRect(g, x, y - h, w, h, t, key, 2.5); g.stroke(); }
// a big number that slams in
function bigNum(t, s, x, y, size, col, t0, o = {}) { slam(t, { w: s, s: t0, x, y, size, col, rot: o.rot ?? -.04 }, { until: o.until, shadowCol: o.shadowCol || INK.navy }); }
// paper-puppet head: swaps expression cutouts on the vocal envelope
async function singingHead(t, x, y, h, o = {}) {
  const v = aud('voc', t), heads = o.heads || ['lexi_3', 'lexi_5', 'lexi_4'];
  const id = v < .25 ? heads[0] : v < .62 ? heads[1] : heads[2];
  const bob = Math.sin(bpOf(t) * Math.PI) * 10 * (o.bob ?? 1), tilt = Math.sin(bpOf(t) * Math.PI * .5) * .06;
  sticker(await SAFE(STK(id)), x, y + bob, h * (1 + .04 * pulse(t, 8)), { rot: tilt + (o.rot || 0), k: o.k ?? 1 });
}
// image that may not exist yet (stickers still generating): resolves to a tiny transparent canvas instead of throwing
const BLANK = mkCanvas(4, 4);
const SAFE = src => IMG(src).catch(() => { CACHE.delete(src); return BLANK; });
