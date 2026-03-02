import type { TFile } from "obsidian";

// ─── Media ────────────────────────────────────────────────────────────────────

export type MediaType =
  | "tv-show"
  | "movie"
  | "anime"
  | "miniseries"
  | "limited-series"
  | "documentary";

export type MediaStatus =
  | "watching"
  | "completed"
  | "planned"
  | "dropped"
  | "on-hold"
  | "rewatching";

export interface Media {
  id: string;
  title: string;
  type: MediaType;
  status: MediaStatus;
  genres: string[];
  year?: number;
  endYear?: number;
  seasons?: number;
  currentSeason?: number;
  currentEpisode?: number;
  rating?: number;
  description?: string;
  tags: string[];
  /** Path inside the vault where notes for this media live (e.g. "Media/Breaking Bad") */
  noteFolder: string;
  coverImage?: string;
}

// ─── Note Types ───────────────────────────────────────────────────────────────

export type NoteType =
  | "series-index"
  | "season-overview"
  | "episode"
  | "character"
  | "location"
  | "magic-system"
  | "technology"
  | "vehicle"
  | "creature-species"
  | "item-artifact"
  | "faction-organization"
  | "timeline-event"
  | "plot-thread"
  | "theory";

export interface NoteTypeInfo {
  id: NoteType;
  label: string;
  description: string;
  /** Subfolder under the media's noteFolder where this type of note goes */
  subFolder: string;
  /** If set, this note type only appears when the media matches one of these types */
  showOnlyFor?: MediaType[];
  /** Whether to ask for season/episode numbers when creating this note */
  asksForSeason?: boolean;
  asksForEpisode?: boolean;
}

// ─── Note Creation ────────────────────────────────────────────────────────────

export interface NoteCreationContext {
  media: Media;
  noteType: NoteType;
  title: string;
  season?: string;
  episode?: string;
}

// ─── Plugin API (exposed globally for QuickAdd / Templater scripts) ───────────

export interface MediaTemplatesAPI {
  getMediaList(): Media[];
  getMedia(id: string): Media | undefined;
  getMediaByTitle(title: string): Media | undefined;
  getNoteTypes(): NoteTypeInfo[];
  createNote(ctx: NoteCreationContext): Promise<TFile>;
}
