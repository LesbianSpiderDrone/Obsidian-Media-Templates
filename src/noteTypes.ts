import type { NoteCreationContext, NoteType, NoteTypeInfo } from "./types";

// ─── Note Type Registry ───────────────────────────────────────────────────────

export const NOTE_TYPES: NoteTypeInfo[] = [
  {
    id: "series-index",
    label: "Series Index",
    description: "Master hub note for a show or movie",
    subFolder: "",
    asksForSeason: false,
    asksForEpisode: false,
  },
  {
    id: "season-overview",
    label: "Season Overview",
    description: "Summary and notes for an entire season or arc",
    subFolder: "Seasons",
    showOnlyFor: ["tv-show", "anime", "miniseries", "limited-series"],
    asksForSeason: true,
    asksForEpisode: false,
  },
  {
    id: "episode",
    label: "Episode",
    description: "Notes for a single episode",
    subFolder: "Episodes",
    showOnlyFor: ["tv-show", "anime", "miniseries", "limited-series"],
    asksForSeason: true,
    asksForEpisode: true,
  },
  {
    id: "character",
    label: "Character",
    description: "Character profile — history, traits, arcs, relationships",
    subFolder: "Characters",
  },
  {
    id: "location",
    label: "Location",
    description: "Place in the world — geography, history, inhabitants",
    subFolder: "World/Locations",
  },
  {
    id: "magic-system",
    label: "Magic System",
    description: "Power system — rules, costs, practitioners, lore",
    subFolder: "World/Magic & Powers",
  },
  {
    id: "technology",
    label: "Technology",
    description: "Device, science, or invention — function, specs, significance",
    subFolder: "World/Technology",
  },
  {
    id: "vehicle",
    label: "Vehicle",
    description: "Ship, car, aircraft, or other vehicle — specs and history",
    subFolder: "World/Vehicles",
  },
  {
    id: "creature-species",
    label: "Creature / Species",
    description: "Non-human creature or alien species",
    subFolder: "World/Creatures & Species",
  },
  {
    id: "item-artifact",
    label: "Item / Artifact",
    description: "Notable object — weapon, MacGuffin, relic, tool",
    subFolder: "World/Items & Artifacts",
  },
  {
    id: "faction-organization",
    label: "Faction / Organization",
    description: "Government, cult, corporation, crew, or any group",
    subFolder: "World/Factions & Organizations",
  },
  {
    id: "timeline-event",
    label: "Timeline Event",
    description: "In-universe historical or story event",
    subFolder: "Timeline",
  },
  {
    id: "plot-thread",
    label: "Plot Thread",
    description: "Ongoing story thread, mystery, or sub-plot",
    subFolder: "Narrative",
  },
  {
    id: "theory",
    label: "Theory",
    description: "Fan theory or analytical hypothesis",
    subFolder: "Analysis",
  },
];

export function getNoteTypeInfo(id: NoteType): NoteTypeInfo {
  const info = NOTE_TYPES.find((t) => t.id === id);
  if (!info) throw new Error(`Unknown note type: ${id}`);
  return info;
}

// ─── Slug Helper ──────────────────────────────────────────────────────────────

export function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Template Builders ────────────────────────────────────────────────────────

function pad2(n: string | undefined): string {
  if (!n) return "01";
  return n.padStart(2, "0");
}

export function buildNoteContent(ctx: NoteCreationContext): string {
  const slug = toSlug(ctx.media.title);
  const year = ctx.media.year ? String(ctx.media.year) : "";
  const vars = {
    MEDIATITLE: ctx.media.title,
    MEDIASLUG: slug,
    MEDIATYPE: ctx.media.type,
    MEDIAGENRES: ctx.media.genres.join(", ") || "",
    MEDIAYEAR: year,
    SEASON: ctx.season ?? "1",
    EPISODE: ctx.episode ?? "1",
    EPISODECODE: ctx.season
      ? `S${pad2(ctx.season)}E${pad2(ctx.episode)}`
      : "",
    NOTETITLE: ctx.title,
  };

  const builders: Record<NoteType, (v: typeof vars) => string> = {
    "series-index": buildSeriesIndex,
    "season-overview": buildSeasonOverview,
    episode: buildEpisode,
    character: buildCharacter,
    location: buildLocation,
    "magic-system": buildMagicSystem,
    technology: buildTechnology,
    vehicle: buildVehicle,
    "creature-species": buildCreatureSpecies,
    "item-artifact": buildItemArtifact,
    "faction-organization": buildFactionOrganization,
    "timeline-event": buildTimelineEvent,
    "plot-thread": buildPlotThread,
    theory: buildTheory,
  };

  return builders[ctx.noteType](vars);
}

// ─── Individual Builders ──────────────────────────────────────────────────────

function buildSeriesIndex(v: Record<string, string>): string {
  return `---
tags:
  - series-index
  - media/${v.MEDIASLUG}
title: "${v.MEDIATITLE}"
type: ${v.MEDIATYPE}
status: watching
year: ${v.MEDIAYEAR}
genres: [${v.MEDIAGENRES}]
rating:
cover:
---

# ${v.MEDIATITLE}

> [!info] Series Info
> **Type**: ${v.MEDIATYPE}
> **Year**: ${v.MEDIAYEAR}
> **Genres**: ${v.MEDIAGENRES}
> **Status**: Watching
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
`;
}

function buildSeasonOverview(v: Record<string, string>): string {
  return `---
tags:
  - season
  - media/${v.MEDIASLUG}
media: "[[${v.MEDIATITLE}]]"
season: ${v.SEASON}
episodes:
air_date_start:
air_date_end:
status: unwatched
rating:
---

# ${v.MEDIATITLE} — Season ${v.SEASON}

> [!info] Season Overview
> **Show**: [[${v.MEDIATITLE}]]
> **Season**: ${v.SEASON}
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

`;
}

function buildEpisode(v: Record<string, string>): string {
  return `---
tags:
  - episode
  - media/${v.MEDIASLUG}
media: "[[${v.MEDIATITLE}]]"
season: ${v.SEASON}
episode: ${v.EPISODE}
title: "${v.NOTETITLE}"
air_date:
directed_by:
written_by:
status: unwatched
rating:
---

# ${v.NOTETITLE}

> [!info] Episode Info
> **Show**: [[${v.MEDIATITLE}]]
> **Season ${v.SEASON}, Episode ${v.EPISODE}** — ${v.EPISODECODE}
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
`;
}

function buildCharacter(v: Record<string, string>): string {
  return `---
tags:
  - character
  - media/${v.MEDIASLUG}
media: "[[${v.MEDIATITLE}]]"
name: "${v.NOTETITLE}"
aliases: []
status: alive
affiliation:
role: supporting
first_appearance:
last_appearance:
actor:
---

# ${v.NOTETITLE}

> [!info] Character Overview
> **Show**: [[${v.MEDIATITLE}]]
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
> — ${v.NOTETITLE}

## Appearances

-

## Analysis

### Themes & Symbolism



### Fan Theories



`;
}

function buildLocation(v: Record<string, string>): string {
  return `---
tags:
  - location
  - media/${v.MEDIASLUG}
media: "[[${v.MEDIATITLE}]]"
name: "${v.NOTETITLE}"
type:
first_appearance:
status:
---

# ${v.NOTETITLE}

> [!info] Location Overview
> **Show**: [[${v.MEDIATITLE}]]
> **Type**:
> **Status**:

## Description

### Physical Description



### Atmosphere / Feel



## Geography & Layout

### Notable Areas

-

### Map / Diagram



## History

### Origins



### Key Historical Events

-

## Inhabitants & Control

### Notable Residents / Rulers

-

### Factions Present

-

## Strategic Importance



## Connections

### Nearby Locations

-

### Access Points

-

## Appearances

-

## Notes & Analysis

`;
}

function buildMagicSystem(v: Record<string, string>): string {
  return `---
tags:
  - magic-system
  - media/${v.MEDIASLUG}
media: "[[${v.MEDIATITLE}]]"
name: "${v.NOTETITLE}"
type:
source_of_power:
---

# ${v.NOTETITLE}

> [!info] System Overview
> **Show**: [[${v.MEDIATITLE}]]
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
`;
}

function buildTechnology(v: Record<string, string>): string {
  return `---
tags:
  - technology
  - media/${v.MEDIASLUG}
media: "[[${v.MEDIATITLE}]]"
name: "${v.NOTETITLE}"
category:
creator:
status:
first_appearance:
---

# ${v.NOTETITLE}

> [!info] Tech Overview
> **Show**: [[${v.MEDIATITLE}]]
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

| Attribute | Value |
|-----------|-------|
| Category  |       |
| Creator   |       |
| Era / Date |      |
| Status    |       |

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

`;
}

function buildVehicle(v: Record<string, string>): string {
  return `---
tags:
  - vehicle
  - media/${v.MEDIASLUG}
media: "[[${v.MEDIATITLE}]]"
name: "${v.NOTETITLE}"
type:
owner:
crew:
status:
first_appearance:
---

# ${v.NOTETITLE}

> [!info] Vehicle Overview
> **Show**: [[${v.MEDIATITLE}]]
> **Type**:
> **Owner / Operator**:
> **Status**:

## Description

### Exterior



### Interior



## Specifications

| Attribute | Value |
|-----------|-------|
| Type      |       |
| Owner     |       |
| Crew      |       |
| Status    |       |

## Capabilities

### Performance



### Weapons / Defenses



### Special Systems



## History

### Origins / Construction



### Previous Owners

-

## Notable Journeys / Missions

-

## Crew & Passengers

| Person | Role |
|--------|------|
|        |      |

## Appearances

-

## Notes & Analysis

`;
}

function buildCreatureSpecies(v: Record<string, string>): string {
  return `---
tags:
  - creature
  - media/${v.MEDIASLUG}
media: "[[${v.MEDIATITLE}]]"
name: "${v.NOTETITLE}"
classification:
sapient: false
status:
first_appearance:
---

# ${v.NOTETITLE}

> [!info] Species Overview
> **Show**: [[${v.MEDIATITLE}]]
> **Classification**:
> **Sapient**: No
> **Status**:

## Physical Characteristics

### Appearance



### Size & Build



### Variants / Subspecies

-

## Abilities & Traits

### Natural Abilities

-

### Special Abilities

-

### Weaknesses

-

## Behavior & Ecology

### Behavior



### Habitat



### Diet



## Society & Culture *(if sapient)*

### Social Structure



### Language



### Beliefs



## History & Lore



## Known Individuals

| Name | Role | Notes |
|------|------|-------|
|      |      |       |

## Appearances

-

## Notes & Analysis

`;
}

function buildItemArtifact(v: Record<string, string>): string {
  return `---
tags:
  - item
  - media/${v.MEDIASLUG}
media: "[[${v.MEDIATITLE}]]"
name: "${v.NOTETITLE}"
type:
origin:
current_holder:
status:
first_appearance:
---

# ${v.NOTETITLE}

> [!info] Item Overview
> **Show**: [[${v.MEDIATITLE}]]
> **Type**:
> **Origin**:
> **Current Holder**:

## Description

### Appearance



### Notable Features



## Properties & Powers

-

## Limitations & Requirements

-

## History

### Origins / Creation



### Chain of Ownership

1.

### Key Events

-

## Significance to Story



## Appearances

-

## Notes & Analysis

`;
}

function buildFactionOrganization(v: Record<string, string>): string {
  return `---
tags:
  - faction
  - media/${v.MEDIASLUG}
media: "[[${v.MEDIATITLE}]]"
name: "${v.NOTETITLE}"
type:
leader:
alignment:
status:
founded:
first_appearance:
---

# ${v.NOTETITLE}

> [!info] Faction Overview
> **Show**: [[${v.MEDIATITLE}]]
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

`;
}

function buildTimelineEvent(v: Record<string, string>): string {
  return `---
tags:
  - timeline-event
  - media/${v.MEDIASLUG}
media: "[[${v.MEDIATITLE}]]"
name: "${v.NOTETITLE}"
date_in_universe:
location:
significance:
---

# ${v.NOTETITLE}

> [!info] Event Overview
> **Show**: [[${v.MEDIATITLE}]]
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

`;
}

function buildPlotThread(v: Record<string, string>): string {
  return `---
tags:
  - plot-thread
  - media/${v.MEDIASLUG}
media: "[[${v.MEDIATITLE}]]"
name: "${v.NOTETITLE}"
type: main-arc
status: ongoing
introduced:
resolved:
---

# ${v.NOTETITLE}

> [!info] Plot Thread
> **Show**: [[${v.MEDIATITLE}]]
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

`;
}

function buildTheory(v: Record<string, string>): string {
  return `---
tags:
  - theory
  - media/${v.MEDIASLUG}
media: "[[${v.MEDIATITLE}]]"
name: "${v.NOTETITLE}"
status: unconfirmed
confidence: medium
---

# ${v.NOTETITLE}

> [!question] Theory
> **Show**: [[${v.MEDIATITLE}]]
> **Status**: Unconfirmed
> **Confidence**: Medium

## The Theory



## Evidence Supporting

-

## Evidence Against

-

## Implications

### If True



### If False



## Related Theories

-

## Status Updates

| Date | Update |
|------|--------|
|      |        |

## Notes

`;
}
