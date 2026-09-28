"""Transparent cutouts via Qwen remove-bg, trimmed to the alpha box. usage: cutout_batch.py SRC_DIR OUT_DIR [names...]"""
import subprocess, sys, pathlib, shutil
import numpy as np
from PIL import Image
ROOT = pathlib.Path(r'C:\AI\deep-learning-birthday'); PY = str(ROOT / 'tools/whisper-venv/Scripts/python.exe')
src, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
names = sys.argv[3:] or [p.stem for p in sorted(src.glob('*.png')) if p.stem != 'test']
for n in names:
    dst = out / f'{n}.png'
    if dst.exists(): continue
    tmp = src / 'cut'; tmp.mkdir(exist_ok=True)
    subprocess.run([PY, str(ROOT/'scripts/comfy_run.py'), str(ROOT/'video/workflows/qwen21_remove_bg_api.json'), '--set', f'10.image=@{src/(n+".png")}',
                    '--set', '5.resolution=1024', '--set', f'9.filename_prefix=cut/{n}', '--out', str(tmp)], check=True, capture_output=True)
    f = sorted(tmp.glob(f'{n}_*.png'))[-1]
    a = np.array(Image.open(f).convert('RGBA')); m = a[:, :, 3] > 20; ys, xs = np.nonzero(m)
    a = a[max(0, ys.min() - 4):ys.max() + 5, max(0, xs.min() - 4):xs.max() + 5]
    Image.fromarray(a).save(dst); print('ok', n, a.shape[1], a.shape[0], flush=True)
