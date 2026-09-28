#!/usr/bin/env bash
cd /c/AI/deep-learning-birthday; PY=tools/whisper-venv/Scripts/python.exe; D=video/assets/sheets
for s in poses1 poses2 heads2; do
  [ -f $D/$s.png ] || { $PY scripts/comfy_run.py video/workflows/qwen21_edit_api.json --set 10.image=@video/assets/char/lexi_riso_sheet.png --drop 11,12 --text 5.prompt=$D/$s.txt --text 5.negative_prompt=video/assets/char/style/neg.txt --set 5.resolution=1440 --set 7.seed=3 --set 9.filename_prefix=sheets/$s --out $D/tmp >/dev/null && mv $(ls -t $D/tmp/${s}_*.png | head -1) $D/$s.png && echo ok $s; }
done
for s in props1 props2; do
  [ -f $D/$s.png ] || { $PY scripts/comfy_run.py video/workflows/qwen21_t2i_api.json --text 5.prompt=$D/$s.txt --text 5.negative_prompt=video/assets/char/style/neg.txt --set 6.width=1920 --set 6.height=1088 --set 7.seed=3 --set 9.filename_prefix=sheets/$s --out $D/tmp >/dev/null && mv $(ls -t $D/tmp/${s}_*.png | head -1) $D/$s.png && echo ok $s; }
done
for s in poses1 poses2 heads2 props1 props2; do
  [ -f $D/${s}_rgba.png ] || { $PY scripts/comfy_run.py video/workflows/qwen21_remove_bg_api.json --set 10.image=@$D/$s.png --set 5.resolution=1440 --set 9.filename_prefix=sheets/${s}_rgba --out $D/tmp >/dev/null && mv $(ls -t $D/tmp/${s}_rgba_*.png | head -1) $D/${s}_rgba.png && echo ok ${s}_rgba; }
done
echo SHEETS_DONE
