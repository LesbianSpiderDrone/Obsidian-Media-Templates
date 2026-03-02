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
    _noteTitle = await tp.system.prompt("Faction / organization name:", "");
}
_%>---
tags:
  - faction
  - media/<%- _mediaSlug %>
media: "[[<%- _mediaTitle %>]]"
name: "<%- _noteTitle %>"
type:
leader:
alignment:
status:
founded:
first_appearance:
---

# <%- _noteTitle %>

> [!info] Faction Overview
> **Show**: [[<%- _mediaTitle %>]]
> **Type**:
> **Leader**:
> **Alignment**:
> **Status**:

## Mission & Goals



## Structure

### Leadership

-

### Hierarchy



### Membership Requirements



## Methods & Resources



## History

### Founding



### Major Events

-

## Relationships

| Faction | Relationship |
|---------|-------------|
|         | Ally        |
|         | Enemy       |

## Members

| Character | Role | Status |
|-----------|------|--------|
|           |      |        |

## Appearances

-

## Notes & Analysis
