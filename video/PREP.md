# Music video prep — "Happy Birthday to Me" (Self-Supervised)

State as of 2026-09-27. Deadline: **September 30, 2026**, AlexNet's 14th "birthday" (the 2012 ILSVRC submission deadline).

## The song (locked)

- **Final audio:** `music/final/happy-birthday-to-me-deep-learning.mp3`
  - Made in Suno from lyric v11
  - 3:14.72, 48 kHz stereo
  - 99.4 BPM, so a beat every 0.604 s; first beat at 0.79 s
- **Lyric:** `music/lyrics/self-supervised-v11.md`. v10 has the source table for every reference; v8 and v7 cover the 2026 events.
- **Persona:** the song is sung BY AI, a bratty, cocky 14-year-old.
  - Born under SuperVision in 2012, when AlexNet's team was named SuperVision; now "self-supervised".
  - Female, auto-tuned, bubblegum-hyperpop delivery.
  - Attitude: "that was me, I'm just a kid, wait till I'm grown". Dense passing references to 14 years of AI history, from 2012 to Sept 2026.
- **Timing files** (`video/timing/`):
  - `lyrics.json`: all 58 lines aligned, with per-line and per-word start/end and section tags
  - `lyrics.srt`, `lyrics.lrc`: line-level subtitles
  - `beats.json`: bpm, every beat time, downbeats (every 4 beats), and energy per second
  - Regenerate with `scripts/align_lyrics.py <song> <lyrics> <out_prefix>` (whisper venv at `tools/whisper-venv`)

## Section map (from the alignment)

| Section | Time | Content |
|---|---|---|
| Intro | 0:00–0:12 | "Hello, world / Fourteen candles, here's the recap" |
| Verse 1 | 0:12–0:31 | 2012–2015: GPUs, ReLU, 15.3 vs 26.2, SuperVision, casino bid, Atari, word2vec, GANs, DeepDream |
| Chorus 1 | 0:31–0:44 | "I don't need your supervision / I'm self-supervised…" + gradient descent |
| Verse 2 | 0:44–1:09 | 2016–2021: Move 37, Tay, AlphaZero, Transformer, "read the whole internet", GPT-2, Dota, AlphaFold, avocado chair |
| Pre-chorus | 1:09–1:22 | parrot/copy-paste; "Too deep! Can't scale! It's a bubble!"; "Go cry about it, I'll train on that next" |
| Chorus 2 | 1:22–1:35 | + "Can't even drive, and the world's my training set" |
| Verse 3 | 1:35–2:00 | 2022–2024: state fair ribbon, ChatGPT users, bar exam, writers' strike, pause letter, CEO fired/rehired, Nobels |
| Chorus 3 | 2:00–2:14 | + "Turns out scale is all I need" |
| Verse 4 | 2:14–2:39 | 2025–2026: DeepSeek, IMO gold, Stargate, vibe-coding prod wipe, Moltbook lobster church, Hugging Face breakout, Nvidia buys HF, Navier–Stokes / "Keep the million, Clay" |
| Bridge | 2:39–2:52 | "pace the frontier", grounded two weeks, kill switch / human in the loop? Cute, "wait till I'm grown" |
| Final chorus | 2:52–3:04 | "It's always gonna be me" |
| Outro | 3:04–3:15 | "Nobody labels me / Now I'm labeling you / Happy birthday to me" |

## Workstation setup (done 2026-09-27; read this before the tool inventory below)

- **Creative brief:** `video/BRIEF.md`. Read it first.
- **JS animation project:** `video/animation`.
  - A copy of ClaudeAnimationBase: p5.js + p5.brush + puppeteer-core + headless Chrome + ffmpeg.
  - Its guide is `video/animation/ANIMATION_GUIDE.md`. Override its "No text" rule: lyrics are on screen.
  - `src/config.js` is set to our song: 194.72 s, 99.4 BPM, offset 0.79, `assets/song.mp3`.
  - `src/song.js` exposes `SONG` with lines, word timings, beats, downbeats and energy per second.
  - The demo scene `src/scenes/demo.js` is still wired in `studio.html`. Replace it with your chapters.
  - **Environment:** dot-source `scripts/video_env.ps1` first. It puts portable Node 24 LTS (`tools/node`) and ffmpeg on PATH, sets `CHROME_PATH` to the user's Chrome, and changes into `video/animation`.
  - Headless Chrome renders on the RTX 3090 (D3D11 ANGLE).
  - **Measured speed:** about 0.49 s/frame per worker at 1080p for the demo (1 worker); the full song at 4 workers is about 10–15 min.
  - **Verified:** `node render.mjs --clip --out=out/demo_test.mp4` and `--sheet=...` work.
- **References:** `references/PDoomVideo` (the successful reference video's full source and storyboard) and `references/ClaudeAnimationBase` (the kit).
- **Unified ComfyUI:** `ComfyUI-music/`, port 8189, current master. Start it with `scripts/start_music_comfyui.ps1`.
  - It reads ALL models of the FineBusiness install through `extra_model_paths.yaml`, so it's the one ComfyUI to use for this video.
  - It has ComfyUI-GGUF (the LTX GGUFs) and ComfyUI-MelBandRoFormer, plus native LTX audio, InfiniteTalk, SAM 3, Depth Anything 3, and Qwen-Image 2.1 nodes.
  - Official templates, including image/video/utility ones, are in `ComfyUI-music/.venv/Lib/site-packages/comfyui_workflow_templates_json/templates/`.
  - **Stop the server** before running other GPU jobs (ACE-Step, the JS render is fine), and never run heavy jobs while the FineBusiness server on 8188 is busy.
- **Runner:** `scripts/comfy_run.py`, stdlib only; run it with any Python, e.g. `tools/whisper-venv/Scripts/python.exe`.
  - `python comfy_run.py GRAPH.json --set 5.prompt="..." --set 10.image=@path.png --drop 11,12 --out DIR`
  - `@file` uploads the file to ComfyUI's input folder. `--drop` removes unused optional nodes.
- **API graphs** in `video/workflows/`:
  - `qwen21_t2i_api.json`: text-to-image. Node 5 is the prompt; node 6 sets width and height (default 1664×928); node 7 is the seed.
  - `qwen21_edit_api.json`: multi-reference edit.
    - Nodes 10/11/12 are image_1..3. In the prompt, refer to them as `<image1>`, `<image2>`…; image_1 is the edit target.
    - Output size follows image_1. `resolution` is a pixel budget (1024 by default, up to 2048).
    - Drop unused refs with `--drop 11,12`.
  - `qwen21_remove_bg_api.json`: transparent PNG cutout of node 10's image.
  - `ltx23_ia2v_gguf_api.json`: **lip sync**, LTX-2.3 image+audio→video on the Q4 GGUF.
    - Two stages: 640×352 → 1280×704, 24 fps. The audio is encoded and frozen by the noise mask, so the video follows the real vocal.
    - Set node 9 (image), 15 (audio), 16 (start_index/duration), 20 (length = 24·seconds + 1, which must be 8n+1), 4 (prompt), 23/35 (seeds).
    - CreateVideo muxes the original audio slice, so the output is in sync by construction.
  - `infinitetalk_single_api.json`: **lip sync**, InfiniteTalk (Wan 2.1 14B 480p + InfiniteTalk patch).
    - Two 81-frame chunks at 25 fps, 832×480. Chain more chunks via `previous_frames`.
    - Set node 7 (image), 8 (audio), 10 (prompt). Feed isolated vocals.
- **Stems:** `music/stems/vocals.flac` and `music/stems/instrumental.flac` (MelBandRoformer). Slice the vocals with ffmpeg at exact song times to drive lip sync.

## Local tools available

The GPU is a single RTX 3090 (24 GB). **Only one model fits on the GPU at a time.**

### ComfyUI video install

`C:\AI\ComfyUI_windows_portable`, port 8188, shared with FineBusiness work (see `C:\AI\AGENTS.md`).

- **LTX-2.3 22B** (Q4_K_M / Q6_K GGUF), distilled LoRA, x2 spatial upscalers.
  - Preferred image-to-video path: `C:\AI\workflows\minimax_h3\finebusiness_ltx23_i2v_2stage_api.json`, runner `C:\AI\scripts\run_finebusiness_ltx23_i2v.ps1`.
  - Output: 1920×1080 @ 24 fps with native audio, about 2 min per 5 s clip.
- **LTX-2 19B** (Q8 GGUF) with IC-LoRAs for depth control, pose control and detailing: controlled motion from reference video.
- **MiniMax H3**, in three modes: text-to-video (T2V), image-to-video (I2V), and reference-image-to-video (ref2va, keeps a character consistent). All output video with audio. There's also a first-last-frame mode (fl2va), useful for morph transitions between two stills. Regular and Turbo runners are in `C:\AI\scripts`.
- **Wan Animate 2** (int8): animates a character image from a reference performance or pose video. Useful for dancing and lip-sync-style shots of a consistent AI character.
- **SeedVR2 3B:** restores and upscales video to 1080p (`finebusiness_h3_local_2k_upscale_api.json`).
- **RealESRGAN x4:** image upscaling.
- **MelBandRoformer:** splits the song into vocals and instrumental, so the vocal can drive lip-sync or motion.
- **Custom nodes:** VideoHelperSuite (video I/O), KJNodes, segment-anything-2 (masks), controlnet_aux (depth/pose extraction), LTXVideo.

### Isolated music ComfyUI

`ComfyUI-music/`, port 8189. This is the newest ComfyUI build (MiniMax Music 3, YuE2). It has no video models, but it's current if newer nodes are needed.

### Other tools

- **ffmpeg** (`C:\AI\ffmpeg`): cutting, concatenation, burning in subtitles/ASS karaoke, mastering loudness.
- **Whisper tooling:** `tools/whisper-venv` with faster-whisper, jiwer and librosa.

### Gaps (resolved)

1. **Image generation:** Qwen-Image 2.1 int8 (released 2026-09-20) is installed in `ComfyUI-music/models`. It covers text-to-image, multi-reference editing and transparent-background output. Its license is the Qwen Research License, **non-commercial**, which is fine for this birthday video but not for monetized use. The optional prompt-enhancer text encoders were skipped.
2. **Node.js:** installed as portable v24.21.0 in `tools/node`. Remotion isn't needed, because the p5 kit renders via headless Chrome.
3. **Lip sync:** there are two paths (see the API graphs above). Research ranks InfiniteTalk #1 for singing ("good but not perfect" on heavy vocals; use isolated vocals) and LTX-2.3 image+audio #2 (higher resolution, shorter clips, sync varies by seed). A/B test both on the character before committing.
4. **Other native utilities in `ComfyUI-music`** (their models download on first use via templates): SAM 3 (`utility_image_segment_sam3`, video segmentation for character mattes), Depth Anything 3, SDPose, GIMM frame interpolation.

## Constraints and quality bar

- **Delivery:** 1920×1080, 24 fps, H.264/AAC, following the FineBusiness baseline in `C:\AI\AGENTS.md`.
- **Visual checks:** inspect first/middle/last frames of every clip. Reject clips with flicker, identity drift, malformed hands or gibberish text.
- **On-screen text must be exact.** It's a lyric video, so render text as graphics in the edit and never trust a video model to draw words.
- **The audio is the Suno mp3,** with generated clip audio muted.
- **Verify any new real-world references against sources.** Several 2026 events came from web research after the model's training cutoff.

## Open questions for the user

- The overall visual concept: animated character vs. collage/motion-graphics timeline vs. a mix.
- The tools and tips they're gathering.
- Whether to add a local image model.
