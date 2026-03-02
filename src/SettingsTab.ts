import { App, PluginSettingTab, Setting } from "obsidian";
import type MediaTemplatesPlugin from "./main";
import type { Media } from "./types";
import { AddMediaModal } from "./AddMediaModal";

export class SettingsTab extends PluginSettingTab {
  constructor(app: App, private plugin: MediaTemplatesPlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Media Templates" });

    // ── General Settings ──────────────────────────────────────────────────────

    containerEl.createEl("h3", { text: "General" });

    new Setting(containerEl)
      .setName("Default media folder")
      .setDesc(
        "Vault path where notes are created when a media entry has no dedicated folder set."
      )
      .addText((text) => {
        text
          .setPlaceholder("Media")
          .setValue(this.plugin.settings.defaultMediaFolder)
          .onChange(async (v) => {
            this.plugin.settings.defaultMediaFolder = v.trim() || "Media";
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("Template folder")
      .setDesc(
        "Where the plugin's Templater template files live (for standalone Templater use)."
      )
      .addText((text) => {
        text
          .setPlaceholder("Templates/Media")
          .setValue(this.plugin.settings.templateFolder)
          .onChange(async (v) => {
            this.plugin.settings.templateFolder = v.trim() || "Templates/Media";
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("Auto-create folders")
      .setDesc("Automatically create sub-folders when a note is created.")
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.autoCreateFolders)
          .onChange(async (v) => {
            this.plugin.settings.autoCreateFolders = v;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("Open note after creating")
      .setDesc("Switch to the new note immediately after it is created.")
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.openAfterCreate)
          .onChange(async (v) => {
            this.plugin.settings.openAfterCreate = v;
            await this.plugin.saveSettings();
          });
      });

    // ── Media Library ─────────────────────────────────────────────────────────

    containerEl.createEl("h3", { text: "Media Library" });

    new Setting(containerEl)
      .setName("Add media")
      .setDesc("Add a new show or movie to your library.")
      .addButton((btn) => {
        btn
          .setButtonText("+ Add media")
          .setCta()
          .onClick(() => {
            new AddMediaModal(this.app, async (media) => {
              this.plugin.settings.mediaLibrary.push(media);
              await this.plugin.saveSettings();
              this.display(); // refresh
            }).open();
          });
      });

    const library = this.plugin.settings.mediaLibrary;

    if (library.length === 0) {
      containerEl.createEl("p", {
        text: "Your library is empty. Add a show or movie above to get started.",
        cls: "setting-item-description",
      });
    } else {
      for (const media of library) {
        this.renderMediaEntry(containerEl, media);
      }
    }
  }

  private renderMediaEntry(container: HTMLElement, media: Media) {
    const s = new Setting(container)
      .setName(media.title)
      .setDesc(
        [
          media.type,
          media.year,
          media.genres.length ? media.genres.join(", ") : null,
          `Status: ${media.status}`,
          `Folder: ${media.noteFolder}`,
        ]
          .filter(Boolean)
          .join("  ·  ")
      )
      .addButton((btn) => {
        btn.setButtonText("Edit").onClick(() => {
          new AddMediaModal(
            this.app,
            async (updated) => {
              const idx = this.plugin.settings.mediaLibrary.findIndex(
                (m) => m.id === media.id
              );
              if (idx !== -1) {
                this.plugin.settings.mediaLibrary[idx] = updated;
                await this.plugin.saveSettings();
                this.display();
              }
            },
            media
          ).open();
        });
      })
      .addButton((btn) => {
        btn
          .setButtonText("Delete")
          .setWarning()
          .onClick(async () => {
            this.plugin.settings.mediaLibrary =
              this.plugin.settings.mediaLibrary.filter((m) => m.id !== media.id);
            await this.plugin.saveSettings();
            this.display();
          });
      });

    // Status badge
    const statusColors: Record<string, string> = {
      watching: "var(--color-green)",
      completed: "var(--color-blue)",
      planned: "var(--color-yellow)",
      dropped: "var(--color-red)",
      "on-hold": "var(--color-orange)",
      rewatching: "var(--color-purple)",
    };
    const badge = s.nameEl.createEl("span", {
      text: ` ${media.status}`,
      cls: "media-templates-badge",
    });
    badge.style.color = statusColors[media.status] ?? "inherit";
    badge.style.fontSize = "0.8em";
    badge.style.marginLeft = "0.5em";
  }
}
