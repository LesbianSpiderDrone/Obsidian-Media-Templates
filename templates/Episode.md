<%*
// ── Media context ─────────────────────────────────────────────────────────────
const _qa_test = `{{VALUE:mediaTitle}}`;
const _fromQA  = !_qa_test.startsWith("{{VALUE");
let _mediaTitle, _mediaSlug, _season, _episode, _noteTitle, _episodeCode;

if (_fromQA) {
    _mediaTitle  = `{{VALUE:mediaTitle}}`;
    _mediaSlug   = `{{VALUE:mediaSlug}}`;
    _season      = `{{VALUE:season}}`;
    _episode     = `{{VALUE:episode}}`;
    _noteTitle   = `{{VALUE:noteTitle}}`;
    _episodeCode = `{{VALUE:episodePadded}}`;
} else {
    const _plugin = window?.MediaTemplates?.api;
    if (_plugin) {
        const _list = _plugin.getMediaList();
        const _sel  = _list.length
            ? await tp.system.suggester(
                _list.map(m => `${m.title}  [${m.type}]`),
                _list, false, "Select show:")
            : null;
        if (_sel) { _mediaTitle = _sel.title; }
    }
    if (!_mediaTitle) _mediaTitle = await tp.system.prompt("Show title:", "");
    _mediaSlug   = _mediaTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    _season      = await tp.system.prompt("Season:", "1");
    _episode     = await tp.system.prompt("Episode:", "1");
    _noteTitle   = await tp.system.prompt("Episode title:", "");
    const s      = (_season  ?? "1").padStart(2, "0");
    const e      = (_episode ?? "1").padStart(2, "0");
    _episodeCode = `S${s}E${e}`;
}
_%>---
tags:
  - episode
  - media/<%- _mediaSlug %>
media: "[[<%- _mediaTitle %>]]"
season: <%- _season %>
episode: <%- _episode %>
title: "<%- _noteTitle %>"
episode_code: <%- _episodeCode %>
air_date:
directed_by:
written_by:
status: unwatched
rating:
---

# <%- _noteTitle %>

> [!info] Episode Info
> **Show**: [[<%- _mediaTitle %>]]
> **<%- _episodeCode %>** — Season <%- _season %>, Episode <%- _episode %>
> **Air Date**:
> **Director**:
> **Writer**:

## Synopsis

> [!abstract] Brief Synopsis
>

## Key Events

1.
2.
3.

## Character Focus

| Character | Arc / Development |
|-----------|------------------|
|           |                  |

## New This Episode

### Characters Introduced

-

### Locations Introduced

-

### Concepts / Reveals

-

## World-Building

> [!example] Lore Drops
> -

## Foreshadowing & Callbacks

- **Foreshadows**:
- **Callbacks to**:

## Memorable Quotes

> ""
> —

## Analysis & Notes



## Episode Connections

- **Previous**:
- **Next**:
