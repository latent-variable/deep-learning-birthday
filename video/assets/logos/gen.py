"""Riso-printed sticker versions of the logos, for the tribute. python gen.py [key ...]"""
import subprocess, sys, pathlib, shutil
ROOT = pathlib.Path(r'C:\AI\deep-learning-birthday'); HERE = pathlib.Path(__file__).parent
PY = str(ROOT / 'tools/whisper-venv/Scripts/python.exe')
STYLE = ("printed as a risograph sticker using only fluorescent pink, riso blue, sunflower yellow and navy inks, halftone texture, slight ink misregistration, "
         "centered alone on a plain flat cream paper background, accurate logo shape and spelling, clean and legible, nothing else in the image.")
LOGOS = {
 'nvidia':   "The NVIDIA logo: the eye-shaped swirl symbol next to the bold NVIDIA wordmark,",
 'google':   "The Google wordmark logo, the word Google in its classic rounded sans-serif letters,",
 'deepmind': "The Google DeepMind logo, its rounded abstract symbol next to the words Google DeepMind,",
 'openai':   "The OpenAI logo, the interlocking hexagonal knot blossom symbol next to the word OpenAI,",
 'microsoft':"The Microsoft logo, the four-square window grid next to the word Microsoft,",
 'meta':     "The Meta logo, the infinity loop symbol next to the word Meta,",
 'huggingface': "The Hugging Face logo: the smiling yellow hugging emoji face with two hands, next to the words Hugging Face spelled exactly H-u-g-g-i-n-g F-a-c-e,",
 'deepseek': "The DeepSeek logo: a stylized blue whale symbol next to the lowercase word deepseek,",
 'anthropic':"The Anthropic wordmark logo, the word ANTHROPIC in wide spaced capitals,",
 'imagenet': "A badge that reads IMAGENET with a small grid of tiny photo thumbnails,",
 'uoft':     "A university crest badge that reads UNIVERSITY OF TORONTO,",
 'baidu':    "The Baidu logo, the bear paw print symbol next to the word Baidu,",
 'midjourney': "The Midjourney logo, a simple sailboat symbol next to the word Midjourney,",
 'replit':   "The Replit logo, its stacked-blocks symbol next to the word replit,",
 'chatgpt':  "A chat app icon badge with the OpenAI knot symbol and the word ChatGPT,",
 'gtx580':   "A retro graphics card box art badge that reads GeForce GTX 580,",
 'arxiv':    "The arXiv logo, the word arXiv in its serif letterforms,",
 'nobel':    "A shiny gold medal with a raised profile portrait of a bearded old man, a completely smooth blank rim with no letters, numbers or engraving,",
}
SEED = int(__import__('os').environ.get('SEED', 3))
def run(key):
    out = HERE / f'{key}.png'
    if out.exists(): return
    (HERE / f'{key}.txt').write_text(LOGOS[key] + ' ' + STYLE, encoding='utf-8')
    subprocess.run([PY, str(ROOT/'scripts/comfy_run.py'), str(ROOT/'video/workflows/qwen21_t2i_api.json'), '--text', f'5.prompt={HERE/(key+".txt")}',
        '--text', f'5.negative_prompt={ROOT/"video/assets/char/style/neg.txt"}', '--set', '6.width=1024', '--set', '6.height=768', '--set', f'7.seed={SEED}',
        '--set', f'9.filename_prefix=logos/{key}', '--out', str(HERE/'tmp')], check=True, capture_output=True)
    f = sorted((HERE/'tmp').glob(f'{key}_*.png'))[-1]; shutil.move(f, out); print('ok', key, flush=True)
for k in (sys.argv[1:] or LOGOS): run(k)
