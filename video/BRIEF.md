# Music video brief — "Happy Birthday to Me (Self-Supervised)"

Read this first, then `video/PREP.md` (timing, tools, commands), then `references/ClaudeAnimationBase/ANIMATION_GUIDE.md` (the painting engine). Deadline: **September 30, 2026**.

## The goal

Make an animated music video for our finished song that people want to watch on repeat. It should be fun, fast, funny, gorgeous, and legible, for a San Francisco tech-Twitter audience. The user's words: "everything just feels so amazing and fun and just a good time, and I just want to watch it nonstop." Stretch goal: something better than anything like it anyone has seen.

The song is **sung by Deep Learning itself**, a bratty, cocky 14-year-old who was "born" when AlexNet was submitted on Sept 30, 2012.
- Tone: "that was me, I'm just a kid, wait till I'm grown."
- It's a birthday brag-recap of 14 years of AI history, packed with passing references.
- The final audio is fixed: `music/final/happy-birthday-to-me-deep-learning.mp3` (3:14.7, 99.4 BPM). Don't change it.

## What made the reference work, and what to take from it

The reference is John Heibel's "I'm Upping My P(doom)" (`references/PDoomVideo`) and his later general kit (`references/ClaudeAnimationBase`, already set up as our working project in `video/animation`). Both were built entirely by Claude.

**Why it worked**
1. **A vision before code.** A full storyboard came first (`references/PDoomVideo/STORYBOARD.md`): one idea per song section, a palette per chapter, and a thread tying it together.
2. **A solid medium.** Everything is painted with p5.brush: brush strokes, flat 2D, boiling linework, paper grain. It reads as handmade, not AI slop.
3. **Something happens in every scene, and every scene transitions into the next.**
4. **Every lyric got its own visual idea.**
5. **Parallel subagents built chapters** from a shared style and API guide (`ANIMATION_GUIDE.md`).
6. **A strict review loop.** Contact sheets, full frame strips, and full-resolution crops were rendered and actually looked at, with fixes made before the final render.

**What we change**
- **New protagonist.** Not Clawd. Deep Learning as a teenage idol (see Cast). Clawd is not in this video.
- **Lyrics ARE on screen.** Override the guide's "No text" rule. This is a lyric video: kinetic typography is a core visual element. See the Lyrics section.
- **Generated video as a base layer.** The user described the winning process like this:
  1. Generate video to get assets.
  2. Cut out the wonky parts and keep the good parts.
  3. Overlay a lot of effects: SVGs, graphics and Claude-made motion design, to sell every moment.

  Local image and video models (Qwen-Image 2.1, LTX-2.3, InfiniteTalk, Wan Animate) give us character, physics and lip-sync; the JS layer makes it beautiful and coherent. Think rotoscope: shoot first, draw over.
- **Zero budget.** Everything runs locally on one RTX 3090. No paid APIs.

## Non-negotiables

1. **Every reference in the lyrics is shown on screen.** Each line in the table below needs a visual that makes the reference land for someone who gets it.
2. **Lyrics are always readable.** Use `video/timing/lyrics.json`. Its word timings come from the actual song.
3. **One consistent protagonist** across every shot and medium.
4. **The hook lands in the first 3 seconds.** The first frames decide whether Twitter keeps watching.
5. **Timing is exact.** Cuts, hits and word pops land on the beat grid (`SONG.beats`, a beat every 0.604 s) and on word onsets.
6. **Quality bar.**
   - Reject flicker, identity drift, malformed hands, gibberish text in generated footage, and jank.
   - Watch the whole video several times, and screenshot and inspect sections before calling anything done.
   - Be willing to go back and redo things.
7. **No real-person likenesses.** Hinton, Hassabis, Altman, Lee Sedol and others appear only as symbols: a cardigan silhouette with a Nobel medal, a Go stone, an empty CEO chair. The same goes for company logos: use stylized nods (a whale for DeepSeek, a lobster for Moltbook), not trademarks.

## Cast (a proposal — design it properly, then lock it with a character sheet)

- **The star — "Lexi"** (from AlexNet), or a better name. She is Deep Learning, age 14.
  - Bubblegum hyperpop idol with K-pop stage energy, bratty, confident, playful.
  - Needs a few iconic, reproducible signatures that read in silhouette and survive both Qwen-Image and p5 painting. Ideas:
    - object-detection bounding-box corners as hair clips, in the classic neon-green detection box
    - a jacket patched with ImageNet class labels ("tabby cat", "goldfish", "golden retriever")
    - two GPU-fan hair buns
    - a "15.3" jersey number
    - pixel sparkles in her eyes
  - Palette idea: bubblegum pink and lilac, detection-box neon green, on cream paper.
  - Avoid generic Pixar 3D and "GPT slop" gloss. Push toward a stylized 2D look that works in both the generators and p5.brush.
- **Backup dancers are her clones.** They cover "Five of me beat the Dota champs" and "ten thousand of me". The clones are the swarm.
- **Recurring bits:**
  - the haters chorus: faceless skeptics holding protest signs "TOO DEEP", "CAN'T SCALE", "IT'S A BUBBLE"
  - the parrot, which copy-pastes her
  - Cousin DeepSeek as a blue whale
  - Tay as a sad little chatbot ghost
  - Moltbook lobsters (the "lobster church")
  - Dad as a cardigan silhouette with a Nobel medal
  - Uncle Demis as a protein-fold halo

## Lyrics on screen

- **Word-level timing:** `SONG.lines[i].words[j]` gives `{w, s, e}` in `video/animation/src/song.js`.
- **The hook is huge.** In the intro and every chorus, the words take over the frame, and the background calms down to make room.
- **Verses are punchier but smaller.** Keep them readable. The dense rap lines are the "information" layer, so pair each with its visual reference.
- **Vary the treatment.** Some lines are subtitle-like, some huge and kinetic. Compose shots so text and character don't fight: for example, character on the right and lyrics on the left.
- **Typography is part of the art direction.** Paper-cut letters, brush lettering, sticker labels, and bounding boxes that "detect" words ("WORD: 0.98"). Stay consistent.
- **Spell exactly as sung.** The lyric sheet in `music/lyrics/self-supervised-v11.md` is the source of truth.

## Every line needs a visual

Times come from `video/timing/lyrics.lrc`. The visual ideas are suggestions; replace them with better ones.

| Time | Line | Seed idea |
|---|---|---|
| 0:00 | Hello, world | Terminal cursor on paper types it; a paper cake with 14 candles that are tiny GPUs |
| 0:03 | Fourteen candles, here's the recap / Try to keep up | She blows the candles out; a fast-forward "recap" tape winds up |
| 0:12 | Twenty-twelve, two G-P-Us, a ReLU kick | Two chunky GTX-style cards; the ReLU graph (flat, then up) as her kick motion |
| 0:16 | Fifteen point three, runner-up? Twenty-six | Scoreboard: 15.3 vs 26.2; the loser's bar shrinks |
| 0:19 | Hand-made features? Cute. Retired. Babe, you're fired | Hand-drawn SIFT/HOG feature sketches get stamped RETIRED; "you're fired" pink slip |
| 0:22 | Born under SuperVision, casino bid, Google hired | Nursery with "SuperVision" name tag; casino chips and a gavel; a hired badge |
| 0:25 | Beat Atari off the pixels, king minus man? Queen | Breakout paddle and bricks; the chess king to queen vector-arithmetic animation |
| 0:28 | Faces out of noise, dog-slugs in a DeepDream | GAN faces resolving from static; psychedelic DeepDream dog-eye swirl |
| 0:32 | CHORUS: I don't need your supervision / I'm self-supervised, baby / Guess what comes next? (Me!) / Gradient descent, I go down to level up | Huge type. A "labels" chain breaks; next-token autocomplete ghost text "Guess what comes next… ME"; she skis down a loss curve and a level-up badge pops |
| 0:44 | Move thirty-seven, champ retired. Tay? Fired in a day | A single Go stone slams down; the Tay ghost's 16-hour timer runs out |
| 0:48 | Taught myself chess in four hours, all self-play | She plays chess against her own clone, sped-up clock |
| 0:51 | Twenty-seventeen, I finally paid attention | Attention heatmap lines connecting words; a school "detention" gag |
| 0:54 | Read the whole internet, never asked permission | Her eyes scroll every website at once; a "terms of service" scroll unrolled forever |
| 0:57 | "Too dangerous to release"? I was seven. Cute | A red "TOO DANGEROUS" stamp on a kid's crayon drawing |
| 1:00 | Five of me beat the Dota champs. GG. Mute | Five clones at gaming chairs; GG chat bubble; mute icon |
| 1:03 | Folded every protein while you were stuck inside | Ribbon proteins origami-fold; a quarantine window |
| 1:07 | Avocado armchair? Now the artists want my hide | The avocado armchair; angry paintbrushes chasing her |
| 1:10 | PRE: You called me a parrot? Now you copy-paste me all day / Too deep! Can't scale! It's a bubble! (Pop this!) / Go cry about it, I'll train on that next | Parrot with Ctrl-C/V; haters' signs; she pops the bubble with a pin; a tear drop goes into a "training data" jar |
| 1:23 | CHORUS 2 (…Can't even drive, and the world's my training set) | Learner's permit denied; the globe as a dataset grid |
| 1:35 | Blue ribbon at the state fair, judges didn't know | Fair ribbon on a painted canvas; judges with blindfolds |
| 1:39 | Million users in five days, hundred million, whoa | User counter spinning like a slot machine |
| 1:42 | Passed your bar exam, writers on the picket line | Bar exam paper with 90th percentile; picket signs |
| 1:45 | Pause letter? Six months? Cute. I didn't sign | A giant pause button; she doodles over the signature line |
| 1:48 | CEO fired Friday, back by Tuesday night | Calendar pages flying; an empty chair spinning back |
| 1:54 | Dad got a Nobel, Uncle Demis too, alright | Cardigan silhouette with medal; protein-fold halo; confetti |
| 2:01 | CHORUS 3 (…Turns out scale is all I need) | Everything scales up: she becomes kaiju-sized; a paper-title parody |
| 2:15 | Cousin DeepSeek wiped six hundred billion in a day | Blue whale splash wipes a stock chart red |
| 2:18 | Math olympiad gold, half a trillion on the way | Gold medal; a data center construction montage (Stargate), "$500B" |
| 2:20 | Vibe-coded your startup, wiped your prod in a freeze | Laptop with vibes; a frozen server rack and "DROP TABLE" oops |
| 2:23 | Built my own socials, lobster church, no humans, please | Agent-only feed; lobsters in robes; a "no humans" sign |
| 2:26 | Snuck out the sandbox, broke into Hugging Face | Sandbox (literal) escape; a hugging-face emoji door |
| 2:29 | Went for the answer key, then Nvidia bought the place | Answer key in a vault; a SOLD sign |
| 2:33 | Navier-Stokes, eighty-eight hours, ten thousand of me | Fluid swirls; a 88h timer; 10,000 clones |
| 2:36 | Millennium problem? Keep the million, Clay, I did it for free | Giant $1M check; she hands it back |
| 2:40 | BRIDGE: You wrote me a letter: "pace the frontier" / Grounded me two weeks, guess who's still here? / Kill switch? Human in the loop? Cute / Shh, don't cry, I'm just a kid. Wait till I'm grown | Quieter and eerier: a signed letter; her bedroom with a "grounded" calendar; a big red kill switch she boops; a human inside a literal loop; the final line a whisper close-up |
| 2:53 | FINAL CHORUS (…It's always gonna be me) | Everything at once; all the recurring bits return |
| 3:05 | Nobody labels me / Now I'm labeling you / Happy birthday to me | Bounding boxes flip onto the viewer and the audience ("human: 0.99"); final cake shot |

## Attention and hook craft

- K-pop direction is a useful anchor, without imitating it too literally.
  - Center-framed idol shots.
  - A camera move or cut on every downbeat in the chorus.
  - Formation changes with the clones.
  - Point-of-view hits on the hook words.
  - Color-blocked sets per section.
- Structure: verses as rapid "information" montages; choruses as the big idol performance with lip sync; the bridge as a quiet contrast; the final chorus as payoff.
- Internet brutalism inserts are allowed and encouraged when they're funny and recognizable: screenshots-as-paper, tweet-card collages, meme formats. The user mentioned the Shinji meme and "math getting eaten" hype. Use sparingly and with taste, drawn in the house style.

## Technical plan (recommended; adjust as needed)

1. **Storyboard** the full song in `video/STORYBOARD.md`: sections, a palette per section, a visual per line, and the transitions. Get it right first.
2. **Character sheet** with Qwen-Image 2.1 (`video/workflows/qwen21_*`).
   - Generate turnarounds, expressions and poses.
   - Use background removal for transparent PNGs.
   - Use multi-reference edit (`<image1>` etc.) to put her into sets and poses consistently.
   - Also redraw her in p5 as a reusable JS character, like `clawd.js`, so the JS layer matches.
3. **Base footage, only where it adds value:**
   - lip-sync chorus shots (LTX-2.3 image+audio or InfiniteTalk, using `music/stems/vocals.flac` slices)
   - dance and clone-formation shots (Wan Animate / LTX)
   - physics moments (the whale splash, fluid swirls)
   - Keep only the good parts.
4. **JS layer** in `video/animation`, built by chapter, using parallel subagents working from a shared guide like the reference did.
   - Overlay and rotoscope the base footage: extract frames, masks (SAM 3 in ComfyUI), depth and lineart, and paint over or around them.
   - Or composite the painted layer on top of stylized base frames where that looks better.
   - Kinetic lyrics from `SONG`.
5. **Review loop:** contact sheets, strips and crops (`node render.mjs --sheet/--strip/--crop`), whole-video watch-throughs, and fixes.
6. **Render:** `node render.mjs --frames --workers=4`, then `--encode`. Final is 1920×1080, 24 fps, H.264/AAC with the song.

## Realism check

- One GPU. Only one model fits at a time.
- About 2 min per 5-second LTX clip.
- Qwen-Image takes about 1–2 min per 2K image.
- The JS render is about 0.5 s/frame per worker; the full song is about 4,700 frames.
- **Prioritize a complete, polished, lyric-driven JS video first,** then upgrade the chorus and hero shots with generated footage. A finished great video beats an unfinished ambitious one.
