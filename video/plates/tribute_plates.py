"""Tribute plates in two light steps (≤ 2 reference images per job, 1024 px budget — keeps VRAM ~16 GB):
  1. base scene: Lexi (<image1> = her sheet) with stand-in characters
  2. one edit per real person: <image1> = the scene, <image2> = their riso portrait → "replace the <role> with the person from <image2>"
python tribute_plates.py [id ...]   (use ComfyUI's venv python: needs PIL). Originals are kept once in rejected/*_pre_tribute.png."""
import subprocess, sys, pathlib, shutil
ROOT = pathlib.Path(r'C:\AI\deep-learning-birthday'); HERE = pathlib.Path(__file__).parent
PY = str(ROOT / 'tools/whisper-venv/Scripts/python.exe'); PPL = ROOT / 'video/assets/people'
EDIT = str(ROOT / 'video/workflows/qwen21_edit_api.json'); NEG = str(ROOT / 'video/assets/char/style/neg.txt')
LEXI = ("the girl from <image1> (keep her exact design: pink hair with two round cooling-fan buns, abstract face with square pixel eyes with plus highlights, "
        "pink bomber jacket with blue and yellow panels and 15.3, blue pleated skirt, platform sneakers)")
STYLE = (" Draw ONE single wide 16:9 illustration (not a character sheet) with only ONE girl, in the exact art style of <image1>: risograph print with only fluorescent "
         "pink, riso blue and yellow inks plus navy line work on cream paper, halftone dots, slight misregistration, stylish editorial zine look. "
         "Full-bleed illustration, no caption band. No text unless described.")
# id: (base scene, [(person, role description used in the replace step), ...])
PLATES = {
 'p06_nursery': (f"Scene: a hospital nursery in December 2012. A tiny baby version of {LEXI} lies in a bassinet in the center with a name card that reads \"SUPERVISION\". "
   "Standing around the bassinet like proud new parents: on the left a young man with short dark hair and a beard in a grey hoodie holding a rattle shaped like a graphics card; "
   "in the middle behind the bassinet a man with a shaved balding head and a short beard in a blue suit, leaning in with a curious smile; on the right a tall elderly "
   "man with white hair in a blue sweater, beaming like a proud father. Balloons, warm and funny.",
   [('krizhevsky', 'the young man on the left in the grey hoodie'), ('sutskever', 'the balding man in the middle in the blue suit'), ('hinton', 'the white-haired man on the right')]),
 'p34_nobel': (f"Scene: a Nobel Prize ceremony stage with golden light and confetti. On the left an elderly white-haired man in a dark sweater wears a gold Nobel medal and laughs; "
   f"in the middle {LEXI} hugs him proudly like a daughter; on the right a bald man with glasses and a short beard in a navy suit also wears a gold Nobel medal and gives her a high five.",
   [('hinton', 'the white-haired man on the left'), ('hassabis', 'the bald man with glasses on the right')]),
 'p33_ceo': (f"Scene: a glass boardroom. A slim man in a navy suit spins around in an executive office chair that is rotating out through a revolving door, calendar pages "
   f"flying through the air. {LEXI} sits cross-legged on the boardroom table eating popcorn, watching the drama with delight.",
   [('altman', 'the man in the office chair')]),
 'p13_go': (f"Scene: across a wooden Go board. {LEXI} on the right slams down a single glowing black stone with a shockwave rippling across the board; across the board on the "
   "left a young Korean man with a black bob haircut in a dark suit stares at the stone, stunned, hand on his chin. Dramatic and respectful.",
   [('leesedol', 'the man on the left side')]),
 'p44_answerkey': (f"Scene: the entrance of a building whose big front door is a giant yellow hugging-face emoji: the classic Hugging Face logo face with two simple curved happy arcs for eyes (not square eyes), a big open smile and two hands hugging its cheeks. {LEXI} tiptoes out on the left holding "
   "a glowing golden envelope, caught red-handed and grinning sheepishly; on the right a man with grey hair and glasses in a black leather jacket cheerfully slaps a big red SOLD sign onto the door.",
   [('jensen', 'the man in the black leather jacket on the right')]),
 'p04_podium': (f"Scene: a winners podium under stadium spotlights. {LEXI} stands on the tall first place block holding up a big trophy, smug; on the right beside the podium a woman "
   "with shoulder-length dark hair in a dark blazer applauds proudly like her teacher. On the much lower second place block a clunky old boxy robot made of arrows and histograms slumps.",
   [('feifei', 'the woman applauding on the right')]),
 'c_lino': (f"Scene: a joyful birthday stage with confetti, streamers and a big cake in the background. On the right, {LEXI} leaps up mid-dance and gives a big "
   "high five to a man on the left: a man in his thirties with short dark wavy hair, round wire glasses, a mustache and short beard, wearing a colorful short-sleeve "
   "button shirt covered in a pattern of little cartoon cats, laughing and dancing. Their palms meet in the center with a burst of sparkles. Both full body, energetic dance poses.",
   [('lino', 'the man with round glasses on the left')]),
 'p30_users': (f"Scene: a hillside at night with an endless queue of tiny happy people lining up toward a giant glowing chat bubble. {LEXI} sits cross-legged on top of the "
   "chat bubble with both legs tucked in naturally, waving to the crowd, delighted and overwhelmed. Exactly one girl in the whole image. Natural anatomy, no stretched limbs.", []),
}
REPLACE = ("Replace {role} in <image1> with the person from <image2>: exactly the face, hair and facial features shown in <image2> (add no accessories that are not in <image2>), drawn in the risograph ink style "
           "of <image1>. Keep the girl, the setting and everything else in <image1> unchanged.")
FACE_NOTE = {'feifei': ' Her face is smooth and softly lit with light, even shading; no dark marks, stubble or shadow anywhere around her mouth, jaw or chin.'}
def ref_of(k):   # a real photo is a much stronger identity signal than the riso portrait
    p = PPL / 'refs' / f'{k}.jpg'
    return p if p.exists() else PPL / f'{k}.png'

def job(images, prompt_text, prefix, seed):
    pf = HERE / 'tmp' / f'{prefix.replace("/", "_")}.txt'; pf.parent.mkdir(exist_ok=True); pf.write_text(prompt_text, encoding='utf-8')
    args = [PY, str(ROOT/'scripts/comfy_run.py'), EDIT, '--set', f'10.image=@{images[0]}']
    args += ['--set', f'11.image=@{images[1]}', '--drop', '12'] if len(images) > 1 else ['--drop', '11,12']
    args += ['--text', f'5.prompt={pf}', '--text', f'5.negative_prompt={NEG}', '--set', '5.resolution=1024', '--set', f'7.seed={seed}',
             '--set', f'9.filename_prefix=tribute/{prefix}', '--out', str(HERE/'tmp')]
    subprocess.run(args, check=True, capture_output=True)
    return sorted((HERE/'tmp').glob(f'{prefix.split("/")[-1]}_*.png'))[-1]

def run(pid, seed=5):
    scene, people = PLATES[pid]
    base = sorted((HERE/'tmp').glob(f'{pid}_base_*.png'))
    cur = base[-1] if '--reuse-base' in sys.argv and base else job([ROOT/'video/assets/char/lexi_riso_sheet.png'], f"Using {LEXI}, {scene}{STYLE}", f'{pid}_base', seed)
    for k, role in people:
        cur = job([cur, ref_of(k)], REPLACE.format(role=role) + FACE_NOTE.get(k, ''), f'{pid}_{k}', seed + 3)
    out = HERE/'img'/f'{pid}_s5.png'; bak = HERE/'rejected'/f'{pid}_s5_pre_tribute.png'
    if out.exists() and not bak.exists(): shutil.move(out, bak)
    shutil.copy(cur, out); print('ok', pid, flush=True)

for p in ([a for a in sys.argv[1:] if not a.startswith('--')] or PLATES): run(p)
