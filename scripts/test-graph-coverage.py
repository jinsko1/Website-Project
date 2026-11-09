"""Exercise Hugo coverage generation with isolated article fixtures."""
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
pinned = ROOT / '.tools/hugo/0.169.0/hugo'
hugo = str(pinned) if pinned.exists() else shutil.which('hugo')
with tempfile.TemporaryDirectory(prefix='graph-coverage-') as tmp:
    tmp = Path(tmp)
    content = tmp / 'content'
    (content / 'blog').mkdir(parents=True)
    (content / 'research').mkdir()
    shutil.copy(ROOT / 'content/graph.md', content / 'graph.md')
    fixtures = {
        'blog/aki.md': ('title: An explicitly linked AKI article', 'Kidney notes.'),
        'blog/mention.md': ('title: Mechanisms', 'GFR, HYPOXEMIA, and insulin deficiency. Not GFRISH or potassium excretions.'),
        'research/title.md': ('title: Renal perfusion', 'A dedicated article with a matching title.'),
        'blog/tagged.md': ('title: Renal regulation\ngraphConcepts: [renal-acid-excretion]', 'An explicitly declared dedicated article.'),
        'blog/draft.md': ('title: Potassium excretion\ndraft: true', 'Potassium excretion.'),
        'blog/dka.md': ('title: DKA', 'An article identified by its alias title.'),
    }
    for name, (frontmatter, body) in fixtures.items():
        (content / name).write_text(f'---\n{frontmatter}\ndate: 2020-01-01\n---\n{body}\n')
    result = subprocess.run([hugo, '--contentDir', str(content), '--destination', str(tmp / 'public')], cwd=ROOT, capture_output=True, text=True)
    assert result.returncode == 0, result.stdout + result.stderr
    data = json.loads((tmp / 'public/graph/index.json').read_text())
    concepts = {c['id']: c for c in data['concepts']}
    assert concepts['aki']['coverage'] == 'article', 'Explicit article must fill even without a body match'
    assert concepts['renal-perfusion']['coverage'] == 'article', 'Exact title must count as dedicated'
    assert concepts['renal-acid-excretion']['coverage'] == 'article', 'Frontmatter must identify dedicated coverage'
    assert concepts['dka']['coverage'] == 'article', 'Alias title must identify dedicated coverage'
    for key in ['gfr', 'hypoxemia', 'insulin-deficiency']:
        assert concepts[key]['coverage'] == 'mentioned', key
        assert len(concepts[key]['mentions']) == 1, key
    assert concepts['potassium-excretion']['coverage'] == 'unmentioned', 'Drafts and partial-word matches must not count'
    assert concepts['heart-failure']['coverage'] == 'unmentioned', 'Absent concepts stay hollow'
    assert not any('draft' in m['url'] for c in concepts.values() for m in c['mentions'])
print('PASS: explicit article, title/alias, frontmatter, whole-word mentions, evidence, and draft exclusion.')
