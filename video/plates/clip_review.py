"""Tile LTX clips for review: each row = one clip, 8 frames (every 15 frames = 0.625 s). usage: clip_review.py out.jpg id [id ...]"""
import sys, subprocess, os
from PIL import Image, ImageDraw
out, ids = sys.argv[1], sys.argv[2:]
cw, ch, n = 240, 135, 8
sheet = Image.new('RGB', (cw * n + 170, ch * len(ids)), (25, 25, 25)); d = ImageDraw.Draw(sheet)
for r, cid in enumerate(ids):
    d.text((4, r * ch + 4), cid, fill=(255, 255, 255))
    folder = f'video/animation/assets/clips/{cid}'
    files = sorted(os.listdir(folder)) if os.path.isdir(folder) else []
    for i in range(n):
        k = i * 15
        if k < len(files):
            im = Image.open(os.path.join(folder, files[k])).convert('RGB').resize((cw, ch))
            sheet.paste(im, (170 + i * cw, r * ch)); d.text((174 + i * cw, r * ch + 2), f'{k / 24:.2f}s', fill=(255, 255, 0))
sheet.save(out, quality=85)
