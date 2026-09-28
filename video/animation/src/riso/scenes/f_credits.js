// f_credits.js — the credits (after the song ends at 194.72): Lexi labels everyone who made this.
// Each credit is a detection box with a pixel label — "now I'm labeling you", all the way to the end.
const SONG_END = 194.72;
(() => {
  const C = SONG_END;
  const PHOTOS = [['geoffrey hinton', 'Cmichel67', 'CC BY-SA 4.0'], ['demis hassabis', 'John Sears', 'CC BY-SA 4.0'], ['fei-fei li', 'ITU Pictures', 'CC BY 2.0'],
    ['yann lecun', 'Jérémy Barande', 'CC BY-SA 2.0'], ['yoshua bengio', 'Xuthoria', 'CC BY-SA 4.0'], ['jensen huang', 'The White House', 'public domain'],
    ['lee sedol', 'LG Electronics', 'CC BY 2.0'], ['sam altman', "PM's Office of Japan", 'CC BY 4.0'], ['ian goodfellow', 'Ian Goodfellow', 'CC BY-SA 4.0'],
    ['john jumper', 'Jay Dixit', 'CC BY-SA 4.0']];
  // one credit line: text + a detection box snapping around it
  function credit(t, x, y, name, label, t0, o = {}) {
    const a = t - t0; if (a < 0) return;
    const size = o.size || 64, fam = o.font || F.serif, style = o.style ?? 'italic';
    const w = measure(S, name, size, fam, style), k = easeOut(seg(a, 0, .18));
    text(S, name, x, y, { size, font: fam, style, align: 'left', col: o.col || INK.navy, alpha: k });
    bbox(x - 18, y - size * .62, w + 36, size * 1.24, label, o.score ?? 1.0, a - .12, { col: o.bc || INK.pink, txt: o.bt || INK.paper, size: o.ls || 24, lw: 5 });
  }
  function header(t, s, t0, col = INK.pink) { slam(t, { w: s, s: t0, x: 120 + measure(S, s, 150) / 2, y: 170, size: 150, col, rot: -.02 }, { knock: 16 }); }
  const cards = [
    // the terminal keeps typing where the song left off
    [C, async (t, lt) => { flood(INK.navy); typeOn(t, '> hello, world', 620, 540, C - 2, 99, { size: 80, font: F.pixel, col: INK.yellow, cursor: false });
      typeOn(t, '> credits --all', 620, 640, C + .1, 26, { size: 80, font: F.pixel, col: INK.pink }); }],
    [C + .95, async (t, lt) => {
      header(t, 'MADE BY', C + 1.0);
      credit(t, 140, 420, 'Lino Valdovinos', 'human · director', C + 1.3, { size: 96 });
      credit(t, 140, 650, 'Claude Opus 5.5', 'ai · co-creator', C + 1.75, { size: 96, bc: INK.blue, score: .99 });
      text(S, 'lyrics · storyboard · code · animation engine · edit', 160, 760, { size: 32, font: F.mono, align: 'left', col: INK.blue, alpha: seg(t, C + 2.0, C + 2.2) });
      sticker(await SAFE(STK('pose_1')), 1540, 600, 760, { k: backOut(seg(t, C + 1.1, C + 1.4)), rot: -.04 });
    }, { tin: ['reprint', 0], c1: INK.yellow, c2: INK.pink }],
    [C + 3.4, async (t, lt) => {
      header(t, 'STARRING', C + 3.45, INK.blue);
      sticker(await SAFE(STK('lexi_0')), 700, 640, 640, { k: backOut(seg(t, C + 3.5, C + 3.8)), rot: .03 });
      bbox(470, 300, 470, 670, 'lexi · deep learning · age 14', .99, t - C - 3.8, { col: INK.pink, size: 30, lw: 8 });
      text(S, 'alex·net → lexi', 1000, 470, { size: 90, font: F.serif, style: 'italic', align: 'left', col: INK.navy, alpha: seg(t, C + 4.1, C + 4.3) });
      text(S, 'jersey 15.3 = her 2012 ImageNet top-5 error', 1000, 570, { size: 28, font: F.mono, align: 'left', col: INK.pink, alpha: seg(t, C + 4.4, C + 4.6) });
      text(S, 'born 2012.09.30, team name SuperVision', 1000, 625, { size: 28, font: F.mono, align: 'left', col: INK.blue, alpha: seg(t, C + 4.6, C + 4.8) });
    }, { tin: ['dots', .3] }],
    [C + 5.6, async (t, lt) => {
      header(t, 'MUSIC', C + 5.65);
      credit(t, 140, 400, 'Suno', 'final song', C + 5.9, { size: 84 });
      credit(t, 140, 560, 'ACE-Step 1.5 XL · MiniMax Music 3 · YuE2', 'style + lyric exploration', C + 6.2, { size: 54, bc: INK.blue });
      credit(t, 140, 700, 'faster-whisper · jiwer', 'lyric legibility scoring', C + 6.5, { size: 54, bc: INK.yellow, bt: INK.navy });
      credit(t, 140, 840, 'MelBand RoFormer', 'vocal stems for lip sync', C + 6.8, { size: 54 });
      for (let i = 0; i < 6; i++) { const h = 60 + 220 * aud('mix', t - 30 + i * .13); S.fillStyle = [INK.pink, INK.blue, INK.yellow][i % 3]; S.fillRect(1500 + i * 60, 800 - h, 44, h); }
    }, { tin: ['stripes', .3] }],
    [C + 8.1, async (t, lt) => {
      header(t, 'PICTURES + MOTION', C + 8.15, INK.blue);
      credit(t, 140, 400, 'Qwen-Image 2.1', 'every illustration · qwen / alibaba', C + 8.4, { size: 72 });
      credit(t, 140, 560, 'LTX-2.3', 'image → motion · lightricks', C + 8.7, { size: 72, bc: INK.blue });
      credit(t, 140, 720, 'InfiniteTalk + Wan 2.1', 'lip sync · meigen · wan-ai', C + 9.0, { size: 72, bc: INK.yellow, bt: INK.navy });
      text(S, 'running in ComfyUI · ComfyUI-GGUF · on one RTX 3090 · $0 budget', 160, 850, { size: 32, font: F.mono, align: 'left', col: INK.navy, alpha: seg(t, C + 9.3, C + 9.5) });
      bbox(140, 820, 1260, 60, 'gpu_0 · survived one bluescreen', .97, t - C - 9.6, { col: INK.pink, size: 22, lw: 4 });
    }, { tin: ['tear', .35] }],
    [C + 10.6, async (t, lt) => {
      header(t, 'PRINT SHOP', C + 10.65);
      credit(t, 140, 390, 'p5.js · p5.brush · Puppeteer · Chrome · FFmpeg', 'the riso compositor', C + 10.85, { size: 50 });
      credit(t, 140, 530, 'ClaudeAnimationBase + "I\'m Upping My P(doom)"', 'the kit & the inspiration · john heibel', C + 11.1, { size: 50, bc: INK.blue });
      credit(t, 140, 670, 'Bricolage Grotesque · Instrument Serif · Silkscreen · Space Mono', 'fonts · SIL OFL', C + 11.35, { size: 42, bc: INK.yellow, bt: INK.navy });
      text(S, 'librosa · Node.js · Python · ACE-Step API · the Hugging Face Hub', 160, 790, { size: 32, font: F.mono, align: 'left', col: INK.blue, alpha: seg(t, C + 11.6, C + 11.8) });
    }, { tin: ['reprint', 0], c1: INK.pink, c2: INK.blue }],
    [C + 12.7, async (t, lt) => {
      header(t, 'PHOTO REFERENCES', C + 12.75, INK.blue);
      text(S, 'portraits redrawn from Wikimedia Commons photos:', 140, 320, { size: 34, font: F.mono, align: 'left', col: INK.navy });
      PHOTOS.forEach(([who, by, lic], i) => { const x = 140 + (i % 2) * 860, y = 400 + Math.floor(i / 2) * 64;
        text(S, `${who} — ${by} (${lic})`, x, y, { size: 26, font: F.mono, align: 'left', col: i % 2 ? INK.blue : INK.navy, alpha: seg(t, C + 12.9 + i * .05, C + 13.1 + i * .05) }); });
      text(S, 'ilya sutskever — reference photo supplied by the director', 140, 400 + 5 * 64, { size: 28, font: F.mono, align: 'left', col: INK.navy, alpha: seg(t, C + 13.4, C + 13.6) });
      text(S, 'logos and names belong to their owners — a tribute, not an endorsement', 140, 860, { size: 44, font: F.serif, style: 'italic', align: 'left', col: INK.pink, alpha: seg(t, C + 13.6, C + 13.8) });
    }, { tin: ['dots', .3] }],
    [C + 14.7, async (t, lt) => {
      flood(INK.navy); const a = t - C - 14.7;
      text(S, 'for Alex, Ilya & Geoff', W / 2, 400, { size: 110, font: F.serif, style: 'italic', col: INK.paper, alpha: seg(a, .1, .5) });
      text(S, '— and everyone who labeled ImageNet', W / 2, 520, { size: 64, font: F.serif, style: 'italic', col: INK.yellow, alpha: seg(a, .6, 1.0) });
      text(S, '2012.09.30 → 2026.09.30', W / 2, 700, { size: 48, font: F.mono, col: INK.pink, alpha: seg(a, 1.0, 1.3) });
      bbox(W / 2 - 520, 300, 1040, 280, 'thank you', 1.0, a - 1.3, { col: INK.pink, size: 34, lw: 8 });
      if (t > DUR - .3) { POST.flash = seg(t, DUR - .3, DUR); POST.flashCol = INK.navy; }
    }, { tin: ['iris', .5] }],
  ];
  shots(cards.map(([t0, fn, o]) => [t0, async (t, lt, dur) => { await fn(t, lt, dur); }, o]));
})();
