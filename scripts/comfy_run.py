"""Run a ComfyUI API graph with overrides, wait for it, and copy its outputs.

Usage:
  python comfy_run.py GRAPH.json [--set NODE.INPUT=VALUE ...] [--upload FILE ...] [--out DIR] [--server URL] [--name PREFIX]

  --set 4.text="a teen idol singing"      string/number/bool values are parsed as JSON when possible
  --set 9.image=@hero.png                  '@file' uploads the file to ComfyUI's input folder and sets its name
  --text 5.prompt=prompt.txt               read a long string input from a text file
  --out video/assets/tests                 where output files are copied (default: ./comfy_out)

Uses only the standard library, so any Python 3.10+ works. The default server is the unified music/video
ComfyUI at http://127.0.0.1:8189 (start it with scripts/start_music_comfyui.ps1).
"""
import argparse
import json
import shutil
import sys
import time
import urllib.request
import uuid
from pathlib import Path

COMFY_ROOT = Path(r"C:\AI\deep-learning-birthday\ComfyUI-music")


def upload(server, path):
    """Upload a local file to ComfyUI's input folder; returns the stored filename."""
    boundary = uuid.uuid4().hex
    data = Path(path).read_bytes()
    body = (f"--{boundary}\r\nContent-Disposition: form-data; name=\"image\"; filename=\"{Path(path).name}\"\r\n"
            f"Content-Type: application/octet-stream\r\n\r\n").encode() + data + \
           f"\r\n--{boundary}\r\nContent-Disposition: form-data; name=\"overwrite\"\r\n\r\ntrue\r\n--{boundary}--\r\n".encode()
    # /upload/image stores any file type (audio, video) in the input folder.
    req = urllib.request.Request(f"{server}/upload/image", data=body,
                                 headers={"Content-Type": f"multipart/form-data; boundary={boundary}"})
    return json.loads(urllib.request.urlopen(req).read())["name"]


def parse_value(server, raw):
    if raw.startswith("@"):
        return upload(server, raw[1:])
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return raw


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("graph")
    ap.add_argument("--set", action="append", default=[], metavar="NODE.INPUT=VALUE")
    ap.add_argument("--text", action="append", default=[], metavar="NODE.INPUT=FILE",
                    help="set a string input from a UTF-8 text file (avoids shell quoting for long prompts)")
    ap.add_argument("--drop", action="append", default=[], metavar="NODE[,NODE]")
    ap.add_argument("--out", default="comfy_out")
    ap.add_argument("--server", default="http://127.0.0.1:8189")
    ap.add_argument("--timeout", type=float, default=7200)
    args = ap.parse_args()

    graph = json.loads(Path(args.graph).read_text(encoding="utf-8-sig"))
    # --drop 11,12 removes optional nodes and every input that links to them (e.g. unused reference images).
    for node in [n for d in args.drop for n in d.split(",") if n]:
        graph.pop(node, None)
        for spec in graph.values():
            for key in [k for k, v in spec["inputs"].items() if isinstance(v, list) and v and str(v[0]) == node]:
                del spec["inputs"][key]
    for item in args.set:
        target, raw = item.split("=", 1)
        node, key = target.split(".", 1)
        graph[node]["inputs"][key] = parse_value(args.server, raw)
    for item in args.text:
        target, path = item.split("=", 1)
        node, key = target.split(".", 1)
        graph[node]["inputs"][key] = Path(path).read_text(encoding="utf-8-sig").strip()

    payload = json.dumps({"prompt": graph, "client_id": "comfy_run"}).encode()
    req = urllib.request.Request(f"{args.server}/prompt", data=payload, headers={"Content-Type": "application/json"})
    try:
        prompt_id = json.loads(urllib.request.urlopen(req).read())["prompt_id"]
    except urllib.error.HTTPError as e:
        sys.exit(f"ComfyUI rejected the graph: {e.read().decode()[:2000]}")
    started = time.time()
    print(f"queued {prompt_id}", flush=True)

    while True:
        time.sleep(3)
        hist = json.loads(urllib.request.urlopen(f"{args.server}/history/{prompt_id}").read()).get(prompt_id)
        if hist and hist.get("status", {}).get("status_str") == "error":
            sys.exit("failed: " + json.dumps(hist["status"].get("messages", []))[:3000])
        if hist and hist.get("status", {}).get("completed"):
            break
        if time.time() - started > args.timeout:
            sys.exit("timed out")

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    for node_out in hist["outputs"].values():
        for kind in ("images", "gifs", "video", "videos", "audio"):
            for f in node_out.get(kind, []):
                if f.get("type") == "temp":
                    continue
                src = COMFY_ROOT / "output" / f.get("subfolder", "") / f["filename"]
                if src.exists():
                    shutil.copy2(src, out / src.name)
                    print(f"output {out / src.name}", flush=True)
    print(f"done in {time.time() - started:.0f}s", flush=True)


if __name__ == "__main__":
    main()
