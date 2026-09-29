// y_tribute.js — the tribute layer: real people, real labs, real papers. Logos are riso-printed stickers (assets/logos),
// people get detection-box name tags, papers get pasted citation clippings. Drawn over the shots, under the stamp and lyric bar.
// EGGS: [t0, t1, (t, a) => {...}]  — a = seconds since t0. Keep each egg inside its shot's time range.
const LOGO = n => `assets/logos/${n}.png`;
const FACE = n => `assets/people/${n}.png`;
async function face(n, x, y, h, a, label, o = {}) {
  if (a < 0) return; const k = backOut(seg(a, 0, .25));
  sticker(await SAFE(FACE(n)), x, y, h, { k, rot: o.rot ?? (hashS(n) - .5) * .12, border: 12 });
  if (label && a > .2) text(S, label, x, y + h / 2 + 34, { size: 26, font: F.pixel, col: o.lc || INK.navy, knock: 8 });
}
async function logo(n, x, y, h, a, o = {}) {
  if (a < 0) return; const k = backOut(seg(a, 0, .22));
  if (n === 'deepseek') {   // Qwen kept misspelling it: our whale sticker + an exact wordmark
    sticker(await SAFE(STK('prop1_6')), x - h * .9, y, h * 1.1, { k, rot: -.08, border: 10 });
    text(S, 'deepseek', x - h * .2, y + 4, { size: h * .62, font: F.hook, align: 'left', col: INK.blue, knock: h * .08, sc: k });
    return;
  }
  sticker(await SAFE(LOGO(n)), x, y, h, { k, rot: (o.rot ?? (hashS(n) - .5) * .2), border: 10, shadow: o.shadow });
}
// o.below: the label chip hangs under the box (for faces pressed against the LIVE stamp or a label that would cover Lexi's eyes)
function tag(x, y, w, h, name, a, o = {}) {
  const sc = o.score ?? 1.0, op = { col: o.col || INK.yellow, txt: o.txt || INK.navy, size: o.size || 26, lw: o.lw || 5 };
  if (!o.below) return bbox(x, y, w, h, name, sc, a, op);
  bbox(x, y, w, h, null, sc, a, op); if (a < .1) return;
  const lab = name + ' ' + sc.toFixed(2), tw = measure(S, lab, op.size, F.pixel) + 18, lx = Math.min(x - op.lw / 2, W - tw - 12);
  S.fillStyle = op.col; S.fillRect(lx, y + h, tw, op.size + 12);
  text(S, lab, lx + 8, y + h + (op.size + 12) / 2 + 1, { size: op.size, font: F.pixel, align: 'left', col: op.txt });
}
function cite(x, y, lines, a, o = {}) {   // a pasted paper clipping: title + authors
  if (a < 0) return; const k = backOut(seg(a, 0, .2)), w = o.w || 640, lh = 34, h = 26 + lines.length * lh;
  S.save(); S.translate(x, y); S.rotate(o.rot ?? -.03); S.scale(k, k);
  S.fillStyle = INK.paper; roughRect(S, 0, 0, w, h, T, 'ct' + x + y, 2); S.fill(); S.strokeStyle = INK.navy; S.lineWidth = 3; roughRect(S, 0, 0, w, h, T, 'ct' + x + y, 2); S.stroke();
  lines.forEach((l, i) => text(S, l, 18, 28 + i * lh, { size: i ? 24 : 30, font: i ? F.mono : F.serif, style: i ? '' : 'italic', align: 'left', col: i ? INK.blue : INK.navy }));
  S.restore();
}
const EGGS = [
  // cameos on the rewind cards
  [SONG.beats[15] + BEAT / 2, SONG.beats[15] + BEAT - .01, async (t, a) => { await face('hinton', 700, 150, 210, a); await face('lecun', 960, 140, 210, a - .05); await face('bengio', 1220, 150, 210, a - .1); }],
  [SONG.beats[15] + 3 * BEAT / 2, SONG.beats[15] + 2 * BEAT - .01, async (t, a) => await face('leesedol', 1640, 170, 230, a)],
  [SONG.beats[15] + 5 * BEAT / 2, SONG.beats[15] + 3 * BEAT - .01, async (t, a) => await face('goodfellow', 1640, 170, 230, a)],
  [28.3, 29.9, async (t, a) => await face('goodfellow', 1640, 620, 320, a - .2, 'ian_goodfellow', { lc: INK.paper })],
  [63.6, 66.5, async (t, a) => await face('jumper', 1660, 420, 330, a - .5, 'john_jumper')],

  // ---- rewind year cards: what each year was ----
  ...[[2019, 'GPT-2 · BERT\'s birthday year · StyleGAN'], [2018, 'BERT · Turing Award: Hinton, LeCun, Bengio'], [2017, 'Transformer · AlphaZero · AlphaGo Zero'],
      [2016, 'AlphaGo 4–1 · Move 37 · TPU'], [2015, 'ResNet · TensorFlow · OpenAI founded · batch norm'], [2014, 'GANs · Adam · seq2seq · DeepMind → Google'],
      [2013, 'word2vec · DQN · DNNresearch → Google']].map(([y, s], i) => [SONG.beats[15] + i * BEAT / 2, SONG.beats[15] + (i + 1) * BEAT / 2 - .01, (t, a) =>
        text(S, s, W / 2, 800, { size: 40, font: F.mono, col: [INK.paper, INK.paper, INK.navy, INK.paper][i % 4] })]),
  // ---- verse 1 ----
  [12.4, 15.7, async (t, a) => { await logo('gtx580', 1560, 170, 190, a - .6); await logo('nvidia', 1230, 110, 110, a - 1.4); text(S, './cuda-convnet --gpus 2', 250, 110, { size: 30, font: F.mono, col: INK.navy, knock: 8, alpha: seg(a, .2, .4) }); }],
  [15.8, 19.0, async (t, a) => { await logo('imagenet', 1740, 560, 150, a - .2); await logo('uoft', 1750, 800, 140, a - 1.8); }],
  [19.1, 21.8, (t, a) => cite(60, 95, ['Distinctive Image Features…', 'SIFT · Lowe 2004 · HOG · Dalal & Triggs 2005'], a - .3, { w: 700 })],
  [23.45, 25.0, async (t, a) => { const L = ['google', 'baidu', 'microsoft', 'deepmind']; for (let i = 0; i < 4; i++) await logo(L[i], 300 + i * 420, 170, 120, a - i * .12);
      text(S, 'DNNresearch → Google · $44M · Lake Tahoe, Dec 2012', W / 2, 330, { size: 34, font: F.mono, col: INK.navy, knock: 8, alpha: seg(a, .5, .7) }); }],
  [25.1, 26.6, async (t, a) => { await logo('deepmind', 1650, 900 - 100, 150, a - .3); cite(60, 95, ['Playing Atari with Deep RL', 'Mnih et al. · DeepMind · 2013'], a - .5, { w: 640 }); }],
  [26.7, 28.08, (t, a) => cite(1210, 820 - 100, ['Efficient Estimation of Word Representations', 'Mikolov et al. · Google · 2013'], a - .6, { w: 680 })],
  [28.1, 29.9, (t, a) => cite(90, 120, ['Generative Adversarial Nets', 'Goodfellow et al. · 2014'], a - .3, { w: 540 })],
  [29.95, 31.7, async (t, a) => { cite(90, 120, ['Inceptionism / DeepDream', 'Mordvintsev et al. · Google · 2015'], a - .1, { w: 600 }); await logo('google', 1650, 830, 110, a - .4); }],
  // ---- verse 2 ----
  [44.0, 45.9, async (t, a) => { tag(350, 50, 360, 350, 'lee_sedol · 9 dan', a - .5, { col: INK.pink, txt: INK.paper }); await logo('deepmind', 1650, 200, 130, a - .9); text(S, 'AlphaGo 4 – 1', 1650, 330, { size: 44, font: F.mono, col: INK.navy, knock: 8, alpha: seg(a, 1.1, 1.3) }); }],
  [45.95, 47.8, async (t, a) => await logo('microsoft', 1650, 900 - 60, 120, a - .4)],
  [47.95, 50.9, async (t, a) => { await logo('deepmind', 1680, 930 - 90, 120, a - .3); text(S, 'AlphaZero vs Stockfish · 28 wins, 0 losses', W / 2, 915 - 70, { size: 32, font: F.mono, col: INK.navy, knock: 8, alpha: seg(a, 1, 1.2) }); }],
  [51.0, 53.9, async (t, a) => { text(S, 'Vaswani · Shazeer · Parmar · Uszkoreit · Jones · Gomez · Kaiser · Polosukhin', 500, 235, { size: 21, font: F.mono, col: INK.pink, knock: 6, alpha: seg(a, 1.6, 1.9) }); await logo('google', 1690, 880 - 80, 100, a - 2.0); }],
  [54.0, 57.0, async (t, a) => { await logo('arxiv', 1600, 250, 110, a - .8); text(S, 'common crawl · books · wikipedia · reddit · github', 1280, 360, { size: 28, font: F.mono, col: INK.navy, knock: 6, alpha: seg(a, 1, 1.2) }); }],
  [57.15, 60.0, async (t, a) => { await logo('openai', 1650, 250, 140, a - .2); text(S, 'GPT-2 · 1.5B params · Feb 2019', 1650, 360, { size: 30, font: F.mono, col: INK.navy, knock: 8, alpha: seg(a, .4, .6) }); }],
  [60.1, 63.3, async (t, a) => { await logo('openai', 220, 190, 120, a - .2); text(S, 'OpenAI Five 2 – 0 OG · TI8 champs', 520, 330, { size: 30, font: F.mono, col: INK.paper, knock: 0, alpha: seg(a, .4, .6) }); }],
  [63.5, 66.5, async (t, a) => { await logo('deepmind', 1680, 880 - 80, 120, a - .8); text(S, 'AlphaFold 2 · CASP14 · GDT 92.4', 1480, 770 - 90, { size: 30, font: F.mono, col: INK.navy, knock: 8, alpha: seg(a, 1, 1.2) }); }],
  [66.6, 69.7, async (t, a) => { await logo('openai', 1660, 900 - 110, 110, a - .4); text(S, 'DALL·E · Jan 2021', 1660, 980 - 110 - 70, { size: 28, font: F.mono, col: INK.navy, knock: 8, alpha: seg(a, .6, .8) }); }],
  [69.9, 73.7, (t, a) => cite(1180, 60, ['On the Dangers of Stochastic Parrots 🦜', 'Bender · Gebru · McMillan-Major · Mitchell · 2021'], a - 1.0, { w: 720 })],
  // ---- verse 3 ----
  [95.2, 98.5, async (t, a) => { await logo('midjourney', 1640, 850 - 80, 120, a - .5); text(S, '"Théâtre D\'opéra Spatial" · Colorado State Fair 2022', W / 2, 870 - 20, { size: 30, font: F.serif, style: 'italic', col: INK.navy, knock: 8, alpha: seg(a, .8, 1) }); }],
  [98.6, 101.6, async (t, a) => await logo('chatgpt', 1750, 760, 160, a - .1)],
  [101.7, 103.2, async (t, a) => { await logo('openai', 1650, 250, 120, a - .2); text(S, 'GPT-4 · Uniform Bar Exam', 1650, 360, { size: 28, font: F.mono, col: INK.navy, knock: 8, alpha: seg(a, .3, .5) }); }],
  [104.7, 107.8, (t, a) => cite(1150, 560, ['Pause Giant AI Experiments: An Open Letter', 'Future of Life Institute · March 22, 2023'], a - .6, { w: 700 })],
  [108.6, 113.1, async (t, a) => { await logo('openai', 150, 830, 110, a - .3); tag(240, 190, 260, 330, 'sam_altman · ceo?', a - .4, { col: INK.pink, txt: INK.paper, score: .5 }); }],
  // 113.2–120.8: the Nobel medals are part of the shot itself (d_v3_v4.js)
  // ---- verse 4 ----
  [134.7, 137.6, async (t, a) => { await logo('deepseek', 300, 170, 110, a - .3); await logo('nvidia', 1560, 470, 90, a - 1.3); text(S, 'NVDA −17% · Jan 27, 2025', 1560, 540, { size: 26, font: F.mono, col: INK.pink, knock: 6, alpha: seg(a, 1.4, 1.6) }); }],
  [137.65, 139.0, async (t, a) => { await logo('deepmind', 260, 180, 110, a - .1); await logo('openai', 260, 330, 110, a - .25); text(S, 'IMO 2025 · 35/42', 260, 440, { size: 30, font: F.mono, col: INK.navy, knock: 8 }); }],
  [139.05, 140.1, async (t, a) => { await logo('openai', 260, 180, 100, a - .1); text(S, 'Stargate · OpenAI × SoftBank × Oracle', 520, 330, { size: 28, font: F.mono, col: INK.paper, alpha: seg(a, .2, .4) }); }],
  [140.2, 143.2, async (t, a) => await logo('replit', 250, 170, 120, a - .3)],
  [146.35, 149.4, async (t, a) => await logo('huggingface', 1650, 880 - 90, 150, a - .6)],
  [149.5, 152.7, async (t, a) => { await logo('nvidia', 1560, 900 - 90, 110, a - .9); await logo('huggingface', 1250, 900 - 90, 110, a - 1.1); }],
  [153.2, 155.9, (t, a) => text(S, 'Clay Mathematics Institute · 7 Millennium Prize Problems · 1 claimed so far', W / 2, 1000 - 100, { size: 26, font: F.mono, col: INK.paper, alpha: seg(a, 1, 1.3) })],
];
// Credits crawl (final chorus → end): a LIVE news ticker thanking everyone
const THANKS = ['Alex Krizhevsky', 'Ilya Sutskever', 'Geoffrey Hinton', 'Fei-Fei Li', 'the ImageNet labelers', 'Yann LeCun', 'Yoshua Bengio', 'Jürgen Schmidhuber', 'Sepp Hochreiter',
  'Demis Hassabis', 'Shane Legg', 'Mustafa Suleyman', 'David Silver', 'Aja Huang', 'Lee Sedol', 'Fan Hui', 'Ian Goodfellow', 'Tomas Mikolov', 'Kaiming He', 'Diederik Kingma',
  'Jimmy Ba', 'Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan Gomez', 'Łukasz Kaiser', 'Illia Polosukhin', 'Alec Radford',
  'Andrej Karpathy', 'Jeff Dean', 'Andrew Ng', 'Oriol Vinyals', 'John Jumper', 'David Baker', 'John Hopfield', 'Jensen Huang', 'Jared Kaplan', 'Dario Amodei',
  'Sam Altman', 'Greg Brockman', 'Liang Wenfeng', 'every grad student with two GPUs', 'every open-source maintainer', 'and you'];
const THANKS_TXT = 'THANK YOU  ▸  ' + THANKS.join('  ▸  ') + '  ▸  HAPPY 14TH BIRTHDAY, DEEP LEARNING  ▸  ';
function ticker(t) {
  const t0 = 172.45, t1 = 193.15; if (t < t0 || t > t1) return;
  const g = S, y = H - 46, k = easeOut(seg(t, t0, t0 + .3)) * (1 - seg(t, t1 - .2, t1));
  g.save(); g.translate(0, (1 - k) * 60);
  g.fillStyle = INK.navy; g.fillRect(0, y - 26, W, 60); g.fillStyle = INK.pink; g.fillRect(0, y - 26, 180, 60);
  const w = measure(g, THANKS_TXT, 30, F.mono), x = 200 - ((t - t0) * 520) % w;
  g.save(); g.beginPath(); g.rect(180, y - 26, W - 180, 60); g.clip();
  for (let xx = x; xx < W; xx += w) text(g, THANKS_TXT, xx, y + 4, { size: 30, font: F.mono, align: 'left', col: INK.yellow });
  g.restore();
  text(g, '● THANK YOU', 90, y + 4, { size: 22, font: F.pixel, col: INK.paper });
  g.restore();
}
// Final chorus: every lab's logo rains down with the confetti
const RAIN_FACES = ['hinton', 'sutskever', 'krizhevsky', 'feifei', 'lecun', 'bengio', 'hassabis', 'jensen', 'leesedol', 'goodfellow', 'jumper', 'altman'];
const ALL_LOGOS = ['nvidia', 'google', 'deepmind', 'openai', 'microsoft', 'meta', 'huggingface', 'anthropic', 'baidu', 'imagenet', 'uoft', 'midjourney', 'arxiv', 'replit', 'gtx580'];
async function logoRain(t, t0, t1) {
  if (t < t0 || t > t1) return;
  for (let i = 0; i < ALL_LOGOS.length * 2; i++) {
    const R = rng('lr' + i), start = t0 + R() * (t1 - t0 - 1.5), a = t - start; if (a < 0 || a > 3) continue;
    const x = 80 + R() * (W - 160), y = -120 + a * (300 + R() * 200);
    sticker(await SAFE(LOGO(ALL_LOGOS[i % ALL_LOGOS.length])), x, y, 90 + R() * 40, { rot: (R() - .5) * .6 + a * (R() - .5), border: 8, shadow: false });
  }
  for (let i = 0; i < RAIN_FACES.length; i++) {
    const R = rng('fr' + i), start = t0 + .4 + i * (t1 - t0 - 2.5) / RAIN_FACES.length, a = t - start; if (a < 0 || a > 3.2) continue;
    sticker(await SAFE(FACE(RAIN_FACES[i])), 120 + R() * (W - 240), -160 + a * 380, 170, { rot: (R() - .5) * .4, border: 10 });
  }
}
(() => {
  OVERLAYS.push(async t => {
    for (const [t0, t1, fn] of EGGS) if (t >= t0 && t < t1) await fn(t, t - t0);
    await logoRain(t, 172.6, 184.5);
    ticker(t);
  });
})();
