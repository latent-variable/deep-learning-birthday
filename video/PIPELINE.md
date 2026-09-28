# How the video is made ("RISO LIVE")

This is the working pipeline for the final video. Read `STORYBOARD.md` for the creative plan.

## 1. Character and assets (Qwen-Image 2.1, ComfyUI-music on :8189)

**Lexi's sheets**
- The model sheet is `assets/char/lexi_riso_sheet.png`.
- It came from the style exploration `assets/char/style/style_C_00001_.png`, fed through `workflows/qwen21_edit_api.json`.

**Sticker sheets**
- Poses, heads and props live in `assets/sheets/*.png`. The `*_rgba.png` versions are the transparent cutouts from `qwen21_remove_bg_api.json`.
- `assets/split_sheet.py` splits them into `animation/assets/stk/*.png`. The index is `animation/out/check/stickers.jpg`.

**Plates**
- One riso illustration per lyric beat.
- `plates/plates.py` holds the prompts; it writes `plates.json` and `prompts/`.
- `plates/run_plates.sh` batch-generates them into `plates/img/<id>_s5.png` (Qwen edit, with the sheet as `<image1>`).
- Bad plates were regenerated, and the originals kept in `plates/rejected/`.

## 2. Motion and lip sync

**Motion**
- `plates/run_ltx.sh` runs LTX-2.3 I2V (`workflows/ltx23_i2v_api.json`) → `plates/ltx/<id>_l1.mp4`, 5 s at 1080p, about 130 s each.

**Lip sync**
- `plates/run_lipsync.sh` runs InfiniteTalk on the isolated vocal stem → `plates/lipsync/*.mp4`.
- That's the 4 chorus close-ups and the bridge whisper, about 4 min each.

**Frames and the edit**
- `plates/extract_clips.sh` extracts clips to `animation/assets/clips/<id>/f%04d.jpg` and rebuilds `src/riso/clips.js`.
- `plates/clip_review.py` tiles clips for review.
- The per-clip edit ("cut the wonky parts") is `animation/src/riso/cuts.js`: `off`, `speed`, `pp` (ping-pong a clean stretch) and `still` (reject the clip, use the plate).

## 3. Compositor (`video/animation`, headless Chrome)

**Engine: `src/riso/engine.js`**
- There are two layers, image (`I`) and spot ink (`S`).
- A WebGL riso pass separates the image layer into fluoro pink, blue, yellow and navy, halftones each ink on rotated screens, and misregisters them (with a kick on each downbeat).
- The spot layer prints solid ink on knocked-out paper.
- Also here: transitions (dots, tear with a paper edge, stripes, iris, slide, reprint = single-ink flash cut) and the POST controls (flash, mono, punch, shake, jolt).

**FX: `src/riso/fx.js`**
- the karaoke lyric bar, driven by the word timings in `src/song.js`
- the LIVE date stamp, bounding boxes, slam type and hook lines, stickers, rubber stamps, confetti and scribbles

**Chapters: `src/riso/scenes/*.js`**
- `common.js`: helpers
- `a_intro_v1`, `b_chorus` (the 4-chorus kit), `c_v2_pre`, `d_v3_v4`, `e_bridge_outro`
- `z_overlay`: the stamp timeline and the lyric bar

**Audio envelopes:** `src/riso/audio.js` (vocal and kick, at 24 fps).

## 4. Review and render

**Review**
```bash
node render.mjs --sheet=T1,T2 --cols=4 --w=480 --out=out/check/x.jpg
```
`--strip=A:B` renders every frame of a range.

**Final render:** `FRESH=1 bash video/make_final.sh <name>`. It writes:
- `final/<name>-master.mp4` (CRF 20)
- `final/<name>.mp4` (1080p, 12 Mbps, about 300 MB, for sharing)
- `final/<name>-720p.mp4`

The full render takes about 3 minutes with 6 Chrome workers.

## Licenses and notes
- **Qwen-Image 2.1:** the outputs are ours to use, including commercially. The license only restricts reselling or hosting the model itself.
- **Tribute content:** real people and company logos are depicted as a transformative, fair-use tribute.
  - Portraits: `assets/people/gen_ref.py` redraws each person from their Wikimedia Commons photo (`assets/people/refs/`, CC BY / CC BY-SA / public domain) in the riso style. Krizhevsky has no public photo, so his portrait is invented.
  - Group scenes: `plates/tribute_plates.py` builds each scene with Lexi, then replaces the stand-ins one at a time using the real photo.
  - Logos: `assets/logos/gen.py` redraws them as riso stickers.
  - The tribute layer (`src/riso/scenes/y_tribute.js`) adds name tags, citations, logos and the "THANK YOU" credits crawl.
- **GPU safety:** the machine hard-crashed once with bugcheck 0x119 (VIDEO_SCHEDULER_INTERNAL_ERROR) during overlapping heavy Qwen edits.
  - ComfyUI-music now runs with `--reserve-vram 3 --disable-smart-memory`, which takes the peak from 22.9 GB to 16.1 GB.
  - Run every GPU step through `video/gpu_queue.sh`, strictly one job at a time.
  - Never run the Chrome render while ComfyUI is busy.
  - Use at most 2 reference images per Qwen edit, at a 1024 px budget.
