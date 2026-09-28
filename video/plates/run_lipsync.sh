#!/usr/bin/env bash
# InfiniteTalk lip sync (2 chunks ≈ 6.1 s @25fps, 832x480) of a plate on an isolated-vocal slice.
# usage: bash run_lipsync.sh OUT_ID PLATE_ID START_SECONDS [PROMPT_FILE]
cd /c/AI/deep-learning-birthday; export PATH=/c/AI/ffmpeg:$PATH
PY=tools/whisper-venv/Scripts/python.exe; id=$1; plate=$2; ss=$3; pf=${4:-video/plates/prompts/lipsync.txt}
out=video/plates/lipsync/$id.mp4; [ -f $out ] && { echo "have $id"; exit 0; }
wav=video/plates/audio/$id.wav
ffmpeg -loglevel error -y -ss $ss -t 6.25 -i music/stems/vocals.flac -ac 1 -ar 16000 $wav
# plate → 16:9 832x480 crop so the face is big
img=video/plates/audio/$id.png
ffmpeg -loglevel error -y -i video/plates/img/${plate}_s5.png -vf "scale=832:480:force_original_aspect_ratio=increase,crop=832:480" $img
$PY scripts/comfy_run.py video/workflows/infinitetalk_single_api.json --set 7.image=@$img --set 8.audio=@$wav --text 10.text=$pf \
  --set 24.noise_seed=11 --set 34.noise_seed=12 --set 42.filename_prefix=lipsync/$id --out video/plates/lstmp
f=$(ls -t video/plates/lstmp/${id}_*.mp4 2>/dev/null | head -1)
[ -n "$f" ] || { echo "FAIL $id"; exit 1; }
# re-mux with the FULL-MIX slice (the clip's own audio is the vocal stem) for review
ffmpeg -loglevel error -y -i $f -ss $ss -t 6.25 -i music/final/happy-birthday-to-me-deep-learning.mp3 -map 0:v -map 1:a -c:v copy -c:a aac -shortest $out && echo "ok $id"
