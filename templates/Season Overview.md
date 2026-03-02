<%*
const _qa_test = `{{VALUE:mediaTitle}}`;
const _fromQA  = !_qa_test.startsWith("{{VALUE");
let _mediaTitle, _mediaSlug, _season, _noteTitle;

if (_fromQA) {
    _mediaTitle = `{{VALUE:mediaTitle}}`;
    _mediaSlug  = `{{VALUE:mediaSlug}}`;
    _season     = `{{VALUE:season}}`;
    _noteTitle  = `{{VALUE:noteTitle}}`;
} else {
    const _plugin = window?.MediaTemplates?.api;
    if (_plugin) {
        const _list = _plugin.getMediaList();
        const _sel  = _list.length
            ? await tp.system.suggester(_list.map(m => `${m.title}  [${m.type}]`), _list, false, "Select show:")
            : null;
        if (_sel) { _mediaTitle = _sel.title; }
    }
    if (!_mediaTitle) _mediaTitle = await tp.system.prompt("Show title:", "");
    _mediaSlug = _mediaTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    _season    = await tp.system.prompt("Season number:", "1");
    _noteTitle = `${_mediaTitle} — Season ${_season}`;
}
_%>---
tags:
  - season
  - media/<%- _mediaSlug %>
media: "[[<%- _mediaTitle %>]]"
season: <%- _season %>
episodes:
air_date_start:
air_date_end:
status: unwatched
rating:
---

# <%- _mediaTitle %> — Season <%- _season %>

> [!info] Season Overview
> **Show**: [[<%- _mediaTitle %>]]
> **Season**: <%- _season %>
> **Episodes**:
> **Aired**:

## Main Arc



## Episode List

| # | Title | Rating | Notes |
|---|-------|--------|-------|
| 1 |       |        |       |

## Key Developments

### Character Arcs



### World-Building



### Major Plot Twists



## New Additions

### New Characters

-

### New Locations

-

### New Concepts / Systems

-

## Deaths & Departures

-

## Season Themes

-

## Connections

- **Previous Season**:
- **Next Season**:

## Rating & Review



## Notes
