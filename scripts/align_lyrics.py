"""Time-align a lyric sheet to a finished song for lyric videos.

Usage: align_lyrics.py <song.mp3> <lyrics.md|txt> <out_prefix> [--device cuda|cpu]
Transcribes with word timestamps, aligns the transcript to the lyric sheet word by word, and writes
<out_prefix>.json (per-line and per-word times plus section tags), .srt and .lrc. Lines Whisper
missed get times interpolated from their neighbours and are marked "interpolated".
"""
import argparse
import json
import sys
from pathlib import Path

import jiwer
from faster_whisper import WhisperModel

sys.path.insert(0, str(Path(__file__).parent))
from score_lyrics import normalize  # noqa: E402  (also sets up the CUDA DLL path)


def sheet_lines(text):
    """(section, display_text, normalized_words) for each sung line, in order."""
    if "[Intro]" in text:
        text = text[text.index("[Intro]"):]
    section, out = "", []
    for raw in text.splitlines():
        line = raw.strip()
        if line.startswith("["):
            section = line.strip("[]")
        elif line and not line.startswith(("#", "|", "-")):
            words = normalize(line.replace("(", " ").replace(")", " ")).split()
            if words:
                out.append((section, line, words))
    return out


def fmt_srt(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("song")
    ap.add_argument("lyrics")
    ap.add_argument("out_prefix")
    ap.add_argument("--device", default="cuda")
    args = ap.parse_args()

    lines = sheet_lines(Path(args.lyrics).read_text(encoding="utf-8"))
    model = WhisperModel("large-v3-turbo", device=args.device, compute_type="float16" if args.device == "cuda" else "int8")
    segments, _ = model.transcribe(args.song, language="en", word_timestamps=True, beam_size=5, vad_filter=False)
    heard = []  # (normalized word, start, end)
    for seg in segments:
        for w in seg.words:
            for token in normalize(w.word).split():
                heard.append((token, w.start, w.end))

    ref_words = [w for _, _, words in lines for w in words]
    owner = [i for i, (_, _, words) in enumerate(lines) for _ in words]
    times = [None] * len(ref_words)
    alignment = jiwer.process_words(" ".join(ref_words), " ".join(h[0] for h in heard)).alignments[0]
    for chunk in alignment:
        if chunk.type in ("equal", "substitute"):
            for k in range(chunk.ref_end_idx - chunk.ref_start_idx):
                j = chunk.hyp_start_idx + k
                if j < chunk.hyp_end_idx:
                    times[chunk.ref_start_idx + k] = (heard[j][1], heard[j][2], chunk.type == "equal")

    out_lines = []
    for i, (section, text, words) in enumerate(lines):
        idx = [k for k, o in enumerate(owner) if o == i]
        got = [times[k] for k in idx if times[k]]
        entry = {"section": section, "text": text, "words": [
            {"word": ref_words[k], "start": times[k][0], "end": times[k][1], "heard": times[k][2]} if times[k]
            else {"word": ref_words[k], "start": None, "end": None, "heard": False} for k in idx]}
        entry["start"], entry["end"] = (got[0][0], got[-1][1]) if got else (None, None)
        entry["interpolated"] = not got
        out_lines.append(entry)

    # Fill lines Whisper missed between their neighbours.
    for i, e in enumerate(out_lines):
        if e["start"] is None:
            prev_end = next((out_lines[k]["end"] for k in range(i - 1, -1, -1) if out_lines[k]["end"] is not None), 0.0)
            nxt = next((out_lines[k]["start"] for k in range(i + 1, len(out_lines)) if out_lines[k]["start"] is not None and not out_lines[k]["interpolated"]), prev_end + 2.0)
            e["start"], e["end"] = prev_end, max(prev_end + 0.5, nxt - 0.05)

    prefix = Path(args.out_prefix)
    prefix.with_suffix(".json").write_text(json.dumps(out_lines, indent=1), encoding="utf-8")
    prefix.with_suffix(".srt").write_text("\n".join(
        f"{n}\n{fmt_srt(e['start'])} --> {fmt_srt(e['end'])}\n{e['text']}\n" for n, e in enumerate(out_lines, 1)), encoding="utf-8")
    prefix.with_suffix(".lrc").write_text("\n".join(
        f"[{int(e['start'] // 60):02d}:{e['start'] % 60:05.2f}]{e['text']}" for e in out_lines) + "\n", encoding="utf-8")
    missed = [e["text"] for e in out_lines if e["interpolated"]]
    print(f"aligned {len(out_lines) - len(missed)}/{len(out_lines)} lines; interpolated: {missed}")


if __name__ == "__main__":
    main()
