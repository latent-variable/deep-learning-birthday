#!/usr/bin/env bash
# After the plates finish: lip-syncs, then LTX motion for every plate in timeline order.
cd /c/AI/deep-learning-birthday
until grep -q PLATES_DONE cache/logs/plates.log; do sleep 20; done
bash video/plates/run_lipsync.sh ls_chorus1 c_close 84.76
bash video/plates/run_lipsync.sh ls_chorus2 c_close 123.16
bash video/plates/run_lipsync.sh ls_chorus3 c_close 174.36
bash video/plates/run_lipsync.sh ls_whisper b50_shh 168.46 video/plates/prompts/lipsync_whisper.txt
ids=$(tools/whisper-venv/Scripts/python.exe -c "import json;print(' '.join(p['id'] for p in json.load(open('video/plates/plates.json')) if p['id'] not in ('p00_hello','c_close','b50_shh')))")
bash video/plates/run_ltx.sh $ids
echo CHAIN_DONE
