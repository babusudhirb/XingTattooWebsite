"""Blog images: hero (1600x900), card (800x500), OG (1200x630 + title) and body images.

Run from clonecraft-hero/:  python -I scripts/blog-images.py [slug ...]
           Site pages' social images (og/*.jpg):  python -I scripts/blog-images.py site
Sources are the studio's own photos (copied, never moved). "TYPE" = typographic cover.
Titles for the OG overlay are read from content/blog/<slug>.md.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images" / "blog"
OG_OUT = ROOT / "public" / "og" / "blog"
A = "src/assets/"
S = A + "services/"
G = "public/images/gallery/tattoo-brookefield-portfolio-"
TYPE = "TYPE"

# slug: (hero source, [body sources])
IMAGES = {
    "tattoo-cost-in-bangalore": (A + "booking/tattoo-machine-xing-premium-tattoo-studio.webp", [S + "minimalist/minimalist-tattoo-brookefield-7.webp", S + "realism/realism-tattoo-brookefield-2.webp"]),
    "best-tattoo-studio-brookefield": (A + "artist/peace-tattoo-artist-xing-brookefield.webp", [G + "4-012.webp"]),
    "first-tattoo-guide-bangalore": (S + "minimalist/minimalist-tattoo-brookefield-bangalore.webp", [S + "minimalist/minimalist-tattoo-brookefield-3.webp", S + "minimalist/minimalist-tattoo-brookefield-6.webp"]),
    "tattoo-pain-chart": (S + "realism/realism-tattoo-brookefield-bangalore.webp", [S + "minimalist/minimalist-tattoo-brookefield-11.webp"]),
    "tattoo-aftercare-guide": (S + "minimalist/minimalist-tattoo-brookefield-13.webp", [S + "minimalist/minimalist-tattoo-brookefield-8.webp"]),
    "hygienic-tattoo-studio-checklist": (A + "booking/tattoo-machine-xing-premium-tattoo-studio.webp", []),
    "realism-tattoos-guide": (S + "realism/realism-tattoo-brookefield-1.webp", [S + "realism/realism-tattoo-brookefield-3.webp", G + "4-012.webp"]),
    "portrait-tattoo-reference-photo": (S + "portrait/portrait-tattoo-brookefield-bangalore.webp", [S + "portrait/portrait-tattoo-brookefield-1.webp", S + "portrait/portrait-tattoo-brookefield-5.webp"]),
    "memorial-tattoo-ideas": (S + "portrait/portrait-tattoo-brookefield-4.webp", [S + "portrait/portrait-tattoo-brookefield-3.webp", G + "4-071.webp"]),
    "pet-portrait-tattoos": (S + "portrait/portrait-tattoo-brookefield-2.webp", []),
    "black-grey-vs-colour-tattoos": (A + "offers/page/offer-hero-samurai.webp", [G + "4-034.webp"]),
    "tattoos-on-indian-skin": (G + "4-023.webp", [G + "4-059.webp"]),
    "fine-line-tattoos": (S + "minimalist/minimalist-tattoo-brookefield-2.webp", [S + "minimalist/minimalist-tattoo-brookefield-11.webp", S + "minimalist/minimalist-tattoo-brookefield-16.webp"]),
    "minimalist-tattoo-ideas": (S + "minimalist/minimalist-tattoo-brookefield-5.webp", [S + "minimalist/minimalist-tattoo-brookefield-21.webp", S + "minimalist/minimalist-tattoo-brookefield-12.webp"]),
    "geometric-mandala-tattoos": (S + "geometric/geometric-tattoo-brookefield-bangalore.webp", [S + "geometric/geometric-tattoo-brookefield-3.webp", S + "geometric/geometric-tattoo-brookefield-2.webp"]),
    "indian-traditional-tattoos": (S + "realism/realism-tattoo-brookefield-5.webp", [S + "realism/realism-tattoo-brookefield-4.webp", S + "minimalist/minimalist-tattoo-brookefield-9.webp"]),
    "lord-shiva-tattoo-designs": (G + "4-048.webp", [G + "4-069.webp", G + "2-001.webp"]),
    "om-trishul-spiritual-tattoos": (G + "4-074.webp", [G + "4-009.webp", S + "minimalist/minimalist-tattoo-brookefield-19.webp"]),
    "sleeve-tattoo-planning": (S + "geometric/geometric-tattoo-brookefield-2.webp", [S + "realism/realism-tattoo-brookefield-2.webp"]),
    "tattoo-cover-up-guide": (G + "4-066.webp", []),
    "tattoo-touch-up-rework": (G + "4-019.webp", []),
    "name-lettering-tattoos": (G + "4-040.webp", [G + "4-060.webp", G + "4-033.webp"]),
    "couple-tattoo-ideas": (G + "4-024.webp", [S + "minimalist/minimalist-tattoo-brookefield-12.webp"]),
    "tattoo-placement-guide": (G + "4-027.webp", [S + "minimalist/minimalist-tattoo-brookefield-15.webp", S + "minimalist/minimalist-tattoo-brookefield-6.webp"]),
    "wrist-tattoo-ideas": (S + "minimalist/minimalist-tattoo-brookefield-7.webp", [S + "minimalist/minimalist-tattoo-brookefield-18.webp", S + "minimalist/minimalist-tattoo-brookefield-3.webp"]),
    "forearm-tattoo-ideas": (S + "geometric/geometric-tattoo-brookefield-6.webp", [S + "minimalist/minimalist-tattoo-brookefield-14.webp"]),
    "chest-back-tattoo-ideas": (G + "4-058.webp", [S + "portrait/portrait-tattoo-brookefield-1.webp", S + "realism/realism-tattoo-brookefield-3.webp"]),
    "tattoo-ideas-for-women": (S + "minimalist/minimalist-tattoo-brookefield-17.webp", [S + "minimalist/minimalist-tattoo-brookefield-10.webp", G + "4-057.webp"]),
    "tattoo-ideas-for-men": (S + "realism/realism-tattoo-brookefield-3.webp", [A + "offers/page/offer-hero-samurai.webp"]),
    "tattoo-appointment-prep": (G + "4-036.webp", []),
    "tattoo-bangalore-weather": (G + "4-022.webp", []),
    "tattoo-healing-stages": (S + "minimalist/minimalist-tattoo-brookefield-1.webp", []),
    "infected-tattoo-signs": (TYPE, []),
    "gym-swimming-sun-after-tattoo": (G + "4-005.webp", []),
    "tattoos-at-work-india": (G + "4-043.webp", []),
    "blood-donation-after-tattoo-india": (TYPE, []),
    "tattoo-myths": (G + "4-041.webp", []),
    "custom-vs-flash-tattoo": (G + "4-049.webp", [S + "minimalist/minimalist-tattoo-brookefield-20.webp"]),
    "custom-tattoo-process": (A + "booking/tattoo-machine-xing-premium-tattoo-studio.webp", [A + "artist/peace-tattoo-artist-xing-brookefield.webp"]),
    "meet-tattoo-artist-peace": (A + "artist/peace-tattoo-artist-xing-brookefield.webp", [S + "realism/realism-tattoo-brookefield-5.webp"]),
    "tattoo-studio-near-whitefield": (G + "4-012.webp", []),
    "tattoo-studio-near-marathahalli": (G + "4-072.webp", []),
    "bangalore-tattoo-ideas": (S + "minimalist/minimalist-tattoo-brookefield-4.webp", []),
    "zodiac-tattoo-ideas": (S + "geometric/geometric-tattoo-brookefield-4.webp", [G + "4-059.webp"]),
    "small-meaningful-tattoos": (S + "minimalist/minimalist-tattoo-brookefield-21.webp", [G + "4-075.webp", G + "4-060.webp"]),
    "watercolour-tattoos": (G + "4-034.webp", [S + "geometric/geometric-tattoo-brookefield-6.webp"]),
    "scar-cover-up-tattoos": (TYPE, []),
    "tattoo-age-rules-india": (TYPE, []),
    "tattoo-removal-vs-cover-up": (TYPE, [G + "4-066.webp"]),
    "hand-finger-tattoos": (S + "geometric/geometric-tattoo-brookefield-3.webp", [G + "4-038.webp", S + "traditional/traditional-tattoo-brookefield-3.webp"]),
    # Answer-first batch (#51–#70)
    "tattoo-studio-aecs-layout-brookefield": (G + "3-147.webp", [G + "3-049.webp", G + "4-021.webp"]),
    "tattoo-studio-near-kundalahalli-gate": (G + "5-062.webp", [G + "3-027.webp"]),
    "tattoo-artists-east-bangalore-it-professionals": (G + "1-036.webp", [G + "4-018.webp"]),
    "tattoo-studio-near-itpl-main-road": (G + "4-049.webp", [G + "4-070.webp"]),
    "small-fine-line-tattoo-cost-bangalore": (G + "3-070.webp", [G + "4-022.webp"]),
    "workout-after-tattoo": (G + "3-113.webp", [G + "3-120.webp"]),
    "custom-sleeve-tattoo-sessions-timeline": (G + "5-056.webp", [G + "5-066.webp"]),
    "white-ink-tattoos-indian-skin": (G + "4-010.webp", [G + "3-098.webp"]),
    "cyberpunk-neo-tribal-tattoos-bangalore": (G + "3-144.webp", [G + "4-030.webp", G + "3-133.webp"]),
    "japanese-irezumi-vs-realism-sleeve": (G + "3-006.webp", [G + "1-056.webp", G + "3-058.webp"]),
    "script-calligraphy-tattoo-fonts": (G + "3-045.webp", [G + "3-167.webp", G + "1-026.webp"]),
    "micro-realism-tattoos": (G + "5-004.webp", [G + "3-017.webp"]),
    "post-tattoo-adrenaline-crash": (G + "3-084.webp", [G + "3-154.webp"]),
    "sibling-family-tattoo-ideas": (G + "5-001.webp", [G + "5-075.webp", G + "1-072.webp"]),
    "birthday-milestone-tattoos": (G + "5-092.webp", [G + "3-127.webp"]),
    "travel-tattoo-ideas": (G + "1-060.webp", [G + "3-155.webp", G + "5-051.webp", G + "3-171.webp"]),
    "vegan-vs-traditional-tattoo-inks": (G + "6-001.webp", [G + "3-119.webp"]),
    "tattoo-consultation-what-happens": (A + "artist/peace-tattoo-artist-xing-brookefield.webp", [S + "minimalist/minimalist-tattoo-brookefield-20.webp"]),
    "approve-tattoo-sketch-stencil": (G + "1-002.webp", [G + "3-013.webp"]),
    "safe-tattoo-needle-cartridges-sterilisation": (A + "booking/tattoo-machine-xing-premium-tattoo-studio.webp", []),
}

FONT_DIR = Path("C:/Windows/Fonts")
SERIF_BOLD = str(FONT_DIR / "georgiab.ttf")
SANS_BOLD = str(FONT_DIR / "arialbd.ttf")
INK = (14, 13, 12)
PAPER = (250, 249, 247)


def save_webp(img: Image.Image, path: Path, limit_kb: int, quality: int = 80):
    path.parent.mkdir(parents=True, exist_ok=True)
    while True:
        img.save(path, "WEBP", quality=quality, method=6)
        if path.stat().st_size <= limit_kb * 1024 or quality <= 40:
            return
        quality -= 6


def fill_frame(src: Image.Image, size):
    """Contained photo on a blurred, darkened copy of itself (keeps the whole tattoo)."""
    w, h = size
    bg = ImageOps.fit(src, size, Image.LANCZOS).filter(ImageFilter.GaussianBlur(28))
    bg = Image.blend(bg, Image.new("RGB", size, INK), 0.45)
    scale = min(w / src.width, h / src.height)
    if src.width * scale / w > 0.82:  # already wide: just cover-crop
        return ImageOps.fit(src, size, Image.LANCZOS, centering=(0.5, 0.4))
    # Fill the frame height (small sources are scaled up so there's no thick border)
    fg = src.resize((round(src.width * scale), round(src.height * scale)), Image.LANCZOS)
    bg.paste(fg, ((w - fg.width) // 2, (h - fg.height) // 2))
    return bg


def wrap(draw, text, font, max_w):
    words, lines, line = text.split(), [], ""
    for word in words:
        test = f"{line} {word}".strip()
        if draw.textlength(test, font=font) <= max_w:
            line = test
        else:
            lines.append(line)
            line = word
    lines.append(line)
    return lines


def logo_mark(size):
    logo = Image.open(ROOT / "public" / "xing-premium-tattoo-studio-logo.webp").convert("RGBA")
    logo.thumbnail((size * 2, size), Image.LANCZOS)  # the logo is wide: allow up to 2:1
    # The mark is dark on transparent: invert to white for dark backgrounds.
    r, g, b, a = logo.split()
    white = Image.merge("RGBA", (*(ImageOps.invert(Image.merge("RGB", (r, g, b))).split()), a))
    return white


def typographic(size, title):
    w, h = size
    img = Image.new("RGB", size, INK)
    d = ImageDraw.Draw(img)
    pad = int(w * 0.08)
    fsize = int(h * 0.105)
    font = ImageFont.truetype(SERIF_BOLD, fsize)
    lines = wrap(d, title, font, w - 2 * pad)
    while len(lines) > 4:
        fsize = int(fsize * 0.9)
        font = ImageFont.truetype(SERIF_BOLD, fsize)
        lines = wrap(d, title, font, w - 2 * pad)
    y = (h - len(lines) * fsize * 1.18) / 2
    for line in lines:
        d.text((pad, y), line, font=font, fill=PAPER)
        y += fsize * 1.18
    d.line([(pad, h - pad * 0.9), (pad + w * 0.08, h - pad * 0.9)], fill=(180, 83, 9), width=max(2, h // 200))
    small = ImageFont.truetype(SANS_BOLD, max(12, int(h * 0.028)))
    d.text((pad, h - pad * 0.75), "XING PREMIUM TATTOO STUDIO  ·  BROOKEFIELD, BANGALORE", font=small, fill=(200, 196, 190))
    mark = logo_mark(int(h * 0.12))
    img.paste(mark, (w - pad - mark.width, int(pad * 0.7)), mark)
    return img


def og_image(hero: Image.Image, title, bottom=70):
    img = ImageOps.fit(hero, (1200, 630), Image.LANCZOS)
    shade = Image.new("L", (1200, 630))
    sd = ImageDraw.Draw(shade)
    for y in range(630):  # bottom-heavy gradient for legible text
        sd.line([(0, y), (1200, y)], fill=int(235 * (y / 630) ** 1.2))
    img = Image.composite(Image.new("RGB", img.size, INK), img, shade)
    d = ImageDraw.Draw(img)
    font = ImageFont.truetype(SERIF_BOLD, 54)
    lines = wrap(d, title, font, 1080)
    while len(lines) > 3:
        font = ImageFont.truetype(SERIF_BOLD, font.size - 4)
        lines = wrap(d, title, font, 1080)
    y = 630 - bottom - len(lines) * font.size * 1.15
    for line in lines:
        d.text((60, y), line, font=font, fill=PAPER)
        y += font.size * 1.15
    d.text((60, 580), "XING PREMIUM TATTOO STUDIO  ·  BROOKEFIELD, BANGALORE", font=ImageFont.truetype(SANS_BOLD, 18), fill=(214, 211, 205))
    mark = logo_mark(70)
    img.paste(mark, (1200 - 60 - mark.width, 40), mark)
    return img


def title_of(slug):
    text = (ROOT / "content" / "blog" / f"{slug}.md").read_text(encoding="utf-8")
    title = re.search(r'^title:\s*"(.+)"\s*$', text, re.M).group(1)
    return re.sub(r"\{\{(\w+)\}\}", lambda m: tokens()[m.group(1)], title)


_tokens = None


def tokens():
    """{{token}} values from src/data/business.ts (the single source), read once."""
    global _tokens
    if _tokens is None:
        out = subprocess.run(
            ["node", "-e", "import('./src/data/business.ts').then(m=>process.stdout.write(JSON.stringify(m.BLOG_TOKENS)))"],
            cwd=ROOT, capture_output=True, text=True, encoding="utf-8", check=True).stdout
        _tokens = json.loads(out)
    return _tokens


def build(slug):
    hero_src, body = IMAGES[slug]
    title = title_of(slug)
    if hero_src == TYPE:
        hero = typographic((1600, 900), title)
        og = typographic((1200, 630), title)
    else:
        src = Image.open(ROOT / hero_src).convert("RGB")
        hero = fill_frame(src, (1600, 900))
        og = og_image(hero, title)
    save_webp(hero, OUT / f"{slug}-hero.webp", 160)
    save_webp(ImageOps.fit(hero, (800, 500), Image.LANCZOS), OUT / f"{slug}-card.webp", 70)
    OG_OUT.mkdir(parents=True, exist_ok=True)
    og.save(OG_OUT / f"{slug}.jpg", "JPEG", quality=82, optimize=True, progressive=True)
    for i, b in enumerate(body, 1):
        im = Image.open(ROOT / b).convert("RGB")
        im.thumbnail((800, 1000), Image.LANCZOS)
        save_webp(im, OUT / f"{slug}-{i}.webp", 120)


# Signature Services cards (4:3, 640x480) — small copies so /blog doesn't load full-size photos
SIGNATURE = {
    "realism": S + "realism/realism-tattoo-brookefield-bangalore.webp",
    "portrait": S + "portrait/portrait-tattoo-brookefield-4.webp",
    "fine-line": S + "minimalist/minimalist-tattoo-brookefield-2.webp",
    "black-grey": A + "offers/page/offer-hero-samurai.webp",
    "traditional": S + "realism/realism-tattoo-brookefield-5.webp",
    "geometric": S + "geometric/geometric-tattoo-brookefield-3.webp",
    "sleeve": S + "geometric/geometric-tattoo-brookefield-2.webp",
    "cover-up": G + "4-066.webp",
}


def signature_cards():
    for name, src in SIGNATURE.items():
        im = Image.open(ROOT / src).convert("RGB")
        save_webp(ImageOps.fit(im, (640, 480), Image.LANCZOS, centering=(0.5, 0.4)), OUT / f"signature-{name}.webp", 60)
    # Author avatar (shown at 40-80px)
    face = Image.open(ROOT / A / "artist/peace-tattoo-artist-xing-brookefield.webp").convert("RGB")
    w, h = face.size
    face = face.crop((int(w * 0.2), 0, int(w * 0.8), int(w * 0.6)))
    save_webp(face.resize((160, 160), Image.LANCZOS), OUT / "peace-avatar.webp", 15)


# Site pages' social images (1200x630): source photo and the headline drawn on it
SITE_OG = {
    "og-xing-premium-tattoo-studio": (S + "realism/realism-tattoo-brookefield-bangalore.webp", "Xing Premium Tattoo Studio"),
    "services-realism": (S + "realism/realism-tattoo-brookefield-bangalore.webp", "Realism Tattoos in Bangalore"),
    "services-portrait": (S + "portrait/portrait-tattoo-brookefield-bangalore.webp", "Portrait Tattoos in Bangalore"),
    "services-black-grey": (S + "black-grey/black-grey-tattoo-brookefield-bangalore.webp", "Black & Grey Tattoos in Bangalore"),
    "services-geometric": (S + "geometric/geometric-tattoo-brookefield-bangalore.webp", "Geometric & Mandala Tattoos in Bangalore"),
    "services-traditional": (S + "traditional/traditional-tattoo-brookefield-bangalore.webp", "Indian Traditional Tattoos in Bangalore"),
    "services-minimalist": (S + "minimalist/minimalist-tattoo-brookefield-bangalore.webp", "Fine Line & Minimalist Tattoos in Bangalore"),
    "tattoo-artist": (A + "artist/peace-tattoo-artist-xing-brookefield.webp", "Peace, Tattoo Artist in Brookefield"),
}
SYMBOL = str(FONT_DIR / "seguisym.ttf")  # the only stock font here with a real ★


def draw_with_stars(d, xy, text, font, size, fill):
    """Draw text, switching to a symbol font for ★ (Arial has no star glyph)."""
    x, y = xy
    star_font = ImageFont.truetype(SYMBOL, size)
    for i, part in enumerate(text.split("★")):
        if i:
            d.text((x, y), "★", font=star_font, fill=fill)
            x += d.textlength("★", font=star_font)
        d.text((x, y), part, font=font, fill=fill)
        x += d.textlength(part, font=font)


def site_images():
    """Social images for the home, services and artist pages (icons: scripts/logo-assets.mjs)."""
    out = ROOT / "public" / "og"
    out.mkdir(parents=True, exist_ok=True)
    rating = f"Brookefield, Bangalore  ·  {tokens()['stars']} on Google"
    for name, (src, title) in SITE_OG.items():
        im = Image.open(ROOT / src).convert("RGB")
        img = og_image(fill_frame(im, (1200, 630)), title, bottom=125 if name == "og-xing-premium-tattoo-studio" else 70)
        if name == "og-xing-premium-tattoo-studio":
            d = ImageDraw.Draw(img)
            draw_with_stars(d, (60, 530), rating, ImageFont.truetype(SANS_BOLD, 30), 30, (232, 229, 224))
        quality = 82
        while True:
            img.save(out / f"{name}.jpg", "JPEG", quality=quality, optimize=True, progressive=True)
            if (out / f"{name}.jpg").stat().st_size <= 200 * 1024 or quality <= 50:
                break
            quality -= 6


if __name__ == "__main__" and sys.argv[1:] == ["site"]:
    site_images()
    print(f"built {len(SITE_OG)} site social images")
    sys.exit()

if __name__ == "__main__":
    wanted = sys.argv[1:] or [s for s in IMAGES if (ROOT / "content" / "blog" / f"{s}.md").exists()]
    for s in wanted:
        build(s)
    signature_cards()
    print(f"built {len(wanted)} post image sets")
