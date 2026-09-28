import sys, glob, os
from PIL import Image, ImageDraw
files = sorted(glob.glob(sys.argv[1]))[int(sys.argv[3]) if len(sys.argv) > 3 else 0:][:int(sys.argv[4]) if len(sys.argv) > 4 else 999]
cols, w = 4, 480; h = 270
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * w, rows * (h + 22)), (30, 30, 30)); d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert('RGB'); im.thumbnail((w, h)); x, y = (i % cols) * w, (i // cols) * (h + 22)
    sheet.paste(im, (x, y + 22)); d.text((x + 4, y + 4), os.path.basename(f), fill=(255, 255, 255))
sheet.save(sys.argv[2], quality=88)
