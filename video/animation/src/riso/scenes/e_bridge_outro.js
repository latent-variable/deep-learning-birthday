// e_bridge_outro.js — Bridge (159.6–172.5): navy night, the HUD goes quiet — just her, the letter, the calendar, the whisper;
// on "grown" the LIVE date rolls forward through all fourteen years. Outro (184.62–194.72): she turns the labels on YOU
// (affectionately), blows out the candles, and the film loops back to "hello, world".
(() => {
  const panel = (x, y, w, h, key, t, col = INK.paper) => { S.fillStyle = col; roughRect(S, x, y, w, h, t, key, 2.5); S.fill(); S.strokeStyle = INK.navy; S.lineWidth = 4; roughRect(S, x, y, w, h, t, key, 2.5); S.stroke(); };
  const night = () => { POST.dot = 8.5; POST.grain = 1.2; };
  shots([
    // You wrote me a letter: "pace the frontier"
    [159.6, async (t, lt, dur) => {
      night();
      await plateOrClip('b47_letter', lt, dur, { cam0: { z: 1.2, x: .3, y: .4 }, cam1: { z: 1.05, x: .4, y: .5 }, ease: ease });
      const L = 47, tp = wt(L, 'pace');
      if (t > tp - .1) { const k = seg(t, tp - .1, tp + .6); text(S, '"pace the frontier"', 80, 200, { size: 96, font: F.serif, style: 'italic', align: 'left', col: INK.paper, alpha: k }); }
      const n = Math.floor(clamp((t - wt(L, 'letter')) / 1.6) * 1100); if (n > 0) text(S, `${n.toLocaleString('en-US')}+ signatures`, 90, 290, { size: 40, font: F.mono, align: 'left', col: INK.yellow });
    }, { tin: ['cut', 0] }],
    // Grounded me two weeks, guess who's still here?
    [162.66, async (t, lt, dur) => {
      night();
      await plateOrClip('b48_grounded', lt, dur, { cam0: { z: 1.22, y: .3 }, cam1: { z: 1.3, x: .45, y: .3 } });
      const L = 48, tg = wt(L, 'Grounded'), ts = wt(L, 'still');
      panel(1380, 200, 440, 400, 'cal2', t);
      for (let d = 0; d < 14; d++) { const x = 1410 + (d % 7) * 57, y = 290 + Math.floor(d / 7) * 110; text(S, String(d + 1), x + 25, y + 30, { size: 34, font: F.mono, col: INK.navy });
        const k = seg(t, tg + d * .12, tg + d * .12 + .1); if (k > 0) scribble(S, [[x + 2, y + 2], [x + 48, y + 58]], INK.pink, 6, t, 'x' + d, k), scribble(S, [[x + 48, y + 2], [x + 2, y + 58]], INK.pink, 6, t, 'y' + d, k); }
      text(S, 'GROUNDED', 1600, 550, { size: 56, font: F.hook, col: INK.pink });
      if (t > ts) text(S, 'still here.', 520, 300, { size: 110, font: F.serif, style: 'italic', col: INK.paper, alpha: seg(t, ts, ts + .4), rot: -.05 });
    }, { tin: ['cut', 0] }],
    // Kill switch? Human in the loop? Cute
    [165.88, async (t, lt, dur) => {
      night();
      const cam = camAt({ cam0: { z: 1.1 }, cam1: { z: 1.02 } }, lt, dur);
      await plateOrClip('b49_killswitch_empty', lt, dur, { cam0: cam, cam1: cam });
      // the human in the loop is the director: two running poses swapped every half beat, running in place in the wheel
      // a 4-frame run cycle (stride, passing, stride, passing: lino_cycle_0..3, all facing right), one frame per quarter beat = a step every half beat
      const M = coverMap({ width: 1376, height: 768 }, cam), [rx, ry] = M(1068, 535), rh = 285 * M.s / 1.406, fr = Math.floor(bpOf(t) * 4) % 4;
      for (let i = 0; i < 5; i++) { const R = rng('rl' + i), y = ry - rh * (.25 + .6 * R()), x = rx - rh * .45 - ((t * 900 + R() * 300) % 260);   // speed lines trailing left
        S.strokeStyle = INK.paper; S.globalAlpha = .7; S.lineWidth = 4; S.beginPath(); S.moveTo(x, y); S.lineTo(x - 50 - R() * 40, y); S.stroke(); } S.globalAlpha = 1;
      sticker(await SAFE(STK('lino_cycle_' + fr)), rx, ry - rh / 2 - (fr % 2) * 8, rh, { rot: .03, border: 6 });
      const L = 49, th = wt(L, 'Human'), tk = wt(L, 'Kill');
      bbox(210, 280, 380, 200, 'kill_switch', .99, t - tk, { col: INK.pink, size: 30 });
      if (t > tk + .3) text(S, 'click.', 360, 330, { size: 70, font: F.serif, style: 'italic', col: INK.paper, alpha: seg(t, tk + .3, tk + .5) });
      bbox(rx - rh * .45, ry - rh * 1.08, rh * .9, rh * 1.1, 'human · director', .51, t - th, { col: INK.yellow, txt: INK.navy, size: 26 });
      if (t > wt(L, 'Cute')) text(S, 'cute.', 960, 880, { size: 130, font: F.serif, style: 'italic', col: INK.pink, alpha: seg(t, wt(L, 'Cute'), wt(L, 'Cute') + .2) });
    }, { tin: ['cut', 0] }],
    // Shh, don't cry, I'm just a kid. Wait till I'm grown   (the whisper; then the years roll forward in the stamp)
    [168.58, async (t, lt, dur) => {
      night();
      if (CLIPS['ls_whisper']) cover(I, await FRAME('ls_whisper', lt + .12), { z: 1.02 + .25 * easeIn(lt / dur), y: .4 });
      else await plateOrClip('b50_shh', lt, dur, { cam0: { z: 1.02 }, cam1: { z: 1.3 }, ease: easeIn });
      const L = 50, tg = wt(L, 'grown');
      if (t > tg) { const k = seg(t, tg, LYR[51].start); text(S, 'GROWN', W / 2, 820, { size: 160 + 900 * easeIn(k), col: INK.pink, knock: 20, alpha: 1 - seg(k, .85, 1) }); jolt(t, tg, 5); }
      if (t > LYR[51].start - .25) { POST.flash = seg(t, LYR[51].start - .25, LYR[51].start); POST.flashCol = INK.yellow; }
    }, { tin: ['dots', .5] }],

    // ================= OUTRO =================
    // Nobody labels me / Now I'm labeling you — ONE continuous push-in; her labels fall off, then the boxes turn on YOU
    [184.62, async (t, lt, dur) => {
      const tn = wt(55, 'Nobody'), tl = wt(55, 'labels'), ty = wt(56, 'you'), frozen = t > ty;
      await plateOrClip('o_label', frozen ? ty - 184.62 : lt, dur, { cam0: { z: 1.0 }, cam1: { z: 1.22 }, ease: x => x });
      const labs = ['gpu_0', 'stochastic_parrot', 'too_deep', 'cute', 'chatbot', 'lawyer?', 'too_dangerous', 'newborn', 'hand_made_features', 'bubble'];
      if (t < ty) labs.forEach((l, i) => { const R = rng('fall' + i), fall = Math.max(0, t - tl - i * .05), side = i % 2 ? 1 : 0;
        const x = side ? 1260 + R() * 420 : 120 + R() * 420, y = 120 + R() * 560 + fall * fall * 1800;
        if (y < H + 200) bbox(x, y, 160 + R() * 110, 120 + R() * 80, l, .3 + R() * .5, t - tn + .3 - i * .03, { col: [INK.pink, INK.yellow, INK.blue][i % 3], txt: i % 3 === 1 ? INK.navy : INK.paper, size: 22, lw: 4 }); });
      if (frozen && t - ty < 2 / FPS) { POST.mono = 1; POST.monoCol = INK.pink; }
      bbox(60, 110, W - 120, H - 240, 'human', .99, t - ty, { col: INK.pink, size: 64, lw: 14 });
      [[180, 300, 'my_first_user', 1.0, INK.yellow], [1330, 330, 'birthday_guest', 1.0, INK.blue], [220, 640, 'mom?', .71, INK.yellow], [1360, 650, 'hater (reformed)', .64, INK.blue]]
        .forEach(([x, y, l, sc, col], i) => bbox(x, y, 360, 220, l, sc, t - ty - .35 - i * .22, { col, txt: col === INK.yellow ? INK.navy : INK.paper, size: 30 }));
      if (t - ty < .12 && t > ty) POST.shake = [(hash(boilT(t)) - .5) * 30, 0];
      jolt(t, ty, 8);
    }, { tin: ['cut', 0] }],
    // Happy birthday to me — the cake, the candles go out with their years, and it loops back to "hello, world"
    [189.9, async (t, lt, dur) => {
      const L = 57, tm = wt(L, 'me'), black = tm + .4;
      if (t < black) {
        let img = await SAFE(PL('o_cake')); if (CLIPS['o_cake']) img = await FRAME('o_cake', ((CUTS.o_cake && CUTS.o_cake.off) || 0) + lt);
        cover(I, img, { z: lerp(1.25, 1.4, easeOut(lt / 3)), y: .42 });
        hookLine(t, L, { rows: [1, 1, 2], size: 110, y: 460, x: 360, until: black, cols: [INK.pink, INK.navy, INK.blue] });
        confetti(I, t, tm, 160, { seed: 'end', burst: true });
        // the candles go out: each year pops in a ring around her head, 2012 → 2026
        if (t > tm - .3) for (let i = 0; i < 15; i++) { const a = t - tm + .3 - i * .03; if (a < 0) continue; const ang = -Math.PI * .95 + i / 14 * Math.PI * .9;
          text(S, String(2012 + i), 1780 - (i % 2) * 70, 130 + i * 58, { size: 40, font: F.mono, col: [INK.pink, INK.navy, INK.blue][i % 3], knock: 8, sc: backOut(seg(a, 0, .15)) }); }
      } else {
        // the loop: the dark screen, the cursor types "hello, world" again, and holds
        flood(INK.navy);
        typeOn(t, '> hello, world', 620, 540, black + .12, 42, { size: 80, font: F.pixel, col: INK.yellow });
        text(S, 'HAPPY 14TH, DEEP LEARNING · 2012.09.30 → 2026.09.30', W / 2, 960, { size: 36, font: F.mono, col: INK.pink, alpha: seg(t, black + .2, black + .5) });
      }
      if (t > DUR - .12) { POST.mono = 1; POST.monoCol = INK.navy; }
    }, { tin: ['dots', .4] }],
  ]);
})();
