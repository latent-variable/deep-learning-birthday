"""Split an RGBA sticker sheet into separate cutouts, dropping thin stray lines (brackets) via morphological opening.
usage: split_sheet.py sheet_rgba.png out_prefix [min_area]"""
import sys, numpy as np
from PIL import Image
from scipy import ndimage
src, pre = sys.argv[1], sys.argv[2]; min_area = int(sys.argv[3]) if len(sys.argv) > 3 else 15000
im = Image.open(src).convert('RGBA'); A = np.array(im)
mask = A[:, :, 3] > 40
core = ndimage.binary_opening(mask, iterations=4)            # thin lines vanish
lab, n = ndimage.label(ndimage.binary_dilation(core, iterations=10))
objs = ndimage.find_objects(lab); boxes = []
for i, s in enumerate(objs):
    comp = (lab[s] == i + 1) & mask[s]
    if comp.sum() < min_area: continue
    boxes.append((s, i + 1))
boxes.sort(key=lambda b: (b[0][0].start // 250, b[0][1].start))
for k, (s, li) in enumerate(boxes):
    keep = ndimage.binary_dilation(lab[s] == li, iterations=2) & mask[s]
    # keep only pieces attached to the main body (drop leftover bracket strokes)
    l2, n2 = ndimage.label(keep); sizes = ndimage.sum(keep, l2, range(1, n2 + 1))
    keep = np.isin(l2, [j + 1 for j, z in enumerate(sizes) if z > 0.02 * sizes.max()])
    crop = A[s].copy(); crop[:, :, 3] = np.where(keep, crop[:, :, 3], 0)
    ys, xs = np.nonzero(crop[:, :, 3] > 10); crop = crop[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    Image.fromarray(crop).save(f'{pre}_{k}.png'); print(k, crop.shape[1], crop.shape[0])
