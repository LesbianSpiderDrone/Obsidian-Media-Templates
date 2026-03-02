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
    _noteTitle = await tp.system.prompt("Event name:", "");
}
_%>---
tags:
  - timeline-event
  - media/<%- _mediaSlug %>
media: "[[<%- _mediaTitle %>]]"
name: "<%- _noteTitle %>"
date_in_universe:
location:
significance:
---

# <%- _noteTitle %>

> [!info] Event Overview
> **Show**: [[<%- _mediaTitle %>]]
> **Date (In-Universe)**:
> **Location**:
> **Significance**:

## What Happened



## Participants

| Person / Faction | Role |
|-----------------|------|
|                 |      |

## Causes & Context

### Direct Causes



### Broader Context



## Consequences

### Immediate Effects



### Long-term Impact



## Related Events

- **Preceded by**:
- **Led to**:

## Episode Reference

-

## Notes & Analysis
