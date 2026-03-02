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
    _noteTitle = await tp.system.prompt("Technology / device name:", "");
}
_%>---
tags:
  - technology
  - media/<%- _mediaSlug %>
media: "[[<%- _mediaTitle %>]]"
name: "<%- _noteTitle %>"
category:
creator:
status:
first_appearance:
---

# <%- _noteTitle %>

> [!info] Tech Overview
> **Show**: [[<%- _mediaTitle %>]]
> **Category**:
> **Creator**:
> **Status**:

## Purpose & Function

### Primary Function



### Secondary Uses



## How It Works

### Mechanism



### Power Source



## Specifications

| Attribute  | Value |
|------------|-------|
| Category   |       |
| Creator    |       |
| Era / Date |       |
| Status     |       |

## Capabilities

-

## Limitations

-

## Who Has Access

-

## History

### Development / Discovery



### Key Events

-

## Impact on the World



## Appearances

-

## Notes & Analysis
