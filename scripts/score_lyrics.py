"""Transcribe song renders with Whisper and score lyric intelligibility against the reference lyric.

Usage: score_lyrics.py <lyrics.txt> <audio files or folders...> [--device cpu|cuda] [--lines]
Writes <audio>.transcript.txt and <audio>.lines.txt beside each file and prints a table sorted by
word error rate. Per-line scores show which lyric lines came through garbled, i.e. what to repaint.
"""
import argparse
import os
import re
import shutil
import sys
from pathlib import Path

# GPU mode: ctranslate2 loads cuBLAS/cuDNN from PATH; they come from the nvidia-*-cu12 wheels in this venv.
_NVIDIA = Path(sys.prefix) / "Lib" / "site-packages" / "nvidia"
os.environ["PATH"] = os.pathsep.join([str(p) for p in _NVIDIA.glob("*/bin")] + [os.environ.get("PATH", "")])

import jiwer
from faster_whisper import WhisperModel

KEY_TERMS = ["alexnet", "imagenet", "supervision", "convolution", "backprop", "relu", "dropout",
             "attention", "diffusion", "look what we see now"]
AUDIO_EXT = {".flac", ".wav", ".mp3"}


ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()
# Whisper splits or joins some terms differently from the lyric sheet.
ALIASES = {"back prop": "backprop", "relu": "relu", "re lu": "relu", "alex net": "alexnet", "image net": "imagenet",
           "super vision": "supervision", "g p u": "gpu", "g p us": "gpus"}


def number_words(match):
    """Spell digits the way they are sung: 15.3 -> fifteen point three, 2017 -> twenty seventeen."""
    token = match.group(0)
    if "." in token:
        whole, frac = token.split(".", 1)
        return f"{number_words_int(int(whole))} point {' '.join(ONES[int(d)] for d in frac)}"
    return number_words_int(int(token))


def number_words_int(n):
    if n < 20:
        return ONES[n]
    if n < 100:
        return TENS[n // 10] + ("" if n % 10 == 0 else " " + ONES[n % 10])
    if 1900 <= n < 2100 and n % 1000:
        return f"{number_words_int(n // 100)} {number_words_int(n % 100)}"
    if n < 100_000 and n % 1000 == 0:
        return f"{number_words_int(n // 1000)} thousand"
    if n < 1000:
        return f"{ONES[n // 100]} hundred" + ("" if n % 100 == 0 else " " + number_words_int(n % 100))
    return str(n)


def normalize(text):
    text = re.sub(r"\[[^\]]*\]", " ", text)  # structure tags
    text = re.sub(r"\([^)]*\)", " ", text)  # backing vocals are often buried in the mix
    text = re.sub(r"\d+(?:\.\d+)?", number_words, text.lower().replace(",", ""))
    text = text.replace("-", " ")
    text = re.sub(r"[^a-z' ]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    for alias, canonical in ALIASES.items():
        text = re.sub(rf"\b{alias}\b", canonical, text)
    return text


def lyric_lines(text):
    """Sung lead lines in order, normalized, skipping tags and blank or backing-only lines."""
    return [n for n in (normalize(l) for l in text.splitlines() if not l.strip().startswith("[")) if n]


def line_scores(lines, hyp):
    """Fraction of each reference line's words that Whisper heard, via the WER word alignment."""
    ref_words = " ".join(lines).split()
    owner = [i for i, line in enumerate(lines) for _ in line.split()]
    heard = [False] * len(ref_words)
    if hyp:
        for chunk in jiwer.process_words(" ".join(ref_words), hyp).alignments[0]:
            if chunk.type == "equal":
                for k in range(chunk.ref_start_idx, chunk.ref_end_idx):
                    heard[k] = True
    totals = [0] * len(lines)
    hits = [0] * len(lines)
    for k, i in enumerate(owner):
        totals[i] += 1
        hits[i] += heard[k]
    return [h / t for h, t in zip(hits, totals)]


def collect(paths):
    for p in map(Path, paths):
        if p.is_dir():
            yield from sorted(f for f in p.rglob("*") if f.suffix.lower() in AUDIO_EXT)
        elif p.suffix.lower() in AUDIO_EXT:
            yield p


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("lyrics")
    ap.add_argument("audio", nargs="+")
    ap.add_argument("--device", default="cpu")
    ap.add_argument("--model", default="large-v3-turbo")
    ap.add_argument("--lines", action="store_true", help="Print per-line scores for every file.")
    ap.add_argument("--pick-best", metavar="DIR", help="Copy the clearest take of each style into DIR (replacing its contents).")
    ap.add_argument("--top", type=int, default=0, help="With --pick-best: copy the N clearest takes overall instead of one per style.")
    args = ap.parse_args()

    lines = lyric_lines(Path(args.lyrics).read_text(encoding="utf-8"))
    reference = " ".join(lines)
    terms = [t for t in KEY_TERMS if t.replace(" ", "") in reference.replace(" ", "")]
    model = WhisperModel(args.model, device=args.device, compute_type="int8" if args.device == "cpu" else "float16")
    rows = []
    for f in collect(args.audio):
        # No initial_prompt: priming Whisper with the key terms would hide mumbled words.
        segments, _ = model.transcribe(str(f), language="en", vad_filter=False, beam_size=5)
        heard = " ".join(s.text for s in segments)
        f.with_suffix(f.suffix + ".transcript.txt").write_text(heard.strip() + "\n", encoding="utf-8")
        hyp = normalize(heard)
        # Rank by missed words (substitutions + deletions); extra repeats the model sings are not a clarity problem.
        if hyp:
            m = jiwer.process_words(reference, hyp)
            wer = (m.substitutions + m.deletions) / len(reference.split())
        else:
            wer = 1.0
        per_line = line_scores(lines, hyp)
        clear = sum(s >= 0.8 for s in per_line)
        report = [f"{s:4.0%}  {'OK ' if s >= 0.8 else 'FIX'}  {line}" for s, line in zip(per_line, lines)]
        f.with_suffix(f.suffix + ".lines.txt").write_text("\n".join(report) + "\n", encoding="utf-8")
        found = [t for t in terms if t.replace(" ", "") in hyp.replace(" ", "")]
        rows.append((wer, f, clear, found))
        print(f"scored {f.name}: missed {wer:.1%}, clear lines {clear}/{len(lines)}, key terms {len(found)}/{len(terms)}", flush=True)
        if args.lines:
            print("\n".join("    " + r for r in report), flush=True)

    print(f"\nRanked by missed words (lower is clearer; extra repeats not counted); clear line = at least 80% of its words heard:")
    for wer, f, clear, found in sorted(rows, key=lambda r: r[0]):
        print(f"  {wer:6.1%}  clear {clear}/{len(lines)}  keys {len(found)}/{len(terms)}  {f.name}")
        missing = [t for t in terms if t not in found]
        if missing:
            print(f"          missing: {', '.join(missing)}")

    if args.pick_best and rows:
        pick_best(rows, len(lines), Path(args.pick_best), args.top)


def pick_best(rows, n_lines, dest, top=0):
    """Replace dest's audio with the clearest take per style (top 3 when a round has one style),
    named '<rank>_<style>_<clear>of<n>-clear'."""
    dest.mkdir(parents=True, exist_ok=True)
    for old in dest.iterdir():
        if old.is_file():
            old.unlink()
    by_style = {}
    for wer, f, clear, _ in rows:
        style = re.sub(r"-(acestep|minimax|yue2|xl-sft).*$", "", f.stem).removeprefix("style-")
        by_style.setdefault(style, []).append((wer, f, clear))
    keep = 3 if len(by_style) == 1 else 1
    picks = [(style, take) for style, takes in by_style.items()
             for take in sorted(takes, key=lambda t: t[0])[:top or keep]]
    picks.sort(key=lambda p: p[1][0])
    if top:
        picks = picks[:top]
    for rank, (style, (wer, f, clear)) in enumerate(picks, 1):
        name = f"{rank:02d}_{style}_{clear}of{n_lines}-clear{f.suffix}"
        shutil.copyfile(f, dest / name)
        shutil.copyfile(f.with_suffix(f.suffix + ".lines.txt"), dest / f"{name}.lines.txt")
    (dest / "SOURCE.txt").write_text("\n".join(f"{style}: {f}" for style, (_, f, _) in picks) + "\n", encoding="utf-8")
    print(f"\nBest takes copied to {dest}", flush=True)

if __name__ == "__main__":
    sys.exit(main())
