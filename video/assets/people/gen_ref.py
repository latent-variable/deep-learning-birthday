"""Riso portraits from real reference photos: <image1> = photo (likeness), <image2> = riso style reference. python gen_ref.py [key ...]"""
import subprocess, sys, pathlib, shutil
ROOT = pathlib.Path(r'C:\AI\deep-learning-birthday'); HERE = pathlib.Path(__file__).parent; PY = str(ROOT / 'tools/whisper-venv/Scripts/python.exe')
PROMPT = ("Redraw the person from <image1> as a risograph print portrait illustration in the exact art style of <image2>: only fluorescent pink, riso blue and "
          "yellow inks plus navy line work on cream paper, halftone dot shading, slight ink misregistration, bold editorial line art, warm and flattering. "
          "Keep their exact likeness from <image1>: face shape, eyes, nose, smile, hairstyle and hairline, glasses if any, facial hair if any, age. "
          "Keep their clothing from <image1>. Copy ONLY the drawing style and colors from <image2>, never its person or clothes. Head and upper body, facing the viewer, friendly expression, plain flat cream paper background, nothing else, no text.")
SOLO = '--solo' in sys.argv
if SOLO:
    PROMPT = PROMPT.replace(' in the exact art style of <image2>', '').replace(' Copy ONLY the drawing style and colors from <image2>, never its person or clothes.', '')
EXTRA = {'jensen': ' He wears his signature black leather jacket over a black t-shirt.', 'sutskever': ' Close-up head and shoulders portrait.', 'hinton': ' Warm gentle smile.', 'feifei': ' Her face is smooth and softly lit with light, even shading; no dark marks, stubble or shadow anywhere around her mouth, jaw or chin.'}
for k in ([a for a in sys.argv[1:] if a != '--solo'] or sorted(p.stem for p in (HERE/'refs').glob('*.jpg'))):
    (HERE / 'ref_prompt.txt').write_text(PROMPT + EXTRA.get(k, ''), encoding='utf-8')
    subprocess.run([PY, str(ROOT/'scripts/comfy_run.py'), str(ROOT/'video/workflows/qwen21_edit_api.json'), '--set', f'10.image=@{HERE/"refs"/(k+".jpg")}',
        *( ['--drop', '11,12'] if SOLO else ['--set', f'11.image=@{HERE/"style_ref.png"}', '--drop', '12'] ), '--text', f'5.prompt={HERE/"ref_prompt.txt"}',
        '--text', f'5.negative_prompt={ROOT/"video/assets/char/style/neg.txt"}', '--set', '5.resolution=1024', '--set', '7.seed=4',
        '--set', f'9.filename_prefix=people/{k}_ref', '--out', str(HERE/'tmp')], check=True, capture_output=True)
    f = sorted((HERE/'tmp').glob(f'{k}_ref_*.png'))[-1]
    if (HERE/f'{k}.png').exists(): shutil.move(HERE/f'{k}.png', HERE/'text_version'/f'{k}.png')
    shutil.move(f, HERE/f'{k}.png'); print('ok', k, flush=True)
