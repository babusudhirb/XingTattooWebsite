"""Content checks for content/blog/*.md — run: python -I scripts/check_blog.py

Checks each post against the blog writing standard: lengths, keyword placement,
one H1, internal links, FAQ count, banned price terms and word count.
(Broken internal links also fail the build — see scripts/blog-plugin.ts.)
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POSTS = sorted((ROOT / "content" / "blog").glob("*.md"))
PILLARS = {1, 2, 3, 5, 6}
# Posts from #51 on follow the answer-first standard: longer, more FAQs, a direct answer.
ANSWER_FIRST = 51
BANNED = re.compile(r"₹|\bRs\.?\s?\d|\bINR\b|%\s*off|\d+\s*%", re.I)
# {{token}} values from src/data/business.ts (the single source), so checks see the rendered text
TOKENS = json.loads(subprocess.run(
    ["node", "-e", "import('./src/data/business.ts').then(m=>process.stdout.write(JSON.stringify(m.BLOG_TOKENS)))"],
    cwd=ROOT, capture_output=True, text=True, encoding="utf-8", check=True).stdout)


def fill(text):
    return re.sub(r"\{\{(\w+)\}\}", lambda m: TOKENS[m.group(1)], text)


CLOSING = "Ready to talk about your idea? Book a free consultation at Xing, {{landmark}}, Brookefield"


def city(s):
    """Bangalore (titles, keywords) and Bengaluru (running text) are the same place."""
    return s.lower().replace("bangalore", "bengaluru")


def page_title(base):
    """Mirror of pageTitle() in src/data/business.ts."""
    bare = re.sub(r"\s*\|\s*Xing Premium( Tattoo Studio)?\s*$", "", base)
    long = bare + " | Xing Premium Tattoo Studio"
    return long if len(long) <= 60 else bare + " | Xing Premium"


def field(fm, name):
    m = re.search(rf'^{name}:\s*"(.*)"\s*$', fm, re.M)
    return m.group(1) if m else ""


problems = 0
for path in POSTS:
    text = path.read_text(encoding="utf-8")
    if CLOSING not in text: closing_missing = True
    else: closing_missing = False
    text = fill(text)
    fm, body = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S).groups()
    num = int(re.search(r"^number:\s*(\d+)", fm, re.M).group(1))
    title, seo, desc = field(fm, "title"), field(fm, "seoTitle"), field(fm, "description")
    kw, alt = city(field(fm, "primaryKeyword")), city(field(fm, "heroAlt"))
    words = len(re.sub(r"[#>*_`|\[\]()!-]", " ", body).split())
    first100 = city(" ".join(re.sub(r"[#>*_`|\[\]()!]", " ", body).split()[:100]))
    h2s = [city(h) for h in re.findall(r"^## (.+)$", body, re.M)]
    internal = re.findall(r"\]\((/[^)\s]*)", body)
    faqs = len(re.findall(r"^\s*- q:", fm, re.M))
    newer = num >= ANSWER_FIRST
    lo, hi = (2000, 2600) if num in PILLARS else (1500, 2200) if newer else (1200, 1750)
    faq_lo, faq_hi = (5, 6) if newer else (3, 4)
    issues = []
    if len(title) > 65: issues.append(f"title {len(title)}>65")
    if len(page_title(seo)) > 60: issues.append(f"seoTitle {len(page_title(seo))}>60")
    if not 145 <= len(desc) <= 158: issues.append(f"description {len(desc)} not 145-158")
    for where, hay in [("seoTitle", seo), ("title", title), ("description", desc), ("heroAlt", alt), ("first 100 words", first100)]:
        if kw not in city(hay): issues.append(f"keyword missing in {where}")
    if not any(kw in h for h in h2s): issues.append("keyword missing in every H2")
    if re.search(r"^# ", body, re.M): issues.append("extra H1 in body")
    if len(internal) < 3: issues.append(f"only {len(internal)} internal links")
    if not faq_lo <= faqs <= faq_hi: issues.append(f"{faqs} FAQs")
    if newer:
        answer_words = len(field(fm, "answer").split())
        if not 40 <= answer_words <= 60: issues.append(f"answer {answer_words} words (want 40-60)")
        if not re.search(r"^\|.*\|$", body, re.M) and not re.search(r"^- \[[ x]\]|^- ✓|^\d+\. \*\*", body, re.M):
            issues.append("no table or checklist")
        if len({l for l in internal if l.startswith("/blog/")}) < 3: issues.append("fewer than 3 related-post links")
        if not any(l.startswith("/services") for l in internal): issues.append("no /services link")
        if not any(l.split("#")[0] in ("/faq", "/tattoo-artist") for l in internal): issues.append("no /faq or /tattoo-artist link")
        for h in ("how we do it at xing", "conclusion"):
            if not any(x.startswith(h) for x in h2s): issues.append(f"missing H2 '{h}'")
    if "Peace's tip" not in body and "Peace’s tip" not in body: issues.append("no Peace's tip")
    if closing_missing: issues.append("closing line missing")
    if BANNED.search(text): issues.append(f"banned price/percent term: {BANNED.search(text).group(0)!r}")
    if not lo <= words <= hi: issues.append(f"{words} words (want {lo}-{hi})")
    if issues:
        problems += 1
        print(f"#{num:02d} {path.stem}: " + "; ".join(issues))
    else:
        print(f"#{num:02d} {path.stem}: ok ({words} words)")

print(f"\n{len(POSTS)} posts, {problems} with issues")
sys.exit(1 if problems else 0)
