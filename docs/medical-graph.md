# Medical knowledge graph

Graph is a separate navigation entry at `/graph/`. Hugo builds `/graph/index.json` from `data/medicine/graph.json`. Locally bundled Cytoscape.js renders the map without a backend or CDN.

## Interaction and visual model

The entire graph opens by default. Drag background to pan, scroll/pinch or use +/− to zoom, and drag circles to reposition concepts. Hover highlights a neighborhood and its connections immediately; unrelated edges fade to 4% opacity. Clicking only changes concept details, without locking connection emphasis to the selected node. Clicking changes concept details without rerunning layout, hiding other nodes, or resetting the viewport. Search centers its result at the current zoom. Fit deliberately resets the viewport; Reset returns to the full graph. Nearby and Foundations are optional focused views. Expand opens a larger workspace; Escape closes it. The canvas supports arrow-key panning, +/− zoom, and Home to fit. Search results support keyboard selection without a persistent directory.

Four broad primary types determine accent colors: disease (rose), etiology/mechanism (amber), physiology (blue), manifestation (lavender). Types are navigation aids, not mutually exclusive clinical truths. A disease or finding can also cause something else; edges carry that meaning. Body-system metadata does not influence colors or force layout, allowing cross-system connections to determine the network.

Nodes are circles with coverage derived at build time from published Blog and Research content. A dedicated article fills the circle; a mention produces a half-filled circle; neither leaves it hollow. This reflects writing coverage rather than mastery. There is no manual `studied` flag.

A dedicated article is identified by an explicit `article` content path on the concept, an article's `graphConcepts` frontmatter list containing the concept ID, or an exact title match to the concept name/alias. An explicit content path takes precedence. A short mention or longer discussion does not automatically qualify as a dedicated article merely because a term occurs frequently. Mentions match concept names and curated `aliases` in page titles and rendered plain text, ignoring case and punctuation and requiring whole words/phrases. Drafts and non-article pages do not count. The panel labels coverage Studied, Mentioned, or Unstudied. The concept type uses its node color; a dedicated article retains a Read article link. Mention evidence is retained in generated JSON without a dropdown. This is lexical matching, not semantic inference: add aliases for synonyms or spelling variations; ambiguous acronyms need care. Missing aliases can undercount mentions. Coverage updates on the next Hugo build.


Tests and treatments are retained as `details` in the curated data, not separate graph nodes. Clinical notes and the About & sources section are omitted from the page; references remain available in the generated graph JSON. Add a new node only for a concept worth connecting and explaining across topics. The current graph contains 28 concepts and 36 relationships.

## Data and validation

Concepts have stable `id`, `name`, `kind`, `categories`, `system`, `summary`, and optional `aliases` fields. Categories may overlap. An optional `article` is a Hugo content path such as `blog/aki`, not a URL; Hugo resolves its permalink and excludes unavailable/draft resources. `details` entries contain a name, summary, relationship type, and reference key.

Relationships have source, target, type, and reference into `sources`. All arrows read source → relationship → target. Solid edges describe clinical relationships. Dashed `prerequisite_for` edges suggest foundational learning order, not clinical causation; they must remain acyclic. Manually review each relationship and its reference. Do not infer causation from article co-occurrence, graph proximity, or shared type.

The force layout runs once from a deterministic starting arrangement. Selection and resizing preserve node positions and zoom. Position changes are session-only. Text fades below a readable zoom level; selected and hovered labels follow the same 10 CSS pixel readability cutoff as all other labels. Hover state is reapplied after selection, so clicking a stationary pointer does not clear neighborhood highlighting. Relationship labels appear on edge hover/tap. The Connections menu is omitted; the graph presents the relationships directly. Graph distance is not diagnostic probability or curricular importance.

Run `python3 scripts/check-medical-graph.py` to validate references, article paths, types, aliases, duplicate edges, endpoints, and prerequisite cycles. Then build with Hugo. Implementation: `layouts/graph/`, `assets/js/graph/medical-graph.js`, and `assets/css/graph.css`. Dependency and MIT license: `static/vendor/cytoscape/`.

## Educational rationale and limits

These papers inform design choices; they do not validate this particular interface or prove that browsing a graph improves learning.

- [Woods, Brooks & Norman (2007), *It all make sense: biomedical knowledge, causal connections and memory in the novice diagnostician*](https://pubmed.ncbi.nlm.nih.gov/17318360/), doi:10.1007/s10459-006-9055-x. Experiments using artificial diseases compared causal explanations with learning features without those explanations; causal learning supported retention of diagnostic performance. **Design inference:** preserve explicit, directional mechanisms rather than treating all connections as generic similarity. The experimental task differs from an open medical graph.
- [Veronese et al. (2013), randomized concept-mapping pilot in first-year medical students](https://pubmed.ncbi.nlm.nih.gov/23617466/), doi:10.3109/0142159X.2013.785628. Concept maps were used in problem-based learning tutorials; qualitative themes included physiological integration and identifying gaps. Exam results used a prespecified alpha of 0.10. **Design inference:** connect physiology to diseases and manifestations across systems. This preliminary study involved active mapping in tutorials, not passive browsing, so stronger learning-effect claims are unwarranted.
- [Woods (2007), *Science is fundamental: the role of biomedical knowledge in clinical reasoning*](https://pubmed.ncbi.nlm.nih.gov/18045369/), doi:10.1111/j.1365-2923.2007.02911.x. This conceptual synthesis argues for explicit biomedical–clinical links. **Design inference:** retain physiology as first-class nodes and cross-links; avoid organ-system silos. This is a synthesis, not an interface trial.

The choice of four colors, article/mention coverage, hidden edge labels, and tests/treatments in details is a product-design judgment responding to the author's preferences, not a finding established by those studies. A useful next learning activity would be explaining a causal path in one's own words and checking it against a source; no new quiz or recommendation panel is added here.

## Technical references

- [Obsidian Graph view](https://obsidian.md/help/plugins/graph): free navigation, circular nodes, hover neighborhoods, zoom-dependent text, and configurable forces informed the interaction model.
- [Cytoscape.js documentation](https://js.cytoscape.org/): built-in CoSE force layout, grabbing, panning/zooming, selectors, and minimum zoomed font size support the implementation. The existing pinned local version remains 3.33.1; no dependency changes are needed for this graph size.
