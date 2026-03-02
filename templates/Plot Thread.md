<%*
const _qa_test = `{{VALUE:mediaTitle}}`;
const _fromQA  = !_qa_test.startsWith("{{VALUE");
let _mediaTitle, _mediaSlug, _noteTitle;

if (_fromQA) {
    _mediaTitle = `{{VALUE:mediaTitle}}`;
    _mediaSlug  = `{{VALUE:mediaSlug}}`;
    _noteTitle  = `{{VALUE:noteTitle}}`;
} else {
    const _plugin = window?.MediaTemplates?.api;
    if (_plugin) {
        const _list = _plugin.getMediaList();
        const _sel  = _list.length
            ? await tp.system.suggester(_list.map(m => `${m.title}  [${m.type}]`), _list, false, "Select media:")
            : null;
        if (_sel) { _mediaTitle = _sel.title; }
    }
    if (!_mediaTitle) _mediaTitle = await tp.system.prompt("Media title:", "");
    _mediaSlug = _mediaTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    _noteTitle = await tp.system.prompt("Plot thread / mystery name:", "");
}
_%>---
tags:
  - plot-thread
  - media/<%- _mediaSlug %>
media: "[[<%- _mediaTitle %>]]"
name: "<%- _noteTitle %>"
type: main-arc
status: ongoing
introduced:
resolved:
---

# <%- _noteTitle %>

> [!info] Plot Thread
> **Show**: [[<%- _mediaTitle %>]]
> **Type**: Main Arc
> **Status**: Ongoing
> **Introduced**:

## Overview



## Development

| Episode | Development | Notes |
|---------|-------------|-------|
|         |             |       |

## Key Players

-

## Connection to Other Threads

-

## Resolution

> [!success] Resolution
> *Status: Unresolved*

## Notes & Analysis
