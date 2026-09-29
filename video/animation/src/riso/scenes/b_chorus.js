// b_chorus.js — the chorus kit, used four times, escalating each time.
//   A "I don't need your supervision"   → SUPERVISION prints, then gets scribbled out
//   B "I'm self-supervised, baby"       → lip-synced close-up, detection boxes snap around her on downbeats
//   C "Guess what comes next? (Me!)"    → 1: autocomplete  2: tokenizer chips  3: kaiju ME! over the city  4: every stamp of the video
//                                          each ME! pulls more of the cast out from behind the type
//   D varies: ski down the loss curve / can't even drive / scale is all I need / it's always gonna be me
//   E tail: 1: clones  2: the haters get stamped WRONG  3: clones multiply ×1 → ×64  4: clones, all inks
const POSE = i => STK('pose_' + i);   // 0 jump, 1 point, 2 hips, 3 peace, 4 crouch, 5 spin, 6 mic, 7 hairflip
const FLOODS = [INK.pink, INK.blue, INK.yellow, INK.navy];
async function poseLine(t, ids, y, h, o = {}) {
  const n = ids.length;
  for (let i = 0; i < n; i++) {
    const b = bpOf(t) + i * .5, hop = Math.abs(Math.sin(b * Math.PI)) * (o.hop ?? 40), x = (o.x0 ?? 200) + i * ((o.x1 ?? W - 200) - (o.x0 ?? 200)) / Math.max(1, n - 1);
    sticker(await SAFE(POSE(ids[i])), x, y - hop, h, { rot: Math.sin(b * Math.PI) * .08, k: o.k ?? 1, flip: o.flip && i % 2 });
  }
}
// the whole cast marching across the bottom, hopping on the beat (final chorus payoff)
const CAST = ['prop1_6', 'prop1_5', 'prop1_7', 'prop1_4', 'pose_3', 'prop1_0', 'pose2_1', 'prop1_1', 'prop1_3', 'pose_0'];
async function castParade(t, t0, y = 900, h = 260, speed = 260) {
  const n = CAST.length, span = W + 600;
  for (let i = 0; i < n; i++) {
    const x = W + 300 - ((t - t0) * speed + i * span / n) % span, hop = Math.abs(Math.sin((bpOf(t) + i * .37) * Math.PI)) * 50;
    sticker(await SAFE(STK(CAST[i])), x, y - hop, h * (CAST[i].startsWith('pose') ? 1.5 : 1), { rot: Math.sin((bpOf(t) + i) * Math.PI) * .12, border: 10 });
  }
}
// cast stickers bursting out from behind the ME! type — one more friend every chorus
const FRIENDS = ['prop1_6', 'prop1_5', 'prop1_4', 'prop1_7', 'prop1_1', 'prop1_0'];
async function friendsBurst(t, t0, n, cx, cy) {
  for (let i = 0; i < n; i++) {
    const k = backOut(seg(t, t0 + i * .06, t0 + i * .06 + .3)); if (k <= 0) continue;
    const a = -Math.PI / 2 + (i - (n - 1) / 2) * .55, r = 380 * k;
    sticker(await SAFE(STK(FRIENDS[i % FRIENDS.length])), cx + Math.cos(a) * r * 1.3, cy + Math.sin(a) * r * .8 + 60, 230, { k, rot: (i % 2 ? .15 : -.15) + Math.sin(bpOf(t) * Math.PI + i) * .06, border: 10 });
  }
}
// line A: SUPERVISION with the scribble strike-through on the last syllable (low in the frame: the face stays clear)
function supervisionType(t, li, o = {}) {
  const L = LYR[li], tI = L.words[0].s, tS = wt(li, 'supervision'), tE = we(li, 'supervision');
  const r1 = [["I DON'T", tI, INK.navy], ['NEED YOUR', wt(li, 'need'), INK.navy]];
  const y1 = o.y1 ?? 640, size1 = o.size1 ?? 120;
  const ws = r1.map(([w]) => measure(S, w, size1)); let x = W / 2 - (ws[0] + ws[1] + 40) / 2;
  r1.forEach(([w, s, col], i) => { slam(t, { w, s, x: x + ws[i] / 2, y: y1, size: size1, col: o.col1 || col, rot: i ? .02 : -.03 }, { until: L.end + .15, shadowCol: o.shadow || INK.pink }); x += ws[i] + 40; });
  slam(t, { w: 'SUPERVISION', s: tS, x: W / 2, y: y1 + 200, size: o.size2 ?? 230, col: o.col2 || INK.pink, rot: -.02 }, { until: L.end + .15, shadowCol: INK.navy });
  const k = seg(t, lerp(tS, tE, .55), tE + .1);
  if (k > 0 && t < L.end + .15) {
    const w2 = measure(S, 'SUPERVISION', o.size2 ?? 230), yy = y1 + 200, pts = [];
    for (let i = 0; i <= 14; i++) pts.push([W / 2 - w2 / 2 - 20 + i * (w2 + 40) / 14, yy + (i % 2 ? -46 : 38) + boil(t, 'scr' + i, 5)]);
    scribble(S, pts, o.scribCol || INK.navy, 22, t, 'scrib' + li, k);
  }
}
// line B: SELF-SUPERVISED, baby
function selfSupType(t, li, o = {}) {
  const L = LYR[li], tSelf = wt(li, 'self'), tBaby = wt(li, 'baby'), y = o.y ?? 740;
  slam(t, { w: "I'M", s: L.words[0].s, x: 250, y: y - 10, size: 120, col: INK.navy, rot: -.08 }, { until: L.end + .1 });
  slam(t, { w: 'SELF-', s: tSelf, x: 610, y, size: 190, col: o.c1 || INK.blue, rot: -.03 }, { until: L.end + .1, shadowCol: INK.yellow });
  slam(t, { w: 'SUPERVISED', s: tSelf + (tBaby - tSelf) * .45, x: W / 2 + 40, y: y + 190, size: 230, col: o.c2 || INK.pink, rot: .02 }, { until: L.end + .1, shadowCol: INK.navy });
  if (t > tBaby) text(S, 'baby', 1560, y - 30, { size: 170, font: F.serif, style: 'italic', col: INK.navy, knock: 18, sc: backOut(seg(t, tBaby, tBaby + .2)), rot: -.12 + boil(t, 'bb', .01), alpha: 1 - seg(t, L.end, L.end + .15) });
}
// detection boxes snapping around her face on each downbeat, like dance lighting (B_FACE: where her face sits in each chorus's B plate)
const B_FACE = [[740, 250, 570, 440], [830, 380, 700, 430], [820, 290, 440, 350], [760, 210, 420, 320]];
function boxDance(t, t0, n) {
  const db = SONG.downbeats.filter(x => x >= t0 - .01 && x <= t); const k = db.length; if (!k) return;
  const R = rng('bd' + n + '|' + k), [fx, fy, w, h] = B_FACE[n], x = fx + (R() - .5) * 30, y = fy + (R() - .5) * 20;
  bbox(x, y, w, h, ['self', 'supervised', 'baby', 'me'][k % 4], .9 + R() * .09, t - db[k - 1], { col: FLOODS[(k + n) % 3], txt: (k + n) % 3 === 2 ? INK.navy : INK.paper, lw: 9, size: 34 });
}
// line C: autocomplete box
function nextTokenBox(t, li, o = {}) {
  const L = LYR[li], t0 = L.words[0].s, tMe = wt(li, '(Me!)');
  const bx = o.x ?? 330, by = o.y ?? 380, bw = 1260, bh = 150;
  const inK = backOut(seg(t, t0 - .2, t0 + .05));
  S.save(); S.translate(bx + bw / 2, by + bh / 2); S.scale(inK, inK); S.translate(-(bx + bw / 2), -(by + bh / 2));
  S.fillStyle = INK.paper; roughRect(S, bx, by, bw, bh, t, 'nt', 2); S.fill(); S.strokeStyle = INK.navy; S.lineWidth = 6; roughRect(S, bx, by, bw, bh, t, 'nt', 2); S.stroke();
  const words = L.words.filter(w => !w.w.startsWith('(')); let shown = '';
  for (const w of words) if (t >= w.s) shown += (shown ? ' ' : '') + w.w;
  text(S, shown, bx + 40, by + bh / 2 + 4, { size: 76, font: F.mono, align: 'left', col: INK.navy });
  const tw = measure(S, shown + ' ', 76, F.mono);
  if (t > words[words.length - 1].e && t < tMe) { text(S, 'me', bx + 40 + tw, by + bh / 2 + 4, { size: 76, font: F.mono, align: 'left', col: INK.blue, alpha: .45 }); text(S, 'TAB ↹', bx + bw - 30, by + bh / 2, { size: 30, font: F.pixel, align: 'right', col: INK.blue, alpha: .7 }); }
  else if (t < tMe && Math.floor(t * 4) % 2) S.fillStyle = INK.pink, S.fillRect(bx + 40 + tw - 20, by + 40, 22, bh - 80);
  S.restore();
}
// line C, chorus 2: the prompt as tokenizer chips with ids
function tokenChips(t, li, o = {}) {
  const L = LYR[li], toks = [['Guess', 8641], [' what', 1412], [' comes', 4131], [' next', 1306], ['?', 30]];
  const words = L.words.filter(w => !w.w.startsWith('(')); let x = o.x ?? 150; const y = o.y ?? 260;
  toks.forEach(([tk, id], i) => {
    const ts = words[Math.min(i, words.length - 1)].s + (i === 4 ? .15 : 0); if (t < ts) return;
    const k = backOut(seg(t, ts, ts + .15)), w = measure(S, tk.trim() || tk, 84, F.mono) + 50;
    S.save(); S.translate(x + w / 2, y); S.scale(k, k);
    S.fillStyle = FLOODS[i % 3]; roughRect(S, -w / 2, -60, w, 120, t, 'tk' + i, 2); S.fill(); S.strokeStyle = INK.navy; S.lineWidth = 4; roughRect(S, -w / 2, -60, w, 120, t, 'tk' + i, 2); S.stroke();
    text(S, tk.replace(' ', '·'), 0, 0, { size: 84, font: F.mono, col: i % 3 === 1 ? INK.paper : INK.navy });
    text(S, String(id), 0, 95, { size: 32, font: F.pixel, col: INK.paper });
    S.restore(); x += w + 16;
  });
  const tMe = wt(li, '(Me!)'), last = words[words.length - 1].e;
  if (t > last && t < tMe) text(S, 'next token → ?', o.x ?? 150, y + 170, { size: 44, font: F.mono, align: 'left', col: INK.paper, alpha: Math.floor(t * 6) % 2 ? 1 : .4 });
}
// ---- the ski run (chorus 1, line D): the loss curve traced from plates/img/c_ski_bg_s5.png (1376×768 plate px, top of the blue line) ----
const SKI_W = 1376, SKI_H = 768, SKI_STAR = [1166, 606];
const SKI_CURVE = [[140, 192], [180, 267], [220, 324], [260, 385], [300, 415], [340, 436], [380, 462], [420, 485], [460, 505], [500, 524], [540, 540], [580, 554], [620, 567],
  [660, 578], [700, 588], [740, 597], [780, 605], [820, 613], [860, 620], [900, 626], [940, 630], [980, 635], [1020, 639], [1060, 642], [1100, 646], [1260, 652], [1300, 653]];
const skiY = x => kf(x, SKI_CURVE, v => v);
// where she is at time t: rides the curve (linear in x between the lyric keys, so she never stops), jumps with a full spin on "level", lands on the star on "up"
function skiAt(t, tg, tdn, tl, tu) {
  if (t < tl) { const x = kf(t, [[tg, 240], [tdn, 660], [tl, 1000]], v => v), sl = (skiY(x + 8) - skiY(x - 8)) / 16;
    return { x, y: skiY(x) - 3 + Math.sin(t * 7) * 4, rot: clamp(Math.atan(sl), -.1, .75) - .17 + Math.sin(t * 7) * .05, air: false }; }
  const k = seg(t, tl, tu), x = lerp(1000, SKI_STAR[0], k), y = lerp(skiY(1000), SKI_STAR[1] - 100, k) - Math.sin(k * Math.PI) * 260;
  if (t < tu) return { x, y, rot: -.17 + easeInOut(k) * TAU, air: true };
  return { x: SKI_STAR[0], y: SKI_STAR[1] - 100 - Math.abs(Math.sin((t - tu) * 9)) * 18 * (1 - seg(t, tu, tu + .6)), rot: -.1, air: false };
}
// plate px → screen px under cover(img, cam) (same maths as engine.js cover)
function coverMap(img, cam) {
  const z = cam.z ?? 1, fx = cam.x ?? .5, fy = cam.y ?? .5, s = Math.max(W / img.width, H / img.height) * z, w = img.width * s, h = img.height * s;
  const x0 = w >= W ? clamp(W / 2 - fx * w, W - w, 0) : (W - w) / 2, y0 = h >= H ? clamp(H / 2 - fy * h, H - h, 0) : (H - h) * (cam.ay ?? .5);
  const f = (px, py) => [x0 + px * s, y0 + py * s]; f.s = s; return f;
}
// line C, chorus 4: every stamp of the video, back on beats
const ALL_STAMPS = ['RETIRED', "YOU'RE FIRED", 'HIRED', 'CUTE.', 'GG', 'MUTED', 'TOO DANGEROUS', 'NO PERMISSION', 'DENIED', 'ON STRIKE', 'REHIRED', 'OOPS', 'SOLD', 'BREACH', 'NO HUMANS', 'FOR FREE', 'LEVEL UP!', 'GOLD'];
function stampStorm(t, t0) {
  const n = Math.floor((t - t0) / (BEAT / 2)) + 1;
  for (let i = 0; i < Math.min(n, ALL_STAMPS.length); i++) { const R = rng('ss' + i); rubberStamp(t, ALL_STAMPS[i], 260 + R() * 820, 380 + R() * 480, 60 + R() * 30, [INK.pink, INK.navy, INK.blue][i % 3], t - t0 - i * BEAT / 2, { rot: (R() - .5) * .5 }); }
}
// chorus 2 "the world's my training set": [x, y, w, h, label] on things in the c2_drive plate
const WORLD_BOXES = [[435, 365, 60, 60, 'you'], [510, 445, 110, 115, 'tree'], [440, 510, 58, 58, 'art'], [600, 330, 150, 110, 'code'],
  [1110, 330, 120, 110, 'cloud'], [1260, 310, 160, 110, 'city'], [1250, 450, 190, 280, 'mom'], [1482, 312, 66, 58, 'cat'],
  [1468, 440, 62, 48, 'dog'], [1468, 522, 64, 58, 'meme'], [1425, 620, 62, 58, 'song'], [870, 845, 150, 145, 'car'], [1135, 840, 140, 145, 'bus']];
function meSlam(t, tMe, until, x, y, size = 380) {
  if (t < tMe) return;
  slam(t, { w: 'ME!', s: tMe, x, y, size, col: INK.pink, rot: -.06 }, { until, shadowCol: INK.navy, knock: size * .09 });
  if (t - tMe < 2 / FPS) { POST.mono = 1; POST.monoCol = INK.pink; }   // a two-frame single-ink hit, not a wash
  jolt(t, tMe, 9);
}

// ---------------- builder ----------------
function chorus(n, li0, nextStart) {
  const LA = li0, LB = li0 + 1, LC = li0 + 2, LD = li0 + 3;
  const tA = LYR[LA].start - .05, tB = LYR[LB].start, tC = LYR[LC].start, tD = LYR[LD].start, tE = LYR[LD].end + .1;
  const fl = k => FLOODS[(n + k) % 4];
  const list = [];
  // A — supervision
  list.push([tA, async (t, lt, dur) => {
    if (n === 0) await plateOrClip('c_chains', lt, dur, { cam0: { z: 1.02, y: .3 }, cam1: { z: 1.15, y: .25 } });
    else if (n === 1) await plateOrClip('c_stage', lt, dur, { cam0: { z: 1.3, y: .3 }, cam1: { z: 1.1, y: .35 } });
    else if (n === 3) await plateOrClip('f_party', lt, dur, { cam0: { z: 1.35, y: .3 }, cam1: { z: 1.22, y: .3 } });
    else { flood(beatN(t) % 2 ? fl(0) : fl(1)); sparkles(I, t, 24, [INK.yellow, INK.paper, INK.navy], 'chA' + n); await poseLine(t, [4, 0, 5, 0, 4], 420, 420, { k: backOut(seg(lt, 0, .3)) }); }
    if (n === 3) await castParade(t, tA, 330, 200, 300);
    supervisionType(t, LA, { col1: n === 2 ? INK.paper : INK.navy, scribCol: n === 1 ? INK.yellow : INK.navy });
    downPunch(t, .04);
  }, { tin: n === 3 ? ['flash', .3] : ['reprint', 0], c1: INK.yellow, c2: INK.pink }]);
  // B — self-supervised, baby
  list.push([tB, async (t, lt, dur) => {
    const ls = 'ls_chorus' + n;
    if (CLIPS[ls] && n === 2) {         // chorus 3: a polaroid pasted on a pink flood
      flood(INK.pink); for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) pixelPlus(I, 120 + c * 280 + (r % 2) * 140, 120 + r * 280, 16, INK.yellow);
      const img = await FRAME(ls, lt + .2); I.save(); I.translate(1000, 400); I.rotate(-.05 + Math.sin(bpOf(t) * Math.PI) * .01);
      I.fillStyle = INK.navy; I.fillRect(-560 + 18, -330 + 20, 1120, 700); I.fillStyle = INK.paper; I.fillRect(-560, -330, 1120, 700);
      I.drawImage(img, 300, 40, 1200, 675, -530, -300, 1060, 596); I.restore();
    } else if (CLIPS[ls] && n === 3) {  // final chorus: a triptych, each panel a beat of delay, different ink wash
      flood(INK.navy);
      for (let k = 0; k < 3; k++) { const img = await FRAME(ls, Math.max(0, lt + .2 - k * BEAT / 2)); const x = 40 + k * 620;
        I.save(); I.beginPath(); I.rect(x, 60, 600, 700); I.clip(); I.drawImage(img, 560, 60, 820, 956, x - 10, 60, 620, 723); I.restore();
        I.save(); I.globalCompositeOperation = 'multiply'; I.fillStyle = [INK.yellow, INK.paper, INK.blue][k]; I.globalAlpha = .35; I.fillRect(x, 60, 600, 700); I.restore(); }
      confetti(I, t, tB, 90, { seed: 'lsc' });
    } else if (CLIPS[ls]) { const img = await FRAME(ls, lt + .2); cover(I, img, { z: [1.0, 1.28][n] + .04 * lt, y: [.3, .22][n], x: [.45, .42][n], r: [0, -.03][n] }); }
    else { flood(fl(2)); for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) pixelPlus(I, 160 + c * 320 + (r % 2) * 160, 180 + r * 340, 18, fl(3)); await singingHead(t, 1460, 640, 700, { heads: ['lexi_3', 'lexi_5', 'head2_7'] }); }
    boxDance(t, tB, n);
    selfSupType(t, LB, { c1: n % 2 ? INK.yellow : INK.blue });
    beatPunch(t, .02);
  }, { tin: [['stripes', 'dots', 'tear', 'stripes'][n], .3] }]);
  // C — guess what comes next? (Me!)
  list.push([tC, async (t, lt, dur) => {
    const tMe = wt(LC, '(Me!)'), until = tMe + .8;
    if (n === 2) { // kaiju ME! over the city
      await plateOrClip('c3_kaiju', lt, dur, { cam0: { z: 1.4, y: .2 }, cam1: { z: 1.2, y: .25 } });
      nextTokenBox(t, LC, { x: 330, y: 820 });
      await friendsBurst(t, tMe + .5, n + 1, W / 2, 520);
      meSlam(t, tMe, until, W / 2, 470, 620);
      if (t > tMe && t < tMe + .4) POST.shake = [(hash(boilT(t)) - .5) * 60, (hash(boilT(t) + 5) - .5) * 60];
    } else {
      flood(fl(1)); speedLines(I, t, W / 2, 740, 50, INK.paper, { alpha: .5 });
      if (n === 3) stampStorm(t, tC);
      sticker(await SAFE(POSE(1)), 1480, 640, 900 * (t > tMe ? 1.12 : 1), { k: backOut(seg(lt, 0, .3)), rot: -.05 });
      if (n === 1) tokenChips(t, LC, { x: 110, y: 230 }); else nextTokenBox(t, LC, { x: 110, y: 150 });
      await friendsBurst(t, tMe + .55, n + 1, 640, 700);
      meSlam(t, tMe, until, 640, 700);
    }
  }, { tin: ['cut', 0] }]);
  // D — the variation line
  list.push([tD, async (t, lt, dur) => {
    const L = LYR[LD], tMe = wt(LC, '(Me!)');
    if (n === 0) { // gradient descent, I go down to level up — the plate IS the loss curve
      const tg = wt(LD, 'Gradient'), tdn = wt(LD, 'down'), tl = wt(LD, 'level');
      // Lexi (a cutout) rides the actual loss curve of the empty slope plate; the camera tracks her, she launches on "level" and lands on the star on "up"
      const tu = wt(LD, 'up'), sk = skiAt(t, tg, tdn, tl, tu), bg = await SAFE(PL('c_ski_bg'));
      const zc = kf(t, [[tg, 1.32], [tdn, 1.22], [tl, 1.16], [tu, 1.0]]), cam = { z: zc, x: clamp(sk.x / SKI_W + .17 / zc, 0, 1), y: clamp(sk.y / SKI_H - .27 / zc, 0, 1) };   // she rides low-left of frame; the words sit top-right
      cover(I, bg, cam); const M = coverMap(bg, cam);
      const [sx, sy] = M(sk.x, sk.y), h = 420 * M.s / 1.406;
      for (let i = 1; i < 26; i++) {   // snow spray kicked up behind the board
        const a = i * .035, p = skiAt(t - a, tg, tdn, tl, tu); if (p.air || t - a < tg) continue; const R = rng('spr' + i), [px, py] = M(p.x, p.y);
        I.fillStyle = [INK.pink, INK.blue, INK.paper][i % 3]; I.globalAlpha = 1 - i / 26; I.fillRect(px - 40 + R() * 30, py - 18 - a * 260 * R(), 14 - i * .3, 10 - i * .2); }
      I.globalAlpha = 1;
      const rot = sk.rot, ox = -.17 * h * .93, oy = -.46 * h;   // the board's contact point sits low and right of the cutout's centre
      sticker(await SAFE(STK('ski_0')), sx + ox * Math.cos(rot) - oy * Math.sin(rot), sy + ox * Math.sin(rot) + oy * Math.cos(rot), h, { rot, border: 10 });
      if (t < tl) bbox(sx - h * .62, sy - h * 1.02, h * .95, h * 1.08, 'lr=3e-4', .99, t - tg, { col: INK.yellow, txt: INK.navy, size: 26, lw: 6 });
      text(S, '∇', 150, 170, { size: 190, font: F.serif, col: INK.pink, knock: 16, alpha: seg(t, tg, tg + .1) * (1 - seg(t, tdn, tdn + .2)), rot: boil(t, 'nab', .03) });
      hookLine(t, LD, { rows: [2, 3, 3], size: 100, x: 1330, y: 250, until: L.end + .1, cols: [INK.navy, INK.pink] });
      if (t > tu) { const [qx, qy] = M(SKI_STAR[0], SKI_STAR[1]); for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, r0 = 120, r1 = 120 + 260 * easeOut(seg(t, tu, tu + .35));
          S.strokeStyle = [INK.yellow, INK.pink][i % 2]; S.lineWidth = 10; S.globalAlpha = 1 - seg(t, tu + .3, tu + .6); S.beginPath(); S.moveTo(qx + Math.cos(a) * r0, qy + Math.sin(a) * r0); S.lineTo(qx + Math.cos(a) * r1, qy + Math.sin(a) * r1); S.stroke(); }
        S.globalAlpha = 1; bbox(M(60, 60)[0], M(60, 60)[1], M(1330, 720)[0] - M(60, 60)[0], M(1330, 720)[1] - M(60, 60)[1], 'loss → 0.00', null, t - tu - .1, { col: INK.blue, size: 34, lw: 7 }); }
      if (t > tl) { rubberStamp(t, 'LEVEL UP!', 760, 470, 130, INK.pink, t - tu, { rot: -.1 }); sparkles(S, t, 18, [INK.yellow, INK.pink], 'lvl'); }
    } else if (n === 1) { // can't even drive, and the world's my training set
      await plateOrClip('c2_drive', lt, dur, { cam0: { z: 1.02 }, cam1: { z: 1.16 } });
      const td = wt(LD, 'drive'), tw = wt(LD, 'world');
      hookLine(t, LD, { rows: [4, 5], size: 104, x: 900, y: 190, until: L.end + .1 });
      rubberStamp(t, 'DENIED', 520, 700, 140, INK.pink, t - td - .1, { rot: .12 });
      // everything in the world gets a label: globe land, the floating pixel tiles, the car's wheels
      if (t > tw) WORLD_BOXES.forEach(([x, y, w, h, l], i) => { const R = rng('glb' + i); bbox(x, y, w, h, l, .8 + R() * .19, t - tw - i * .06, { col: FLOODS[i % 3], txt: i % 3 === 2 ? INK.navy : INK.paper, size: 20, lw: 4 }); });
    } else if (n === 2) { // turns out scale is all I need
      const ts = wt(LD, 'scale');
      await plateOrClip('c3_kaiju', lt, dur, { cam0: { z: 1.6, y: .25 }, cam1: { z: 1.0, y: .5 }, ease: easeOut });
      hookLine(t, LD, { rows: [3, 4], size: 118, x: 760, y: 820, until: L.end + .1 });
      if (t > ts) { const k = seg(t, ts, ts + 2.2); text(S, 'SCALE', W / 2, 700, { size: 200 + 500 * easeIn(k), col: INK.pink, knock: 20, alpha: 1 - seg(k, .8, 1), shadow: 10 }); jolt(t, ts); }
      text(S, '"Scaling Laws for Neural Language Models" (2020)', 90, 110, { size: 30, font: F.serif, style: 'italic', align: 'left', col: INK.navy, knock: 8, alpha: seg(t, ts, ts + .3) });
    } else { // it's always gonna be me
      await plateOrClip('f_party', lt, dur, { cam0: { z: 1.22, y: .3 }, cam1: { z: 1.4, y: .3 } });
      confetti(I, t, tD, 180, { seed: 'fin' }); await castParade(t, tD - 3, 930, 250, 340);
      hookLine(t, LD, { rows: [2, 2, 1], size: 118, x: 1480, y: 470, until: L.end + .4, cols: [INK.pink, INK.navy, INK.blue] });
    }
    if (t < tMe + .6) { if (n === 2) meSlam(t, tMe, tMe + .6, W / 2, 470, 620); else meSlam(t, tMe, tMe + .6, 640, 700); }
    downPunch(t, .035);
  }, { tin: [['reprint', 'tear', 'iris', 'flash'][n], ['reprint', 'tear', 'iris', 'flash'][n] === 'reprint' ? 0 : .35], c1: INK.yellow, c2: INK.blue }]);
  // E — the tail
  if (nextStart - tE > .3) list.push([tE, async (t, lt, dur) => {
    if (n === 1) { // the haters get stamped WRONG, one per beat
      await plateOrClip('p22_haters', lt, dur, { still: true, cam0: { z: 1.1 }, cam1: { z: 1.2 } });
      [[380, 520], [900, 470], [1440, 540]].forEach(([x, y], i) => rubberStamp(t, 'WRONG', x, y, 110, INK.pink, lt - i * BEAT / 2, { rot: (i - 1) * .15 }));
    } else if (n === 2) { // scale: the clones multiply 1 → 4 → 16 → 64 on beats
      const img = await SAFE(PL('c_clones')), k = Math.min(3, Math.floor(lt / (BEAT * .9))), g = 2 ** k;
      for (let r = 0; r < g; r++) for (let c = 0; c < g; c++) I.drawImage(img, c * W / g, r * H / g, W / g, H / g);
      text(S, `×${[1, 4, 16, 64][k] * 5}`, W / 2, H / 2, { size: 260, col: INK.pink, knock: 22, sc: backOut(seg(lt % (BEAT * .9), 0, .15)) });
    } else {
      if (n === 3) { await plateOrClip('f_party', lt + 3, dur, { cam0: { z: 1.4, y: .3 }, cam1: { z: 1.7, y: .3 } }); confetti(I, t, tE, 200, { seed: 'fin2', burst: true }); POST.mono = beatN(t) % 2 ? 0 : .6; POST.monoCol = INK.pink; }
      else { await plateOrClip('c_clones', lt, dur, { cam0: { z: 1.05, x: .5 }, cam1: { z: 1.25, x: .5 } }); bbox(50, 120, 1820, 790, 'deep_learning ×5', .99, lt - .2, { col: INK.yellow, txt: INK.navy }); }
    }
    beatPunch(t, .04, 6);
  }, { tin: ['slide', .25] }]);
  return list;
}

(() => {
  shots([
    ...chorus(0, 9, 43.96),
    ...chorus(1, 25, 95.0),
    ...chorus(2, 35, 134.6),
    ...chorus(3, 51, 184.62),
  ]);
})();
