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
    _noteTitle = await tp.system.prompt("System / power name:", "");
}
_%>---
tags:
  - magic-system
  - media/<%- _mediaSlug %>
media: "[[<%- _mediaTitle %>]]"
name: "<%- _noteTitle %>"
type:
source_of_power:
---

# <%- _noteTitle %>

> [!info] System Overview
> **Show**: [[<%- _mediaTitle %>]]
> **Type**:
> **Source of Power**:

## Fundamental Rules

> [!important] Hard Rules
> 1.
> 2.
> 3.

## How It Works

### Mechanism



### Source of Power



### Activation / Casting



## Limitations & Costs

> [!warning] Limitations
> -
> -

## Tiers & Levels

| Level | Description | Known Practitioners |
|-------|-------------|---------------------|
|       |             |                     |

## Known Practitioners

| Character | Ability Level | Specialization |
|-----------|--------------|----------------|
|           |              |                |

## Notable Uses

-

## History & Lore

### Origins



### Evolution Over Time



## Mysteries & Questions

> [!question] Unanswered Questions
> -
> -

## Theories

-
