# Hugo Narrow migration notes

This site now keeps Hugo Markdown files in `content/` as the writing source. Quarto files are no longer part of the build path.

## Citation workflow

Keep writing citations in the `.md` files with Pandoc syntax:

```markdown
This is a cited claim [@smith2024].
```

Keep Zotero exporting to `references.bib`. When you add or update citations, regenerate the citation-processed Hugo build content:

```bash
python3 scripts/build_hugo_content.py
hugo
```

The generator reads editable files from `content/`, runs Pandoc with `--citeproc`, uses `references.bib`, and writes processed HTML into `.hugo-content/`. Hugo is configured to build from `.hugo-content/`, so the files you edit are never overwritten.

If you add `styles/cell.csl`, the generator will automatically use it. Otherwise Pandoc uses its default citation style.

## Source and output

- Edit source files in `content/`.
- Put images and static assets in `static/`.
- Do not hand-edit generated files in `.hugo-content/`.
- `.hugo-content/`, `public/`, `public-hugo/`, and `themes/` are ignored by git to keep the repository focused on source files.
- Hugo Narrow is installed locally at `themes/hugo-narrow`. If you clone the repository somewhere new, reinstall it with:

```bash
git clone https://github.com/tom2almighty/hugo-narrow themes/hugo-narrow
```
