<%*
// ── Media context ─────────────────────────────────────────────────────────────
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
            ? await tp.system.suggester(
                _list.map(m => `${m.title}  [${m.type}]`),
                _list, false, "Select media:")
            : null;
        if (_sel) { _mediaTitle = _sel.title; }
    }
    if (!_mediaTitle) _mediaTitle = await tp.system.prompt("Media title:", "");
    _mediaSlug = _mediaTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    _noteTitle = await tp.system.prompt("Character name:", "");
}
_%>---
tags:
  - character
  - media/<%- _mediaSlug %>
media: "[[<%- _mediaTitle %>]]"
name: "<%- _noteTitle %>"
aliases: []
status: alive
affiliation:
role: supporting
first_appearance:
last_appearance:
actor:
---

# <%- _noteTitle %>

> [!info] Character Overview
> **Show**: [[<%- _mediaTitle %>]]
> **Status**: Alive
> **Role**:
> **Affiliation**:
> **Portrayed by**:

## Description

### Physical Appearance



### Personality



## Background

### History



### Backstory Reveals

-

## Abilities & Skills

-

## Relationships

| Character | Relationship | Notes |
|-----------|-------------|-------|
|           |             |       |

## Character Arc

### Season by Season



## Key Moments

-

## Memorable Quotes

> ""
> — <%- _noteTitle %>

## Appearances

-

## Analysis

### Themes & Symbolism



### Fan Theories


