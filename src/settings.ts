import type { Media } from "./types";

export interface MediaTemplatesSettings {
  /** The user's media library */
  mediaLibrary: Media[];
  /** Vault path to the folder where notes for all media are created */
  defaultMediaFolder: string;
  /** Vault path to this plugin's template files (for reference / standalone Templater use) */
  templateFolder: string;
  /** Automatically create sub-folders when creating a note */
  autoCreateFolders: boolean;
  /** Open the new note after creating it */
  openAfterCreate: boolean;
}

export const DEFAULT_SETTINGS: MediaTemplatesSettings = {
  mediaLibrary: [],
  defaultMediaFolder: "Media",
  templateFolder: "Templates/Media",
  autoCreateFolders: true,
  openAfterCreate: true,
};
