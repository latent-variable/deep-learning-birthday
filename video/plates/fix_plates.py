"""Targeted fixes to existing plates: one Qwen edit per job with the current plate as <image1> (1 ref, 1024 px budget).
python fix_plates.py [job ...]   (jobs run in order; a job's source may be the output of an earlier job). Originals are kept once in rejected/*_pre_fix.png."""
import subprocess, sys, pathlib, shutil
ROOT = pathlib.Path(r'C:\AI\deep-learning-birthday'); HERE = pathlib.Path(__file__).parent
PY = str(ROOT / 'tools/whisper-venv/Scripts/python.exe'); EDIT = str(ROOT / 'video/workflows/qwen21_edit_api.json'); NEG = str(ROOT / 'video/assets/char/style/neg.txt')
MOUTH = ("her mouth is a tiny simple round 'o' drawn with a thin navy outline and filled with the same cream color as her face, like a cartoon; "
         "no lips, no lipstick, no pink or red on the mouth")
KEEP = "Keep everything else in <image1> exactly the same: composition, colors, confetti and the risograph print style with halftone dots."
# job: (source plate id, output plate id, prompt, seed)
JOBS = {
 'candles_lit': ('p01_candles', 'p01_candles', f"Edit <image1>: change only the girl's mouth: {MOUTH}. Her cheeks are slightly puffed, about to blow. Both hands rest flat on the table on "
                 f"either side of the cake. The fourteen graphics-card candles keep their lit flames. {KEEP}", 5),
 'candles_out': ('p01_candles', 'p01_candles_out', f"Edit <image1>: she has just blown out the candles. Every candle flame is gone; each wick has only a tiny dark burnt tip. Her square pixel eyes "
                 f"are squeezed shut as two happy curved lines, cheeks puffed, and {MOUTH}. Both hands stay resting flat on the table. The cake and the fourteen graphics-card candles stay "
                 f"in exactly the same place. {KEEP}", 5),
 'killswitch': ('b49_killswitch', 'b49_killswitch', "Edit <image1>: replace the tiny pink-haired girl running inside the hamster wheel with a tiny ordinary adult office worker: a man "
                "with short brown hair in a grey hoodie, jeans and white sneakers, an ID badge on a lanyard, running hard inside the wheel mid-stride, drawn with clear simple anatomy. "
                "Exactly one girl in the image: the big girl on the left pressing the red button stays exactly the same. The red button, the pedestal, the loop arrow and the wheel stay "
                f"exactly the same. {KEEP}", 5),
 # the ski shot is animated in code: an empty slope + Lexi on her board as a cutout that rides the loss curve
 'ski_bg': ('c_ski', 'c_ski_bg', "Edit <image1>: remove the girl and her snowboard completely, and the pink snow spray behind her. Fill in the empty snowy slope, the mountains and the "
            f"cream sky where she was. The big blue curved line of the slope and the golden star badge stay exactly where they are. {KEEP}", 5),
 'ski_girl': ('c_ski', 'c_ski_girl', "Edit <image1>: keep only the girl riding her snowboard, in exactly the same pose, size and drawing; remove everything else (the slope, the blue curve, "
              "the mountains, the snow spray and the star) and put her on a plain flat solid bright green background. Her whole snowboard is visible.", 5),
}
def run(job):
    src, dst, prompt, seed = JOBS[job]
    img = HERE / 'img' / f'{src}_s5.png'; bak = HERE / 'rejected' / f'{src}_s5_pre_fix.png'
    if not bak.exists(): shutil.copy(img, bak)
    pf = HERE / 'tmp' / f'fix_{job}.txt'; pf.parent.mkdir(exist_ok=True); pf.write_text(prompt, encoding='utf-8')
    subprocess.run([PY, str(ROOT / 'scripts/comfy_run.py'), EDIT, '--set', f'10.image=@{bak}', '--drop', '11,12',
                    '--text', f'5.prompt={pf}', '--text', f'5.negative_prompt={NEG}', '--set', '5.resolution=1024', '--set', f'7.seed={seed}',
                    '--set', f'9.filename_prefix=fix/{job}', '--out', str(HERE / 'tmp')], check=True, capture_output=True)
    out = sorted((HERE / 'tmp').glob(f'{job}_*.png'))[-1]; shutil.copy(out, HERE / 'img' / f'{dst}_s5.png'); print('ok', job, '->', dst, flush=True)
for j in ([a for a in sys.argv[1:]] or JOBS): run(j)
