"""Riso caricature portraits of real people for the tribute. python gen.py [key ...]"""
import subprocess, sys, pathlib, shutil
ROOT = pathlib.Path(r'C:\AI\deep-learning-birthday'); HERE = pathlib.Path(__file__).parent
PY = str(ROOT / 'tools/whisper-venv/Scripts/python.exe')
STYLE = ("Risograph print portrait illustration, only fluorescent pink, riso blue and yellow inks plus navy line work on cream paper, "
         "halftone dot shading, slight ink misregistration, bold confident editorial line art, warm flattering celebratory caricature, "
         "head and upper body, facing the viewer, plain flat cream paper background, no text. ")
PEOPLE = {
 'hinton':   "Geoffrey Hinton, the godfather of deep learning: tall elderly British computer scientist, short white hair swept back, high forehead, kind wry smile, blue cardigan over a collared shirt.",
 'hassabis': "Demis Hassabis, DeepMind co-founder: British man in his late forties, short dark receding hair, warm intelligent eyes, friendly smile, dark blazer over a navy sweater.",
 'sutskever':"Ilya Sutskever: man with a shaved balding head, dark thick eyebrows, intense thoughtful eyes, slight smile, dark t-shirt.",
 'krizhevsky':"Alex Krizhevsky, creator of AlexNet: young man in his twenties with short dark hair, short dark beard, calm shy smile, plain grey hoodie.",
 'feifei':   "Fei-Fei Li, creator of ImageNet: woman with shoulder-length straight black hair, warm confident smile, simple dark blazer.",
 'lecun':    "Yann LeCun: man with grey hair, rectangular glasses, amused smile, dark jacket.",
 'bengio':   "Yoshua Bengio: man with curly grey hair and a short grey beard, gentle eyes, dark sweater.",
 'jensen':   "Jensen Huang, NVIDIA CEO: man with short black-grey hair, big confident grin, his signature black leather jacket over a black t-shirt.",
 'leesedol': "Lee Sedol, Go world champion: Korean man with short black hair, thoughtful expression, dark suit, holding a single white Go stone between two fingers.",
 'altman':   "Sam Altman: slim man with short dark hair, calm half smile, plain grey crewneck sweater.",
 'goodfellow':"Ian Goodfellow, inventor of GANs: man with short dark hair and a short beard, friendly smile, casual button shirt.",
 'jumper':   "John Jumper, AlphaFold lead: man with short hair, glasses and a full beard, cheerful smile, casual shirt.",
}
def run(key):
    out = HERE / f'{key}.png'
    if out.exists(): return
    (HERE / f'{key}.txt').write_text(STYLE + 'Portrait of ' + PEOPLE[key], encoding='utf-8')
    subprocess.run([PY, str(ROOT/'scripts/comfy_run.py'), str(ROOT/'video/workflows/qwen21_t2i_api.json'), '--text', f'5.prompt={HERE/(key+".txt")}',
        '--text', f'5.negative_prompt={ROOT/"video/assets/char/style/neg.txt"}', '--set', '6.width=1024', '--set', '6.height=1024', '--set', '7.seed=4',
        '--set', f'9.filename_prefix=people/{key}', '--out', str(HERE/'tmp')], check=True, capture_output=True)
    f = sorted((HERE/'tmp').glob(f'{key}_*.png'))[-1]; shutil.move(f, out); print('ok', key, flush=True)
for k in (sys.argv[1:] or PEOPLE): run(k)
