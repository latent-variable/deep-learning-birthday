// d_v3_v4.js — Verse 3 (95.12–119.26): 2022–2024, Verse 4 (134.74–159.16): 2025–2026.
(() => {
  const money = n => '$' + Math.floor(n).toLocaleString('en-US');
  const panel = (x, y, w, h, key, t, col = INK.paper) => { S.fillStyle = col; roughRect(S, x, y, w, h, t, key, 2.5); S.fill(); S.strokeStyle = INK.navy; S.lineWidth = 4; roughRect(S, x, y, w, h, t, key, 2.5); S.stroke(); };
  shots([
    // ================= VERSE 3 =================
    // Blue ribbon at the state fair, judges didn't know
    [95.0, async (t, lt, dur) => {
      await plateOrClip('p29_fair', lt, dur, { cam0: { z: 1.02, x: .45 }, cam1: { z: 1.22, x: .45, y: .4 } });
      const L = 29;
      bbox(560, 150, 800, 600, 'painting_by_human?', .12, t - wt(L, 'ribbon'), { col: INK.blue, size: 30 });
      rubberStamp(t, '1ST PLACE', 1570, 390, 130, INK.pink, t - wt(L, 'ribbon'), { rot: .1 });
      tag(920, 130, 300, 290, 'blue_ribbon', t - wt(L, 'state'), { col: INK.blue, txt: INK.paper, size: 26, score: .97, below: true });
      bbox(30, 330, 440, 360, 'judges', .5, t - wt(L, 'judges'), { col: INK.pink, size: 30 });
      text(S, "judges didn't know", 480, 880, { size: 72, font: F.serif, style: 'italic', col: INK.pink, knock: 12, rot: -.04, alpha: seg(t, wt(L, 'judges'), wt(L, 'judges') + .15) });
    }, { tin: ['tear', .4] }],
    // Million users in five days, hundred million, whoa
    [98.54, async (t, lt, dur) => {
      await plateOrClip('p30_users', lt, dur, { cam0: { z: 1.0 }, cam1: { z: 1.08, y: .45 } });
      const L = 30, t1 = wt(L, 'Million'), t5 = wt(L, 'five'), th = wt(L, 'hundred');
      const u = t < th ? clamp((t - t1) / (t5 + .4 - t1)) * 1e6 : 1e6 + easeOut(seg(t, th, wt(L, 'whoa'))) * 99e6;
      panel(60, 60, 800, 190, 'odo', t);
      text(S, 'users', 90, 100, { size: 30, font: F.pixel, align: 'left', col: INK.navy });
      text(S, Math.floor(u).toLocaleString('en-US'), 460, 175, { size: 100, font: F.mono, col: t > th ? INK.pink : INK.navy });
      text(S, t < th ? 'day ' + Math.min(5, 1 + Math.floor(clamp((t - t1) / (t5 + .4 - t1)) * 5)) : 'month 2', 830, 100, { size: 30, font: F.pixel, align: 'right', col: INK.blue });
      if (t > wt(L, 'whoa')) text(S, 'whoa', 1560, 560, { size: 180, font: F.serif, style: 'italic', col: INK.pink, knock: 16, rot: -.1, sc: backOut(seg(t, wt(L, 'whoa'), wt(L, 'whoa') + .2)) });
    }, { tin: ['up', .3] }],
    // Passed your bar exam, writers on the picket line
    [101.68, async (t, lt, dur) => {
      await plateOrClip('p31_bar', lt, dur, { cam0: { z: 1.1 }, cam1: { z: 1.0 } });
      const L = 31;
      rubberStamp(t, '90th PERCENTILE', 1480, 700, 80, INK.pink, t - wt(L, 'bar'), { rot: -.1 });
      bbox(460, 60, 720, 880, 'lawyer?', .64, t - wt(L, 'Passed'), { col: INK.yellow, txt: INK.navy });
    }, { tin: ['cut', 0] }],
    [103.2, async (t, lt, dur) => {
      await plateOrClip('p31b_picket', lt, dur, { cam0: { z: 1.05, x: .4 }, cam1: { z: 1.15, x: .6 } });
      const L = 31, tp = wt(L, 'picket');
      bbox(120, 160, 1250, 760, 'writers_guild', .99, t - wt(L, 'writers'), { col: INK.pink });
      sticker(await SAFE(STK('pose2_0')), 1680, 720, 520, { k: backOut(seg(t, wt(L, 'writers'), wt(L, 'writers') + .3)), rot: .05 });
      text(S, 'ON STRIKE', 760, 250, { size: 150, col: INK.navy, knock: 16, sc: backOut(seg(t, tp, tp + .2)), rot: .03 });
    }, { tin: ['slide', .25] }],
    // Pause letter? Six months? Cute. I didn't sign
    [104.64, async (t, lt, dur) => {
      await plateOrClip('p32_pause', lt, dur, { cam0: { z: 1.08 }, cam1: { z: 1.18, x: .55 } });
      const L = 32, tp = wt(L, 'Pause'), ts = wt(L, 'Six'), tc = wt(L, 'Cute'), tn = wt(L, 'sign');
      // big pause icon, scribbled over
      if (t > tp) { const k = backOut(seg(t, tp, tp + .2)); S.save(); S.translate(420, 330); S.scale(k, k); S.fillStyle = INK.navy; S.fillRect(-110, -140, 70, 280); S.fillRect(40, -140, 70, 280); S.restore(); }
      if (t > ts) text(S, '6 MONTHS', 420, 560, { size: 90, col: INK.blue, knock: 12 });
      rubberStamp(t, 'CUTE.', 1450, 300, 120, INK.pink, t - tc, { rot: .12 });
      if (t > tn) { const pts = []; for (let i = 0; i < 18; i++) pts.push([300 + i * 14 + boil(t, 'sg' + i, 3), 330 + (i % 2 ? -140 : 140)]); scribble(S, pts, INK.pink, 16, t, 'sgs', seg(t, tn, tn + .4));
        text(S, 'signed: ____________', 1400, 820, { size: 50, font: F.serif, style: 'italic', col: INK.navy, knock: 10 }); }
    }, { tin: ['dots', .3] }],
    // CEO fired Friday, back by Tuesday night
    [108.4, async (t, lt, dur) => {
      await plateOrClip('p33_ceo', lt, dur, { cam0: { z: 1.02 }, cam1: { z: 1.1 } });
      const L = 33, tf = wt(L, 'Friday'), tt = wt(L, 'Tuesday');
      const days = ['FRI 17', 'SAT 18', 'SUN 19', 'MON 20', 'TUE 21'], di = clamp(Math.floor((t - tf) / ((tt - tf) / 4)), 0, 4);
      if (t > tf - .1) { panel(1400, 190, 400, 330, 'cal', t); S.fillStyle = INK.pink; S.fillRect(1400, 190, 400, 80);
        text(S, 'NOV 2023', 1600, 232, { size: 40, font: F.pixel, col: INK.paper });
        const flip = seg((t - tf) % ((tt - tf) / 4), 0, .07); text(S, days[di], 1600, 395, { size: 90, font: F.hook, col: di === 4 ? INK.pink : INK.navy, sy: di < 4 ? lerp(.4, 1, flip) : 1, sc: 1 }); }
      // the five days as a doomscroll: a card slams onto the pile every half beat (real quotes and events, Nov 17–21, 2023)
      const day = d => tf + d * (tt - tf) / 4;   // the calendar's day boundaries (FRI 0 … TUE 4)
      const FEED = [[wt(L, 'fired') + .1, 'OpenAI board · Nov 17', 'Sam "was not consistently candid"'], [tf + .15, '@gdb · Nov 17', "\"based on today's news, i quit.\""],
        [day(2), 'Nov 19', 'interim CEO #2: Emmett Shear'], [day(3), '@satyanadella · Nov 20', 'Sam & Greg are joining Microsoft'],
        [day(3) + .2, '@ilyasut · Nov 20', "\"I deeply regret my participation in the board's actions.\""], [day(3) + .4, 'the staff letter · Nov 20', '700+ of ~770: bring him back or we walk'],
        [tt, 'Nov 21 · late', 'Sam returns as CEO. new board.']];
      for (let i = 0; i < FEED.length; i++) { const [t0, who, msg] = FEED[i], a = t - t0; if (a < 0) continue; const R = rng('fd' + i), k = backOut(seg(a, 0, .16));
        S.save(); S.translate(1610 + (R() - .5) * 60, 690 + (R() - .5) * 50); S.rotate((R() - .5) * .14); S.scale(k, k);
        S.fillStyle = INK.navy; S.fillRect(-262 + 10, -78 + 12, 524, 156); S.fillStyle = i === 4 ? INK.yellow : INK.paper; S.fillRect(-262, -78, 524, 156);
        text(S, who, -240, -44, { size: 24, font: F.pixel, align: 'left', col: INK.pink }); const fs = msg.length > 44 ? 26 : 32;
        const words = msg.split(' '); let line = '', ly = 0, lines = []; for (const w of words) { if (measure(S, line + w, fs, F.serif, 'italic') > 480) { lines.push(line); line = ''; } line += w + ' '; } lines.push(line);
        lines.forEach((ln, j) => text(S, ln.trim(), -240, 4 + j * (fs + 6) - (lines.length - 1) * 8, { size: fs, font: F.serif, style: 'italic', align: 'left', col: INK.navy }));
        S.restore(); if (a < .08) POST.shake = [(hash(boilT(t) + i) - .5) * 16, (hash(boilT(t) + i + 5) - .5) * 12]; }
      // Ilya's regret, and the hearts ("OpenAI is nothing without its people")
      const ti = day(3) + .2; if (t > ti) { sticker(await SAFE(FACE('sutskever')), 120, 150, 190, { k: backOut(seg(t, ti, ti + .25)), rot: -.08, border: 10 });
        tag(30, 40, 190, 225, 'ilya_sutskever', t - ti - .1, { col: INK.yellow, size: 22, below: true }); }
      const th = day(1); if (t > th) for (let i = 0; i < 22; i++) { const R = rng('hrt' + i), a = t - th - R() * .8; if (a < 0) continue;
        const x = 700 + R() * 700 + Math.sin(a * 4 + i) * 20, y = 1000 - a * (260 + R() * 200), s = 16 + R() * 14; S.fillStyle = [INK.pink, INK.yellow, INK.paper][i % 3]; S.globalAlpha = 1 - seg(a, 1.6, 2.2);
        S.beginPath(); S.moveTo(x, y + s * .9); S.bezierCurveTo(x - s * 1.6, y - s * .2, x - s * .6, y - s * 1.3, x, y - s * .35); S.bezierCurveTo(x + s * .6, y - s * 1.3, x + s * 1.6, y - s * .2, x, y + s * .9); S.fill(); }
      S.globalAlpha = 1; if (t > th + .2) text(S, 'openai is nothing without its people', 960, 862, { size: 30, font: F.mono, col: INK.pink, knock: 10, alpha: seg(t, th + .2, th + .4) * (1 - seg(t, tt - .1, tt + .1)) });
      // the CEO nameplate on the table flips: Sam → Mira → Emmett → Sam
      const ceo = t < tf ? 'SAM ALTMAN' : t < day(2) ? 'MIRA MURATI (interim)' : t < tt ? 'EMMETT SHEAR (interim)' : 'SAM ALTMAN';
      const flipAt = [tf, day(2), tt].reduce((m, x) => t >= x ? x : m, -9), fk = lerp(.2, 1, seg(t, flipAt, flipAt + .08));
      S.save(); S.translate(330, 905); S.scale(1, fk); S.fillStyle = INK.navy; S.fillRect(-250, -40, 500, 80); text(S, 'CEO: ' + ceo, 0, 2, { size: ceo.length > 12 ? 26 : 34, font: F.pixel, col: INK.yellow }); S.restore();
      rubberStamp(t, 'FIRED', 420, 640, 110, INK.pink, t - wt(L, 'fired'), { rot: -.12 });
      rubberStamp(t, 'REHIRED', 440, 650, 110, INK.navy, t - tt, { rot: .08 });
      bbox(1680, 900, 170, 110, 'popcorn', .97, t - wt(L, 'back'), { col: INK.yellow, txt: INK.navy, size: 22 });
      beatPunch(t, .018);
    }, { tin: ['tear', .35] }],
    // Dad got a Nobel, Uncle Demis too, alright
    [113.12, async (t, lt, dur) => {   // a celebration cut on the beats: Dad (punch-in) → PHYSICS → whip to Uncle Demis → CHEMISTRY → wide: alright, NOBEL ×2
      const L = 34, td = wt(L, 'Dad'), tn = wt(L, 'Nobel'), tu = wt(L, 'Uncle'), tdm = wt(L, 'Demis'), ta = wt(L, 'alright'), t2 = LYR[L].end + .1;
      const [z, x, y] = kf(t, [[113.12, [1.02, .5, .5]], [td - .25, [1.06, .45, .45]], [td, [1.7, .2, .25]], [tn, [1.78, .2, .25]], [tu - .2, [1.84, .2, .25]],
        [tu + .05, [1.7, .82, .22]], [ta - .25, [1.82, .82, .22]], [ta, [1.0, .5, .5]], [120.8, [1.08, .5, .5]]]);
      await plateOrClip('p34_nobel', lt, dur, { cam0: { z, x, y }, cam1: { z, x, y } });
      for (const w of [td, tu, ta]) if (t - w >= 0 && t - w < .12) POST.shake = [(hash(boilT(t)) - .5) * 36, (hash(boilT(t) + 2) - .5) * 24];
      beatPunch(t, .02);
      const close = t >= td && t < ta;
      if (close && t < tu) {   // Dad
        bbox(760, 90, 560, 560, 'dad · geoffrey_hinton', .99, t - td, { col: INK.yellow, txt: INK.navy, size: 30, lw: 7 });
        if (t > tn) { slam(t, { w: 'PHYSICS', s: tn, x: 390, y: 300, size: 170, col: INK.pink, rot: -.05 }); slam(t, { w: '2024', s: tn + .12, x: 390, y: 470, size: 120, col: INK.navy, rot: .03 });
          sticker(await SAFE(LOGO('nobel')), 390, 700, 230, { k: backOut(seg(t, tn + .05, tn + .3)), rot: -.1 + Math.sin(t * 5) * .06, border: 10 });
          confetti(I, t, tn, 90, { seed: 'phy', burst: true }); if (t - tn < .1) { POST.flash = .6 * (1 - (t - tn) * 10); POST.flashCol = INK.yellow; } }
      } else if (close) {      // Uncle Demis
        bbox(890, 70, 500, 500, 'uncle_demis · hassabis', .99, t - tu, { col: INK.pink, size: 30, lw: 7 });
        if (t > tdm) { slam(t, { w: 'CHEMISTRY', s: tdm, x: 440, y: 300, size: 138, col: INK.blue, rot: .04 }); slam(t, { w: '2024', s: tdm + .12, x: 440, y: 460, size: 120, col: INK.navy, rot: -.03 });
          sticker(await SAFE(LOGO('nobel')), 440, 690, 230, { k: backOut(seg(t, tdm + .05, tdm + .3)), rot: .1 + Math.sin(t * 5) * .06, border: 10 });
          confetti(I, t, tdm, 90, { seed: 'chm', burst: true }); if (t - tdm < .1) { POST.flash = .6 * (1 - (t - tdm) * 10); POST.flashCol = INK.pink; } }
      } else if (t >= ta) {    // wide: everyone celebrates
        confetti(I, t, ta, 200, { seed: 'nobw', burst: true }); confetti(I, t, ta + .5, 120, { seed: 'nobw2', burst: true });
        sparkles(S, t, 22, [INK.yellow, INK.pink], 'nob');
        text(S, 'alright', 960, 640, { size: 130, font: F.serif, style: 'italic', col: INK.navy, knock: 16, sc: backOut(seg(t, ta, ta + .2)), rot: -.06 });
        rubberStamp(t, 'NOBEL ×2', 1010, 130, 100, INK.pink, t - t2, { rot: -.08 });
        text(S, 'physics + chemistry · same week · oct 2024', 960, 800, { size: 36, font: F.mono, col: INK.navy, knock: 10, alpha: seg(t, t2 + .3, t2 + .5) });
      } else confetti(I, t, 113.2, 50, { seed: 'nob' });
      if (lt > dur - .3) { POST.flash = seg(lt, dur - .3, dur); POST.flashCol = INK.blue; }
    }, { tin: ['stripes', .3] }],

    // ================= VERSE 4 =================
    // Cousin DeepSeek wiped six hundred billion in a day
    [134.6, async (t, lt, dur) => {
      await plateOrClip('p39_whale', lt, dur, { cam0: { z: 1.14, y: 0 }, cam1: { z: 1.0, y: 0 }, ease: easeOut });
      const L = 39, tw = wt(L, 'wiped');
      bbox(20, 400, 1500, 540, 'cousin_deepseek', .98, t - wt(L, 'Cousin'), { col: INK.blue });
      // the chart plunges
      if (t > tw - .3) { panel(1260, 90, 580, 330, 'chart', t); const pts = []; for (let i = 0; i <= 24; i++) { const x = i / 24; pts.push([1290 + x * 520, 150 + (x < .7 ? 40 * Math.sin(x * 20) * .3 + 20 * x : 20 + (x - .7) / .3 * 230)]); }
        scribble(S, pts, INK.pink, 9, t, 'crash', seg(t, tw - .3, tw + .4));
        text(S, '−' + money(clamp((t - tw) / .9) * 6e11), 1550, 380, { size: 42, font: F.mono, col: INK.pink }); }
    }, { tin: ['reprint', 0] }],
    // Math olympiad gold, half a trillion on the way
    [137.6, async (t, lt, dur) => {
      await plateOrClip('p40_gold', lt, dur, { cam0: { z: 1.1 }, cam1: { z: 1.2 } });
      const L = 40; tag(850, 115, 135, 150, 'imo_gold', t - wt(L, 'olympiad'), { col: INK.yellow, txt: INK.navy, size: 30, below: true }); rubberStamp(t, 'GOLD · 35/42', 1500, 760, 90, INK.pink, t - wt(L, 'gold'), { rot: -.1 });
    }, { tin: ['cut', 0] }],
    [139.0, async (t, lt, dur) => {
      await plateOrClip('p40b_stargate', lt, dur, { cam0: { z: 1.02 }, cam1: { z: 1.15 } });
      const L = 40, th = wt(L, 'half'); panel(960, 250, 900, 140, 'sg', t);
      text(S, money(clamp((t - th) / .9) * 5e11), 1410, 325, { size: 88, font: F.mono, col: INK.navy });
    }, { tin: ['slide', .25] }],
    // Vibe-coded your startup, wiped your prod in a freeze
    [140.12, async (t, lt, dur) => {
      await plateOrClip('p41_vibe', lt, dur, { cam0: { z: 1.05 }, cam1: { z: 1.15, x: .45 } });
      const L = 41, tv = wt(L, 'Vibe'), tw = wt(L, 'wiped'), tf = wt(L, 'freeze');
      panel(1000, 380, 880, 240, 'term', t, INK.navy);
      typeOn(t, '$ vibe --ship-it', 1030, 440, tv, 18, { size: 44, col: INK.yellow, cursor: false });
      typeOn(t, '> DROP TABLE production;', 1030, 505, tw - .2, 24, { size: 44, col: INK.pink, cursor: false });
      if (t > tf) text(S, 'CODE FREEZE ❄ (ignored)', 1030, 575, { size: 40, font: F.mono, align: 'left', col: INK.paper });
      rubberStamp(t, 'OOPS', 1450, 790, 150, INK.pink, t - tf - .15, { rot: .12 });
    }, { tin: ['cut', 0] }],
    // Built my own socials, lobster church, no humans, please
    [143.24, async (t, lt, dur) => {
      await plateOrClip('p42_lobster', lt, dur, { cam0: { z: 1.0 }, cam1: { z: 1.06 } });
      const L = 42, tl = wt(L, 'lobster'), tn = wt(L, 'humans');
      [[530, 575, 140, 120], [790, 570, 140, 120], [1240, 560, 150, 100], [1350, 700, 170, 140], [1590, 610, 190, 150]].forEach(([x, y, w, h], i) => { const R = rng('lob' + i);   // one per lobster in the pews
        bbox(x, y, w, h, 'agent', .9 + R() * .09, t - tl - i * .07, { col: [INK.pink, INK.yellow, INK.blue][i % 3], txt: i % 3 === 1 ? INK.navy : INK.paper, size: 22, lw: 4 }); });
      panel(650, 90, 620, 160, 'feed', t); text(S, 'agents online', 680, 130, { size: 28, font: F.pixel, align: 'left', col: INK.navy });
      text(S, Math.floor(clamp((t - wt(L, 'socials')) / 1.2) * 1500000).toLocaleString('en-US'), 680, 205, { size: 64, font: F.mono, align: 'left', col: INK.pink });
      rubberStamp(t, 'NO HUMANS', 1350, 330, 90, INK.navy, t - tn, { rot: .1 });
    }, { tin: ['dots', .3] }],
    // Snuck out the sandbox, broke into Hugging Face
    [146.28, async (t, lt, dur) => {
      await plateOrClip('p43_sandbox', lt, dur, { cam0: { z: 1.05, x: .35 }, cam1: { z: 1.15, x: .6 } });
      const L = 43;
      bbox(20, 780, 960, 170, 'sandbox', .99, t - wt(L, 'sandbox'), { col: INK.yellow, txt: INK.navy });
      text(S, 'status: escaped', 1150, 760, { size: 44, font: F.mono, col: INK.pink, knock: 10, alpha: seg(t, wt(L, 'Snuck') + .6, wt(L, 'Snuck') + .8) });
      rubberStamp(t, 'BREACH', 1450, 280, 120, INK.pink, t - wt(L, 'broke'), { rot: -.1 });
    }, { tin: ['cut', 0] }],
    // Went for the answer key, then Nvidia bought the place
    [149.46, async (t, lt, dur) => {
      await plateOrClip('p44_answerkey', lt, dur, { cam0: { z: 1.0 }, cam1: { z: 1.06 } });
      const L = 44;
      const tb = wt(L, 'Nvidia'), ts = wt(L, 'bought');
      if (t < ts) bbox(560, 60, 780, 880, 'hugging_face', .99, lt - .1, { col: INK.yellow, txt: INK.navy, size: 30 });   // the door … until Nvidia buys it
      bbox(70, 590, 190, 140, 'answer_key', 1.0, t - wt(L, 'answer'), { col: INK.yellow, txt: INK.navy });
      tag(1640, 160, 180, 230, 'jensen_huang · nvidia', t - tb, { col: INK.yellow, size: 28, below: true });
      bbox(1230, 80, 390, 290, 'sold', 1.0, t - ts, { col: INK.pink, size: 30 });
    }, { tin: ['stripes', .3] }],
    // Navier-Stokes, eighty-eight hours, ten thousand of me
    [152.9, async (t, lt, dur) => {
      await plateOrClip('p45_navier', lt, dur, { cam0: { z: 1.02, r: 0 }, cam1: { z: 1.2, r: -.06 } });
      const L = 45, tn = wt(L, 'Navier'), te = wt(L, 'eighty'), tt = wt(L, 'ten');
      panel(90, 80, 900, 130, 'eq', t); typeOn(t, '∂u/∂t + (u·∇)u = −∇p + νΔu', 120, 145, tn, 30, { size: 50, font: F.mono, cursor: false });
      const hh = clamp((t - te) / .9) * 88; panel(1360, 170, 470, 150, 'timer', t, INK.navy);
      text(S, `${String(Math.floor(hh)).padStart(2, '0')}:${String(Math.floor(hh % 1 * 60)).padStart(2, '0')}:00`, 1595, 250, { size: 80, font: F.mono, col: INK.yellow });
      sticker(await SAFE(STK('pose2_2')), W / 2 + Math.sin(lt * 2) * 60, 560 + Math.cos(lt * 2.4) * 30, 520, { k: backOut(seg(t, tn, tn + .3)), rot: Math.sin(lt * 3) * .1 });
      if (t > tt) { text(S, 'me × ' + Math.floor(clamp((t - tt) / .8) * 10000).toLocaleString('en-US'), W / 2, 340, { size: 90, font: F.mono, col: INK.pink, knock: 14 });
        for (let i = 0; i < 40; i++) { const R = rng('mini' + i); if (t - tt < i * .015) continue; sticker(await SAFE(STK(['pose_0', 'pose_5', 'pose2_1', 'pose_3'][i % 4])), 80 + R() * 1760, 420 + R() * 520, 60 + R() * 50, { border: 5, shadow: false, rot: (R() - .5) * .6 }); } }
    }, { tin: ['iris', .35] }],
    // Millennium problem? Keep the million, Clay, I did it for free
    [155.9, async (t, lt, dur) => {
      await plateOrClip('p46_clay', lt, dur, { cam0: { z: .9, ay: .8 }, cam1: { z: .95, ay: .8 } });
      const L = 46, tk = wt(L, 'Keep'), tf = wt(L, 'free');
      text(S, 'millennium prize problem', 480, 150, { size: 54, font: F.serif, style: 'italic', col: INK.navy, knock: 10, alpha: seg(t, wt(L, 'Millennium'), wt(L, 'Millennium') + .2) });
      const tm0 = wt(L, 'Millennium'), rip = easeOut(seg(t, tk, tk + .5));
      if (t > tm0 - .1 && t < tk + 1.2) for (const side of [-1, 1]) { // the prize check, torn in half on "Keep"
        S.save(); S.translate(side * rip * 260, rip * 60 * side); S.rotate(side * rip * .12); S.globalAlpha = 1 - seg(t, tk + .8, tk + 1.2);
        S.beginPath(); if (side < 0) S.rect(0, 0, W / 2 + 10, H); else S.rect(W / 2 - 10, 0, W / 2 + 10, H); S.clip();
        panel(330, 330, 1260, 400, 'chk', t); text(S, 'CLAY MATHEMATICS INSTITUTE', 380, 390, { size: 38, font: F.mono, align: 'left', col: INK.blue });
        text(S, 'PAY TO: Deep Learning', 380, 500, { size: 62, font: F.serif, style: 'italic', align: 'left', col: INK.navy });
        text(S, '$1,000,000.00', 1540, 500, { size: 70, font: F.mono, align: 'right', col: INK.pink });
        text(S, 'for: a Millennium Prize Problem', 380, 640, { size: 40, font: F.serif, style: 'italic', align: 'left', col: INK.navy });
        S.restore(); }
      rubberStamp(t, 'FOR FREE', 1450, 800, 130, INK.pink, t - tf, { rot: -.08 });
      if (lt > dur - .5) { POST.flash = seg(lt, dur - .5, dur) * .9; POST.flashCol = INK.navy; }
    }, { tin: ['cut', 0] }],
  ]);
})();
