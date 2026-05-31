export type KylrixApp = 'root' | 'accounts' | 'kylrix' | 'vault' | 'flow' | 'note' | 'connect';

export type GoogleServiceKey = 'keep' | 'tasks' | 'calendar' | 'drive' | 'gmail' | 'docs' | 'sheets';

export interface GoogleService {
  key: GoogleServiceKey;
  name: string;
  googlename: string;
  description: string;
  connected: boolean;
  syncActive: boolean;
  destination: string;
  app: KylrixApp;
  lastSync: string | null;
  accent: string;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'error';
  service: string;
  message: string;
}

export interface KeepMapping {
  importMode: 'all' | 'filtered';
  markdownCategory: string; // Kylrix Note category
  autoTag: boolean;
}

export interface TasksMapping {
  flowBoard: string; // Kylrix Flow board/stream
  priorityThreshold: 'all' | 'high';
}

export interface CalendarMapping {
  flowAgenda: string; // Kylrix Flow agenda / schedule stream
  syncRangeDays: number; // e.g., 30, 90, 180
}

export interface DriveMapping {
  vaultDirectory: string; // Kylrix Vault location
  encryptOnImport: boolean;
}

export interface GmailMapping {
  connectChannel: string; // Kylrix Connect channel destination
  filterKeyword: string;
}

export interface DocsMapping {
  noteDirectory: string; // Kylrix Note location
  importAsMarkdown: boolean;
}

export interface GoogleDoc {
  id: string;
  title: string;
  bodyContent?: string;
  lastModified?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
}

export interface GitHubConfig {
  connected: boolean;
  tokenType: 'pat' | 'oauth' | null;
  token: string | null;
  username: string | null;
  avatarUrl: string | null;
  selectedRepo: string | null; // e.g., 'owner/repo'
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  html_url: string;
  created_at: string;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface GoogleTaskList {
  id: string;
  title: string;
  updated?: string;
}

export interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string;
  updated?: string;
}

export interface GoogleKeepNote {
  name: string; // "notes/{noteId}"
  title?: string;
  body?: {
    text?: {
      text?: string;
    };
  };
  createTime?: string;
  updateTime?: string;
}

export interface GoogleGmailMessage {
  id: string;
  threadId: string;
  from?: string;
  to?: string;
  subject?: string;
  snippet?: string;
  body?: string;
  date?: string;
  labels?: string[];
}

export interface GoogleGmailLabel {
  id: string;
  name: string;
  type?: string;
}

export interface GooglePickerFile {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  description?: string;
  sizeBytes?: number;
}

export interface SheetsMapping {
  flowBoard: string;
  autoSync: boolean;
}

export interface GoogleSpreadsheet {
  id: string;
  title: string;
  url: string;
  sheets: {
    sheetId: number;
    title: string;
    index: number;
  }[];
  lastModified?: string;
}

export interface GoogleSheetData {
  spreadsheetId: string;
  sheetName: string;
  values: string[][];
}



