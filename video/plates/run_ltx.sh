#!/usr/bin/env bash
# LTX-2.3 I2V (2-stage, 1920x1080, 121 frames) for plates. Usage: SEED=1 bash run_ltx.sh id [id ...]
cd /c/AI/deep-learning-birthday
PY=tools/whisper-venv/Scripts/python.exe
SEED=${SEED:-1}; PSEED=${PSEED:-5}
mkdir -p video/plates/ltx
for id in "$@"; do
  out=video/plates/ltx/${id}_l${SEED}.mp4; [ -f $out ] && continue
  $PY scripts/comfy_run.py video/workflows/ltx23_i2v_api.json --set 149.image=@video/plates/img/${id}_s${PSEED}.png \
    --text 121.text=video/plates/prompts/$id.motion.txt --text 110.text=video/workflows/ltx_neg.txt \
    --set 115.noise_seed=$((SEED*1000+1)) --set 114.noise_seed=$((SEED*1000+2)) --set 75.filename_prefix=ltx/$id --out video/plates/ltxtmp > /dev/null 2>&1
  f=$(ls -t video/plates/ltxtmp/${id}_*.mp4 2>/dev/null | head -1)
  [ -n "$f" ] && mv "$f" $out && echo "ok $id" || echo "FAIL $id"
done
echo LTX_DONE
