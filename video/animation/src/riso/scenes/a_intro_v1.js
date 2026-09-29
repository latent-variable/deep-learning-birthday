// a_intro_v1.js — Intro (0–12.3) and Verse 1 (12.3–31.7): 2012–2015.
(() => {
  const B = SONG.beats, DB = SONG.downbeats;
  // giant split-flap year: fills the frame on a solid ink
  function bigYear(t, y, t0, col, bg) {
    const k = seg(t, t0, t0 + .08); flood(bg);
    const sy = lerp(.1, 1, easeOut(k));
    text(S, String(y), W / 2, H / 2 + 20, { size: 560, font: F.hook, col, sy, track: -20 });
    S.fillStyle = bg; S.fillRect(0, H / 2 + 12, W, 10);   // the flap seam
  }
  shots([
    // ---- Hello, world: her pixel eyes in the dark, HELLO / WORLD slam, the detector finds her ----
    [0, async (t, lt, dur) => {
      await plateOrClip('p00_hello', lt, dur, { still: true, cam0: { z: 1.22, y: .36 }, cam1: { z: 1.08, y: .42 }, ease: easeOut });
      slam(t, { w: 'HELLO,', s: 0.0, x: 470, y: 250, size: 250, col: INK.yellow, rot: -.08 }, { until: 2.84, shadowCol: INK.pink, knock: 0 });
      slam(t, { w: 'WORLD', s: .54, x: 1470, y: 840, size: 250, col: INK.pink, rot: .05 }, { until: 2.84, shadowCol: INK.yellow, knock: 0 });
      bbox(530, 140, 760, 610, 'deep_learning', .99, lt - 1.1, { col: INK.yellow, txt: INK.navy, size: 36, lw: 8 });
      typeOn(t, '> hello, world', 760, 1010, 0, 22, { size: 40, font: F.pixel, col: INK.yellow });
      beatPunch(t, .02);
    }],
    // ---- Fourteen candles, here's the recap / (Ooh) try to keep up → she blows them out ----
    [2.84, async (t, lt, dur) => {
      const L1 = 1, L2 = 2, tb = wt(L2, 'keep');   // a two-plate puppet swap: lit, then blown out (eyes squeezed shut) on "keep"
      await plateOrClip(t < tb ? 'p01_candles' : 'p01_candles_out', lt, dur, { cam0: { z: 1.0, y: .4 }, cam1: { z: 1.08, y: .45 } });
      jolt(t, tb, 8); confetti(I, t, 2.9, 60, { seed: 'c1' });
      const row = (words, y, size, until) => { const ws = words.map(([w]) => measure(S, w, size)), sp = size * .25, tot = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1); let x = W / 2 - tot / 2;
        words.forEach(([w, s, col, rot], i) => { slam(t, { w, s, x: x + ws[i] / 2, y, size, col, rot }, { until, knock: 22 }); x += ws[i] + sp; }); };
      row([['FOURTEEN', wt(L1, 'Fourteen'), INK.navy, -.04], ['CANDLES,', wt(L1, 'candles'), INK.navy, .03]], 150, 150, 6.9);
      row([["HERE'S", wt(L1, "here's"), INK.blue, .03], ['THE', wt(L1, 'the'), INK.navy, -.02], ['RECAP', wt(L1, 'recap'), INK.pink, -.04]], 935, 150, wt(L2, 'Try') - .05);
      // (ooh) as a little tilted sticker by her mouth
      if (t > 4.52 && t < wt(L2, 'Try')) { const k = backOut(seg(t, 4.52, 4.7)); S.save(); S.translate(1130, 560); S.rotate(-.18); S.scale(k, k); S.fillStyle = INK.yellow; roughRect(S, -95, -48, 190, 96, t, 'ooh', 3); S.fill(); text(S, '(ooh)', 0, 0, { size: 64, font: F.serif, style: 'italic', col: INK.navy }); S.restore(); }
      row([['TRY', wt(L2, 'Try'), INK.navy, -.03], ['TO', wt(L2, 'to'), INK.blue, .02], ['KEEP', wt(L2, 'keep'), INK.pink, -.02], ['UP', wt(L2, 'up'), INK.navy, .05]], 935, 170, 6.9);
      // candles blown out on "keep up": smoke curls rise from each wick
      if (t > tb) for (let i = 0; i < 14; i++) { const R = rng('wick' + i), x0 = 360 + R() * 1200, y0 = 640 + R() * 120, a = t - tb - R() * .15; if (a < 0) continue;
        const pts = []; for (let j = 0; j < 8; j++) pts.push([x0 + Math.sin(j * .9 + a * 4 + i) * 16 * j / 4, y0 - j * 26 - a * 90]); scribble(S, pts, INK.blue, 7, t, 'smk' + i, clamp(a * 4)); }
      beatPunch(t, .015);
    }, { tin: ['dots', .45] }],
    // ---- REWIND: title card, then the years slam full-frame 2019 → 2013 on half-beats ----
    [6.72, async (t, lt, dur) => {
      const years = []; for (let y = 2019, k = 0; y >= 2013; y--, k++) years.push([y, B[15] + k * BEAT / 2]);
      const cur = years.filter(([, s]) => t >= s).pop();
      if (cur) {
        const i = 2019 - cur[0], bg = [INK.pink, INK.blue, INK.yellow, INK.navy][i % 4], col = [INK.navy, INK.yellow, INK.pink, INK.pink][i % 4];
        bigYear(t, cur[0], cur[1], col, bg);
        text(S, '◀◀ REWIND', 160, 120, { size: 44, font: F.pixel, align: 'left', col: i % 4 === 2 ? INK.navy : INK.paper });
      } else {
        await plateOrClip('p02_rewind', lt, dur, { cam0: { z: 1.05 }, cam1: { z: 1.35, r: -.05 }, ease: easeIn });
        speedLines(S, t, W / 2, H / 2, 26 + Math.floor(lt * 6), INK.navy, { alpha: .6 + .3 * seg(lt, 0, 3) });
        const slams = [['HAPPY', DB[3], 300, INK.navy, -.06], ['BIRTHDAY', B[13], 470, INK.pink, .03], ['TO ME', B[14], 650, INK.blue, -.03]];
        for (const [w, s, y, col, rot] of slams) slam(t, { w, s, x: W / 2, y, size: w === 'BIRTHDAY' ? 250 : 220, col, rot }, { until: B[15] });
        if (t > B[14] + .3) text(S, '(self-supervised)', W / 2, 800, { size: 96, font: F.serif, style: 'italic', col: INK.navy, knock: 14, sc: backOut(seg(t, B[14] + .3, B[14] + .55)) });
      }
      beatPunch(t, .03, 5);
    }, { tin: ['tear', .5] }],

    // ================= VERSE 1 =================
    // Twenty-twelve, two G-P-Us, a ReLU kick   (the giant 2012 lands, then shrinks into the LIVE stamp)
    [12.32, async (t, lt, dur) => {
      await plateOrClip('p03_gpus', lt, dur, { off: .2, speed: .9, cam0: { z: 1.04 }, cam1: { z: 1.12, x: .45 } });
      const L = 3;
      if (lt < .75) { const k = easeInOut(seg(lt, .3, .75)); text(S, '2012', lerp(W / 2, W - 200, k), lerp(H / 2 + 20, 60, k), { size: lerp(560, 40, k), font: F.hook, col: INK.pink, knock: lerp(26, 0, k), shadow: 14 * (1 - k), shadowCol: INK.navy }); }
      bbox(300, 700, 540, 250, 'gpu_0: gtx_580', .99, t - wt(L, 'two'), { col: INK.yellow, txt: INK.navy });
      bbox(1300, 690, 600, 260, 'gpu_1: gtx_580', .98, t - wt(L, 'G-P-Us'), { col: INK.yellow, txt: INK.navy });
      // ReLU: a huge pink line — flat along the floor, then kicking up — drawn with the kick
      const tr = wt(L, 'ReLU'), k = seg(t, tr - .15, tr + .35);
      if (k > 0) {
        scribble(S, [[40, 820], [300, 820], [560, 820], [820, 820], [900, 800], [1180, 520], [1460, 240], [1700, 20]], INK.pink, 30, t, 'relu', k);
        text(S, 'ReLU', 470, 740, { size: 120, font: F.hook, col: INK.navy, knock: 16, alpha: seg(t, tr, tr + .1) });
        text(S, 'f(x) = max(0, x)', 470, 650, { size: 44, font: F.mono, col: INK.pink, knock: 10, alpha: seg(t, tr + .05, tr + .15) });
      }
    }, { tin: ['reprint', 0], tag: '2012 · gpu ×2' }],
    // Fifteen point three, runner-up? Twenty-six   (top-5 error: lower is better, one scale)
    [15.74, async (t, lt, dur) => {
      await plateOrClip('p04_podium', lt, dur, { cam0: { z: 1.05 }, cam1: { z: 1.0 } });
      tag(1130, 335, 190, 215, 'fei-fei_li', t - 16.1, { col: INK.yellow, size: 28 });
      const L = 4, t15 = wt(L, 'Fifteen'), t26 = wt(L, 'Twenty'), sc = 17;
      if (t < 17.8) bbox(840, 415, 160, 135, 'jersey: 15.3% err', null, t - wt(L, 'point'), { col: INK.pink, size: 24, lw: 5 });   // until she hops up
      // the race chart fits the empty stage left of her (she and the trophy start at x ≈ 600)
      const gx = 30, gy = 900, hk = easeOut(seg(t, t15, t15 + .45)), hk2 = easeOut(seg(t, t26, t26 + .5));
      if (t > t15 - .05) {
        S.fillStyle = INK.paper; roughRect(S, gx - 20, 250, 490, gy - 170, t, 'ch', 3); S.fill(); S.strokeStyle = INK.navy; S.lineWidth = 4; roughRect(S, gx - 20, 250, 490, gy - 170, t, 'ch', 3); S.stroke();
        text(S, 'top-5 error · lower wins', gx + 225, 288, { size: 24, font: F.mono, col: INK.navy });
        inkBar(S, gx + 20, gy - 40, 170, 15.3 * sc * hk, INK.pink, t, 'b1'); text(S, 'me', gx + 105, gy - 5, { size: 36, font: F.pixel, col: INK.navy });
        bigNum(t, '15.3', gx + 105, gy - 40 - 15.3 * sc * hk - 60, 96, INK.pink, t15);
        if (hk2 > 0) { inkBar(S, gx + 240, gy - 40, 170, 26.2 * sc * hk2, INK.blue, t, 'b2'); text(S, 'runner-up', gx + 325, gy - 5, { size: 26, font: F.pixel, col: INK.navy });
          bigNum(t, '26.2', gx + 325, Math.max(350, gy - 40 - 26.2 * sc * hk2 - 55), 84, INK.blue, t26); }
      }
      text(S, 'runner-up?', 1560, 330, { size: 80, font: F.serif, style: 'italic', col: INK.navy, knock: 12, alpha: seg(t, wt(L, 'runner') - .05, wt(L, 'runner') + .1), rot: -.06 });
    }, { tin: ['slide', .3], tag: '2012.10 · imagenet' }],
    // Hand-made features? Cute. Retired. Babe, you're fired
    [19.02, async (t, lt, dur) => {
      await plateOrClip('p05_fired', lt, dur, { cam0: { z: 1.05, x: .6 }, cam1: { z: 1.18, x: .5 } });
      const L = 5;
      bbox(890, 275, 540, 470, 'hand_made_features', .31, t - wt(L, 'Hand'), { col: INK.blue });
      rubberStamp(t, 'CUTE.', 260, 560, 90, INK.pink, t - wt(L, 'Cute'), { rot: -.12 });
      rubberStamp(t, 'RETIRED', 1480, 560, 120, INK.navy, t - wt(L, 'Retired'), { rot: .14 });
      rubberStamp(t, "YOU'RE FIRED", W / 2 - 60, 760, 130, INK.pink, t - wt(L, 'fired'), { rot: -.07 });
    }, { tin: ['reprint', 0], tag: 'sift · hog · retired' }],
    // Born under SuperVision, casino bid, Google hired
    [21.84, async (t, lt, dur) => {
      await plateOrClip('p06_nursery', lt, dur, { cam0: { z: 1.0 }, cam1: { z: 1.05 } });
      const L = 6;
      bbox(740, 480, 500, 470, 'newborn', .99, t - wt(L, 'Born'), { col: INK.pink });
      bbox(520, 528, 90, 82, 'supervision', null, t - wt(L, 'Super'), { col: INK.blue, size: 24, lw: 4 });   // the team pin
      tag(455, 70, 285, 310, 'alex_krizhevsky', t - wt(L, 'Super') - .12, { col: INK.pink, txt: INK.paper, size: 28 });
      tag(875, 100, 240, 245, 'ilya_sutskever', t - wt(L, 'Super') - .24, { col: INK.pink, txt: INK.paper, size: 28 });
      tag(1195, 20, 270, 320, 'geoffrey_hinton', t - wt(L, 'Super') - .36, { col: INK.pink, txt: INK.paper, size: 28 });   // label drops under his chin
    }, { tin: ['stripes', .35], tag: 'born' }],
    [23.4, async (t, lt, dur) => {
      await plateOrClip('p06b_casino', lt, dur, { cam0: { z: 1.02 }, cam1: { z: 1.15, y: .4 } });
      const L = 6;
      text(S, 'going… going…', 380, 450, { size: 70, font: F.serif, style: 'italic', col: INK.navy, knock: 12, alpha: seg(t, wt(L, 'casino'), wt(L, 'casino') + .1), rot: -.05 });
      rubberStamp(t, 'HIRED', 1550, 520, 140, INK.navy, t - wt(L, 'hired'), { rot: -.15 });
    }, { tin: ['reprint', 0], tag: 'auction · lake tahoe' }],
    // Beat Atari off the pixels, king minus man? Queen
    [25.02, async (t, lt, dur) => {
      await plateOrClip('p07_atari', lt, dur, { cam0: { z: 1.0 }, cam1: { z: 1.2 } });
      const L = 7;
      bbox(1110, 390, 380, 260, 'breakout', 1.00, t - wt(L, 'Atari'), { col: INK.yellow, txt: INK.navy });
      const sc = Math.floor(clamp((t - wt(L, 'Beat')) / 1.4) * 864); text(S, 'SCORE ' + String(sc).padStart(4, '0'), 1600, 180, { size: 48, font: F.pixel, col: INK.pink, knock: 8 });
    }, { tin: ['dots', .3], tag: '2013 · dqn' }],
    [26.6, async (t, lt, dur) => {
      await plateOrClip('p07b_queen', lt, dur, { cam0: { z: 1.12 }, cam1: { z: 1.0 } });
      const L = 7, tk = wt(L, 'king'), tq = wt(L, 'Queen');
      const eq = [['KING', tk, INK.navy], ['−', tk + .15, INK.pink], ['MAN', wt(L, 'man'), INK.navy], ['+', wt(L, 'man') + .15, INK.pink], ['WOMAN', wt(L, 'man') + .3, INK.navy], ['=', tq - .1, INK.pink]];
      let x = 200; for (const [w, s, col] of eq) { const sz = w.length > 1 ? 80 : 90; slam(t, { w, s, x: x + measure(S, w, sz) / 2, y: 110, size: sz, col, rot: 0 }, {}); x += measure(S, w, sz) + 36; }
      slam(t, { w: 'QUEEN', s: tq, x: x + 170, y: 110, size: 130, col: INK.pink, rot: -.06 }, { shadowCol: INK.yellow });
    }, { tin: ['reprint', 0], tag: 'word2vec' }],
    // Faces out of noise (progressive GAN: pixels resolve into faces), dog-slugs in a DeepDream
    [28.08, async (t, lt, dur) => {
      const L = 8, td = wt(L, 'dog');
      if (t < td - .05) {
        let img; try { img = await IMG(PL('p08a_faces')); } catch (e) { CACHE.delete(PL('p08a_faces')); img = null; }
        const r = easeIn(seg(t, 28.2, wt(L, 'noise') + .4));
        if (img) { const res = Math.round(lerp(6, 160, r)); TMP.imageSmoothingEnabled = false; TMP.clearRect(0, 0, W, H);
          TMP.drawImage(img, 0, 0, res * 16 / 9, res); I.imageSmoothingEnabled = false; I.drawImage(tmpC, 0, 0, res * 16 / 9, res, 0, 0, W, H); I.imageSmoothingEnabled = true; }
        text(S, `${Math.round(lerp(4, 1024, r))} px`, 1700, 900, { size: 44, font: F.mono, col: INK.navy, knock: 10 });
      } else {
        await plateOrClip('p08_deepdream', t - td, dur, { cam0: { z: 1.1, r: 0 }, cam1: { z: 1.3, r: .12 } });
        [[1640, 210, 270, 220, 'dog', .97], [95, 575, 330, 300, 'dog', .95], [540, 70, 930, 830, 'slug?', .61], [455, 690, 90, 90, 'eye', .88]]
          .forEach(([x, y, w, h, l, s], i) => bbox(x, y, w, h, l, s, t - td - i * .1, { col: [INK.yellow, INK.pink, INK.blue][i % 3], txt: i % 3 === 0 ? INK.navy : INK.paper }));
      }
    }, { tin: ['iris', .4], tag: '2014 · gan' }],
  ]);
})();
