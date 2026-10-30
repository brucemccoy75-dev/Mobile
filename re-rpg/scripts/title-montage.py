#!/usr/bin/env python3
"""Title-screen reference montage and character sheet from the Style C sources (docs/ART.md, Title screen).

usage: title-montage.py <cut_dir> <out_dir>
  cut_dir holds <name>.png cut-outs made with scripts/cut-sprite.py from art-src/<name>_styleC.jpg
  (hero_warrior, knight_andre, adept_necromancer, hex_imp, boar, shell_beetle, rat_pack), at height 1100.
Writes <out_dir>/montage.jpg (2560x1184) and <out_dir>/character-sheet.jpg. Run from re-rpg/.
"""
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageFont
S, OUT = sys.argv[1], sys.argv[2]
W, H = 2560, 1184

def sprite(name, height, flip=False, bright=1.0):
    im = Image.open(f'{S}/{name}.png').convert('RGBA')
    im = im.crop(im.getbbox())
    im = im.resize((round(im.width * height / im.height), height), Image.LANCZOS)
    if flip: im = im.transpose(Image.FLIP_LEFT_RIGHT)
    if bright != 1.0:
        a = im.getchannel('A'); im = ImageEnhance.Brightness(im.convert('RGB')).enhance(bright).convert('RGBA'); im.putalpha(a)
    return im

# Background: the battle backdrop, cover-scaled, a touch darker, with a vignette.
bg = Image.open('art-src/backdrop_forest_styleC.jpg').convert('RGB')
s = max(W / bg.width, H / bg.height)
bg = bg.resize((round(bg.width * s), round(bg.height * s)), Image.LANCZOS)
bg = bg.crop(((bg.width - W) // 2, (bg.height - H) // 2, (bg.width - W) // 2 + W, (bg.height - H) // 2 + H))
bg = ImageEnhance.Brightness(bg).enhance(0.8)
vig = Image.new('L', (W, H), 0); d = ImageDraw.Draw(vig)
d.ellipse((-W * 0.15, -H * 0.25, W * 1.15, H * 1.3), fill=255)
vig = vig.filter(ImageFilter.GaussianBlur(220))
dark = Image.new('RGB', (W, H), (10, 12, 20))
canvas = Image.composite(bg, dark, vig).convert('RGBA')

def place(im, cx, feet, shadow=True):
    if shadow:
        sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(sh)
        w = im.width * 0.7
        sd.ellipse((cx - w / 2, feet - 26, cx + w / 2, feet + 22), fill=(0, 0, 0, 120))
        canvas.alpha_composite(sh.filter(ImageFilter.GaussianBlur(14)))
    canvas.alpha_composite(im, (round(cx - im.width / 2), round(feet - im.height)))

# Back to front. Enemies face left, toward the hero.
place(sprite('knight_andre', 860, bright=0.82), 1960, 1050)
place(sprite('adept_necromancer', 520, bright=0.9), 1530, 1085)
place(sprite('hex_imp', 430), 2330, 1120)
place(sprite('shell_beetle', 270), 2050, 1160)
place(sprite('boar', 360), 1270, 1165)
place(sprite('rat_pack', 280), 300, 1170)
place(sprite('hero_warrior', 820), 780, 1172)
canvas.convert('RGB').save(f'{OUT}/montage.jpg', quality=92)

# A labelled sheet, so the generator can tell who is who.
sh = Image.new('RGBA', (2560, 740), (18, 22, 34, 255))
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 34)
except Exception: font = ImageFont.load_default()
cast = [('hero_warrior', 'The Warrior\n(hero)'), ('knight_andre', 'Knight Andre\n(boss)'), ('adept_necromancer', 'Adept\nNecromancer'), ('hex_imp', 'Hex Imp'), ('boar', 'Boar'), ('shell_beetle', 'Shell Beetle'), ('rat_pack', 'Rat Pack')]
slot = 2560 / len(cast)
d = ImageDraw.Draw(sh)
for i, (n, label) in enumerate(cast):
    im = sprite(n, 520 if n in ('hero_warrior', 'knight_andre', 'adept_necromancer', 'hex_imp') else 330)
    if im.width > slot - 30: im = im.resize((round(slot - 30), round(im.height * (slot - 30) / im.width)), Image.LANCZOS)
    cx = slot * i + slot / 2
    sh.alpha_composite(im, (round(cx - im.width / 2), round(590 - im.height)))
    for k, line in enumerate(label.split('\n')):
        d.text((cx - d.textlength(line, font=font) / 2, 615 + k * 42), line, font=font, fill=(240, 230, 200))
sh.convert('RGB').save(f'{OUT}/character-sheet.jpg', quality=92)
print('ok')
