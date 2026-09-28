# AlexNet birthday music video

Project workspace for an original song and music video marking the ImageNet 2012 AlexNet result.

## Date

September 30 is a reasonable anniversary date: the official ILSVRC 2012 page lists September 30, 2012 at 23:00 GMT as the results submission deadline. The preliminary results were released October 8 and full results October 13. So the 30th marks the AlexNet submission, while October marks when the win became public.

## Local music generation

ACE-Step 1.5 is the primary local setup. It runs natively on Windows, supports full songs with lyrics and vocals, offers style/reference conditioning and editing, and the machine has an RTX 3090 with 24 GB VRAM. The project repository, Python 3.12, CUDA 12.8 PyTorch environment, and model downloads are kept in this folder. This is isolated from the existing ComfyUI Python environment.

Upstream's best-quality pairing for 24 GB is the XL SFT DiT (50 steps, CFG) with the 4B 5Hz LM, which upstream rates "Strong" for composition against "Medium" for the 1.7B. Both are downloaded under `models/ACE-Step/` alongside Turbo, XL Turbo, and the 1.7B LM. `scripts\start_alexnet_music.ps1` now uses XL SFT + 4B by default; pass `-Turbo` for 8-step XL Turbo drafts. Music generation uses ACE-Step's own local Gradio interface.

MiniMax Music 3 (released August 2026; the lowest phoneme error rate among open models on WildSongBench) is set up as an A/B challenger. It lives in a separate, current ComfyUI checkout, `ComfyUI-music/`, with its own `.venv`, running at `127.0.0.1:8189`. This keeps the FineBusiness video install at `C:\AI\ComfyUI_windows_portable` (port 8188) untouched. Use `scripts\run_minimax_music3.ps1`; it takes the v2 caption and lyric by default and writes FLAC to `music/renders/`. The API graph is `music/workflows/minimax_music3_t2m_api.json` (official template settings: 30 steps, CFG 1.7, euler/simple, tiled decode). On the 3090 its autoregressive planning stage runs at about 4 tokens/s (25 tokens per audio second), so a 240 s take is roughly 35–40 minutes. Batch it overnight. Its Community License allows commercial use under $20M revenue, and public posts must disclose that the audio is machine-generated.

Only one model fits on the GPU at a time. Before rendering music, make sure the video ComfyUI queue is idle. `run_minimax_music3.ps1 -FreeVideoComfy` unloads its models only when its queue is empty.

YuE2 tops its own September 2026 WildSongBench report, but its weights are CC BY-NC 4.0. The new ComfyUI checkout ships native YuE2 nodes and templates (`audio_yue2_text2music`) that use a single 3.7 GB checkpoint, `yue2_3b_int8_convrot.safetensors`, which is not yet downloaded. That makes YuE2 a possible third comparison on Windows without WSL. ACE-Step's official code and model cards are MIT licensed and its model card states commercial use is allowed. Check the licenses of any added reference audio, samples, artwork, and other source material separately.

## Folder layout

- `ACE-Step-1.5/` — upstream source checkout and isolated `.venv`
- `models/ACE-Step/` — model checkpoints
- `ComfyUI-music/` — isolated current ComfyUI for MiniMax Music 3 / YuE2 (port 8189)
- `music/lyrics/` — lyric drafts, model-input lyrics, and captions (v2 is current)
- `music/workflows/` — MiniMax Music 3 API graph and upstream template
- `music/acestep-configs/` — ACE-Step CLI TOML configs
- `music/renders/` — generated song versions
- `music/stems/` — separated or exported stems
- `video/` — storyboard, stills, and animation work
- `references/` — source notes and creative references
- `tools/` — local uv and managed Python runtime
- `cache/` — project-local package and model download caches

## Launch

After the model downloads finish and the video render is done, launch the local UI:

```powershell
& 'C:\AI\deep-learning-birthday\scripts\start_alexnet_music.ps1'
```

The UI uses `http://127.0.0.1:7860`. The project-local API launcher is also available at `scripts\start_alexnet_music_api.ps1` (port 8001).

MiniMax Music 3 takes (random seeds, 240 s):

```powershell
& 'C:\AI\deep-learning-birthday\scripts\run_minimax_music3.ps1' -Takes 4 -FreeVideoComfy
```

## References

- [ImageNet ILSVRC 2012 official page](https://www.image-net.org/challenges/LSVRC/2012/)
- [ACE-Step 1.5 source and model guide](https://github.com/ACE-Step/ACE-Step-1.5)
- [YuE2 source and benchmark notes](https://github.com/tidesea/yue)
