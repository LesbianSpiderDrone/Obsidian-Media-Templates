/**
 * Media Templates — QuickAdd User Script
 * =======================================
 * Connects QuickAdd macros to the Media Templates plugin.
 *
 * HOW TO USE
 * ----------
 * 1. In QuickAdd settings, create a new "Macro" choice.
 * 2. Inside the macro, add a "User Script" step pointing to this file.
 * 3. After the User Script step, add a "Template" step pointing to one of
 *    the templates in the `templates/` folder (or a catch-all template).
 *    QuickAdd will substitute {{VALUE:x}} in the template before Templater runs.
 *
 * VARIABLES SET (available as {{VALUE:x}} in templates)
 * ------------------------------------------------------
 *   mediaTitle     — full title of the selected media  (e.g. "Breaking Bad")
 *   mediaSlug      — URL-safe slug                     (e.g. "breaking-bad")
 *   mediaType      — type string                       (e.g. "tv-show")
 *   mediaStatus    — current watch status              (e.g. "watching")
 *   mediaYear      — start year                        (e.g. "2008")
 *   mediaGenres    — comma-separated genres            (e.g. "Drama, Crime")
 *   mediaFolder    — vault folder for this media       (e.g. "Media/Breaking Bad")
 *   noteType       — internal note type id             (e.g. "episode")
 *   noteTypeLabel  — human-readable label              (e.g. "Episode")
 *   noteTitle      — the title the user entered        (e.g. "Pilot")
 *   noteFolder     — full folder path for the new note
 *   fileName       — file name (same as noteTitle, used by QuickAdd)
 *   season         — season number (episode / season notes only)
 *   episode        — episode number (episode notes only)
 *   episodePadded  — formatted code, e.g. "S01E01"
 *
 * REQUIREMENTS
 * ------------
 *   - Media Templates plugin installed and enabled
 *   - At least one media entry in the plugin's library
 */

// ─── Note type registry (mirrors src/noteTypes.ts) ───────────────────────────

const NOTE_TYPES = [
  { id: "series-index",          label: "Series Index",          description: "Master hub note for a show or movie",                    subFolder: "",                         asksForSeason: false, asksForEpisode: false, showOnlyFor: null },
  { id: "season-overview",       label: "Season Overview",       description: "Summary and notes for an entire season or arc",          subFolder: "Seasons",                  asksForSeason: true,  asksForEpisode: false, showOnlyFor: ["tv-show","anime","miniseries","limited-series"] },
  { id: "episode",               label: "Episode",               description: "Notes for a single episode",                             subFolder: "Episodes",                 asksForSeason: true,  asksForEpisode: true,  showOnlyFor: ["tv-show","anime","miniseries","limited-series"] },
  { id: "character",             label: "Character",             description: "Character profile — history, traits, arcs, relationships", subFolder: "Characters",              asksForSeason: false, asksForEpisode: false, showOnlyFor: null },
  { id: "location",              label: "Location",              description: "Place in the world — geography, history, inhabitants",    subFolder: "World/Locations",          asksForSeason: false, asksForEpisode: false, showOnlyFor: null },
  { id: "magic-system",         label: "Magic System",          description: "Power system — rules, costs, practitioners, lore",       subFolder: "World/Magic & Powers",     asksForSeason: false, asksForEpisode: false, showOnlyFor: null },
  { id: "technology",            label: "Technology",            description: "Device, science, or invention",                          subFolder: "World/Technology",         asksForSeason: false, asksForEpisode: false, showOnlyFor: null },
  { id: "vehicle",               label: "Vehicle",               description: "Ship, car, aircraft, or other vehicle",                  subFolder: "World/Vehicles",           asksForSeason: false, asksForEpisode: false, showOnlyFor: null },
  { id: "creature-species",     label: "Creature / Species",    description: "Non-human creature or alien species",                    subFolder: "World/Creatures & Species", asksForSeason: false, asksForEpisode: false, showOnlyFor: null },
  { id: "item-artifact",        label: "Item / Artifact",       description: "Notable object — weapon, MacGuffin, relic, tool",        subFolder: "World/Items & Artifacts",  asksForSeason: false, asksForEpisode: false, showOnlyFor: null },
  { id: "faction-organization", label: "Faction / Organization", description: "Government, cult, corporation, crew, or any group",     subFolder: "World/Factions & Organizations", asksForSeason: false, asksForEpisode: false, showOnlyFor: null },
  { id: "timeline-event",       label: "Timeline Event",        description: "In-universe historical or story event",                  subFolder: "Timeline",                 asksForSeason: false, asksForEpisode: false, showOnlyFor: null },
  { id: "plot-thread",          label: "Plot Thread",           description: "Ongoing story thread, mystery, or sub-plot",             subFolder: "Narrative",                asksForSeason: false, asksForEpisode: false, showOnlyFor: null },
  { id: "theory",               label: "Theory",                description: "Fan theory or analytical hypothesis",                    subFolder: "Analysis",                 asksForSeason: false, asksForEpisode: false, showOnlyFor: null },
];

function toSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function pad2(n) {
  return String(n || 1).padStart(2, "0");
}

// ─── Main script entry point ──────────────────────────────────────────────────

module.exports = async (params) => {
  const {
    app,
    quickAddApi: { suggester, inputPrompt },
    variables,
  } = params;

  // ── 1. Verify the plugin is installed ────────────────────────────────────

  const plugin = app.plugins.plugins?.["obsidian-media-templates"];
  if (!plugin) {
    throw new Error(
      "Media Templates plugin is not installed or enabled.\n" +
      "Please install it from the community plugins list first."
    );
  }

  const mediaList = plugin.api.getMediaList();
  if (mediaList.length === 0) {
    throw new Error(
      "Your media library is empty.\n" +
      "Add some media in Settings → Media Templates."
    );
  }

  // ── 2. Select media ───────────────────────────────────────────────────────

  const mediaDisplayLabels = mediaList.map((m) => {
    const statusIcon = m.status === "watching" ? "▶ " : m.status === "completed" ? "✓ " : "";
    const year = m.year ? ` (${m.year})` : "";
    return `${statusIcon}${m.title}${year}  [${m.type}]`;
  });

  const selectedMedia = await suggester(mediaDisplayLabels, mediaList, "Select media:");
  if (!selectedMedia) return; // user cancelled

  // ── 3. Select note type ───────────────────────────────────────────────────

  const relevantTypes = NOTE_TYPES.filter(
    (t) => !t.showOnlyFor || t.showOnlyFor.includes(selectedMedia.type)
  );

  const typeLabels = relevantTypes.map((t) => `${t.label}  —  ${t.description}`);
  const selectedType = await suggester(typeLabels, relevantTypes, "What kind of note?");
  if (!selectedType) return; // user cancelled

  // ── 4. Gather type-specific details ──────────────────────────────────────

  let season = "1";
  let episode = "1";
  let episodePadded = "";
  let defaultTitle = "";

  if (selectedType.asksForSeason) {
    season = (await inputPrompt("Season number:", "1")) ?? "1";
    season = season.trim() || "1";
  }

  if (selectedType.asksForEpisode) {
    episode = (await inputPrompt("Episode number:", "1")) ?? "1";
    episode = episode.trim() || "1";
    episodePadded = `S${pad2(season)}E${pad2(episode)}`;
    defaultTitle = `${selectedMedia.title} ${episodePadded}`;
  } else if (selectedType.id === "season-overview") {
    defaultTitle = `${selectedMedia.title} — Season ${season}`;
  } else if (selectedType.id === "series-index") {
    defaultTitle = selectedMedia.title;
  }

  // ── 5. Get the note title ─────────────────────────────────────────────────

  const noteTitle = await inputPrompt(`${selectedType.label} title:`, defaultTitle);
  if (!noteTitle || !noteTitle.trim()) return; // user cancelled

  // ── 6. Set all QuickAdd variables ─────────────────────────────────────────

  const slug       = toSlug(selectedMedia.title);
  const mediaFolder = selectedMedia.noteFolder || `Media/${selectedMedia.title}`;
  const subFolder  = selectedType.subFolder;
  const noteFolder = subFolder ? `${mediaFolder}/${subFolder}` : mediaFolder;

  variables["mediaTitle"]    = selectedMedia.title;
  variables["mediaSlug"]     = slug;
  variables["mediaType"]     = selectedMedia.type;
  variables["mediaStatus"]   = selectedMedia.status ?? "";
  variables["mediaYear"]     = selectedMedia.year ? String(selectedMedia.year) : "";
  variables["mediaGenres"]   = (selectedMedia.genres ?? []).join(", ");
  variables["mediaFolder"]   = mediaFolder;
  variables["noteType"]      = selectedType.id;
  variables["noteTypeLabel"] = selectedType.label;
  variables["noteTitle"]     = noteTitle.trim();
  variables["noteFolder"]    = noteFolder;
  variables["fileName"]      = noteTitle.trim();  // QuickAdd uses this as the file name
  variables["season"]        = season;
  variables["episode"]       = episode;
  variables["episodePadded"] = episodePadded;

  // ── 7. (Optional) Use the plugin to create the note directly ─────────────
  //
  //  If your QuickAdd macro has NO Template step after this User Script,
  //  uncomment the block below to let the plugin create the note directly.
  //  Otherwise, leave it commented and let QuickAdd + Templater handle it.
  //
  // const file = await plugin.api.createNote({
  //   media:    selectedMedia,
  //   noteType: selectedType.id,
  //   title:    noteTitle.trim(),
  //   season,
  //   episode,
  // });
  // console.log("[Media Templates] Created note:", file.path);
};
