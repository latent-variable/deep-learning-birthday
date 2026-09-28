(() => {
  STAMP = [[0, '2012.09.30'], [2.84, '2026.09.30'], [6.72, '2026.09.30', 'REWIND']];
  const PL = id => `../plates/img/${id}_s5.png`;
  shots([
    [0, async (t, lt, dur) => { await plateShot(PL('p00_hello'), lt, dur, { z: 1.25, y: .4 }, { z: 1.05, y: .5 });
      bbox(760, 180, 420, 300, 'deep_learning', .99, lt - 1.1, { col: INK.pink }); }],
    [2.84, async (t, lt, dur) => { await plateShot(PL('p01_candles'), lt, dur, { z: 1.1 }, { z: 1.25, x: .55 });
      hookLine(t, 1, { rows: [2, 2], size: 150, y: 330 }); }, { tin: ['dots', .5] }],
    [6.72, async (t, lt, dur) => { await plateShot(PL('p02_rewind'), lt, dur, { z: 1.0 }, { z: 1.3 }); speedLines(S, t, W / 2, H / 2, 30, INK.navy); }, { tin: ['tear', .45] }],
  ]);
  OVERLAYS.push(async t => { liveStamp(t); lyricBar(t); });
})();
