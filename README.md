# Happy Birthday to Me (Self-Supervised)

A music video for Deep Learning's 14th birthday.

On **September 30, 2012**, the team called *SuperVision* (Alex Krizhevsky, Ilya Sutskever and Geoffrey Hinton) submitted AlexNet to ImageNet. It won with a **15.3%** top-5 error; the runner-up had 26.2%. This video is that birthday, sung by the kid who was born that night.

**Lexi** (from Alex·Net) is Deep Learning at 14: bratty, brilliant, and done asking permission. In 3 minutes and 14 seconds she recaps fourteen years:
- 2012 to 2015: two GPUs and a ReLU kick, Atari, word2vec, GANs, DeepDream
- 2016 to 2021: Move 37, Tay, AlphaZero, "Attention Is All You Need", GPT-2, OpenAI Five, AlphaFold, the avocado armchair
- 2022 to 2024: ChatGPT, the bar exam, the pause letter, the Nobels
- 2025 to 2026: DeepSeek, IMO gold, Stargate, Moltbook, Hugging Face, Navier–Stokes

Along the way she labels everything with object-detection boxes, until the last line: *"Nobody labels me / Now I'm labeling you."*

It's made entirely with local, open tools on **one RTX 3090, with a $0 budget**, directed by Lino Valdovinos and built together with Claude Opus 5.5.

## The look: "RISO LIVE"

Every frame is printed through a WebGL **risograph shader**:
- The image layer is separated into four inks (fluorescent pink, blue, yellow and navy) and halftoned on rotated screens, with misregistration that kicks on every downbeat.
- The type and HUD print as solid spot ink.
- A `● LIVE yyyy.mm.dd` stamp tracks the real date of every event.
- A karaoke lyric bar highlights each word as it's sung.
- Detection boxes label the people, papers, companies and objects.

## Pipeline

| Stage | Tools | Where |
|---|---|---|
| Song | Suno (final). Style and lyric exploration with ACE-Step 1.5 XL SFT + 4B LM, MiniMax Music 3 and YuE2; legibility scored with faster-whisper + jiwer | `music/`, `scripts/` |
| Timing | word-level lyric alignment (faster-whisper) and a librosa beat grid | `scripts/align_lyrics.py`, `video/timing/` |
| Character & plates | Qwen-Image 2.1 (text-to-image, multi-reference edit, background removal) | `video/assets/char/`, `video/plates/` |
| Real people | Wikimedia Commons photos redrawn in the riso style; two-step scene edits (stand-in → real person) | `video/assets/people/`, `video/plates/tribute_plates.py` |
| Motion | LTX-2.3 image-to-video (22B Q4 GGUF, 2-stage 1080p), trimmed per clip | `video/plates/run_ltx.sh`, `video/animation/src/riso/cuts.js` |
| Lip sync | InfiniteTalk on Wan 2.1 I2V 14B, driven by MelBand RoFormer vocal stems | `video/plates/run_lipsync.sh` |
| Compositor | p5.js-era kit (ClaudeAnimationBase) rebuilt as a two-layer canvas + WebGL riso pass, rendered by headless Chrome | `video/animation/` |
| Review | contact sheets, frame strips, grid overlays, and critic subagents on every pass | `render.mjs --sheet/--strip/--grid` |

The full write-up is in [`video/PIPELINE.md`](video/PIPELINE.md). The creative brief is [`video/BRIEF.md`](video/BRIEF.md) and the shot plan is [`video/STORYBOARD.md`](video/STORYBOARD.md).

## Render it

```bash
cd video/animation && npm install
# review a moment:  node render.mjs --sheet=12.5,31.8 --cols=2 --w=960 --grid --out=out/check/a.jpg
FRESH=1 bash video/make_final.sh happy-birthday-to-me     # frames → master + 1080p share + 720p
```

`video/gpu_queue.sh` runs GPU jobs strictly one at a time. The workstation once hard-crashed with bugcheck 0x119 (a GPU scheduler error) when heavy Qwen edits overlapped. Since then ComfyUI runs with `--reserve-vram 3 --disable-smart-memory`, and peak VRAM dropped from 22.9 GB to 16.1 GB.

## Assets not in the repo

These are kept out for size or licensing and are regenerable with the scripts:
- the ComfyUI and ACE-Step installs, model weights and caches
- the LTX and InfiniteTalk clips and the extracted frames
- the reference photos
- the final videos

The 54 final illustration plates (`video/plates/img/`), stickers, logos and portraits are included.

## Credits

- **Direction:** Lino Valdovinos
- **Co-creation (lyrics, storyboard, code, animation engine, edit):** Claude Opus 5.5
- **Music:** Suno · ACE-Step · MiniMax Music 3 · YuE2 · faster-whisper · jiwer · MelBand RoFormer
- **Pictures & motion:** Qwen-Image 2.1 (Qwen / Alibaba) · LTX-2.3 (Lightricks) · InfiniteTalk (MeiGen) · Wan 2.1 (Wan-AI) · ComfyUI · ComfyUI-GGUF
- **Print shop:** p5.js · p5.brush · Puppeteer · Chrome · FFmpeg · librosa. The animation kit and the inspiration come from John Heibel's [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase) (MIT) and [*I'm Upping My P(doom)*](https://github.com/JohnHeibel/PDoomVideo).
- **Fonts:** Bricolage Grotesque, Instrument Serif, Silkscreen, Space Mono (SIL OFL)
- **Portrait references (Wikimedia Commons):** see [`video/assets/people/refs_attribution.json`](video/assets/people/refs_attribution.json). Each photo is credited to its author under CC BY / CC BY-SA / public domain. Ilya Sutskever's reference photo was supplied by the director.

The logos and names belong to their owners. This is a tribute, not an endorsement.

*For Alex, Ilya & Geoff, and everyone who labeled ImageNet.*
