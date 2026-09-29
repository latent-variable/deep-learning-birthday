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
 # the human in the loop is the director (<image2> = the director's photo, video/assets/people/refs/lino.jpg, not in the repo)
 'killswitch_lino': ('b49_killswitch', 'b49_killswitch', "Edit <image1>: change the tiny man running inside the hamster wheel into the man from <image2>. Replace his grey hoodie "
                     "with the colorful short-sleeve button-up shirt covered in little cartoon cats that the man in <image2> wears, and remove the ID badge and lanyard. Give him the face "
                     "and hair of the man in <image2>: round wire glasses, dark wavy hair, a dark mustache and short beard, warm tan skin. Dark jeans and sneakers, running hard mid-stride "
                     "with a slightly frantic grin, clear simple anatomy, drawn in the same risograph ink style as <image1>. The big girl on the left, the red button, the pedestal, "
                     f"the loop arrow and the wheel stay exactly the same. {KEEP}", 5,
                     ROOT / 'video/assets/people/refs/lino.jpg', HERE / 'rejected/b49_killswitch_s5_before_killswitch_lino.png'),
 # the director in the loop: the wheel emptied, and two running poses of him (composited in code, alternating on the beat)
 'killswitch_empty': ('b49_killswitch', 'b49_killswitch_empty', "Edit <image1>: remove the tiny figure running inside the hamster wheel completely; the inside of the wheel is empty and shows "
                      f"the night city behind it. The floor stays smooth flat cream paper. Keep everything else exactly the same: the big girl on the left, the red button, the pedestal, the loop arrow and the wheel. {KEEP}", 5,
                      None, HERE / "rejected/b49_killswitch_s5_pre_fix.png"),
 'lino_run_a': ('lino_run', 'lino_run_a', 'Redraw the man from <image1> as a small full-body risograph print sticker in the exact art style of <image2>: fluorescent pink, riso blue and yellow inks with navy line work, halftone dots. Keep his exact likeness from <image1>: round wire glasses, dark wavy hair, mustache and short beard, warm tan skin, and his colorful short-sleeve shirt with little cartoon cats. Dark jeans and white sneakers. Side view, running hard to the right with a slightly frantic grin, left leg stretched forward and right leg pushing off behind, right arm swinging forward, clear simple anatomy, whole body visible from head to sneakers. Copy only the drawing style from <image2>, never its person. Plain flat solid bright green background, nothing else, no text.', 5,
                ROOT / 'video/assets/people/style_ref.png', ROOT / 'video/assets/people/refs/lino.jpg'),
 'lino_run_b': ('lino_run', 'lino_run_b', 'Redraw the man from <image1> as a small full-body risograph print sticker in the exact art style of <image2>: fluorescent pink, riso blue and yellow inks with navy line work, halftone dots. Keep his exact likeness from <image1>: round wire glasses, dark wavy hair, mustache and short beard, warm tan skin, and his colorful short-sleeve shirt with little cartoon cats. Dark jeans and white sneakers. Side view, running hard to the right with a slightly frantic grin, mid-stride with both knees bent and feet passing under him, left arm swinging forward, clear simple anatomy, whole body visible from head to sneakers. Copy only the drawing style from <image2>, never its person. Plain flat solid bright green background, nothing else, no text.', 5,
                ROOT / 'video/assets/people/style_ref.png', ROOT / 'video/assets/people/refs/lino.jpg'),
 # the ending: joy, not tears. Same framing so the edit still lands; she beams and offers the cake to us
 'cake_joy': ('o_cake', 'o_cake', "Edit <image1>: change only the girl's face and the cake: no tears at all, a huge beaming open-mouthed happy grin, her square pixel eyes turned into two "
              "happy upward arcs, rosy blushing cheeks, and she lifts the birthday cake up toward the viewer with both hands as if offering us a slice. The candles are lit. "
              f"Keep her outfit, her pose, the confetti, the framing and the risograph print style exactly the same. {KEEP}", 5),
}
def run(job):
    src, dst, prompt, seed, *extra = JOBS[job]; ref, base = (extra + [None, None])[:2]
    img = HERE / 'img' / f'{src}_s5.png'; bak = HERE / 'rejected' / f'{src}_s5_pre_fix.png'
    if base: bak = base   # edit a specific earlier version of the plate (or a photo)
    elif not bak.exists(): shutil.copy(img, bak)
    pf = HERE / 'tmp' / f'fix_{job}.txt'; pf.parent.mkdir(exist_ok=True); pf.write_text(prompt, encoding='utf-8')
    subprocess.run([PY, str(ROOT / 'scripts/comfy_run.py'), EDIT, '--set', f'10.image=@{bak}', *(['--set', f'11.image=@{ref}', '--drop', '12'] if ref else ['--drop', '11,12']),
                    '--text', f'5.prompt={pf}', '--text', f'5.negative_prompt={NEG}', '--set', '5.resolution=1024', '--set', f'7.seed={seed}',
                    '--set', f'9.filename_prefix=fix/{job}', '--out', str(HERE / 'tmp')], check=True, capture_output=True)
    out = sorted((HERE / 'tmp').glob(f'{job}_0*.png'))[-1]; shutil.copy(out, HERE / 'img' / f'{dst}_s5.png'); shutil.copy(out, HERE / 'tmp' / f'seed{seed}_{job}.png'); print('ok', job, '->', dst, flush=True)
SEED = int(next((a[7:] for a in sys.argv if a.startswith('--seed=')), 0))
for j in ([a for a in sys.argv[1:] if not a.startswith('--')] or JOBS):
    if SEED: JOBS[j] = (*JOBS[j][:3], SEED, *JOBS[j][4:])
    run(j)
