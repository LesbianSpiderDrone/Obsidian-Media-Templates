import { App, Modal, Notice, Setting } from "obsidian";
import type { Media, MediaStatus, MediaType } from "./types";

type DoneCallback = (media: Media) => void;

const MEDIA_TYPES: { value: MediaType; label: string }[] = [
  { value: "tv-show", label: "TV Show" },
  { value: "movie", label: "Movie" },
  { value: "anime", label: "Anime" },
  { value: "miniseries", label: "Mini-series" },
  { value: "limited-series", label: "Limited Series" },
  { value: "documentary", label: "Documentary" },
];

const MEDIA_STATUSES: { value: MediaStatus; label: string }[] = [
  { value: "watching", label: "Watching" },
  { value: "completed", label: "Completed" },
  { value: "planned", label: "Plan to Watch" },
  { value: "on-hold", label: "On Hold" },
  { value: "dropped", label: "Dropped" },
  { value: "rewatching", label: "Rewatching" },
];

export class AddMediaModal extends Modal {
  private draft: Partial<Media>;
  private callback: DoneCallback;
  private isEdit: boolean;

  constructor(app: App, callback: DoneCallback, existing?: Media) {
    super(app);
    this.callback = callback;
    this.isEdit = !!existing;
    this.draft = existing
      ? { ...existing }
      : {
          type: "tv-show",
          status: "watching",
          genres: [],
          tags: [],
          noteFolder: "",
        };
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("media-templates-modal");

    contentEl.createEl("h2", {
      text: this.isEdit ? "Edit Media" : "Add Media to Library",
    });

    // Title
    new Setting(contentEl)
      .setName("Title")
      .setDesc("Name of the show or movie")
      .addText((text) => {
        text
          .setPlaceholder("Breaking Bad")
          .setValue(this.draft.title ?? "")
          .onChange((v) => (this.draft.title = v));
        if (!this.isEdit) {
          setTimeout(() => text.inputEl.focus(), 50);
        }
      });

    // Type
    new Setting(contentEl)
      .setName("Type")
      .addDropdown((dd) => {
        for (const { value, label } of MEDIA_TYPES) {
          dd.addOption(value, label);
        }
        dd.setValue(this.draft.type ?? "tv-show");
        dd.onChange((v) => (this.draft.type = v as MediaType));
      });

    // Status
    new Setting(contentEl)
      .setName("Status")
      .addDropdown((dd) => {
        for (const { value, label } of MEDIA_STATUSES) {
          dd.addOption(value, label);
        }
        dd.setValue(this.draft.status ?? "watching");
        dd.onChange((v) => (this.draft.status = v as MediaStatus));
      });

    // Year
    new Setting(contentEl)
      .setName("Year")
      .setDesc("Start year (e.g. 2008)")
      .addText((text) => {
        text
          .setPlaceholder("2008")
          .setValue(this.draft.year ? String(this.draft.year) : "")
          .onChange((v) => {
            const n = parseInt(v);
            this.draft.year = isNaN(n) ? undefined : n;
          });
      });

    // Genres
    new Setting(contentEl)
      .setName("Genres")
      .setDesc("Comma-separated list (e.g. Drama, Crime, Thriller)")
      .addText((text) => {
        text
          .setPlaceholder("Drama, Crime")
          .setValue((this.draft.genres ?? []).join(", "))
          .onChange((v) => {
            this.draft.genres = v
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
          });
      });

    // Note folder
    new Setting(contentEl)
      .setName("Note Folder")
      .setDesc(
        "Vault path where notes for this media will be created. Leave blank to use the plugin default."
      )
      .addText((text) => {
        text
          .setPlaceholder("Media/Breaking Bad")
          .setValue(this.draft.noteFolder ?? "")
          .onChange((v) => (this.draft.noteFolder = v));
      });

    // Tags
    new Setting(contentEl)
      .setName("Tags")
      .setDesc("Extra tags (comma-separated), in addition to automatic media tags")
      .addText((text) => {
        text
          .setPlaceholder("netflix, favorite")
          .setValue((this.draft.tags ?? []).join(", "))
          .onChange((v) => {
            this.draft.tags = v
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
          });
      });

    // Buttons
    new Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText(this.isEdit ? "Save Changes" : "Add to Library")
          .setCta()
          .onClick(() => this.submit())
      )
      .addButton((btn) =>
        btn.setButtonText("Cancel").onClick(() => this.close())
      );
  }

  private submit() {
    const title = (this.draft.title ?? "").trim();
    if (!title) {
      new Notice("Please enter a title.");
      return;
    }

    const media: Media = {
      id: this.draft.id ?? crypto.randomUUID(),
      title,
      type: this.draft.type ?? "tv-show",
      status: this.draft.status ?? "watching",
      genres: this.draft.genres ?? [],
      year: this.draft.year,
      tags: this.draft.tags ?? [],
      noteFolder:
        (this.draft.noteFolder ?? "").trim() ||
        `Media/${title}`,
    };

    this.close();
    this.callback(media);
  }

  onClose() {
    this.contentEl.empty();
  }
}
