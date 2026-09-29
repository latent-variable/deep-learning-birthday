# Release kit: Wed, Sept 30, 2026

## Which file goes where

| Where | File | Why |
|---|---|---|
| **YouTube** | `final/happy-birthday-to-me-v12-master.mp4` (1.08 GB) | YouTube re-encodes everything, so give it the highest-quality source. The master isn't uncompressed; it's H.264 CRF 20 with 320k AAC. |
| **Reddit native upload**, Discord (Nitro), email/Drive links | `final/happy-birthday-to-me-v12.mp4` (323 MB, 1080p, 12 Mbps) | Looks the same to the eye at a third of the size. |
| Texting friends, WhatsApp, Discord (free), previews | `final/happy-birthday-to-me-v12-720p.mp4` (151 MB) | Small enough for most messengers. |
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
Make your own (the whole pipeline, MIT): https://github.com/latent-variable/deep-learning-birthday

0:00 Hello, world
0:12 2012: born on ImageNet
0:31 Chorus: happy birthday to me
0:43 Move 37 → Attention (2016–2020)
1:09 The haters (and the skeptics)
1:22 Chorus: can't even drive
1:35 ChatGPT → the Nobels
2:00 Chorus: scale is all I need
2:14 DeepSeek → 2026
2:39 Bridge
2:52 Final chorus
3:04 Nobody labels me
3:14 Credits

Easter eggs: her jersey says 15.3, AlexNet's top-5 error. The song is 3:14 long. Her snowboard runs at lr=3e-4. Tell me which ones you found.

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

- **Post type:** upload the video natively; native video gets far more plays than a link. Put the YouTube link and the repo (github.com/latent-variable/deep-learning-birthday) in your first comment.
- **Before posting:** check each sub's self-promo and AI-content rules.
- **Title ideas:**
  - r/singularity, r/accelerate: *AlexNet turns 14 today, so I made deep learning a birthday song (made with open models on one 3090)*
  - r/StableDiffusion, r/comfyui, r/LocalLLaMA: lead with the pipeline, e.g. *Local-only music video: Qwen-Image 2.1 + LTX-2.3 + InfiniteTalk on a single 3090, $0*. Then add a comment with the workflow breakdown. These subs reward process posts.
  - r/MachineLearning: only as a `[P]` project post that follows their rules. They're strict.

## LinkedIn

Upload the video natively (the 1080p `v12.mp4`), and put the YouTube and repo links in the first comment. LinkedIn down-ranks posts with links in the body.

```
14 years ago today, on September 30, 2012, AlexNet was submitted to ImageNet.

To me, that's the birth of modern deep learning. Three things came together for the first time:
→ GPUs: two GTX 580s doing massively parallel training
→ Deep neural networks: eight layers, ReLU, dropout
→ Data at scale: 1.2 million labeled images

Everything since (transformers, ChatGPT, AlphaFold, the 2024 Nobel Prizes) builds on those three pillars. The rest is details.

So I made deep learning a birthday present: a music video. Meet Lexi (Alex·Net → Lexi), a bratty 14-year-old who recaps fourteen years of AI in 3 minutes and 14 seconds. Her jersey says 15.3, AlexNet's top-5 error.

Made with open models on a single RTX 3090, with a $0 budget, together with Claude. The whole pipeline is open source if you want to build your own.

Happy birthday, deep learning. For Alex, Ilya & Geoff, and everyone who labeled ImageNet.

#DeepLearning #AI #MachineLearning #ImageNet #AlexNet
```

## X

With X Premium, post the full video natively (Premium lifts the 2:20 cap), pin it, and reply with the YouTube and repo links. Without Premium, post a 45–60 s teaser instead. Set the new profile picture a day or two before.

## Repo

Flip latent-variable/deep-learning-birthday to public on release day: `gh repo edit latent-variable/deep-learning-birthday --visibility public --accept-visibility-change-consequences`.
