<%*
const _qa_test = `{{VALUE:mediaTitle}}`;
const _fromQA  = !_qa_test.startsWith("{{VALUE");
let _mediaTitle, _mediaSlug, _mediaType, _mediaYear, _mediaGenres, _mediaStatus;

if (_fromQA) {
    _mediaTitle   = `{{VALUE:mediaTitle}}`;
    _mediaSlug    = `{{VALUE:mediaSlug}}`;
    _mediaType    = `{{VALUE:mediaType}}`;
    _mediaYear    = `{{VALUE:mediaYear}}`;
    _mediaGenres  = `{{VALUE:mediaGenres}}`;
    _mediaStatus  = `{{VALUE:mediaStatus}}`;
} else {
    const _plugin = window?.MediaTemplates?.api;
    let _sel = null;
    if (_plugin) {
        const _list = _plugin.getMediaList();
        _sel = _list.length
            ? await tp.system.suggester(_list.map(m => `${m.title}  [${m.type}]`), _list, false, "Select media:")
            : null;
    }
    if (_sel) {
        _mediaTitle  = _sel.title;
        _mediaType   = _sel.type;
        _mediaYear   = _sel.year ? String(_sel.year) : "";
        _mediaGenres = (_sel.genres ?? []).join(", ");
        _mediaStatus = _sel.status ?? "";
    } else {
        _mediaTitle  = await tp.system.prompt("Media title:", "");
        _mediaType   = "tv-show";
        _mediaYear   = "";
        _mediaGenres = "";
        _mediaStatus = "watching";
    }
    _mediaSlug = _mediaTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
_%>---
tags:
  - series-index
  - media/<%- _mediaSlug %>
title: "<%- _mediaTitle %>"
type: <%- _mediaType %>
status: <%- _mediaStatus %>
year: <%- _mediaYear %>
genres: [<%- _mediaGenres %>]
rating:
cover:
---

# <%- _mediaTitle %>

> [!info] Series Info
> **Type**: <%- _mediaType %>
> **Year**: <%- _mediaYear %>
> **Genres**: <%- _mediaGenres %>
> **Status**: <%- _mediaStatus %>
> **Rating**:

## Description



## Seasons

| Season | Episodes | Status | Notes |
|--------|----------|--------|-------|
| 1      |          |        |       |

## Characters

### Main Cast

-

### Supporting

-

## World

### Locations

-

### Magic / Powers

-

### Technology

-

### Factions & Organizations

-

### Creatures & Species

-

### Items & Artifacts

-

## Timeline

-

## Themes

-

## My Notes & Analysis



## External Links

- [IMDb]()
- [Wikipedia]()
