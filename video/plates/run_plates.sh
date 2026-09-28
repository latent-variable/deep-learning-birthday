#!/usr/bin/env bash
# Generate every plate missing from video/plates/img (seed via SEED env, default 5). Usage: bash run_plates.sh [id ...]
cd /c/AI/deep-learning-birthday
PY=tools/whisper-venv/Scripts/python.exe
SEED=${SEED:-5}
ids=("$@"); [ ${#ids[@]} -eq 0 ] && ids=($($PY -c "import json;print(' '.join(p['id'] for p in json.load(open('video/plates/plates.json'))))"))
mkdir -p video/plates/img
for id in "${ids[@]}"; do
  [ -f video/plates/img/${id}_s${SEED}.png ] && continue
  $PY scripts/comfy_run.py video/workflows/qwen21_edit_api.json --set 10.image=@video/assets/char/lexi_riso_sheet.png --drop 11,12 \
    --text 5.prompt=video/plates/prompts/$id.txt --text 5.negative_prompt=video/assets/char/style/neg.txt \
    --set 5.resolution=1280 --set 7.seed=$SEED --set 9.filename_prefix=plates/$id --out video/plates/tmp > /dev/null 2>&1
  f=$(ls -t video/plates/tmp/${id}_*.png 2>/dev/null | head -1)
  [ -n "$f" ] && mv "$f" video/plates/img/${id}_s${SEED}.png && echo "ok $id" || echo "FAIL $id"
done
echo PLATES_DONE
