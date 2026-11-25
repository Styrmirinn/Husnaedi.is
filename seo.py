# Setur favicon, lýsingar, canonical, Open Graph og sitemap á allar síður.
# Keyrt sjálfkrafa í lok build.py (sem keyrir á eftir gen_run.py).
import os, re, json, glob, html, datetime

B = os.path.dirname(os.path.abspath(__file__)) + '/'
SITE = 'https://husnaedi.is'

# Titill (á íslensku, án " | Húsnæði.is") og lýsing fyrir hverja síðu.
# Titill None = halda þeim sem fyrir er.
PAGES = {
 'index.html': (None, 'Óháðar og áreiðanlegar upplýsingar um húsnæðislán, húsnæðismarkaðinn og leigumarkaðinn á Íslandi, settar fram á mannamáli. Reiknivélar, hagtölur og heimildir.'),
 'um-okkur.html': (None, 'Um Húsnæði.is, óháðan upplýsingavef um íslensk húsnæðismál. Kynntu þér fólkið á bak við vefinn og tilganginn með honum.'),
 'husnaedislan.html': (None, 'Allt um húsnæðislán á einum stað: fyrstu kaup, hlutdeildarlán, séreignarsparnaður, verðtrygging, lánareiknar og lög og reglugerðir.'),
 'fyrstu-kaup.html': ('Fyrstu kaup á íbúð', 'Upplýsingar og heimildir fyrir fyrstu kaupendur: það sem gott er að vita áður en fyrsta íbúðin er keypt á Íslandi.'),
 'hlutdeildarlan.html': (None, 'Hvað eru hlutdeildarlán og hverjir geta fengið þau? Greinar, skýrslur og heimildir um hlutdeildarlán HMS á einum stað.'),
 'sereignarsparnadur.html': ('Séreignarsparnaður og íbúðakaup', 'Hvernig nýtist séreignarsparnaður við íbúðakaup og til að greiða inn á húsnæðislán? Greinar og heimildir á einum stað.'),
 'verdtrygging.html': (None, 'Lærðu um verðtryggingu húsnæðislána: greinar, skýrslur, myndbönd og Excel reiknilíkön sem bera saman verðtryggð og óverðtryggð lán.'),
 'lanareiknar.html': (None, 'Reiknivélar Húsnæði.is fyrir greiðslubyrði, hámarkslán og eigið fé, auk lánareiknivéla banka, lífeyrissjóða og HMS á einum stað.'),
 'log-husnaedislan.html': ('Lög og reglugerðir um húsnæðislán', 'Lög og reglugerðir sem gilda um húsnæðislán á Íslandi, með beinum tenglum á gildandi texta.'),
 'husnaedismarkadurinn.html': (None, 'Fræðileg gögn, fjölmiðlaumfjöllun, mánaðarskýrslur HMS, ársskýrslur Íbúðalánasjóðs og lög um íslenska húsnæðismarkaðinn.'),
 'fraedileg-gogn.html': ('Fræðileg gögn um húsnæðismarkaðinn', 'Rannsóknir, skýrslur og ritgerðir um íslenska húsnæðismarkaðinn, flokkaðar og aðgengilegar á einum stað.'),
 'fjolmidlaumfjollun.html': ('Fjölmiðlaumfjöllun um húsnæðismarkaðinn', 'Greinar og fréttir úr íslenskum fjölmiðlum um húsnæðismarkaðinn, flokkaðar eftir efni.'),
 'hms-manadarskyrslur.html': (None, 'Mánaðarskýrslur HMS um stöðu og þróun íslenska húsnæðismarkaðarins, raðaðar eftir árum.'),
 'arsskyrslur-ils.html': (None, 'Ársskýrslur og ársreikningar Íbúðalánasjóðs frá 1999, auk ársskýrslna HMS og ársreikninga arftaka sjóðsins.'),
 'log-husnaedismarkadur.html': ('Lög og reglugerðir um húsnæðismarkaðinn', 'Lög og reglugerðir sem gilda um íslenska húsnæðismarkaðinn, með beinum tenglum á gildandi texta.'),
 'leigumarkadurinn.html': (None, 'Upplýsingar um íslenska leigumarkaðinn: fræðileg gögn, fjölmiðlaumfjöllun, leigumarkaðskönnun HMS, Airbnb og lög um leigu.'),
 'fraedileg-gogn-leiga.html': ('Fræðileg gögn um leigumarkaðinn', 'Rannsóknir, skýrslur og ritgerðir um íslenska leigumarkaðinn á einum stað.'),
 'fjolmidlaumfjollun-leiga.html': ('Fjölmiðlaumfjöllun um leigumarkaðinn', 'Greinar og fréttir úr íslenskum fjölmiðlum um leigumarkaðinn.'),
 'leigumarkadskonnun.html': (None, 'Niðurstöður leigumarkaðskönnunar HMS: helstu tölur um leigjendur, leiguverð og stöðuna á íslenska leigumarkaðnum.'),
 'airbnb.html': ('Airbnb og skammtímaleiga', 'Rannsóknir, fréttir og gögn um áhrif Airbnb og skammtímaleigu á húsnæðismarkaðinn og leigumarkaðinn á Íslandi.'),
 'log-leigumarkadur.html': ('Lög og reglugerðir um leigumarkaðinn', 'Lög og reglugerðir sem gilda um leigumarkaðinn á Íslandi, með beinum tenglum á gildandi texta.'),
 'hagtolur.html': (None, 'Helstu hagtölur og mælaborð um íslenska húsnæðismarkaðinn á einum stað, með tenglum á opinberar gagnaveitur.'),
 'greidslubyrdi.html': (None, 'Reiknaðu mánaðargreiðslur, heildarvaxtakostnað og þróun eftirstöðva verðtryggðra og óverðtryggðra húsnæðislána.'),
 'hamarkslan.html': (None, 'Sjáðu hversu hátt húsnæðislán þú getur fengið miðað við tekjur, önnur lán og eigið fé.'),
 'eiginfjarframlag.html': (None, 'Sjáðu hversu mikið eigið fé þú þarft til fasteignakaupa, að meðtöldu stimpilgjaldi og öðrum kaupkostnaði.'),
}
PRIORITY = {'index.html': '1.0', 'greidslubyrdi.html': '0.9', 'hamarkslan.html': '0.9', 'eiginfjarframlag.html': '0.9',
            'husnaedislan.html': '0.8', 'husnaedismarkadurinn.html': '0.8', 'leigumarkadurinn.html': '0.8', 'verdtrygging.html': '0.8', 'lanareiknar.html': '0.8'}

START, END = '<!--seo-->', '<!--/seo-->'
e = lambda s: html.escape(s, quote=True)

PAGES_ON_DISK = set()
def clean_links(s):
    # Hreinar slóðir: verdtrygging.html -> /verdtrygging, index.html -> /
    def rep(m):
        name, rest = m.group(2), m.group(3) or ''
        if name + '.html' not in PAGES_ON_DISK: return m.group(0)
        return m.group(1) + ('/' if name == 'index' else '/' + name) + rest + '"'
    return re.sub(r'(href=")(?:\./|/)?([a-z0-9-]+)\.html((?:[?#][^"]*)?)"', rep, s)

def process(f):
    p = B + f; s = open(p).read()
    s = re.sub(re.escape(START) + r'.*?' + re.escape(END) + r'\n?', '', s, flags=re.S)
    title_new, desc = PAGES[f]
    if title_new:
        s = re.sub(r'<title>.*?</title>', f'<title>{e(title_new)} | Húsnæði.is</title>', s, count=1)
        def fix_dt(m):
            try:
                o = json.loads(html.unescape(m.group(1))); o['is'] = title_new
                return 'data-title="' + e(json.dumps(o, ensure_ascii=False)) + '"'
            except Exception:
                return m.group(0)
        s = re.sub(r'data-title="([^"]*)"', fix_dt, s, count=1)
    title = html.unescape(re.search(r'<title>(.*?)</title>', s).group(1))
    s = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{e(desc)}">', s, count=1)
    url = SITE + '/' + ('' if f == 'index.html' else f[:-5])
    tags = f'''{START}
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
<link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Húsnæði.is">
<meta property="og:locale" content="is_IS">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/assets/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0048ee">
{END}
'''
    s = s.replace('</head>', tags + '</head>', 1)
    s = re.sub(r'<link rel="icon" href="data:,">\n?', '', s)
    s = clean_links(s)
    open(p, 'w').write(s)
    return url

def run():
    files = sorted(f for f in os.listdir(B) if f.endswith('.html') and not f.startswith('src'))
    PAGES_ON_DISK.update(files)
    missing = [f for f in files if f not in PAGES]
    if missing: raise SystemExit('seo.py: vantar lýsingu fyrir ' + ', '.join(missing))
    today = datetime.date.today().isoformat()
    urls = []
    for f in files:
        urls.append((process(f), PRIORITY.get(f, '0.6')))
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sm += ''.join(f'  <url><loc>{u}</loc><lastmod>{today}</lastmod><priority>{pr}</priority></url>\n' for u, pr in urls)
    sm += '</urlset>\n'
    open(B + 'sitemap.xml', 'w').write(sm)
    open(B + 'robots.txt', 'w').write(f'User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n')
    print('seo', len(files), 'pages')

if __name__ == '__main__':
    run()
