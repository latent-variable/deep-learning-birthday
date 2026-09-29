# Release kit: Wed, Sept 30, 2026

## Which file goes where

| Where | File | Why |
|---|---|---|
| **YouTube** | `final/happy-birthday-to-me-v4-master.mp4` (1.0 GB) | YouTube re-encodes everything, so give it the highest-quality source. The master isn't uncompressed; it's H.264 CRF 20 with 320k AAC. |
| **Reddit native upload**, Discord (Nitro), email/Drive links | `final/happy-birthday-to-me-v4.mp4` (308 MB, 1080p, 12 Mbps) | Looks the same to the eye at a third of the size. |
| Texting friends, WhatsApp, Discord (free), previews | `final/happy-birthday-to-me-v4-720p.mp4` (144 MB) | Small enough for most messengers. |
| **X / Twitter** | a teaser under 2:20 (to do) | Free accounts cap video at 2 min 20 s; the full cut is 3:31. |

## Promo images: `final/promo/`

| File | Use |
|---|---|
| `youtube-banner.jpg` / `youtube-banner-no-title.jpg` | channel banner, 2560×1440. Desktop shows only the yellow band; TVs show the whole image, including the 14-year filmstrip. |
| `thumbnail-a/b/c.jpg` | video thumbnails, 1280×720 |
| `lino_*_square.jpg` | profile pictures, 1000×1000 |

To re-render: `node render.mjs --page=poster.html --poster=banner|banner_clean|thumb_a|thumb_b|thumb_c --stills=3` (see `src/riso/scenes/posters.js`).

## YouTube

- **Upload** unlisted now → **Schedule as Premiere** for Sept 30 → the premiere/countdown link is shareable right away.
- **Altered/synthetic content:** tick "yes". It depicts real people and doing so costs nothing.
- **Thumbnail:** 1280×720 JPG.

**Title:** Happy Birthday to Me: AlexNet turns 14 (an AI music video)

**Description:**

```
On Sept 30, 2012, AlexNet was submitted to ImageNet, and deep learning was born. Today she turns 14.
Meet Lexi (Alex·Net → Lexi): bratty, brilliant, labeling everything, and done asking permission.
14 years of AI in 3 minutes 14 seconds: ReLU, GANs, Move 37, Attention, ChatGPT, the Nobels, DeepSeek, and more.

Made on one RTX 3090 with a $0 budget, using open models, by Lino Valdovinos and Claude Opus 5.5.

0:00 Hello, world
0:12 2012: born on ImageNet
0:31 Chorus: happy birthday to me
0:43 Move 37 → Attention (2016–2020)
1:09 The haters
1:22 Chorus: can't even drive
1:35 ChatGPT → the Nobels
2:00 Chorus: scale is all I need
2:14 DeepSeek → 2026
2:39 Bridge
2:52 Final chorus
3:04 Nobody labels me
3:14 Credits

Easter eggs: her jersey says 15.3, AlexNet's top-5 error. The song is 3:14 long. Tell me which ones you found.

MUSIC: Suno (final song) · ACE-Step 1.5 · MiniMax Music 3 · YuE2 (exploration)
PICTURES + MOTION: Qwen-Image 2.1 · LTX-2.3 · InfiniteTalk + Wan 2.1 · ComfyUI
PRINT SHOP: p5.js · Puppeteer · FFmpeg · librosa · ClaudeAnimationBase by John Heibel (MIT)

Portraits redrawn from Wikimedia Commons photos:
Geoffrey Hinton (Cmichel67, CC BY-SA 4.0) · Demis Hassabis (John Sears, CC BY-SA 4.0) · Fei-Fei Li (ITU Pictures, CC BY 2.0) ·
Yann LeCun (Jérémy Barande, CC BY-SA 2.0) · Yoshua Bengio (Xuthoria, CC BY-SA 4.0) · Jensen Huang (The White House, public domain) ·
Lee Sedol (LG Electronics, CC BY 2.0) · Sam Altman (Office of the Prime Minister of Japan, CC BY 4.0) · Ian Goodfellow (CC BY-SA 4.0) · John Jumper (Jay Dixit, CC BY-SA 4.0) ·
Gary Marcus (Web Summit, CC BY 2.0) · Noam Chomsky (Σ, retouched by Wugapodes & Jonnmann, CC BY-SA 4.0) · Emily M. Bender (King of Hearts, CC BY-SA 4.0)

Logos and names belong to their owners. This is a fan tribute, not an endorsement.
For Alex, Ilya & Geoff, and everyone who labeled ImageNet.
```

## Reddit (Sept 30, around 8–10 am ET)

- **Post type:** upload the video natively; native video gets far more plays than a link. Put the YouTube link in your first comment.
- **Before posting:** check each sub's self-promo and AI-content rules.
- **Title ideas:**
  - r/singularity, r/accelerate: *AlexNet turns 14 today, so I made deep learning a birthday song (made with open models on one 3090)*
  - r/StableDiffusion, r/comfyui, r/LocalLLaMA: lead with the pipeline, e.g. *Local-only music video: Qwen-Image 2.1 + LTX-2.3 + InfiniteTalk on a single 3090, $0*. Then add a comment with the workflow breakdown. These subs reward process posts.
  - r/MachineLearning: only as a `[P]` project post that follows their rules. They're strict.

## X

Post a 45–60 s teaser (the chorus-1 hook, or the "now I'm labeling you" ending), pin it, and link the YouTube premiere. Set the new profile picture a day or two before.
