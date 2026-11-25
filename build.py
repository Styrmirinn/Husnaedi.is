# Setur saman síðurnar úr hlutunum í parts/
import re
import os
B=os.path.dirname(os.path.abspath(__file__))+'/'
r=lambda f: open(B+f).read()
logo=r('logo.svg.part').replace('class="logo-svg"','class="logo-svg logo-pre"',1)
head=r('parts/head.html'); header=r('parts/header.html').replace('{{LOGO}}',logo); footer=r('parts/footer.html')
def page(out, pid, title, main, js, keep_comment):
    h=head if keep_comment else re.sub(r'<!--.*?-->','',head,flags=re.S)
    h=h.replace('<title>Húsnæði.is</title>',f'<title>{title}</title>')
    html=f'''{h}
<link rel="stylesheet" href="assets/site.css">
</head>
<body data-page="{pid}">
{header}
{main}

{footer}

<script src="assets/core.js"></script>
<script>
{js}
</script>
</body>
</html>
'''
    open(B+out,'w').write(html)
page('index.html','home','Húsnæði.is',r('parts/home-main.html').replace('{{QCARDS}}',r('parts/qcards.html').replace('{{MORE}}','\n          '+r('parts/qcards-more.html'))),r('parts/home.js'),True)
page('um-okkur.html','about','Um Húsnæði.is',r('parts/about-main.html'),r('parts/about.js'),False)
print('built')

# Reiknivélarnar: sama haus og fótur og aðrar síður. Frumskrár: src_calc_*.html
def calc_page(name):
    s=r(f'src_calc_{name}.html')
    title=re.search(r'<title>(.*?)</title>',s).group(1)
    desc=re.search(r'<meta name="description" content="(.*?)">',s).group(1)
    main=re.search(r'<main id="main">(.*?)</main>',s,re.S).group(1)
    script=re.search(r'<script>\s*(const CALC = .*?)</script>',s,re.S).group(1)
    style=''.join(re.findall(r'<style>.*?</style>',s,re.S))
    h=re.sub(r'<!--.*?-->','',head,flags=re.S).replace('<title>Húsnæði.is</title>',f'<title>{title}</title>')
    h=re.sub(r'<meta name="description" content=".*?">',f'<meta name="description" content="{desc}">',h)
    html=f'''{h}
<link rel="stylesheet" href="assets/site.css">
<link rel="stylesheet" href="reiknivelar/calc.css">
<script src="reiknivelar/config.js"></script>
<script src="reiknivelar/calc-common.js"></script>
{style}
</head>
<body data-page="calc">
{header}
<main id="main" class="calc-main">{main}</main>

{footer}

<script src="assets/core.js"></script>
<script>
{script}
// Tungumálaval í haus síðunnar stýrir líka reiknivélinni
onLang(() => H.setLang(lang));
startSite();
</script>
</body>
</html>
'''
    open(B+name+'.html','w').write(html)
for n in ('greidslubyrdi','hamarkslan','eiginfjarframlag'): calc_page(n)
print('built calcs')
