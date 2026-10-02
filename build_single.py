#!/usr/bin/env python3
"""Bundle the game into one self-contained HTML file (dist/statecraft.html) — playable in any browser."""
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
www = root / 'app/src/main/assets/www'
html = (www / 'index.html').read_text()
css = (www / 'css/style.css').read_text()
html = html.replace('<link rel="stylesheet" href="css/style.css">', '<style>\n' + css + '\n</style>')
def inline(m):
    js = (www / m.group(1)).read_text().replace('</script>', '<\\/script>')
    return '<script>\n' + js + '\n</script>'
html = re.sub(r'<script src="([^"]+)"></script>', inline, html)
out = root / 'dist'; out.mkdir(exist_ok=True)
(out / 'statecraft.html').write_text(html)
print('wrote', out / 'statecraft.html', round(len(html) / 1024), 'KB')
