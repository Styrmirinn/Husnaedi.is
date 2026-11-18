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
page('index.html','home','Húsnæði.is',r('parts/home-main.html'),r('parts/home.js'),True)
page('um-okkur.html','about','Um Húsnæði.is',r('parts/about-main.html'),r('parts/about.js'),False)
print('built')
