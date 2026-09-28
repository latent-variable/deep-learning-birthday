// fx.js — typography, HUD, stickers, stamps and effects for the RISO LIVE engine.
// Spot-layer drawing (S) prints as solid ink; image-layer drawing (I) gets separated and halftoned.
const F = { hook: '"Hook"', serif: '"Serif"', pixel: '"Pixel"', mono: '"Mono"' };

// ---------------- lyric timing: display tokens with times ----------------
const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
function buildLyrics() {
  return SONG.lines.map((L, li) => {
    const toks = L.text.split(/\s+/).filter(Boolean);
    const aw = L.words; const letters = aw.map(w => norm(w.w)).join('');
    const tl = toks.map(tk => norm(tk).length || 1), tot = tl.reduce((a, b) => a + b, 0), totA = letters.length || 1;
    // char position -> time using aligned words (interpolated within each word)
    const cum = []; let c = 0; for (const w of aw) { const n = Math.max(1, norm(w.w).length); cum.push([c, c + n, w.s, w.e]); c += n; }
    const timeAt = pos => { pos = pos * totA / tot; for (const [a, b, s, e] of cum) if (pos < b) return s + (e - s) * clamp((pos - a) / (b - a)); return cum.length ? cum[cum.length - 1][3] : L.end; };
    let p = 0; const words = toks.map((tk, i) => { const s = timeAt(p), e = timeAt(p + tl[i] - .01); p += tl[i]; return { w: tk, s, e: Math.max(e, s + .08) }; });
    return { i: li, section: L.section, text: L.text, start: L.start, end: L.end, words };
  });
}
const LYR = buildLyrics();
const lineAt = t => { let cur = null; for (const L of LYR) if (t >= L.start - .12) cur = L; return cur; };
const lineIdx = t => { const L = lineAt(t); return L ? L.i : -1; };

// ---------------- text helpers ----------------
function font(g, size, fam = F.hook, style = '') { g.font = `${style} ${fam === F.hook ? 800 : 400} ${size}px ${fam}`.trim(); }
function text(g, s, x, y, o = {}) {
  g.save(); g.translate(x, y); if (o.rot) g.rotate(o.rot); if (o.sc) g.scale(o.sc, o.sc * (o.sy ?? 1));
  font(g, o.size || 60, o.font || F.hook, o.style || ''); g.textAlign = o.align || 'center'; g.textBaseline = o.base || 'middle';
  if (o.track) g.letterSpacing = o.track + 'px';
  g.globalAlpha = o.alpha ?? 1;
  if (o.knock) { g.lineJoin = 'round'; g.lineWidth = o.knock; g.strokeStyle = INK.paper; g.strokeText(s, 0, 0); }
  if (o.shadow) { g.fillStyle = o.shadowCol || INK.navy; g.fillText(s, o.shadow, o.shadow); }
  if (o.stroke) { g.lineJoin = 'round'; g.lineWidth = o.strokeW || 4; g.strokeStyle = o.stroke; g.strokeText(s, 0, 0); }
  if (!o.noFill) { g.fillStyle = o.col || INK.navy; g.fillText(s, 0, 0); }
  g.restore();
}
function measure(g, s, size, fam = F.hook, style = '') { g.save(); font(g, size, fam, style); const w = g.measureText(s).width; g.restore(); return w; }
// rough, boiling rectangle path (hand-cut)
function roughRect(g, x, y, w, h, t, key, a = 3) {
  g.beginPath(); g.moveTo(x + boil(t, key + 1, a), y + boil(t, key + 2, a)); g.lineTo(x + w + boil(t, key + 3, a), y + boil(t, key + 4, a));
  g.lineTo(x + w + boil(t, key + 5, a), y + h + boil(t, key + 6, a)); g.lineTo(x + boil(t, key + 7, a), y + h + boil(t, key + 8, a)); g.closePath();
}

// ---------------- LIVE stamp (top right) ----------------
let STAMP = null;   // set by timeline: [[t, 'YYYY.MM.DD'], ...]
function stampAt(t) { let s = STAMP[0]; for (const x of STAMP) if (t >= x[0]) s = x; return s; }
function liveStamp(t, o = {}) {
  if (!STAMP) return; const [t0, date, label] = stampAt(t), age = t - t0, g = S;
  const x = W - 54, y = 48, lab = label || 'LIVE', ds = 54;
  const blink = (Math.floor(t * 2) % 2) === 0;
  const k = backOut(seg(age, 0, .3));
  g.save(); g.translate(x, y); g.rotate(-.015 + boil(t, 'st', .004)); g.scale(lerp(1.25, 1, k), lerp(1.25, 1, k));
  font(g, ds, F.mono); const wDate = g.measureText(date).width; const bw = Math.max(wDate, 150) + 50, bh = 112;
  g.fillStyle = INK.paper; roughRect(g, -bw, -8, bw, bh, t, 'stb', 1.5); g.fill();
  g.strokeStyle = INK.navy; g.lineWidth = 4; roughRect(g, -bw, -8, bw, bh, t, 'stb', 1.5); g.stroke();
  if (blink || lab !== 'LIVE') { g.fillStyle = INK.pink; g.beginPath(); g.arc(-bw + 30, 22, 10, 0, TAU); g.fill(); }
  text(g, lab, -bw + 50, 23, { size: 28, font: F.pixel, align: 'left', col: INK.pink });
  const roll = easeOut(seg(age, 0, .35));
  g.save(); g.beginPath(); g.rect(-bw + 10, 40, bw - 20, 62); g.clip();
  text(g, date, -bw + 25, 73 + (1 - roll) * 56, { size: ds, font: F.mono, align: 'left', col: INK.navy });
  g.restore();
  g.restore();
}

// ---------------- karaoke lyric bar (bottom) ----------------
// style: 'bar' (default cream box, serif italic), 'none'
function lyricBar(t, o = {}) {
  const L = lineAt(t); if (!L || t > L.end + .45) return;
  const g = S, size = o.size || 72, fam = F.serif, style = 'italic', sp = size * .26, pad = 26, lh = size * 1.12;
  const inK = easeOut(seg(t, L.start - .12, L.start + .1)), outK = seg(t, L.end + .15, L.end + .45);
  const words = L.words, ws = words.map(w => measure(g, w.w, size, fam, style));
  // split into up to two balanced lines when too wide
  const total = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  let rows = [[0, words.length]];
  if (total > (o.maxW || 1500) && words.length > 3) {
    let best = 1, bd = 1e9; for (let k = 1; k < words.length; k++) { const a = ws.slice(0, k).reduce((x, y) => x + y, 0) + sp * (k - 1), b = total - a - sp; if (Math.abs(a - b) < bd) { bd = Math.abs(a - b); best = k; } }
    rows = [[0, best], [best, words.length]];
  }
  const rw = rows.map(([a, b]) => ws.slice(a, b).reduce((x, y) => x + y, 0) + sp * (b - a - 1)), maxw = Math.max(...rw);
  const yB = o.y || H - 70, y0 = yB - (rows.length - 1) * lh;
  g.save(); g.globalAlpha = 1 - outK; g.translate(0, (1 - inK) * 30);
  const bx = W / 2 - maxw / 2 - pad, by = y0 - size * .72, bw = maxw + pad * 2, bh = (rows.length - 1) * lh + size * 1.44;
  g.fillStyle = INK.paper; roughRect(g, bx, by, bw, bh, t, 'lb' + L.i, 2); g.fill();
  g.strokeStyle = INK.navy; g.lineWidth = 3; roughRect(g, bx, by, bw, bh, t, 'lb' + L.i, 2); g.stroke();
  rows.forEach(([a, b], r) => {
    let x = W / 2 - rw[r] / 2; const y = y0 + r * lh;
    for (let i = a; i < b; i++) {
      const w = words[i], on = t >= w.s, live = t < w.e + .08, k = seg(t, w.s, w.s + .12);
      if (on) {
        const hw = ws[i] * easeOut(seg(t, w.s, w.s + Math.min(.18, w.e - w.s + .05)));
        g.fillStyle = live ? INK.pink : INK.yellow;
        g.beginPath(); g.moveTo(x - 6, y - size * .42); g.lineTo(x + hw + 6, y - size * .46); g.lineTo(x + hw + 4, y + size * .36); g.lineTo(x - 4, y + size * .4); g.closePath(); g.fill();
      }
      text(g, w.w, x, y + 2 - (on && live ? 5 * (1 - k) : 0), { size, font: fam, style, align: 'left', col: on ? INK.navy : INK.blue, alpha: (1 - outK) * (on ? 1 : .85) });
      x += ws[i] + sp;
    }
  });
  g.restore();
}
// "the HUD is the camera": on a cut, detection brackets collapse from the frame edge onto the shot and tag it
function snapBox(t, lt, tag, o = {}) {
  if (lt > .7 || !tag) return; const k = easeOut(seg(lt, 0, .22)), a = 1 - seg(lt, .45, .7);
  const inset = lerp(-40, o.inset ?? 70, k), g = S; g.save(); g.globalAlpha = a;
  bbox(inset, inset, W - inset * 2, H - inset * 2 - 40, tag, null, .5, { col: o.col || INK.yellow, txt: INK.navy, size: 34, lw: 8, t });
  g.restore();
}

// ---------------- bounding box (object-detection label) ----------------
// age: seconds since it appeared. col: ink.
function bbox(x, y, w, h, label, score, age, o = {}) {
  if (age < 0) return; const g = o.g || S, col = o.col || INK.pink, t = o.t ?? T;
  const k = backOut(seg(age, 0, .25)), cl = Math.min(w, h) * .22 * k + 10, lw = o.lw || 5;
  const j = (n) => boil(t, 'bb' + label + n, 1.5);
  g.save(); g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'square';
  const X = x - (1 - k) * 30, Y = y - (1 - k) * 30, Wd = w + (1 - k) * 60, Hd = h + (1 - k) * 60;
  if (o.full) { g.globalAlpha = .9; g.strokeRect(X, Y, Wd, Hd); g.globalAlpha = 1; }
  const C = [[X, Y, 1, 1], [X + Wd, Y, -1, 1], [X, Y + Hd, 1, -1], [X + Wd, Y + Hd, -1, -1]];
  C.forEach(([cx, cy, sx, sy], i) => { g.beginPath(); g.moveTo(cx + j(i) , cy + sy * cl); g.lineTo(cx, cy); g.lineTo(cx + sx * cl, cy + j(i + 9)); g.stroke(); });
  if (label && age > .04) {
    const lab = label + (score != null ? ' ' + score.toFixed(2) : ''), sz = o.size || 30;
    const tw = measure(g, lab, sz, F.pixel) + 18, ty = Y - sz - 12 >= 0 ? Y - sz - 12 : Y + Hd;
    const typed = age > .1 ? lab.length : Math.ceil(lab.length * seg(age, .04, .1));
    g.fillStyle = col; g.fillRect(X - lw / 2, ty, tw, sz + 12);
    text(g, lab.slice(0, typed), X + 8, ty + (sz + 12) / 2 + 1, { size: sz, font: F.pixel, align: 'left', col: o.txt || INK.paper });
  }
  g.restore();
}

// ---------------- big kinetic hook type ----------------
// words: [{w, s, col?, size?, x?, y?, rot?}] — each slams in at s. Stays until `until`.
function slam(t, w, o = {}) {
  const age = t - w.s; if (age < 0) return; const g = o.g || S;
  const k = backOut(seg(age, 0, .18), 2.6), size = w.size || o.size || 200;
  const out = o.until != null ? seg(t, o.until, o.until + .12) : 0; if (out >= 1) return;
  const sc = lerp(1.6, 1, k) * (1 - out * .3), rot = (w.rot ?? 0) + boil(t, 'sl' + w.w + w.s, .006);
  text(g, w.w, w.x ?? W / 2, w.y ?? H / 2, { size, sc, rot, col: w.col || INK.navy, knock: o.knock ?? size * .09, shadow: o.shadow ?? size * .04, shadowCol: o.shadowCol || INK.pink, alpha: (1 - out) * clamp(k * 3), track: w.track ?? -size * .02 });
}
// Words of a lyric line as big stacked type, one row per `rows` groups; returns nothing.
function hookLine(t, li, o = {}) {
  const L = LYR[li]; if (!L) return; const rows = o.rows || [L.words.length], size = o.size || 170, g = S;
  const cols = o.cols || [INK.navy, INK.pink, INK.blue];
  let wi = 0, y = (o.y ?? H / 2) - (rows.length - 1) * size * .5;
  const until = o.until ?? L.end + .2;
  rows.forEach((n, r) => {
    const ws = L.words.slice(wi, wi + n); wi += n;
    const txt = ws.map(w => w.w.toUpperCase());
    const widths = txt.map(s => measure(g, s, size)); const sp = size * .22, tot = widths.reduce((a, b) => a + b, 0) + sp * (n - 1);
    let x = (o.x ?? W / 2) - tot / 2;
    ws.forEach((w, i) => { slam(t, { w: txt[i], s: w.s - .03, x: x + widths[i] / 2, y, size, col: cols[(r + i) % cols.length], rot: (hash(li * 13 + wi + i) - .5) * .08 }, { until, ...o.slam }); x += widths[i] + sp; });
    y += size * 1.0;
  });
}

// ---------------- stickers (cutout images with paper border + hard shadow) ----------------
const OUTLINE = new Map();
function outlined(img, r = 10) {
  const key = (img.src || 'c') + '|' + r; if (OUTLINE.has(key)) return OUTLINE.get(key);
  const c = mkCanvas(img.width + r * 4, img.height + r * 4), g = c.getContext('2d');
  for (let a = 0; a < TAU; a += TAU / 16) g.drawImage(img, r * 2 + Math.cos(a) * r, r * 2 + Math.sin(a) * r);
  g.globalCompositeOperation = 'source-in'; g.fillStyle = INK.paper; g.fillRect(0, 0, c.width, c.height);
  g.globalCompositeOperation = 'source-over'; g.drawImage(img, r * 2, r * 2);
  OUTLINE.set(key, c); return c;
}
function sticker(img, x, y, h, o = {}) {
  const g = o.g || I, k = o.k ?? 1; if (k <= 0 || !img || img.width < 8) return;
  const c = outlined(img, o.border ?? 12), s = h / img.height * backOut(clamp(k)), rot = (o.rot || 0) + boil(o.t ?? T, 'stk' + img.src, .01);
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s * (o.flip ? -1 : 1), s);
  if (o.shadow !== false) { g.globalAlpha = .9; g.filter = 'brightness(0)'; g.drawImage(c, -c.width / 2 + 14 / s, -c.height / 2 + 16 / s); g.filter = 'none'; g.globalAlpha = 1; }
  g.drawImage(c, -c.width / 2, -c.height / 2);
  g.restore();
}

// ---------------- rubber stamp ----------------
function rubberStamp(t, txt, x, y, size, col, age, o = {}) {
  if (age < 0) return; const g = S;
  const k = seg(age, 0, .12), sc = lerp(2.4, 1, easeIn(k)), rot = o.rot ?? -.18;
  const w = measure(g, txt, size) + size * .7, h = size * 1.35;
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc, sc); g.globalAlpha = k < 1 ? k : 1;
  g.strokeStyle = col; g.lineWidth = size * .09; roughRect(g, -w / 2, -h / 2, w, h, t, 'rs' + txt, 3); g.stroke();
  text(g, txt, 0, size * .04, { size, col, track: size * .05 });
  // worn ink: punch paper speckles out of the stamp
  const R = rng('wear' + txt); g.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 70; i++) { g.globalAlpha = .7; g.beginPath(); g.arc((R() - .5) * w, (R() - .5) * h, 1 + R() * size * .05, 0, TAU); g.fill(); }
  g.restore();
  if (age < .1) POST.shake = [(hash(boilT(t)) - .5) * 30, (hash(boilT(t) + 3) - .5) * 30];
}

// ---------------- misc effects ----------------
function speedLines(g, t, cx, cy, n = 40, col = INK.navy, o = {}) {
  const R = rng('sl' + boilT(t)); g.save(); g.strokeStyle = col; g.globalAlpha = o.alpha ?? .8;
  for (let i = 0; i < n; i++) { const a = R() * TAU, r0 = (o.r0 || 380) + R() * 200, r1 = r0 + 300 + R() * 700; g.lineWidth = 2 + R() * 7; g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); g.stroke(); }
  g.restore();
}
function confetti(g, t, t0, n = 120, o = {}) {
  const age = t - t0; if (age < 0) return; const cols = [INK.pink, INK.blue, INK.yellow, INK.navy];
  for (let i = 0; i < n; i++) {
    const R = rng('cf' + i + (o.seed || '')), x0 = R() * W, vy = 180 + R() * 260, sw = R() * TAU;
    const y = -40 + age * vy - (o.burst ? Math.max(0, 1 - age * 2) * 600 * R() : 0), x = x0 + Math.sin(age * 3 + sw) * 40;
    if (y > H + 40) continue; g.save(); g.translate(x, y); g.rotate(age * (R() * 8 - 4)); g.fillStyle = cols[i % 4];
    g.scale(1, Math.cos(age * 6 + sw)); g.fillRect(-9, -5, 18, 10); g.restore();
  }
}
// pixel sparkle (plus shape)
function pixelPlus(g, x, y, s, col) { g.fillStyle = col; g.fillRect(x - s / 2, y - s * 1.5, s, s * 3); g.fillRect(x - s * 1.5, y - s / 2, s * 3, s); }
function sparkles(g, t, n = 14, cols = [INK.yellow, INK.pink, INK.blue], seed = 's') {
  for (let i = 0; i < n; i++) { const R = rng(seed + i), x = R() * W, y = R() * H * .85, ph = R() * 4, k = Math.max(0, Math.sin((t * 1.7 + ph) * 3)); if (k < .2) continue; pixelPlus(g, Math.round(x / 6) * 6, Math.round(y / 6) * 6, 6 + 8 * k, cols[i % cols.length]); }
}
// hand-drawn line chart (loss curve etc.)
function scribble(g, pts, col, lw = 6, t = T, key = 'sc', k = 1) {
  const n = Math.max(2, Math.floor(pts.length * k)); g.save(); g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); pts.slice(0, n).forEach(([x, y], i) => { const X = x + boil(t, key + 'x' + i, 1.5), Y = y + boil(t, key + 'y' + i, 1.5); i ? g.lineTo(X, Y) : g.moveTo(X, Y); }); g.stroke(); g.restore();
}
// generic plate shot with a camera move
async function plateShot(file, lt, dur, cam0, cam1, o = {}) {
  const img = await IMG(file); const k = o.ease ? o.ease(lt / dur) : easeInOut(lt / dur);
  const c = {}; for (const key of ['x', 'y', 'z', 'r']) if (cam0[key] != null) c[key] = lerp(cam0[key], cam1[key] ?? cam0[key], k);
  cover(I, img, c);
}

// a physical print jolt: the ink plates slam apart for 3 frames on a big hit
function jolt(t, t0, amt = 7) { if (t >= t0 && t < t0 + 3 / FPS) POST.jolt = Math.max(POST.jolt || 0, amt * (1 - (t - t0) * FPS / 3)); }
