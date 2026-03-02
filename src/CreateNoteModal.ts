import {
  App,
  FuzzySuggestModal,
  Modal,
  Notice,
  Setting,
  type FuzzyMatch,
} from "obsidian";
import type MediaTemplatesPlugin from "./main";
import type { Media, NoteTypeInfo } from "./types";
import { NOTE_TYPES } from "./noteTypes";

// ─── Step 1: Select Media ─────────────────────────────────────────────────────

export class MediaSuggestModal extends FuzzySuggestModal<Media> {
  private callback: (media: Media) => void;

  constructor(app: App, private mediaList: Media[], callback: (media: Media) => void) {
    super(app);
    this.callback = callback;
    this.setPlaceholder("Type to search your media library…");
    this.setInstructions([
      { command: "↑↓", purpose: "navigate" },
      { command: "↵", purpose: "select" },
      { command: "esc", purpose: "cancel" },
    ]);
  }

  getItems(): Media[] {
    return this.mediaList;
  }

  getItemText(item: Media): string {
    const icon = item.status === "watching" ? "▶ " : item.status === "completed" ? "✓ " : "";
    return `${icon}${item.title}  [${item.type}]`;
  }

  renderSuggestion(item: FuzzyMatch<Media>, el: HTMLElement): void {
    const media = item.item;
    el.createEl("div", { text: media.title, cls: "suggestion-title" });
    const sub = `${media.type}${media.year ? " · " + media.year : ""}  —  ${media.status}`;
    el.createEl("div", { text: sub, cls: "suggestion-note" });
  }

  onChooseItem(item: Media, _evt: MouseEvent | KeyboardEvent): void {
    this.callback(item);
  }
}

// ─── Step 2: Select Note Type ─────────────────────────────────────────────────

export class NoteTypeSuggestModal extends FuzzySuggestModal<NoteTypeInfo> {
  private callback: (type: NoteTypeInfo) => void;

  constructor(app: App, private noteTypes: NoteTypeInfo[], callback: (type: NoteTypeInfo) => void) {
    super(app);
    this.callback = callback;
    this.setPlaceholder("What kind of note?");
  }

  getItems(): NoteTypeInfo[] {
    return this.noteTypes;
  }

  getItemText(item: NoteTypeInfo): string {
    return item.label;
  }

  renderSuggestion(item: FuzzyMatch<NoteTypeInfo>, el: HTMLElement): void {
    const t = item.item;
    el.createEl("div", { text: t.label, cls: "suggestion-title" });
    el.createEl("div", { text: t.description, cls: "suggestion-note" });
  }

  onChooseItem(item: NoteTypeInfo, _evt: MouseEvent | KeyboardEvent): void {
    this.callback(item);
  }
}

// ─── Step 3: Enter Note Details ───────────────────────────────────────────────

export class NoteTitleModal extends Modal {
  private title = "";
  private season = "";
  private episode = "";

  constructor(
    app: App,
    private noteType: NoteTypeInfo,
    private media: Media,
    private defaultTitle: string,
    private callback: (title: string, season: string, episode: string) => void
  ) {
    super(app);
    this.title = defaultTitle;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("media-templates-modal");

    contentEl.createEl("h2", { text: `New ${this.noteType.label}` });
    contentEl.createEl("p", {
      text: `For: ${this.media.title}`,
      cls: "setting-item-description",
    });

    if (this.noteType.asksForSeason) {
      new Setting(contentEl)
        .setName("Season")
        .setDesc("Season number (leave blank for season 1)")
        .addText((text) => {
          text
            .setPlaceholder("1")
            .setValue(this.season)
            .onChange((v) => (this.season = v));
        });
    }

    if (this.noteType.asksForEpisode) {
      new Setting(contentEl)
        .setName("Episode")
        .setDesc("Episode number within the season")
        .addText((text) => {
          text
            .setPlaceholder("1")
            .setValue(this.episode)
            .onChange((v) => (this.episode = v));
        });
    }

    new Setting(contentEl)
      .setName("Title")
      .setDesc(`Name for this ${this.noteType.label.toLowerCase()} note`)
      .addText((text) => {
        text
          .setPlaceholder(`${this.noteType.label} title…`)
          .setValue(this.title)
          .onChange((v) => (this.title = v));
        // Auto-focus + select all
        setTimeout(() => {
          text.inputEl.focus();
          text.inputEl.select();
        }, 50);
        // Submit on Enter
        text.inputEl.addEventListener("keydown", (e: KeyboardEvent) => {
          if (e.key === "Enter") this.submit();
        });
      });

    new Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText("Create Note")
          .setCta()
          .onClick(() => this.submit())
      )
      .addButton((btn) =>
        btn.setButtonText("Cancel").onClick(() => this.close())
      );
  }

  private submit() {
    const finalTitle = this.title.trim();
    if (!finalTitle) {
      new Notice("Please enter a title.");
      return;
    }
    this.close();
    this.callback(finalTitle, this.season || "1", this.episode || "1");
  }

  onClose() {
    this.contentEl.empty();
  }
}

// ─── Orchestrator: runs all three steps in sequence ──────────────────────────

export function openCreateNoteFlow(app: App, plugin: MediaTemplatesPlugin) {
  const mediaList = plugin.settings.mediaLibrary;

  if (mediaList.length === 0) {
    new Notice(
      "No media in your library yet. Add some in Media Templates settings.",
      4000
    );
    return;
  }

  // Step 1 → Step 2 → Step 3 → create note
  new MediaSuggestModal(app, mediaList, (media) => {
    const relevantTypes = NOTE_TYPES.filter(
      (t) => !t.showOnlyFor || t.showOnlyFor.includes(media.type)
    );

    new NoteTypeSuggestModal(app, relevantTypes, (noteType) => {
      // Build a smart default title
      const defaultTitle = buildDefaultTitle(media, noteType);

      new NoteTitleModal(app, noteType, media, defaultTitle, (title, season, episode) => {
        plugin
          .createNote({ media, noteType: noteType.id, title, season, episode })
          .then((file) => {
            if (plugin.settings.openAfterCreate) {
              const leaf = app.workspace.getLeaf(false);
              leaf.openFile(file);
            }
            new Notice(`Created: ${title}`);
          })
          .catch((err: Error) => {
            new Notice(`Error creating note: ${err.message}`);
            console.error("[Media Templates]", err);
          });
      }).open();
    }).open();
  }).open();
}

function buildDefaultTitle(media: Media, noteType: NoteTypeInfo): string {
  switch (noteType.id) {
    case "series-index":
      return media.title;
    case "season-overview":
      return `${media.title} — Season `;
    case "episode":
      return `${media.title} S01E01 — `;
    default:
      return "";
  }
}
