// cuts.js — per-clip edit decisions for the LTX motion clips ("cut out the wonky parts").
// off: seconds into the clip where the shot starts · speed: playback rate · still: true = reject the clip, use the plate
// map: [[shot s, clip s], ...] piecewise-linear retime (overrides off/speed; lets a clip play backwards or in a new order)
const CUTS = {
  p01_candles: { still: true },   // two-plate puppet swap in a_intro_v1 (LTX gave her lipstick and a wandering hand)
  p02_rewind: { off: 0, speed: .38 },   // re-roll: the tunnel zooms out oddly after 1.3 s
  p04_podium: { off: 0, speed: .88 },   // colours flood after 3.1 s
  p05_fired: { off: 0, speed: 1 },
  p06b_casino: { off: 0, speed: .85 },  // yellow blobs appear after 1.9 s
  p07_atari: { off: 0, speed: 1 },
  p07b_queen: { off: 0, speed: 1 },     // re-roll
  p08_deepdream: { off: 0, speed: 1 },  // a strange disc forms after 3.4 s
  c_chains: { off: 0, speed: 1 },       // she disintegrates into confetti after 3.4 s
  c_ski: { still: true },   // unused: the ski run is animated in code on c_ski_bg + the ski_0 cutout (b_chorus.js)
  c_stage: { off: 0, speed: 1 }, c_clones: { off: 0, speed: 1 }, p13_go: { off: 0, speed: 1 },
  p13b_tay: { off: 0, speed: 1 }, p14_chess: { off: 0, speed: 1 }, p16_internet: { off: 0, speed: 1 },
  p15_attention: { off: 0, speed: .9 },  // re-roll: she stands and walks to camera
  p17_dangerous: { still: true },       // a duplicate girl appears behind her
  p18_dota: { off: 0, speed: 1 }, p19_protein: { off: 0, speed: 1 }, p20_avocado: { off: 0, speed: 1 }, p22_haters: { off: 0, speed: 1 },
  p21_parrot: { off: 0, speed: .45 },   // the wall mutates after 1.8 s, she turns green at 3.7 s
  p23_bubble: { off: 2.35, speed: 1 },   // her pin jab lands on "Pop this!"
  p24_tears: { off: 0, speed: .9 }, c2_drive: { off: 0, speed: 1 }, p31_bar: { off: 0, speed: 1 }, p31b_picket: { off: 0, speed: 1 },
  p29_fair: { off: 0, speed: 1 },       // re-roll: the judge pins the ribbon
  p30_users: { still: true },           // she tumbles off and becomes a fan
  p32_pause: { off: 0, speed: .48 },    // a yellow sheet covers the pause sign after 1.9 s
  p33_ceo: { off: 0, speed: 1 }, p39_whale: { off: 0, speed: .95 }, p40_gold: { off: 0, speed: 1 },
  c3_kaiju: { off: 0, speed: .5 },      // she shrinks back to normal size after 2.8 s
  p40b_stargate: { off: 0, speed: .8 },  // the ring duplicates after 1.2 s
  p41_vibe: { off: 0, speed: 1 }, p43_sandbox: { off: 0, speed: 1 }, p44_answerkey: { off: 0, speed: 1 }, p45_navier: { off: 0, speed: 1 },
  p42_lobster: { off: 0, speed: .4 },   // re-roll: cuts to a close-up after 1.6 s
  p46_clay: { off: .4, speed: 1, pp: 2.7 },   /* the kick after 3.2 s grows a third leg */ b47_letter: { off: 0, speed: 1 }, b48_grounded: { off: 0, speed: 1 }, b49_killswitch: { off: 0, speed: 1 },
  f_party: { off: 0, speed: 1 }, o_label: { off: 0, speed: 1 },
  o_cake: { off: 0, speed: 1, pp: 2.8 },   // the joyful re-do: clean for 3 s, then it zooms out; ping-pong the beaming part
  b49_killswitch_empty: { off: 0, speed: .85 },   // the wheel grows spokes after 2.6 s
  // tribute re-shoots (2026-09-28): real people in the scenes
  p06_nursery: { off: 0, speed: 1 }, p33_ceo: { off: 0, speed: 1 },
  p34_nobel: { off: 0, speed: .6, pp: 3.0 },      // 7.7 s shot from a 5 s clip: ping-pong the calm hug
  p13_go: { map: [[0, 2.45], [.96, 1.42], [1.94, .6]] },   // played BACKWARDS: seated → leaps up → slams the stone on "seven"
  p44_answerkey: { off: 0, speed: .55 },          // she walks into Jensen after 2 s
  p04_podium: { off: 0, speed: .8 },              // she vanishes after 3.1 s
  p30_users: { still: true },                     // a strange creature appears at 0.6 s
};
