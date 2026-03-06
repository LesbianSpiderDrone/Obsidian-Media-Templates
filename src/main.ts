import { Notice, Plugin, TFile, TFolder, normalizePath } from "obsidian";
import { DEFAULT_SETTINGS, type MediaTemplatesSettings } from "./settings";
import { SettingsTab } from "./SettingsTab";
import { openCreateNoteFlow } from "./CreateNoteModal";
import { AddMediaModal } from "./AddMediaModal";
import { buildNoteContent, getNoteTypeInfo, NOTE_TYPES, toSlug } from "./noteTypes";
import type {
  Media,
  MediaTemplatesAPI,
  NoteCreationContext,
  NoteTypeInfo,
} from "./types";

export default class MediaTemplatesPlugin extends Plugin {
  settings!: MediaTemplatesSettings;
  api!: MediaTemplatesAPI;

  async onload() {
    await this.loadSettings();

    // ── Public API (used by QuickAdd scripts and Templater user functions) ────
    this.api = {
      getMediaList: (): Media[] => this.settings.mediaLibrary,

      getMedia: (id: string): Media | undefined =>
        this.settings.mediaLibrary.find((m) => m.id === id),

      getMediaByTitle: (title: string): Media | undefined =>
        this.settings.mediaLibrary.find(
          (m) => m.title.toLowerCase() === title.toLowerCase()
        ),

      getNoteTypes: (): NoteTypeInfo[] => NOTE_TYPES,

      createNote: (ctx: NoteCreationContext): Promise<TFile> =>
        this.createNote(ctx),
    };

    // Expose globally so QuickAdd user scripts and Templater functions can reach it:
    //   const api = window.MediaTemplates?.api;
    (window as Record<string, unknown>)["MediaTemplates"] = {
      plugin: this,
      api: this.api,
    };

    // ── Commands ──────────────────────────────────────────────────────────────

    this.addCommand({
      id: "create-media-note",
      name: "Create media note",
      callback: () => openCreateNoteFlow(this.app, this),
    });

    this.addCommand({
      id: "add-media-to-library",
      name: "Add media to library",
      callback: () => {
        new AddMediaModal(this.app, async (media) => {
          this.settings.mediaLibrary.push(media);
          await this.saveSettings();
          new Notice(`Added "${media.title}" to your library.`);
        }).open();
      },
    });

    this.addCommand({
      id: "create-series-index",
      name: "Create series index for media",
      callback: () => {
        const list = this.settings.mediaLibrary;
        if (!list.length) {
          new Notice("No media in library. Add some first.", 3000);
          return;
        }
        // Re-use the create flow — it starts with media selection
        // We'll pre-filter to series-index by kicking straight into note type
        openCreateNoteFlow(this.app, this);
      },
    });

    // ── Settings Tab ──────────────────────────────────────────────────────────
    this.addSettingTab(new SettingsTab(this.app, this));

    console.log("[Media Templates] Plugin loaded.");
  }

  onunload() {
    delete (window as Record<string, unknown>)["MediaTemplates"];
    console.log("[Media Templates] Plugin unloaded.");
  }

  // ── Settings persistence ──────────────────────────────────────────────────

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  // ── Core note creation ────────────────────────────────────────────────────

  async createNote(ctx: NoteCreationContext): Promise<TFile> {
    const noteTypeInfo = getNoteTypeInfo(ctx.noteType);
    const media = ctx.media;

    // Resolve folder
    const mediaFolder = (media.noteFolder || `${this.settings.defaultMediaFolder}/${media.title}`).replace(/\/$/, "");
    const subFolder = noteTypeInfo.subFolder;
    const folderPath = normalizePath(
      subFolder ? `${mediaFolder}/${subFolder}` : mediaFolder
    );

    // Create folder hierarchy if needed
    if (this.settings.autoCreateFolders) {
      await this.ensureFolder(folderPath);
    }

    // Sanitize title for file system
    const safeTitle = ctx.title.replace(/[\\/:*?"<>|]/g, "-");
    const filePath = normalizePath(`${folderPath}/${safeTitle}.md`);

    // Check for duplicates
    const existing = this.app.vault.getAbstractFileByPath(filePath);
    if (existing instanceof TFile) {
      new Notice(`Note "${safeTitle}" already exists — opening it.`, 3000);
      return existing;
    }

    // Build content
    const content = buildNoteContent(ctx);

    return await this.app.vault.create(filePath, content);
  }

  private async ensureFolder(path: string): Promise<void> {
    const parts = path.split("/").filter(Boolean);
    let current = "";
    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      const exists = this.app.vault.getAbstractFileByPath(current);
      if (!exists) {
        await this.app.vault.createFolder(current);
      } else if (!(exists instanceof TFolder)) {
        throw new Error(
          `Path "${current}" exists but is a file, not a folder.`
        );
      }
    }
  }

  // ── Convenience helper for QuickAdd / Templater scripts ──────────────────

  /** Returns a slug-safe version of the media title */
  static toSlug(title: string): string {
    return toSlug(title);
  }

}
