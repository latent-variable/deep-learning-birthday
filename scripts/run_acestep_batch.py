"""Unattended ACE-Step 1.5 song batch (the bundled cli.py pauses for interactive prompt edits).

Run with the ACE-Step venv from the ACE-Step-1.5 folder, with ACESTEP_CHECKPOINTS_DIR set:
  python run_acestep_batch.py --rounds 2 --batch 2
"""
import argparse
import shutil
import time
from pathlib import Path

from acestep.handler import AceStepHandler
from acestep.inference import GenerationConfig, GenerationParams, generate_music
from acestep.llm_inference import LLMHandler

ROOT = Path(r"C:\AI\deep-learning-birthday")
LYRICS = ROOT / "music" / "lyrics"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dit", default="acestep-v15-xl-sft")
    ap.add_argument("--lm", default="acestep-5Hz-lm-4B")
    ap.add_argument("--caption", nargs="+", default=[str(LYRICS / "look-what-we-see-now-v2.caption.txt")],
                    help="One or more caption files; each is rendered in turn and named after its file stem.")
    ap.add_argument("--lyrics", default=str(LYRICS / "look-what-we-see-now-v2.acestep.txt"))
    ap.add_argument("--name", default="look-what-we-see-now-v2-acestep")
    ap.add_argument("--out-dir", default=str(ROOT / "music" / "renders" / "acestep"))
    ap.add_argument("--duration", type=float, default=240)
    ap.add_argument("--bpm", type=int, default=0, help="0 lets the LM choose.")
    ap.add_argument("--steps", type=int, default=50)
    ap.add_argument("--guidance", type=float, default=7.0)
    ap.add_argument("--shift", type=float, default=3.0)
    ap.add_argument("--batch", type=int, default=2)
    ap.add_argument("--rounds", type=int, default=2)
    ap.add_argument("--per-caption-names", action="store_true", help="Always append the caption file stem to output names.")
    ap.add_argument("--no-cot-caption", action="store_true",
                    help="Keep the caption verbatim; by default the LM rewrites it, which can drift from a locked style.")
    args = ap.parse_args()

    out_dir = Path(args.out_dir)
    work_dir = ROOT / "cache" / "acestep-work"
    out_dir.mkdir(parents=True, exist_ok=True)

    # XL DiT (~9 GB) + 4B LM (~8 GB) leave too little VRAM to decode 240 s on a 24 GB card,
    # so both handlers park idle weights in system RAM between stages.
    dit = AceStepHandler()
    status, ok = dit.initialize_service(project_root=str(ROOT / "ACE-Step-1.5"), config_path=args.dit, device="cuda",
                                        offload_to_cpu=True)
    if not ok:
        raise SystemExit(f"DiT init failed: {status}")
    lm = LLMHandler()
    status, ok = lm.initialize(checkpoint_dir=str(ROOT / "models" / "ACE-Step"), lm_model_path=args.lm, backend="pt", device="cuda",
                               offload_to_cpu=True)
    if not ok:
        raise SystemExit(f"LM init failed: {status}")

    config = GenerationConfig(batch_size=args.batch, use_random_seed=True, audio_format="flac")
    lyrics = Path(args.lyrics).read_text(encoding="utf-8").strip()
    multi = len(args.caption) > 1 or args.per_caption_names

    for caption_path in map(Path, args.caption):
        name = f"{args.name}-{caption_path.name.split('.')[0]}" if multi else args.name
        params = GenerationParams(
            caption=caption_path.read_text(encoding="utf-8").strip(),
            lyrics=lyrics,
            vocal_language="en",
            bpm=args.bpm or None,
            duration=args.duration,
            inference_steps=args.steps,
            guidance_scale=args.guidance,
            shift=args.shift,
            thinking=True,
            use_cot_caption=not args.no_cot_caption,
        )
        for rnd in range(1, args.rounds + 1):
            started = time.time()
            result = generate_music(dit, lm, params, config, save_dir=str(work_dir))
            if not result.success:
                print(f"{name} round {rnd} failed: {result.error}", flush=True)
                continue
            for audio in result.audios:
                seed = audio["params"]["seed"]
                target = out_dir / f"{name}-{args.dit.replace('acestep-v15-', '')}-seed{seed}.flac"
                shutil.copyfile(audio["path"], target)
                print(f"saved {target}", flush=True)
            print(f"{name} round {rnd}/{args.rounds} done in {time.time() - started:.0f}s", flush=True)


if __name__ == "__main__":
    main()