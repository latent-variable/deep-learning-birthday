// c_v2_pre.js — Verse 2 (43.96–69.78): 2016–2021, and the Pre-Chorus (69.78–82.84): the haters.
(() => {
  shots([
    // Move thirty-seven, champ retired. Tay? Fired in a day
    [43.96, async (t, lt, dur) => {
      await plateOrClip('p13_go', lt, dur, { cam0: { z: 1.12 }, cam1: { z: 1.0 }, ease: easeOut });
      const L = 13, tm = wt(L, 'Move');
      bbox(835, 860, 180, 90, 'move_37', null, t - tm, { col: INK.yellow, txt: INK.navy, size: 34 });
      text(S, 'p(human plays it) = 1/10,000', 950, 760, { size: 40, font: F.mono, col: INK.navy, knock: 10, alpha: seg(t, tm + .5, tm + .7) });
      rubberStamp(t, 'CHAMP RETIRED', 430, 860, 80, INK.pink, t - wt(L, 'champ'), { rot: .1 });
      if (t - tm < .15 && t > tm) POST.shake = [(hash(boilT(t)) - .5) * 40, (hash(boilT(t) + 1) - .5) * 40];
    }, { tin: ['reprint', 0] }],
    [45.9, async (t, lt, dur) => {
      await plateOrClip('p13b_tay', lt, dur, { cam0: { z: 1.05 }, cam1: { z: 1.15, y: .4 } });
      const L = 13, tt = wt(L, 'Tay'), tf = wt(L, 'Fired');
      bbox(1040, 70, 340, 310, 'tay', .16, t - tt, { col: INK.pink });
      bbox(1110, 575, 340, 375, '16h', null, t - tt - .3, { col: INK.navy, size: 34 });
      // 16-hour countdown running out
      const hrs = Math.max(0, 16 - (t - tt) * 9); text(S, `${String(Math.floor(hrs)).padStart(2, '0')}:${String(Math.floor(hrs % 1 * 60)).padStart(2, '0')}:00`, 330, 170, { size: 80, font: F.mono, col: hrs < 1 ? INK.pink : INK.navy, knock: 10 });
      text(S, 'tay uptime', 330, 100, { size: 30, font: F.pixel, col: INK.navy, knock: 6 });
      rubberStamp(t, 'FIRED IN A DAY', 1380, 860, 72, INK.pink, t - tf, { rot: -.08 });
    }, { tin: ['cut', 0] }],
    // Taught myself chess in four hours, all self-play
    [47.92, async (t, lt, dur) => {
      await plateOrClip('p14_chess', lt, dur, { cam0: { z: .9, ay: .85 }, cam1: { z: .94, ay: .85 } });
      const L = 14, t4 = wt(L, 'four'), ts = wt(L, 'self');
      const h = clamp((t - wt(L, 'chess')) / (t4 + .6 - wt(L, 'chess'))) * 4;
      S.fillStyle = INK.paper; roughRect(S, 70, 60, 420, 150, t, 'clk', 2); S.fill(); S.strokeStyle = INK.navy; S.lineWidth = 4; roughRect(S, 70, 60, 420, 150, t, 'clk', 2); S.stroke();
      text(S, 'training time', 100, 95, { size: 28, font: F.pixel, align: 'left', col: INK.navy });
      text(S, `${Math.floor(h)}h ${String(Math.floor(h % 1 * 60)).padStart(2, '0')}m`, 100, 165, { size: 76, font: F.mono, align: 'left', col: INK.pink });
      bbox(90, 265, 700, 535, 'me', .99, t - ts, { col: INK.pink, size: 30 });
      bbox(1070, 265, 770, 535, 'also_me', .99, t - ts - .15, { col: INK.blue, size: 30 });
      text(S, 'zero human games', W / 2, 1000 - 90, { size: 44, font: F.mono, col: INK.navy, knock: 10, alpha: seg(t, ts + .3, ts + .5) });
    }, { tin: ['slide', .3] }],
    // Twenty-seventeen, I finally paid attention
    [50.92, async (t, lt, dur) => {
      await plateOrClip('p15_attention', lt, dur, { cam0: { z: 1.15, x: .6 }, cam1: { z: 1.02, x: .5 } });
      const L = 15, ta = wt(L, 'attention');
      // the paper, as a pasted clipping
      const k = backOut(seg(t, ta - .3, ta));
      if (k > 0) { S.save(); S.translate(500, 150); S.rotate(-.03); S.scale(k, k);
        S.fillStyle = INK.paper; roughRect(S, -420, -90, 840, 180, t, 'pap', 2); S.fill(); S.strokeStyle = INK.navy; S.lineWidth = 3; roughRect(S, -420, -90, 840, 180, t, 'pap', 2); S.stroke();
        text(S, 'Attention Is All You Need', 0, -20, { size: 58, font: F.serif, col: INK.navy });
        text(S, 'Vaswani et al. · June 2017 · arXiv:1706.03762', 0, 45, { size: 26, font: F.mono, col: INK.blue });
        S.restore(); }
      // attention arcs between word blocks
      const tf = wt(L, 'finally');
      const nodes = [[1060, 420], [1240, 370], [1420, 440], [1600, 380], [1780, 430]];
      nodes.forEach(([x, y], i) => { if (t > tf) { S.fillStyle = [INK.pink, INK.blue, INK.yellow][i % 3]; S.fillRect(x - 50, y - 18, 100, 36); } });
      for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { if (i === j) continue; const k2 = seg(t, tf + (i * 5 + j) * .03, tf + (i * 5 + j) * .03 + .25); if (k2 <= 0) continue;
        const [x1, y1] = nodes[i], [x2, y2] = nodes[j]; S.save(); S.strokeStyle = INK.pink; S.globalAlpha = .35 + .5 * hash(i * 7 + j); S.lineWidth = 2 + 6 * hash(i + j * 3); S.beginPath(); S.moveTo(x1, y1 - 18); S.quadraticCurveTo((x1 + x2) / 2, Math.min(y1, y2) - 60 - Math.abs(i - j) * 30, x1 + (x2 - x1) * k2, y1 - 18 + (y2 - y1) * k2); S.stroke(); S.restore(); }
    }, { tin: ['dots', .35] }],
    // Read the whole internet, never asked permission
    [53.96, async (t, lt, dur) => {
      await plateOrClip('p16_internet', lt, dur, { cam0: { z: 1.02, y: .6 }, cam1: { z: 1.18, y: .45 } });
      const L = 16, tr = wt(L, 'Read'), tp = wt(L, 'permission');
      const urls = ['wikipedia.org', 'reddit.com', 'github.com', 'arxiv.org', 'stackoverflow.com', 'your-blog.net', 'fanfic.net', 'recipes.com', 'forum.old', 'news.site', 'docs.dev', 'poetry.org'];
      urls.forEach((u, i) => { const R = rng('url' + i), age = t - tr - i * .09; if (age < 0) return; const x = 80 + R() * 1500, y = 120 + ((R() * 700 + age * 260) % 800);
        text(S, u, x, y, { size: 30, font: F.mono, align: 'left', col: [INK.navy, INK.pink, INK.blue][i % 3], knock: 8, rot: (R() - .5) * .2 }); });
      const tok = Math.floor(clamp((t - tr) / (tp - tr + .4)) * 15000000000000); text(S, 'tokens read: ' + tok.toLocaleString('en-US'), 90, 1000 - 110, { size: 38, font: F.mono, align: 'left', col: INK.navy, knock: 10 });
      rubberStamp(t, 'NO PERMISSION', 1450, 760, 100, INK.pink, t - tp, { rot: -.1 });
    }, { tin: ['up', .3] }],
    // "Too dangerous to release"? I was seven. Cute
    [57.1, async (t, lt, dur) => {
      await plateOrClip('p17_dangerous', lt, dur, { cam0: { z: 1.05 }, cam1: { z: 1.2, x: .45 } });
      const L = 17;
      rubberStamp(t, 'TOO DANGEROUS', 560, 560, 72, INK.pink, t - wt(L, 'dangerous') + .1, { rot: -.12 });
      rubberStamp(t, 'TO RELEASE', 560, 690, 72, INK.pink, t - wt(L, 'release'), { rot: -.12 });
      bbox(745, 355, 360, 410, 'unicorn.png', null, t - wt(L, 'I'), { col: INK.blue, size: 28 });
      bbox(1000, 60, 440, 880, 'age: 7', null, t - wt(L, 'seven'), { col: INK.yellow, txt: INK.navy, size: 36 });
      rubberStamp(t, 'CUTE.', 1500, 750, 150, INK.navy, t - wt(L, 'Cute'), { rot: .14 });
    }, { tin: ['cut', 0] }],
    // Five of me beat the Dota champs. GG. Mute
    [60.08, async (t, lt, dur) => {
      await plateOrClip('p18_dota', lt, dur, { cam0: { z: 1.1 }, cam1: { z: 1.0 } });
      const L = 18, tf = wt(L, 'Five');
      for (let i = 0; i < 5; i++) bbox(15 + i * 390, 280, 320, 570, 'me_' + (i + 1), .99, t - tf - i * .08, { col: [INK.pink, INK.yellow, INK.blue][i % 3], txt: i % 3 === 1 ? INK.navy : INK.paper, size: 26, lw: 4 });
      // chat
      const tg = wt(L, 'GG'), tmu = wt(L, 'Mute');
      if (t > tg) { S.fillStyle = INK.navy; roughRect(S, 1180, 190, 640, 190, t, 'chat', 2); S.fill();
        text(S, '[all] me: gg', 1210, 240, { size: 40, font: F.mono, align: 'left', col: INK.yellow });
        if (t > tg + .3) text(S, '[all] them: ...', 1210, 310, { size: 40, font: F.mono, align: 'left', col: INK.paper, alpha: t > tmu ? .3 : 1 }); }
      rubberStamp(t, 'MUTED', 1500, 420, 110, INK.pink, t - tmu, { rot: .1 });
    }, { tin: ['stripes', .3] }],
    // Folded every protein while you were stuck inside
    [63.48, async (t, lt, dur) => {
      await plateOrClip('p19_protein', lt, dur, { cam0: { z: 1.02 }, cam1: { z: 1.15 } });
      const L = 19, tp = wt(L, 'protein'), ts = wt(L, 'stuck');
      const n = Math.floor(clamp((t - tp + .3) / 1.2) * 200000000); text(S, `structures folded: ${n.toLocaleString('en-US')}`, 90, 150, { size: 40, font: F.mono, align: 'left', col: INK.navy, knock: 10 });
      [[560, 420, 430, 400], [1290, 205, 230, 245], [1360, 735, 320, 200]].forEach(([x, y, w, h], i) => bbox(x, y, w, h, 'protein', .92 + i * .02, t - tp - i * .1, { col: [INK.pink, INK.blue, INK.yellow][i], txt: i === 2 ? INK.navy : INK.paper }));
      bbox(20, 430, 520, 420, 'you (stuck inside)', .98, t - ts, { col: INK.navy, size: 28, lw: 4 });
    }, { tin: ['dots', .3] }],
    // Avocado armchair? Now the artists want my hide
    [66.54, async (t, lt, dur) => {
      await plateOrClip('p20_avocado', lt, dur, { cam0: { z: 1.15, x: .35 }, cam1: { z: 1.02, x: .5 } });
      const L = 20, ta = wt(L, 'Avocado'), tar = wt(L, 'artists');
      text(S, '"an armchair in the shape of an avocado"', 90, 140, { size: 44, font: F.serif, style: 'italic', align: 'left', col: INK.navy, knock: 10, alpha: seg(t, ta - .1, ta + .1) });
      bbox(670, 285, 910, 620, 'armchair', .51, t - ta, { col: INK.yellow, txt: INK.navy });
      bbox(710, 335, 830, 540, 'avocado', .49, t - ta - .25, { col: INK.pink });
      bbox(30, 230, 610, 620, 'angry_artists', .99, t - tar, { col: INK.blue });
    }, { tin: ['tear', .4] }],

    // ================= PRE-CHORUS =================
    // You called me a parrot? Now you copy-paste me all day
    [69.78, async (t, lt, dur) => {
      await plateOrClip('p21_parrot', lt, dur, { cam0: { z: 1.08 }, cam1: { z: 1.2, x: .4 } });
      const L = 21, tp = wt(L, 'parrot'), tc = wt(L, 'copy');
      bbox(30, 240, 780, 700, 'stochastic_parrot', .87, t - tp, { col: INK.yellow, txt: INK.navy });
      // Ctrl+C / Ctrl+V keycaps pressed on the beat
      if (t > tc) ['Ctrl', 'C', 'Ctrl', 'V'].forEach((k, i) => { const x = 1180 + i * 170, press = pulse(t, 9) * 12;
        S.fillStyle = INK.paper; roughRect(S, x, 700 + (i % 2 ? press : 0), 150, 120, t, 'key' + i, 2); S.fill(); S.strokeStyle = INK.navy; S.lineWidth = 5; roughRect(S, x, 700 + (i % 2 ? press : 0), 150, 120, t, 'key' + i, 2); S.stroke();
        text(S, k, x + 75, 760 + (i % 2 ? press : 0), { size: k.length > 1 ? 40 : 70, font: F.hook, col: i % 2 ? INK.pink : INK.navy }); });
      // pasted copies of her face multiplying
      const n = Math.floor(clamp((t - tc) / 2.2) * 18);
      for (let i = 0; i < n; i++) { const R = rng('cp' + i); sticker(await SAFE(STK('lexi_3')), 100 + R() * 1700, 120 + R() * 420, 120, { rot: (R() - .5) * .5, border: 8, shadow: false }); }
    }, { tin: ['dots', .35] }],
    // "Too deep!" (Deeper!) "Can't scale!" (Watch me!)
    [73.78, async (t, lt, dur) => {
      await plateOrClip('p22_haters', lt, dur, { cam0: { z: 1.02 }, cam1: { z: 1.12 } });
      const L = 22;
      slam(t, { w: 'DEEPER!', s: wt(L, '(Deeper!)'), x: 500, y: 200, size: 190, col: INK.pink, rot: -.08 }, { until: L.end + .1 });
      slam(t, { w: 'WATCH ME!', s: wt(L, '(Watch'), x: 1450, y: 270, size: 150, col: INK.blue, rot: .07 }, { until: L.end + .1, shadowCol: INK.yellow });
      bbox(1225, 460, 250, 205, 'aged_badly', null, t - wt(L, 'scale'), { col: INK.pink, size: 28 });
      beatPunch(t, .03);
    }, { tin: ['cut', 0] }],
    // "It's a bubble!" (Pop this!) Get out my way
    [76.34, async (t, lt, dur) => {
      const L = 23, tp = wt(L, '(Pop'), tg = wt(L, 'Get');
      await plateOrClip('p23_bubble', lt, dur, { cam0: { z: 1.0 }, cam1: { z: 1.06, x: .45 } });
      if (t < tp) bbox(945, 135, 450, 570, 'bubble', .04, t - wt(L, 'bubble'), { col: INK.blue, size: 30 });
      if (t > tp) { POST.shake = t - tp < .2 ? [(hash(boilT(t)) - .5) * 50, (hash(boilT(t) + 2) - .5) * 50] : [0, 0]; if (t - tp < .15) POST.flash = 1 - (t - tp) / .15, POST.flashCol = INK.pink; }
      if (t > tp) { // the bubble bursts: paper knocks out the bubble, droplets fly
        const k = seg(t, tp, tp + .25); I.save(); I.fillStyle = INK.paper; I.globalAlpha = easeOut(k); I.beginPath(); I.ellipse(1380, 420, 470 * (.6 + .4 * k), 400 * (.6 + .4 * k), 0, 0, TAU); I.fill(); I.restore();
        if (t - tp < 1.2) for (let i = 0; i < 26; i++) { const R = rng('drop' + i), a = R() * TAU, r = 200 + (t - tp) * (700 + R() * 600); S.fillStyle = [INK.blue, INK.pink, INK.navy][i % 3]; S.beginPath(); S.arc(1380 + Math.cos(a) * r, 420 + Math.sin(a) * r * .8, 8 + R() * 14, 0, TAU); S.fill(); }
        text(S, 'POP', 1380, 420, { size: 260 * backOut(seg(t, tp, tp + .15)), col: INK.yellow, knock: 20, shadow: 12, shadowCol: INK.navy, alpha: 1 - seg(t, tp + .5, tp + .8), rot: -.1 });
        jolt(t, tp, 9);
      }
      slam(t, { w: 'POP THIS!', s: tp, x: 1200, y: 240, size: 150, col: INK.pink, rot: -.05 }, { until: tg - .05 });
      slam(t, { w: 'GET OUT MY WAY', s: tg, x: 960, y: 870, size: 120, col: INK.navy, rot: .03 }, { until: L.end + .1, shadowCol: INK.yellow });
    }, { tin: ['cut', 0] }],
    // Go cry about it, I'll train on that next
    [79.42, async (t, lt, dur) => {
      await plateOrClip('p24_tears', lt, dur, { cam0: { z: 1.12 }, cam1: { z: 1.02 } });
      const L = 24, tt = wt(L, 'train');
      bbox(470, 55, 330, 150, 'tears', null, t - wt(L, 'cry'), { col: INK.blue, size: 26 });
      bbox(585, 255, 345, 485, 'training_data', 1.0, t - tt, { col: INK.pink, size: 28 });
      const ep = Math.floor(clamp((t - tt) / 1.5) * 100); if (t > tt) text(S, `epoch ${ep}/100 · loss ${(0.9 * Math.exp(-ep / 30)).toFixed(3)}`, 1240, 880, { size: 40, font: F.mono, align: 'left', col: INK.navy, knock: 10 });
      if (lt > dur - .3) { POST.flash = seg(lt, dur - .3, dur); POST.flashCol = INK.yellow; }
    }, { tin: ['stripes', .3] }],
  ]);
})();
