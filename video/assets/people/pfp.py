"""Profile-picture variants of the director in the riso style (≤ 2 refs per job). python pfp.py  → assets/people/pfp/*.png (square crops made separately)."""
import subprocess, pathlib, shutil
ROOT = pathlib.Path(r'C:\AI\deep-learning-birthday'); HERE = pathlib.Path(__file__).parent; PY = str(ROOT / 'tools/whisper-venv/Scripts/python.exe')
PHOTO, STYLE, LEXI = HERE / 'refs/lino.jpg', HERE / 'style_ref.png', ROOT / 'video/assets/char/lexi_riso_sheet.png'
INKS = ("risograph print illustration: only fluorescent pink, riso blue and yellow inks plus navy line work on cream paper, halftone dot shading, "
        "slight ink misregistration, bold editorial zine line art, warm and flattering")
LIKE = ("Keep his exact likeness from <image1>: face shape, eyes, nose, smile, hairstyle and hairline, round glasses, mustache and beard, age. Keep his clothing from <image1>.")
SOLO = (f"Redraw the man from <image1> as a {INKS}, in the exact art style of <image2>. {LIKE} Copy ONLY the drawing style and colors from <image2>, never its person or clothes. "
        "Centered head and shoulders portrait for a profile picture, facing the viewer, big genuine grin, {bg}, nothing else, no text.")
DUO = (f"A square {INKS}. On the left the man from <image1>; {LIKE} On the right, cheek to cheek with him, the girl from <image2> (keep her exact design: pink hair with two "
       "round cooling-fan buns, abstract face with square pixel eyes with plus highlights, pink bomber jacket with blue and yellow panels and 15.3). Both grin at the viewer "
       "and wear tiny striped party hats, a little confetti around them. Centered head and shoulders composition for a profile picture, flat {bg}, no text.")
SOLO1 = SOLO.replace(', in the exact art style of <image2>', '').replace(' Copy ONLY the drawing style and colors from <image2>, never its person or clothes.', '')
JOBS = [('lino_solo_cream', SOLO1.format(bg='plain flat cream paper background'), [PHOTO], 4),
        ('lino_solo_pink', SOLO.format(bg='solid flat fluorescent pink background'), [PHOTO, STYLE], 7),
        ('lino_lexi_a', DUO.format(bg='fluorescent yellow background'), [PHOTO, LEXI], 5),
        ('lino_lexi_b', DUO.format(bg='riso blue background'), [PHOTO, LEXI], 9)]
out = HERE / 'pfp'; out.mkdir(exist_ok=True)
import sys
for name, prompt, imgs, seed in [j for j in JOBS if len(sys.argv) < 2 or j[0] in sys.argv[1:]]:
    pf = HERE / 'tmp' / f'{name}.txt'; pf.parent.mkdir(exist_ok=True); pf.write_text(prompt, encoding='utf-8')
    subprocess.run([PY, str(ROOT/'scripts/comfy_run.py'), str(ROOT/'video/workflows/qwen21_edit_api.json'), '--set', f'10.image=@{imgs[0]}', *(['--set', f'11.image=@{imgs[1]}', '--drop', '12'] if len(imgs) > 1 else ['--drop', '11,12']), '--text', f'5.prompt={pf}', '--text', f'5.negative_prompt={ROOT/"video/assets/char/style/neg.txt"}', '--set', '5.resolution=1024',
        '--set', f'7.seed={seed}', '--set', f'9.filename_prefix=people/{name}', '--out', str(HERE/'tmp')], check=True, capture_output=True)
    shutil.copy(sorted((HERE/'tmp').glob(f'{name}_*.png'))[-1], out / f'{name}.png'); print('ok', name, flush=True)
