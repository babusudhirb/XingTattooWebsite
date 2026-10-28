"""Audit the built site (.output/public) for consistency with src/data/business.ts and SEO basics.

Run after `npm run build`:  python -I scripts/audit_site.py
Checks every prerendered page: title rules (≤60, the right suffix, unique), description, canonical,
og:image, one TattooParlor block whose name/address/phone match the footer, the one hours format,
banned spellings in visible text (customer review quotes are exempt), Bangalore/Bengaluru usage,
and that every internal link resolves to a page or file.
"""
import html
import json
import re
import subprocess
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
APP = Path(__file__).resolve().parent.parent
ROOT = APP / ".output" / "public"

# Canonical values come from the single source of truth, never from a copy here.
B = json.loads(subprocess.run(
    ["node", "-e", """import('./src/data/business.ts').then((b) =>
      process.stdout.write(JSON.stringify({ name: b.BUSINESS_NAME, id: b.BUSINESS_ID, site: b.SITE_URL,
        address: b.ADDRESS, phone: b.PHONE_DISPLAY, e164: b.PHONE_E164, hours: b.HOURS_TEXT,
        open: b.OPEN_TIME, close: b.CLOSE_TIME })))"""],
    cwd=APP, capture_output=True, text=True, encoding="utf-8", check=True).stdout)
# Customer review quotes (src/data/reviews.ts uses an @/ import, so read the quotes as text)
B["quotes"] = [json.loads(q) for q in re.findall(
    r'quote:\s*("(?:[^"\\]|\\.)*")', (APP / "src/data/reviews.ts").read_text(encoding="utf-8"))]
SITE, BUSINESS_ID = B["site"], B["id"]
LONG, SHORT = " | Xing Premium Tattoo Studio", " | Xing Premium"
BANNED = [  # case-sensitive substrings that must not appear in visible text, titles or descriptions
    "Brookfield", "DMart", "Dmart", "D-Mart", "Gray", "Xing Studio", "XING tattoo", "XING Tattoo",
    "Xing Tattoo Studio", "Artist Peace", "Mr Peace", "Mr. Peace", "Oct 2026", "25–31 Oct",
    "Tuesday: Closed", "Tuesdays closed", "4.8★", "600+ reviews", "1,600+", "5000+", "A Block",
    "John Doe", "Krishna D J", "₹", "Cleanse & Rest",
]
PHONE_RE = re.compile(r"(?:\+91[\s-]?)?\b\d{5}\s?\d{5}\b")
ALLOWED = {  # exact strings exempt from BANNED, and why
    "XING TATTOO STUDIO": "offer-page wordmark next to the logo (logo artwork is the owner's to replace)",
}


def visible_text(h):
    h = re.sub(r"<script[\s\S]*?</script>|<style[\s\S]*?</style>", " ", h)
    return " ".join(html.unescape(re.sub(r"<[^>]+>", " ", h)).split())


def page_url(f):
    rel = f.relative_to(ROOT).as_posix()[:-5]
    return "/" if rel == "index" else "/" + rel


pages = sorted(ROOT.rglob("*.html"))
problems, footers, titles = 0, {}, {}
for f in pages:
    h = f.read_text(encoding="utf-8")
    url = page_url(f)
    is404 = url == "/404"
    issues = []
    title = html.unescape((re.search(r"<title>(.*?)</title>", h) or [None, ""])[1])
    desc_m = re.search(r'<meta name="description" content="([^"]*)"', h)
    desc = html.unescape(desc_m.group(1)) if desc_m else ""
    canon = (re.search(r'<link rel="canonical" href="([^"]+)"', h) or [None, ""])[1]

    # Titles: ≤60; "| Xing Premium Tattoo Studio" when that fits, else "| Xing Premium"; unique
    base = re.sub(r"\s*\|\s*Xing Premium( Tattoo Studio)?$", "", title)
    want_suffix = LONG if len(base + LONG) <= 60 else SHORT
    if len(title) > 60: issues.append(f"title {len(title)}")
    if title != base + want_suffix: issues.append(f"title suffix (want '{want_suffix.strip()}')")
    titles.setdefault(title, []).append(url)

    if not is404:
        if not 145 <= len(desc) <= 158: issues.append(f"desc {len(desc)}")
        if not re.search(r"Brookefield|Bangalore|Bengaluru", desc): issues.append("desc locality")
        want = SITE + ("/" if url == "/" else url)
        if canon != want: issues.append(f"canonical {canon or 'missing'}")
        if 'property="og:image"' not in h: issues.append("og:image")

    # Schema: exactly one TattooParlor, and its NAP + hours match the canonical values
    lds = [json.loads(x) for x in re.findall(r'<script type="application/ld\+json">([\s\S]*?)</script>', h)]
    nodes = [g for j in lds for g in j.get("@graph", [j])]
    biz = [n for n in nodes if n.get("@type") == "TattooParlor"]
    if len(biz) != 1 or biz[0].get("@id") != BUSINESS_ID:
        issues.append(f"TattooParlor x{len(biz)}")
    else:
        a, A = biz[0]["address"], B["address"]
        # Schema = the GBP street line + locality; the display line adds the GBP sublocality
        schema_addr = f'{a["streetAddress"]}, {A["sublocality"]}, {a["addressLocality"]}, {a["addressRegion"]} {a["postalCode"]}, India'
        if biz[0]["name"] != B["name"]: issues.append("schema name")
        if schema_addr != A["full"]: issues.append(f"schema address {schema_addr!r}")
        if biz[0]["telephone"] != B["e164"]: issues.append("schema telephone")
        oh = biz[0]["openingHoursSpecification"][0]
        if (oh["opens"], oh["closes"]) != (B["open"], B["close"]) or "Tuesday" in oh["dayOfWeek"] or len(oh["dayOfWeek"]) != 6:
            issues.append("schema hours")

    # Post dates ("28 Oct 2026") are real dates, not offer copy — leave <time> out of the text checks
    text = visible_text(re.sub(r"<time[^>]*>[\s\S]*?</time>", " ", h))
    for q in B["quotes"]:  # customer review quotes are never edited
        text = text.replace(" ".join(q.split()), " ")
    # The GBP address spells it "Brookfield"; allowed there and nowhere else
    banned_text = text.replace(B["address"]["full"], " ")
    for ok in ALLOWED:
        banned_text = banned_text.replace(ok, " ")
    for b in BANNED:
        if b in banned_text or b in title or b in desc: issues.append(f"banned {b!r}")
    for ph in PHONE_RE.findall(text):
        if re.sub(r"\D", "", ph)[-10:] != "8970007818": issues.append(f"phone {ph}")
        elif ph.strip() != B["phone"]: issues.append(f"phone format {ph!r}")
    if re.search(r"\d+(?:\.\d)?★", text) and not re.fullmatch(r"(?:4\.9★)?", "".join(set(re.findall(r"\d+(?:\.\d)?★", text)))):
        issues.append("rating other than 4.9★")
    for n in re.findall(r"\b(\d+) (?:Google )?reviews\b", text):
        if n != "211": issues.append(f"review count {n}")

    # City names: never both in one heading; Bangalore only in the business name, titles and headings
    for lvl, inner in re.findall(r"<h([1-6])[^>]*>([\s\S]*?)</h\1>", h):
        t = visible_text(inner)
        if "Bangalore" in t and "Bengaluru" in t: issues.append(f"h{lvl} has both city names")
    # Running text = the page minus <head>, headings and navigation (TOC, breadcrumbs, chips repeat headings)
    running = re.sub(r"<(head|nav|h[1-6])\b[\s\S]*?</\1>", " ", h)
    for para in re.findall(r"<(?:p|li|td|dd|address|figcaption)[^>]*>([\s\S]*?)</(?:p|li|td|dd|address|figcaption)>", running):
        t = visible_text(para).replace(B["name"], "").replace("Local: Bangalore", "")
        if "Bangalore" in t: issues.append(f"Bangalore in text: {t[:60]!r}")

    foot = re.search(r"<footer[\s\S]*?</footer>", h)
    ft = visible_text(foot.group(0)) if foot else ""
    if "Contact Us" in ft:
        footers.setdefault(ft[ft.find("Contact Us"):], []).append(url)
        if B["address"]["full"] not in ft or B["phone"] not in ft or B["name"] not in ft:
            issues.append("footer NAP differs from schema")
    else:
        # Landing pages with their own footer must still show the same NAP + hours
        for must in [B["address"]["full"], B["phone"], B["hours"]]:
            if must not in text: issues.append(f"missing {must[:30]!r}")
    for href in set(re.findall(r'href="(/[^"#?]*)', h)):
        if href in ("/",) or href.startswith("//"): continue
        target = ROOT / href.lstrip("/")
        if not (target.exists() or target.with_name(target.name + ".html").exists()):
            issues.append(f"broken {href}")
    if issues:
        problems += 1
        print(f"{url}: " + "; ".join(dict.fromkeys(issues)))

dupes = {t: u for t, u in titles.items() if len(u) > 1}
for t, u in dupes.items():
    print(f"duplicate title {t!r}: {u[:4]}")
print(f"\n{len(pages)} pages, {problems} with issues, {len(dupes)} duplicate titles")
print(f"footer contact/hours variants: {len(footers)}")
if len(footers) > 1:
    for k, v in footers.items():
        print(" -", v[:3], "…", k[:160])
for extra in ["sitemap.xml", "robots.txt", "site.webmanifest", "sitemap-pages.xml", "sitemap-blog.xml", "llms.txt", "blog/rss.xml"]:
    print(f"{extra}: {'ok' if (ROOT / extra).exists() else 'MISSING'}")
sys.exit(1 if problems or dupes or len(footers) > 1 else 0)
