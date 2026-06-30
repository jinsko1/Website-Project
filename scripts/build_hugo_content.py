#!/usr/bin/env python3
from __future__ import annotations

import html
import re
import shutil
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_CONTENT = ROOT / "content"
BUILD_CONTENT = ROOT / ".hugo-content"
BIBLIOGRAPHY = ROOT / "references.bib"
CSL = ROOT / "styles" / "cell.csl"

def split_front_matter(text: str) -> tuple[str, str]:
    if not text.startswith("---\n"):
        return "", text
    end = text.find("\n---", 4)
    if end == -1:
        return "", text
    body_start = text.find("\n", end + 4)
    if body_start == -1:
        return text[4:end], ""
    return text[4:end], text[body_start + 1 :]


def source_for_pandoc(source: Path) -> str:
    front_matter, body = split_front_matter(source.read_text())
    body = re.sub(r"(?m)^```\{mermaid\}\s*$", "```mermaid", body)
    body = re.sub(r"(?m)^```\{\.mermaid\}\s*$", "```mermaid", body)
    return f"---\n{front_matter}\n---\n\n{body}" if front_matter else body


def yaml_has(front_matter: str, key: str) -> bool:
    return re.search(rf"(?m)^{re.escape(key)}\s*:", front_matter) is not None


def yaml_quote(value: str) -> str:
    return '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'


def clean_summary_text(markdown: str) -> str:
    text = re.sub(r"```.*?```", "", markdown, flags=re.DOTALL)
    text = re.sub(r":::\s*\{[^}]*\}", "", text)
    text = text.replace(":::", "")
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)(?:\{[^}]*\})?", "", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"\[@[^\]]+\]", "", text)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"[*_~#>]+", "", text)
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    paragraphs = [re.sub(r"\s+", " ", part).strip() for part in re.split(r"\n\s*\n", text)]
    paragraphs = [part for part in paragraphs if part]
    summary = paragraphs[0] if paragraphs else ""
    return summary[:177].rstrip() + "..." if len(summary) > 180 else summary


def front_matter_with_summary(source: Path) -> str:
    front_matter, body = split_front_matter(source.read_text())
    if not front_matter:
        return ""
    if yaml_has(front_matter, "summary") or yaml_has(front_matter, "description"):
        return front_matter
    summary = clean_summary_text(body)
    if not summary:
        return front_matter
    return f"{front_matter}\nsummary: {yaml_quote(summary)}"


def pandoc_html(source: Path) -> str:
    command = [
        "pandoc",
        "-f",
        "markdown+fenced_code_attributes",
        "--citeproc",
        f"--bibliography={BIBLIOGRAPHY.relative_to(ROOT)}",
        "--metadata",
        "link-citations=true",
        "--metadata",
        "reference-section-title=References",
        "--mathjax",
        "-t",
        "html5",
    ]
    if CSL.exists():
        command.insert(-2, f"--csl={CSL.relative_to(ROOT)}")

    completed = subprocess.run(
        command,
        cwd=ROOT,
        check=True,
        text=True,
        input=source_for_pandoc(source),
        capture_output=True,
    )
    return completed.stdout


def rewrite_links(body: str) -> str:
    replacements = {
        'href="index.md"': 'href="/"',
        'href="blog.md"': 'href="/blog/"',
        'href="research.md"': 'href="/research/"',
    }
    for before, after in replacements.items():
        body = body.replace(before, after)

    def linked_md(match: re.Match[str]) -> str:
        target = Path(match.group(1))
        return f'href="{html.escape(target.with_suffix("").name)}/"'

    body = re.sub(r'href="([^":#]+)\.md"', linked_md, body)
    return body.replace('<h1 class="unnumbered" id="bibliography">References</h1>', '<h2 id="references">References</h2>')


def output_path(source: Path) -> Path:
    relative = source.relative_to(SOURCE_CONTENT)
    if relative.name == "_index.md":
        return BUILD_CONTENT / relative.with_suffix(".html")
    return BUILD_CONTENT / relative.with_suffix(".html")


def write_processed(source: Path) -> None:
    front_matter = front_matter_with_summary(source)
    destination = output_path(source)
    destination.parent.mkdir(parents=True, exist_ok=True)
    body = rewrite_links(pandoc_html(source))
    if front_matter:
        destination.write_text(f"---\n{front_matter}\n---\n\n{body}", encoding="utf-8")
    else:
        destination.write_text(body, encoding="utf-8")


def main() -> None:
    if BUILD_CONTENT.exists():
        shutil.rmtree(BUILD_CONTENT)
    BUILD_CONTENT.mkdir(parents=True)

    for source in sorted(SOURCE_CONTENT.rglob("*.md")):
        write_processed(source)


if __name__ == "__main__":
    main()
