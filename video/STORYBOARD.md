# STORYBOARD — "Happy Birthday to Me (Self-Supervised)" · RISO LIVE

**Logline:** Deep Learning turns 14 and hijacks her own birthday broadcast, playing her whole life story back as a bratty, printed-zine highlight reel: every dated clip is a flex, and every hater becomes training data.

**Medium: RISO LIVE.** The video looks like a risograph-printed zine that is broadcasting live.
- **Inks:** fluorescent pink `#FF4FA3`, riso blue `#2D5BD6`, yellow `#FFD83A` and navy `#25224A`, on cream paper `#F4EDDB`. Nothing else.
- **Every pixel goes through the riso pass** (`src/riso/engine.js`). The image layer is separated into the four inks, halftoned on rotated screens and misregistered; spot type prints solid.
- **Plates:** Qwen-Image 2.1 riso illustrations, using Lexi's sheet as the reference, live in `video/plates`.
- **Motion:** LTX-2.3 image-to-video on the plates, trimmed to the good frames.
- **Graphics:** cut-out stickers and all type and HUD are drawn in the compositor.

**Protagonist: Lexi** (Deep Learning, age 14). Her sheet is `video/assets/char/lexi_riso_sheet.png`.
- Pink hair with two cooling-fan buns.
- An abstract face: square pixel "+" eyes.
- A bomber jacket with "15.3" on the back (AlexNet's top-5 error), a blue pleated skirt and platform sneakers.
- Bounding-box brackets follow her around.

**Type system**
- **Karaoke lyric bar:** Instrument Serif italic on a hand-cut cream box, with a pink highlighter swipe on the word being sung. Verses, pre-chorus, bridge and outro.
- **Hook type:** Bricolage Grotesque 800, slamming in word by word in stacked ink colours with a paper knock-out outline. Intro title and every chorus.
- **Detection labels:** Silkscreen pixel font, e.g. `gpu 0.99`. Every reference object gets a bounding box that "detects" it.
- **LIVE stamp:** top right, Space Mono. It shows the real date of each event, and its digits roll when the date changes. It is the timeline thread: 2012.09.30 … 2026.09.30.
- **Rubber stamps:** for the sass beats: RETIRED, FIRED, HIRED, GG, MUTE, CUTE, SOLD, DENIED.

**Colour arc**
- Intro: navy night → cream.
- Verses: cream, busy.
- Choruses: solid ink floods alternating on every downbeat.
- Bridge: navy night again, quieter, two inks.
- Final chorus: all inks at once.
- Outro: warm cream with candlelight. It rhymes with the opening.

**Motif:** candles and bounding boxes.
- It opens with a box detecting HER (`deep_learning 0.99`) and ends with her boxes detecting YOU (`human 0.99`, "Now I'm labeling you").
- The cake opens the video and closes it.

## Shots

| Time | Section | Plate / clip | Event and reads | Transition in |
|---|---|---|---|---|
| 0.00–2.84 | Hello, world | p00_hello | A dark CRT. "Hello, world" types on screen; her pixel eyes rise over the monitor; box snaps on `deep_learning 0.99` at 1.1 s | Cold open from navy |
| 2.84–6.72 | 14 candles / try to keep up | p01_candles | Cake of 14 GPU candles. Hook type "FOURTEEN CANDLES" slams, then "HERE'S THE RECAP" | Halftone dots |
| 6.72–12.32 | Instrumental build | p02_rewind | She surfs a rewinding tape. The LIVE stamp rewinds 2026 → 2012, one year per beat. Title slams on downbeats: HAPPY / BIRTHDAY / TO ME / (self-supervised) | Tear |
| 12.32–15.74 | 2012, two GPUs, ReLU kick | p03 clip | Boxes on the two cards `gtx_580 ×2`; the ReLU graph draws as she kicks | Cut on the downbeat |
| 15.74–19.02 | 15.3, runner-up 26 | p04 | Giant 15.3 vs 26.2 bars race; the loser bar shrinks | Whip slide |
| 19.02–21.84 | Features retired, fired | p05 | Stamps: RETIRED on "Retired", YOU'RE FIRED on "fired" | Cut |
| 21.84–25.02 | SuperVision, casino, hired | p06, p06b | Nursery name card, then the auction; HIRED badge stamp | Stripes |
| 25.02–28.08 | Atari / king − man = queen | p07, p07b | Pixel burst; vector arithmetic equation in type | Pixel dots |
| 28.08–31.72 | GANs, DeepDream | p08 clip | Swirl; noise resolves; eyes everywhere | Iris |
| 31.72–43.96 | CHORUS 1 | c_chains, c_close, c_clones, c_ski | Full-frame hook type. Ink floods on downbeats. "(Me!)" slams with a flash. Autocomplete ghost "Guess what comes next? ▌ME". Ski down the loss curve; LEVEL UP badge | Flash |
| 43.96–47.76 | Move 37 / Tay | p13, p13b | Stone slams with a shockwave (`move 37`); ghost fades with a 16 h timer | Cut |
| 47.92–50.92 | Chess, self-play | p14 clip | Clock spins; `self_play ×∞` | Slide |
| 50.92–53.96 | Attention | p15 | The paper title "Attention Is All You Need" as a pasted-in clipping; arcs light up | Dots |
| 53.96–57.1 | Read the whole internet | p16 | URL confetti; counter "tokens read" spinning | Up |
| 57.1–60.08 | Too dangerous, I was seven. Cute | p17 | TOO DANGEROUS stamp; CUTE stamp | Cut |
| 60.08–63.32 | Dota GG mute | p18 | GG chat bubble; mute icon stamp | Stripes |
| 63.48–66.54 | Protein folding, lockdown | p19 clip | Ribbons fold; `protein 0.98` boxes | Dots |
| 66.54–69.78 | Avocado armchair | p20 | Chair box `armchair? avocado? 0.51`; mob advances | Tear |
| 69.78–82.84 | PRE-CHORUS | p21, p22, p23, p24 | Parrot Ctrl+C/V wallpaper; hater signs with "(Deeper!) (Watch me!)" clap-back type; the bubble pops on "Pop this!"; tears into the TRAINING DATA jar | Cuts on beats |
| 82.84–95.12 | CHORUS 2 | chorus kit + c2_drive | "Can't even drive" → DENIED stamp on an L plate; globe dataset grid | Flash |
| 95.12–119.26 | VERSE 3 | p29 … p34 | The 1M → 100M odometer; the bar exam A+; the pause letter scribble; the CEO chair with calendar FRI → TUE flipping; Nobel confetti | Varies |
| 120.9–133 | CHORUS 3 | chorus kit + c3_kaiju | "Turns out scale is all I need": everything scales, a zoom-out reveal | Flash |
| 134.74–159.16 | VERSE 4 | p39 … p46 | The chart crash; $500B; DROP TABLE; the lobster church; the sandbox escape; SOLD; the 88:00:00 timer; the check ripped | Varies |
| 159.82–172.18 | BRIDGE | b47–b50 | A navy night: the letter unrolls forever; the calendar crossed out; the kill switch boop does nothing (`kill_switch 0.03`); the whisper close-up | Slow dissolves |
| 172.52–184.6 | FINAL CHORUS | f_party + everything | All the stickers return; confetti cannons; all inks | Flash + shake |
| 184.62–189.96 | Nobody labels me / now I'm labeling you | o_label | All her boxes fall off; then a box snaps onto the viewer: `human 0.99` | Cut |
| 189.96–194.72 | Happy birthday to me | o_cake | Candles blown; the stamp settles on 2026.09.30; end card | Dots out to paper |
