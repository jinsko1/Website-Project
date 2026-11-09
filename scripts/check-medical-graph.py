"""Validate the curated graph before building: python3 scripts/check-medical-graph.py."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
graph = json.loads((ROOT / 'data/medicine/graph.json').read_text())
concepts = {c['id']: c for c in graph['concepts']}
assert len(concepts) == len(graph['concepts']), 'Duplicate concept IDs'
categories = {'mechanism', 'disease', 'physiology', 'finding', 'test', 'treatment'}
systems = {'renal', 'cardiovascular', 'respiratory', 'integrative'}
types = {'can_cause', 'assessed_using', 'treated_by', 'may_require', 'prerequisite_for', 'compensated_by'}
for concept in concepts.values():
    assert concept['categories'] and set(concept['categories']) <= categories, concept
    assert concept['system'] in systems, concept
    assert concept['kind'] in {'disease', 'etiology', 'physiology', 'manifestation'}, concept
    assert 'studied' not in concept, 'Coverage must be derived from content'
    assert all(isinstance(alias, str) and alias.strip() for alias in concept.get('aliases', [])), concept
    for note in concept.get('details', []):
        assert note['reference'] in graph['sources'], note
        assert note['type'] in types and note['name'] and note['summary'], note
    assert concept['name'] and concept['summary'], concept
    if concept.get('article'):
        article = Path(concept['article'])
        assert not article.is_absolute() and '..' not in article.parts, concept
        assert article.parts[0] in {'blog', 'research'}, concept
        # Optional article references may point to work not published yet.
        # Hugo deliberately leaves those resources unlinked until available.
seen = set()
for relation in graph['relations']:
    key = (relation['source'], relation['type'], relation['target'])
    assert key not in seen, f'Duplicate relationship: {key}'
    seen.add(key)
    assert relation['source'] in concepts and relation['target'] in concepts, key
    assert relation['source'] != relation['target'], key
    assert relation['type'] in types, key
    assert relation['reference'] in graph['sources'], key

# Cycles would make the recommended prerequisite order impossible.
visiting, visited = set(), set()
def visit(concept_id):
    assert concept_id not in visiting, f'Prerequisite cycle at {concept_id}'
    if concept_id in visited:
        return
    visiting.add(concept_id)
    for relation in graph['relations']:
        if relation['type'] == 'prerequisite_for' and relation['source'] == concept_id:
            visit(relation['target'])
    visiting.remove(concept_id)
    visited.add(concept_id)
for concept_id in concepts:
    visit(concept_id)
print(f'Validated {len(concepts)} concepts, {len(seen)} relationships, and acyclic prerequisites.')
