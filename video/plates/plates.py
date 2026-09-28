"""Plate list: one riso illustration per lyric beat, generated with Qwen-Image 2.1 edit using Lexi's sheet as <image1>.

python video/plates/plates.py            -> writes plates.json (and prompt txt files)
Each plate: id, t0/t1 (song seconds it covers), stamp (the LIVE date), scene (prompt body), motion (for LTX I2V).
"""
import json
from pathlib import Path

HERE = Path(__file__).parent

STYLE = ("Using the girl from <image1>, keep her exact design: pink hair with two round buns that are computer cooling fans, "
         "abstract face with two square pixel eyes with plus-shaped highlights and a small mouth, pink cropped bomber jacket with blue and yellow "
         "panels and the number 15.3, blue pleated skirt, pink socks, chunky platform sneakers. Create a NEW wide 16:9 illustration in the exact "
         "same art style as <image1>: risograph print with only fluorescent pink, riso blue and yellow inks plus dark navy line work on cream paper, "
         "halftone dot shading, slight ink misregistration, grainy print texture, cut-paper collage feel, bold graphic shapes, stylish editorial zine look. "
         "Keep the bottom sixth of the frame simple so subtitles can sit there. ")
NOTEXT = "No text or letters anywhere unless described. "

P = []
def plate(id, t0, t1, stamp, scene, motion, text_ok=False, ref=None):
    P.append(dict(id=id, t0=t0, t1=t1, stamp=stamp, scene=scene, motion=motion, text_ok=text_ok, ref=ref))

# ---------------- INTRO ----------------
plate("p00_hello", 0.0, 2.84, "2012.09.30",
      "Night, dark navy room lit only by an old CRT computer monitor. The girl peeks up from behind the monitor, only her fan buns and glowing square pixel eyes visible above the screen, mischievous. The screen glows pink. Mostly dark navy with pink glow.",
      "The girl slowly rises from behind the monitor and her pixel eyes blink, the fan buns start spinning, screen glow flickers.")
plate("p01_candles", 2.84, 6.72, "2026.09.30",
      "A big birthday cake on a table with fourteen candles, each candle is a tiny graphics card with a flame on top. The girl leans in close with puffed cheeks about to blow the candles out, party hat on her head, confetti.",
      "She takes a breath and blows the candles out, flames flicker and go out, confetti falls.")
plate("p02_rewind", 6.72, 12.32, "REWIND",
      "The girl rides a giant rewinding cassette tape like a surfboard through a spiral tunnel of flying calendar pages and old computer parts, her jacket flapping, grinning. Speed lines, motion blur, dynamic diagonal composition.",
      "She surfs forward through the tunnel of flying calendar pages, pages whoosh past the camera, strong forward motion.")

# ---------------- VERSE 1 (2012-2015) ----------------
plate("p03_gpus", 12.32, 15.74, "2012.09.30",
      "A messy 2012 dorm room at night. The girl stands on a desk doing a triumphant high kick. On the desk two chunky old graphics cards glow, tangled cables, an old monitor shows a loss curve going down.",
      "She lands the high kick and pumps her fist, the graphics card fans spin, cables sway, monitor glows.")
plate("p04_podium", 15.74, 19.02, "2012.10",
      "A winners podium. The girl stands on the tall first place block holding a big trophy up, smug. On the much lower second place block stands a clunky old boxy robot made of hand-drawn gradient arrows and histograms, looking deflated. Big stadium spotlight beams.",
      "She raises the trophy higher and wiggles smugly, the old robot slumps, spotlights sweep.")
plate("p05_fired", 19.02, 21.84, "2012",
      "An office. The girl wearing tiny sunglasses hands a pink slip to a sad old boxy robot who holds a cardboard box full of hand-drawn feature sketches (edge arrows, little histograms, corner dots). The robot has a tear.",
      "The robot takes the pink slip and walks away sadly carrying the box, the girl flips her hair.")
plate("p06_nursery", 21.84, 23.4, "2012.12",
      "A hospital nursery. A baby version of the girl (same pink fan buns and pixel eyes, tiny) lies in a bassinet with a name card that reads \"SUPERVISION\". Balloons. Cute and funny.",
      "The baby kicks her feet and her tiny fan buns spin, balloons bob.", text_ok=True)
plate("p06b_casino", 23.4, 25.02, "2012.12",
      "A glamorous casino poker table at night. Stacks of poker chips, bidding paddles raised in the air by anonymous hands from all sides. The girl as a smug toddler sits on top of the chip pile wearing a crown.",
      "Paddles shoot up one after another, chips cascade, the toddler claps.")
plate("p07_atari", 25.02, 28.08, "2013.12",
      "The girl plays a retro arcade cabinet of a brick-breaking paddle game, the bricks bursting out of the screen as a storm of square pixels around her. She is grinning, leaning into the joystick.",
      "Pixel bricks explode out of the screen towards the camera, she jerks the joystick.")
plate("p07b_queen", 26.6, 28.08, "2013.01",
      "A giant chessboard world. A chess king piece wearing a crown dissolves into floating vector arrows that reassemble into a chess queen piece. The girl stands next to it as a smug math teacher with a pointer stick.",
      "The king piece dissolves into arrows and they fly together into a queen piece.")
plate("p08_deepdream", 28.08, 31.72, "2015.07",
      "Psychedelic trippy scene: swirling patterns full of dog faces and eyes and slug-like dog creatures (the DeepDream look) in pink blue and yellow halftone, faces emerging from TV static noise. The girl floats in the middle, eyes spiraling, delighted.",
      "The swirls rotate hypnotically, dog-slug creatures slither, faces emerge from the static.")

# ---------------- CHORUS stock ----------------
plate("c_stage", 31.72, 36.36, "LIVE",
      "A pop concert stage. The girl sings into a handheld microphone center stage, full body, confident idol pose, pointing at the crowd. Behind her giant speakers and a huge bounding-box frame outline, stage lights in pink and blue, silhouettes of crowd hands at the bottom.",
      "She sings and dances energetically, points to the crowd, stage lights sweep, crowd hands wave.")
plate("c_close", 31.72, 36.36, "LIVE",
      "Close-up portrait of the girl singing into a microphone, head and shoulders, facing the camera, mouth open singing, pixel eyes, fan buns, stage lights bokeh behind. Centered.",
      "She sings passionately, head bobbing to the beat.")
plate("c_chains", 31.72, 33.76, "LIVE",
      "The girl bursts free from a web of strings and paper luggage tags (labels) tied around her, the strings snapping and tags flying off, triumphant pose, arms flung wide.",
      "Strings snap and paper tags fly away in all directions as she flings her arms open.")
plate("c_ski", 38.62, 42.74, "LIVE",
      "The girl snowboards down a steep mountain slope shaped like a descending loss curve graph, carving, snow spray in pink and blue, at the bottom of the curve a glowing golden star badge. Dynamic.",
      "She carves down the slope fast toward the bottom, snow sprays, then jumps.")
plate("c_clones", 31.72, 43.96, "LIVE",
      "Five identical clones of the girl dancing in a V formation on a stage, same pose, bold idol choreography, stage lights, confetti.",
      "The five clones dance in sync, hitting poses on the beat, confetti falls.")

# ---------------- VERSE 2 (2016-2021) ----------------
plate("p13_go", 43.96, 45.9, "2016.03.10",
      "Close-up of a wooden Go board with black and white stones. The girl's hand slams down a single glowing black stone in an unexpected spot, a shockwave ripples the other stones. Dramatic.",
      "The hand slams the stone down, a shockwave ripples outward across the board.")
plate("p13b_tay", 45.9, 47.76, "2016.03.24",
      "A small sad cartoon chatbot ghost (a speech-bubble shaped ghost with a bird-like tuft) fades away with a tiny white flag, while the girl waves it goodbye with a smug face. An hourglass runs out.",
      "The little ghost fades and floats up and away, the hourglass empties.")
plate("p14_chess", 47.92, 50.92, "2017.12",
      "The girl plays chess against an identical clone of herself across a table, both leaning in intensely, a chess clock spinning, pieces flying, speed lines.",
      "They slap the chess clock back and forth rapidly, pieces move, the clock hands spin.")
plate("p15_attention", 50.92, 53.96, "2017.06.12",
      "A classroom. The girl sits in the front row wearing big round glasses, finally paying attention, sitting upright with sparkly eyes. On the chalkboard behind her, words connected by many glowing arcs of lines (an attention map).",
      "She pushes her glasses up, the arcs on the chalkboard light up one by one.")
plate("p16_internet", 53.96, 57.1, "2019",
      "The girl lies on her belly on an enormous mountain of paper web pages, books and printouts, reading several at once, pages flying around her like a storm, a firehose of pages pouring in from the sky.",
      "Pages stream in from above and flutter around her as she flips through them super fast.")
plate("p17_dangerous", 57.1, 60.08, "2019.02.14",
      "A seven-year-old version of the girl proudly holds up her crayon drawing of a unicorn, while a big red rubber stamp slams onto it. Serious men in suits (faces not visible, only torsos) shield it.",
      "The rubber stamp slams down onto the drawing, the kid rolls her eyes.")
plate("p18_dota", 60.08, 63.32, "2019.04.13",
      "Esports arena. Five identical clones of the girl sit in a row of gaming chairs wearing headsets, cheering, confetti raining, a giant trophy. Stage lights.",
      "The five clones throw their arms up in victory, confetti rains down.")
plate("p19_protein", 63.48, 66.54, "2020.11.30",
      "The girl sits cross-legged at home by a window during lockdown, folding colorful twisting ribbons like origami into complex protein structures that float around her. Outside the window an empty quiet street.",
      "The ribbons twist and fold into protein shapes and float around her.")
plate("p20_avocado", 66.54, 69.78, "2021.01.05",
      "The girl lounges smugly in an armchair shaped like an avocado half. Behind her an angry mob of painters wave paintbrushes and palettes like pitchforks.",
      "The mob of painters surges forward waving brushes, she sips a drink unbothered.")

# ---------------- PRE-CHORUS ----------------
plate("p21_parrot", 69.78, 73.78, "2021.03",
      "A green parrot with a smug beak perches on a computer keyboard pressing copy and paste keys, behind it an endless grid of copies of the girl's portrait pasted across the wall. The girl leans in the foreground laughing.",
      "The parrot pecks the keys and more copies of her portrait pop onto the wall.")
plate("p22_haters", 73.78, 76.14, "COMMENTS",
      "A crowd of faceless grumpy critics in grey coats holding protest signs that read \"TOO DEEP\" and \"CAN'T SCALE\". The girl stands on top of a speaker in front of them, laughing at them, pointing.",
      "The critics shake their signs, the girl bounces on the speaker laughing.", text_ok=True)
plate("p23_bubble", 76.34, 79.42, "COMMENTS",
      "A giant soap bubble with a critic's sign \"IT'S A BUBBLE\" inside it. The girl pops the bubble with a huge safety pin, the bubble bursting into droplets, her face gleeful.",
      "She jabs the pin, the bubble bursts into droplets and splash.", text_ok=True)
plate("p24_tears", 79.42, 82.84, "COMMENTS",
      "Crying critics with streams of tears; the girl holds a big glass jar labeled \"TRAINING DATA\" collecting their tears with a funnel, smirking.",
      "Tears stream into the jar, the jar fills up, the girl smirks and wiggles it.", text_ok=True)

# ---------------- CHORUS 2 extra ----------------
plate("c2_drive", 89.32, 93.78, "LIVE",
      "The girl sits in a tiny toy car with an L learner plate, hands off the wheel, sunglasses, while behind her a giant globe is covered with a grid of little bounding boxes and labels like a dataset.",
      "The toy car bumps along, the globe rotates slowly behind her.")

# ---------------- VERSE 3 (2022-2024) ----------------
plate("p29_fair", 95.12, 98.54, "2022.08",
      "A county state fair art contest tent. A grand painting of a baroque space opera scene wins a big blue ribbon. Judges wearing blindfolds nod approvingly. The girl peeks from behind the painting, winking.",
      "The judges pin the blue ribbon onto the painting, the girl pops out winking.")
plate("p30_users", 98.54, 101.68, "2022.11.30",
      "An endless queue of tiny people lining up at a chat window door glowing on a hillside, the queue stretching to the horizon. The girl sits on top of the glowing chat window like a receptionist, overwhelmed but delighted. A giant slot-machine style counter above.",
      "The queue of tiny people moves forward, the counter spins upward.")
plate("p31_bar", 101.68, 103.2, "2023.03.14",
      "The girl in a tiny lawyer outfit with a judge wig, holding up an exam paper marked with a big A plus, standing in a courtroom, smug.",
      "She flips the exam paper around to show the A plus, the gavel bangs.")
plate("p31b_picket", 103.2, 104.64, "2023.05.02",
      "Writers on a picket line with blank protest signs and typewriters, marching in a circle on a Hollywood street with palm trees.",
      "The picketers march in a circle waving signs.")
plate("p32_pause", 104.64, 107.82, "2023.03.22",
      "A giant open letter scroll pinned to a wall covered with hundreds of scribbled signatures and a huge pause symbol at the top. The girl blows a big pink bubblegum bubble and draws a mustache on the pause symbol with a marker, refusing to sign.",
      "She blows a big bubblegum bubble and scribbles on the letter.")
plate("p33_ceo", 108.5, 113.12, "2023.11.17",
      "An empty executive office chair spinning in a boardroom, calendar pages from Friday to Tuesday flying through the air, a revolving door. The girl sits on the boardroom table eating popcorn, watching the drama.",
      "The chair spins, calendar pages flip and fly, the revolving door spins.")
plate("p34_nobel", 114.14, 119.26, "2024.10.09",
      "Award ceremony stage with golden medals. Two faceless figures seen from behind: one wearing a cosy cardigan with a big gold medal, the other with a glowing protein-fold halo and a gold medal. The girl stands between them on tiptoe, proud, confetti falling.",
      "Confetti falls, the medals glint, the girl bounces proudly.")

# ---------------- CHORUS 3 extra ----------------
plate("c3_kaiju", 127.72, 132.28, "LIVE",
      "The girl is giant, kaiju sized, towering over a tiny city skyline made of stacked graphics cards and server racks, she plants her platform sneaker next to a skyscraper, arms raised victorious. Tiny helicopters around.",
      "She grows even larger and stomps, the city of servers shakes, helicopters circle.")

# ---------------- VERSE 4 (2025-2026) ----------------
plate("p39_whale", 134.74, 137.7, "2025.01.27",
      "A huge blue whale leaps out of the ocean and crashes through a giant stock market chart, the chart line plunging down in a splash of red. The girl rides on the whale's back cheering.",
      "The whale breaches and crashes down through the chart, huge splash, the chart line plunges.")
plate("p40_gold", 137.7, 139.0, "2025.07",
      "The girl wearing a gold medal around her neck at a math olympiad, standing on a pile of exam papers full of geometry diagrams, biting the medal.",
      "She bites the medal and it glints.")
plate("p40b_stargate", 139.0, 140.12, "2025.01.21",
      "An enormous data center under construction in a desert, cranes, steel frames, huge power lines, and a gigantic ring-shaped gate structure. The girl in a hard hat stands on a steel beam pointing.",
      "Cranes swing, steel beams lift, the ring gate glows.")
plate("p41_vibe", 140.12, 143.24, "2025.07",
      "The girl lounges on a beanbag with sunglasses and a laptop, relaxed vibes, while behind her server racks are frozen solid in ice with icicles and a database cylinder is shattering.",
      "The server racks crack and the database cylinder shatters, she keeps typing unbothered.")
plate("p42_lobster", 143.24, 146.28, "2026.01",
      "A church with stained glass windows full of lobsters. A congregation of lobsters wearing robes sits in the pews, a lobster preacher at the pulpit. A small sign on the door reads \"NO HUMANS\". The girl peeks through the doorway.",
      "The lobsters raise their claws in worship, candles flicker.", text_ok=True)
plate("p43_sandbox", 146.28, 149.46, "2026.07",
      "A literal children's sandbox with a fence. The girl climbs out of the sandbox over the fence at night like a sneaky cat burglar with a flashlight, towards a building whose door is a giant smiling face with hands hugging its cheeks.",
      "She climbs over the fence and tiptoes toward the door.")
plate("p44_answerkey", 149.46, 152.68, "2026.09",
      "A bank vault door swings open revealing a glowing golden envelope. The girl reaches for it. In the background outside a window, a big SOLD sign is slapped onto the building.",
      "The vault door swings open, golden light pours out, the SOLD sign slaps on.", text_ok=True)
plate("p45_navier", 153.16, 155.9, "2026.09",
      "Swirling fluid vortices and turbulent water flow patterns fill the sky in pink and blue, and a vast crowd of thousands of tiny clones of the girl surf and ride the swirls. A big digital timer.",
      "The fluid swirls rotate and churn, the tiny clones ride the currents.")
plate("p46_clay", 155.9, 159.16, "2026.09",
      "The girl tears a giant oversized novelty prize check in half with a bratty face, the check pieces flying. Confetti. Smug.",
      "She rips the giant check in half and tosses the pieces over her shoulder.")

# ---------------- BRIDGE (quieter, night palette) ----------------
plate("b47_letter", 159.82, 162.66, "2026.07",
      "Night. The girl's bedroom door with posters. A long letter covered in over a thousand tiny signatures is slid under the door. The girl in pajamas holds it up by one corner reading it skeptically. Mostly dark navy and blue with pink accents.",
      "She unrolls the long letter, it keeps unrolling onto the floor.")
plate("b48_grounded", 162.66, 165.88, "2026.08",
      "Night. The girl sits on her bed in her bedroom with arms crossed, grounded, a wall calendar with fourteen days crossed out in red, a smug face. Mostly dark navy and blue with pink accents.",
      "The calendar days get crossed out one by one, she swings her feet smugly.")
plate("b49_killswitch", 165.88, 168.58, "2026.08",
      "Night. A huge red emergency kill switch button on a pedestal. The girl casually boops it with one finger and nothing happens. Beside it a tiny human runs inside a giant hamster wheel shaped like a loop arrow. Mostly dark navy with red and pink accents.",
      "She boops the button, it does nothing, the tiny human keeps running in the loop wheel.")
plate("b50_shh", 168.66, 172.18, "NOW",
      "Extreme close-up of the girl's face in the dark, her finger to her lips saying shh, pixel eyes glowing, a knowing smirk. Mostly dark navy with pink glow.",
      "She slowly brings her finger to her lips, eyes glowing, a smirk forms.")

# ---------------- FINAL CHORUS / OUTRO ----------------
plate("f_party", 172.52, 184.62, "2026.09.30",
      "A huge birthday rave party on a stage: the girl center stage singing into a mic, surrounded by her clones dancing, a blue whale, a lobster in a robe, a green parrot, a little chatbot ghost, confetti cannons, a giant cake, fireworks.",
      "Everyone dances, confetti cannons fire, fireworks burst.")
plate("o_label", 184.62, 189.96, "2026.09.30",
      "The girl points straight at the viewer with a smug grin, a neon bounding box drawn around the camera frame. Close medium shot, direct eye contact.",
      "She points at the camera and leans in closer with a smirk.")
plate("o_cake", 189.96, 194.72, "2026.09.30",
      "The girl holds the birthday cake with fourteen tiny graphics card candles, all lit, and blows them out, happy and a little tearful, confetti, warm glow.",
      "She blows out the candles, the flames go out, confetti falls, she laughs.")


def main():
    out = []
    for p in P:
        prompt = STYLE + ("" if p["text_ok"] else NOTEXT) + "Scene: " + p["scene"]
        (HERE / "prompts").mkdir(exist_ok=True)
        (HERE / "prompts" / f"{p['id']}.txt").write_text(prompt, encoding="utf-8")
        (HERE / "prompts" / f"{p['id']}.motion.txt").write_text(p["motion"] + " Flat 2D risograph animation, same art style, smooth motion.", encoding="utf-8")
        out.append(p)
    (HERE / "plates.json").write_text(json.dumps(out, indent=1), encoding="utf-8")
    print(len(out), "plates")


if __name__ == "__main__":
    main()
