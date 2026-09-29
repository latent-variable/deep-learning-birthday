// posters.js — channel banner and video thumbnails, printed through the same riso engine (poster.html?p=...).
// One still shot per poster; render at t = 3 so every box and sticker has settled.
(() => {
  const P = window.POSTER, LOGO = n => `assets/logos/${n}.png`, FACE = n => `assets/people/${n}.png`;
  const AGE = 5;   // "seconds since it appeared" for bboxes: fully drawn
  // a small riso print pasted on the paper (image layer) with a year tab (spot layer) under the same transform
  function print(img, cx, cy, w, rot, year, col = INK.yellow) {
    const h = w * img.height / img.width;
    for (const g of [I, S]) { g.save(); g.translate(cx, cy); g.rotate(rot); }
    I.fillStyle = INK.navy; I.fillRect(-w / 2 - 12 + 14, -h / 2 - 12 + 16, w + 24, h + 24);
    I.fillStyle = INK.paper; I.fillRect(-w / 2 - 12, -h / 2 - 12, w + 24, h + 24); I.drawImage(img, -w / 2, -h / 2, w, h);
    if (year) { const tw = measure(S, year, 30, F.pixel) + 22; S.fillStyle = col; S.fillRect(-w / 2 - 12, h / 2 + 12, tw, 44);
      text(S, year, -w / 2 - 1, h / 2 + 35, { size: 30, font: F.pixel, align: 'left', col: col === INK.navy ? INK.paper : INK.navy }); }
    for (const g of [I, S]) g.restore();
  }
  // static confetti scattered over a region (spot ink, crisp)
  function scatter(n, seed, x0 = 0, y0 = 0, x1 = W, y1 = H, sz = 1) {
    const cols = [INK.pink, INK.blue, INK.yellow, INK.navy], R = rng('pc' + seed);
    for (let i = 0; i < n; i++) { const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0), r = R() * TAU, s = (.7 + R() * .8) * sz;
      I.save(); I.translate(x, y); I.rotate(r); I.fillStyle = cols[i % 4]; I.fillRect(-11 * s, -6 * s, 22 * s, 12 * s); I.restore(); }
  }
  const face = async (n, x, y, h, rot = 0) => sticker(await SAFE(FACE(n)), x, y, h, { rot, border: 12 });
  const logo = async (n, x, y, h, rot = 0) => sticker(await SAFE(LOGO(n)), x, y, h, { rot, border: 10 });
  function title(x, y, s) {   // HAPPY BIRTHDAY / TO ME (self-supervised)
    text(S, 'HAPPY BIRTHDAY', x, y, { size: 124 * s, col: INK.navy, knock: 12 * s, shadow: 6 * s, shadowCol: INK.pink, track: -2 * s, rot: -.02 });
    text(S, 'TO ME', x - 250 * s, y + 138 * s, { size: 150 * s, col: INK.pink, knock: 14 * s, shadow: 7 * s, shadowCol: INK.navy, track: -3 * s, rot: -.02 });
    text(S, '(self-supervised)', x + 250 * s, y + 150 * s, { size: 74 * s, font: F.serif, style: 'italic', col: INK.blue, knock: 8 * s, rot: -.02 });
  }
  // the 14 years, one plate each
  const YEARS = [['p03_gpus', '2012'], ['p04_podium', '2012'], ['p06_nursery', '2012'], ['p07_atari', '2013'], ['p08_deepdream', '2015'], ['p13_go', '2016'], ['p15_attention', '2017'],
    ['p19_protein', '2020'], ['p20_avocado', '2021'], ['p30_users', '2022'], ['p34_nobel', '2024'], ['p39_whale', '2025'], ['p40_gold', '2025'], ['p44_answerkey', '2026']];
  const TRIBUTE = ['hassabis', 'feifei', 'lecun', 'bengio', 'goodfellow', 'jensen', 'leesedol', 'altman', 'jumper'];

  async function banner(clean) {
    // TV-only rows: a filmstrip of the 14 years above and below the desktop band (y 508–931)
    scatter(160, 'bn', 0, 0, W, H);
    for (let i = 0; i < 14; i++) {
      const row = i < 7 ? 0 : 1, c = i % 7, R = rng('bp' + i), [id, yr] = YEARS[i];
      print(await SAFE(PL(id)), 200 + c * 360 + (row ? 90 : 0), row ? 1150 : 260, 330, (R() - .5) * .12, yr, [INK.yellow, INK.pink, INK.blue][i % 3]);
    }
    for (let i = 0; i < TRIBUTE.length; i++) { const R = rng('bf' + i); await face(TRIBUTE[i], 330 + i * 250 + (i % 2) * 40, i % 2 ? 1330 : 90, 150, (R() - .5) * .25); }
    // the desktop band: a yellow ink strip with rough edges, then everything that has to be seen on every device
    I.fillStyle = INK.yellow; roughRect(I, -20, 492, W + 40, 456, 3, 'band', 6); I.fill();
    I.fillStyle = INK.navy; I.fillRect(0, 492, W, 10); I.fillRect(0, 938, W, 10);
    scatter(40, 'band', 0, 520, W, 910, .8);
    // left: the SuperVision team
    text(S, 'SUPERVISION · 2012', 250, 560, { size: 30, font: F.pixel, col: INK.navy, knock: 8 });
    await face('krizhevsky', 105, 740, 230, -.06); await face('sutskever', 255, 770, 230, .04); await face('hinton', 405, 735, 240, -.03);
    bbox(20, 610, 460, 290, 'parents', .99, AGE, { col: INK.pink, size: 26, lw: 6 });
    // right: the labs
    const L = [['nvidia', 2150, 610, 110], ['imagenet', 2300, 600, 110], ['gtx580', 2450, 615, 110], ['openai', 2310, 735, 80], ['deepmind', 2190, 855, 68], ['huggingface', 2430, 850, 72]];
    for (const [n, x, y, h] of L) await logo(n, x, y, h, (hashS(n) - .5) * .12);
    if (clean) {
      sticker(await SAFE(STK('pose_0')), 1280, 735, 410, {});
      bbox(1090, 545, 380, 385, 'lexi · deep learning · age 14', .99, AGE, { col: INK.pink, size: 28, lw: 7 });
      text(S, '> hello, world', 700, 880, { size: 40, font: F.pixel, col: INK.navy, knock: 10 });
      text(S, '2012.09.30 → 2026.09.30', 1800, 880, { size: 32, font: F.mono, col: INK.navy, knock: 10 });
    } else {
      sticker(await SAFE(STK('pose_0')), 720, 735, 410, {});
      bbox(535, 545, 375, 385, 'lexi', .99, AGE, { col: INK.pink, size: 28, lw: 7 });
      title(1490, 640, .92);
      text(S, 'deep learning · born 2012.09.30 · age 14', 1490, 880, { size: 30, font: F.pixel, col: INK.navy, knock: 8 });
    }
  }

  async function thumbA() {   // paper, Lexi mid-jump, the title stacked big
    scatter(90, 'ta');
    sticker(await SAFE(STK('pose_0')), 1480, 560, 920, { rot: .03 });
    bbox(1170, 110, 640, 900, 'deep_learning', .99, AGE, { col: INK.yellow, txt: INK.navy, size: 46, lw: 12 });
    text(S, 'HAPPY', 560, 240, { size: 250, col: INK.pink, knock: 24, shadow: 12, shadowCol: INK.navy, rot: -.04 });
    text(S, 'BIRTHDAY', 560, 470, { size: 205, col: INK.navy, knock: 22, shadow: 10, shadowCol: INK.pink, rot: -.04 });
    text(S, 'TO ME!', 560, 720, { size: 260, col: INK.blue, knock: 24, shadow: 12, shadowCol: INK.yellow, rot: -.04 });
    text(S, 'AlexNet · 2012 → 2026', 560, 930, { size: 48, font: F.pixel, col: INK.navy, knock: 12 });
  }
  async function thumbB() {   // navy, the 14-candle cake print, a giant 14
    flood(INK.navy); scatter(70, 'tb');
    print(await SAFE(PL('p01_candles')), 1260, 560, 1180, .04);
    bbox(700, 110, 1130, 650, 'candles 14', .99, AGE, { col: INK.pink, size: 40, lw: 10 });
    text(S, '14', 330, 470, { size: 560, col: INK.yellow, knock: 0, shadow: 22, shadowCol: INK.pink, rot: -.05, track: -30 });
    text(S, 'DEEP LEARNING', 340, 810, { size: 84, col: INK.paper, rot: -.03 });
    text(S, 'TURNS FOURTEEN', 340, 900, { size: 70, col: INK.pink, rot: -.03 });
  }
  async function thumbC() {   // yellow, huge yelling head, AI TURNS 14
    flood(INK.yellow); scatter(70, 'tc');
    sticker(await SAFE(STK('head2_0')), 1400, 610, 1050, { rot: .05 });
    bbox(980, 90, 860, 900, 'deep_learning', .99, AGE, { col: INK.pink, size: 46, lw: 12 });
    text(S, 'AI', 480, 250, { size: 260, col: INK.navy, knock: 24, shadow: 12, shadowCol: INK.pink, rot: -.05 });
    text(S, 'TURNS', 480, 480, { size: 220, col: INK.navy, knock: 22, shadow: 12, shadowCol: INK.pink, rot: -.05 });
    text(S, '14', 480, 790, { size: 420, col: INK.pink, knock: 30, shadow: 18, shadowCol: INK.navy, rot: -.05 });
  }
  const DRAW = { banner: () => banner(false), banner_clean: () => banner(true), thumb_a: thumbA, thumb_b: thumbB, thumb_c: thumbC };
  shots([[0, async t => { POST.misKick = 0; await DRAW[P](); }]]);
})();
