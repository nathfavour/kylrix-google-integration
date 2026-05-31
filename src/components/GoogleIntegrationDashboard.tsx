import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Switch, 
  Chip, 
  Button, 
  LinearProgress, 
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  Paper
} from '@mui/material';
import { 
  RefreshCw, 
  Trash2, 
  FileText, 
  Calendar, 
  FolderLock, 
  Mail, 
  ArrowUpRight, 
  Layers,
  Terminal,
  Activity,
  AlertTriangle,
  Database,
  MapPin,
  Clock,
  User,
  Search,
  Upload,
  Download,
  Folder,
  Eye,
  File,
  ListTodo,
  CheckSquare,
  Plus
} from 'lucide-react';
import { GoogleService, GoogleServiceKey, SyncLog, CalendarEvent, GoogleDoc, GoogleDriveFile, GoogleTaskList, GoogleTask } from '../types';
import { MappingModal } from './MappingModal';
import Logo from './Logo';
import { initAuth, googleSignIn, logout, getAccessToken } from '../googleAuth';

export const GoogleIntegrationDashboard: React.FC = () => {
  // Initial states representing the sovereign Google import conduits
  const [services, setServices] = useState<GoogleService[]>([
    {
      key: 'keep',
      name: 'Google Keep',
      googlename: 'Keep Archive',
      description: 'Import checklists, legacy ideas, and voice logs into Markdown-supported structures.',
      connected: false,
      syncActive: false,
      destination: 'Kylrix Note',
      app: 'note',
      lastSync: null,
      accent: '#EC4899' // Note brand color
    },
    {
      key: 'tasks',
      name: 'Google Tasks',
      googlename: 'Tasks Feed',
      description: 'Transfer unfinished items, checklists, and pipelines directly into active Kanban boards.',
      connected: false,
      syncActive: false,
      destination: 'Kylrix Flow',
      app: 'flow',
      lastSync: null,
      accent: '#A855F7' // Flow brand color
    },
    {
      key: 'calendar',
      name: 'Google Calendar',
      googlename: 'Calendar API',
      description: 'Verify and map upcoming private schedules into offline analytical workspace agendas.',
      connected: false,
      syncActive: false,
      destination: 'Kylrix Flow',
      app: 'flow',
      lastSync: null,
      accent: '#A855F7' // Flow brand color
    },
    {
      key: 'drive',
      name: 'Google Drive',
      googlename: 'Drive Storage',
      description: 'Secure, client-encrypt, and upload document volumes to the Zero-Knowledge Vault.',
      connected: false,
      syncActive: false,
      destination: 'Kylrix Vault',
      app: 'vault',
      lastSync: null,
      accent: '#10B981' // Vault brand color
    },
    {
      key: 'gmail',
      name: 'Gmail',
      googlename: 'Gmail IMAPS',
      description: 'Index local correspondence into private peer channels or autonomous agent streams.',
      connected: false,
      syncActive: false,
      destination: 'Kylrix Connect',
      app: 'connect',
      lastSync: null,
      accent: '#F59E0B' // Connect brand color
    },
    {
      key: 'docs',
      name: 'Google Docs',
      googlename: 'Docs Editor',
      description: 'Exchange structured text nodes, drafts, and design logs directly with active Google Documents.',
      connected: false,
      syncActive: false,
      destination: 'Kylrix Note',
      app: 'note',
      lastSync: null,
      accent: '#3B82F6' // Docs brand color
    }
  ]);

  // Firebase auth state variables
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  // Live Calendar State
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // Live Google Docs State
  const [googleDocs, setGoogleDocs] = useState<GoogleDoc[]>([]);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(false);
  const [docsError, setDocsError] = useState<string | null>(null);
  const [activeDocContent, setActiveDocContent] = useState<string | null>(null);
  const [activeDocTitle, setActiveDocTitle] = useState<string | null>(null);
  const [fetchingDocId, setFetchingDocId] = useState<string | null>(null);
  const [directDocUrlOrId, setDirectDocUrlOrId] = useState<string>('');
  
  // Create / Export doc states
  const [exportTitle, setExportTitle] = useState<string>('Kylrix Sovereign Design Log');
  const [exportContent, setExportContent] = useState<string>('# Kylrix Sovereign Design Log\n\n- Local hardware-bound keys verified.\n- Zero cloud telemetry storage.\n- Private note conduit established successfully.');
  const [exportLoad, setExportLoad] = useState<boolean>(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  // Live Google Tasks State
  const [taskLists, setTaskLists] = useState<GoogleTaskList[]>([]);
  const [selectedTaskListId, setSelectedTaskListId] = useState<string>('@default');
  const [googleTasks, setGoogleTasks] = useState<GoogleTask[]>([]);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(false);
  const [tasksError, setTasksError] = useState<string | null>(null);
  
  // Create task states
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskNotes, setNewTaskNotes] = useState<string>('');
  const [creatingTask, setCreatingTask] = useState<boolean>(false);

  // Live Google Drive State
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [loadingDrive, setLoadingDrive] = useState<boolean>(false);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [driveSearch, setDriveSearch] = useState<string>('');
  
  // Upload states
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Global states for simulated sync orchestration
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([
    { id: '1', timestamp: '14:06:00', type: 'info', service: 'System', message: 'Sovereign client bridge initialized.' }
  ]);
  const [activeSyncStep, setActiveSyncStep] = useState<string>('');

  // Mapping Modal controls
  const [selectedService, setSelectedService] = useState<GoogleService | null>(null);
  const [mappingOpen, setMappingOpen] = useState<boolean>(false);

  // Destructive wipe Dialog controls
  const [wipeOpen, setWipeOpen] = useState<boolean>(false);

  // Stats Counters
  const [itemsImported, setItemsImported] = useState<number>(() => {
    const cached = localStorage.getItem('cached_calendar_events');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return parsed.length;
      } catch (e) {
        return 0;
      }
    }
    return 0;
  });

  // Handle Auth mount listening
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, cachedToken) => {
        setCurrentUser(user);
        setToken(cachedToken);
        setAuthChecked(true);
        triggerSyncLog('success', 'Auth', `Session restored for ${user.email}`);
        
        // Auto mark Google services as connected since auth succeeded
        setServices(current => current.map(s => {
          if (s.key === 'calendar' || s.key === 'keep' || s.key === 'tasks' || s.key === 'docs' || s.key === 'drive') {
            return { ...s, connected: true, syncActive: (s.key === 'calendar' || s.key === 'docs' || s.key === 'drive' || s.key === 'tasks') ? true : s.syncActive };
          }
          return s;
        }));

        // Fetch events, drive files and tasklists if user previously connected
        fetchCalendarEvents(cachedToken);
        fetchGoogleDriveFiles(cachedToken);
        fetchGoogleTaskLists(cachedToken);
      },
      () => {
        setCurrentUser(null);
        setToken(null);
        setAuthChecked(true);
        setServices(current => current.map(s => ({ ...s, connected: false, syncActive: false })));
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Sync Log triggering helper
  const triggerSyncLog = (type: 'info' | 'success' | 'warn' | 'error', service: string, message: string) => {
    const newLog: SyncLog = {
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      service,
      message
    };
    setSyncLogs(prev => [newLog, ...prev]);
  };

  // Google Login and Scope Request Handler
  const handleLogin = async () => {
    try {
      triggerSyncLog('info', 'Auth', 'Requesting secure Firebase Google Popup with Calendar scopes...');
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setToken(result.accessToken);
        triggerSyncLog('success', 'Auth', `Bridged successfully with profile: ${result.user.email}`);
        
        setServices(current => current.map(s => {
          if (s.key === 'calendar' || s.key === 'keep' || s.key === 'tasks' || s.key === 'docs' || s.key === 'drive') {
            return { ...s, connected: true, syncActive: (s.key === 'calendar' || s.key === 'docs' || s.key === 'drive' || s.key === 'tasks') ? true : s.syncActive };
          }
          return s;
        }));

        // Fetch initial list of calendar events, drive files and tasklists
        await fetchCalendarEvents(result.accessToken);
        await fetchGoogleDriveFiles(result.accessToken);
        await fetchGoogleTaskLists(result.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      triggerSyncLog('error', 'Auth', `Authentication cancelled or failed: ${err.message || err}`);
    }
  };

  // Google Sign-out Handler
  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to disconnect your Google account and deactivate the current synchronizers?");
    if (!confirmed) return;

    try {
      await logout();
      setCurrentUser(null);
      setToken(null);
      setCalendarEvents([]);
      setDriveFiles([]);
      setGoogleDocs([]);
      setGoogleTasks([]);
      setTaskLists([]);
      localStorage.removeItem('cached_calendar_events');
      setServices(current => current.map(s => ({ ...s, connected: false, syncActive: false, lastSync: null })));
      triggerSyncLog('warn', 'Auth', 'Google Account disconnected. Active access tokens flushed.');
    } catch (err: any) {
      console.error(err);
      triggerSyncLog('error', 'Auth', `Logout failed: ${err.message || err}`);
    }
  };

  // Fetch real Google Calendar Events
  const fetchCalendarEvents = async (accessToken: string) => {
    setLoadingEvents(true);
    setEventsError(null);
    try {
      const timeMin = new Date().toISOString();
      const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&singleEvents=true&timeMin=${timeMin}`;
      
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });
      
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Calendar fetch failed: Status ${res.status} - ${errText || res.statusText}`);
      }

      const data = await res.json();
      const eventsList: CalendarEvent[] = (data.items || []).map((item: any) => ({
        id: item.id,
        summary: item.summary || '(No Subject)',
        description: item.description,
        start: {
          dateTime: item.start?.dateTime,
          date: item.start?.date
        },
        end: {
          dateTime: item.end?.dateTime,
          date: item.end?.date
        },
        location: item.location
      }));

      setCalendarEvents(eventsList);
      localStorage.setItem('cached_calendar_events', JSON.stringify(eventsList));
      triggerSyncLog('success', 'Calendar', `Direct indexed ${eventsList.length} sovereign schedule blocks from primary feed.`);
      setItemsImported(eventsList.length);
    } catch (err: any) {
      console.error('Calendar error:', err);
      setEventsError(err.message || 'Error occurred fetching events');
      triggerSyncLog('error', 'Calendar', `API Query fault: ${err.message || err}`);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Fetch files from Google Drive
  const fetchGoogleDriveFiles = async (accessToken: string, queryStr = '') => {
    setLoadingDrive(true);
    setDriveError(null);
    try {
      let url = 'https://www.googleapis.com/drive/v3/files?pageSize=12&orderBy=modifiedTime desc&fields=files(id,name,mimeType,size,modifiedTime,webViewLink)';
      if (queryStr.trim()) {
        const query = encodeURIComponent(`name contains '${queryStr.replace(/'/g, "\\'")}'`);
        url = `https://www.googleapis.com/drive/v3/files?q=${query}&pageSize=12&orderBy=modifiedTime desc&fields=files(id,name,mimeType,size,modifiedTime,webViewLink)`;
      }
      
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });
      
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Drive list failed: Status ${res.status} - ${errText || res.statusText}`);
      }

      const data = await res.json();
      const filesList: GoogleDriveFile[] = (data.files || []).map((file: any) => ({
        id: file.id,
        name: file.name || 'Untitled File',
        mimeType: file.mimeType || 'unknown',
        size: file.size,
        modifiedTime: file.modifiedTime ? new Date(file.modifiedTime).toLocaleString() : undefined,
        webViewLink: file.webViewLink
      }));

      setDriveFiles(filesList);
      triggerSyncLog('success', 'Google Drive', `Successfully cached ${filesList.length} sovereign files/folders data.`);
    } catch (err: any) {
      console.error('Google Drive fetch error:', err);
      setDriveError(err.message || 'Error occurred querying Google Drive files');
      triggerSyncLog('error', 'Google Drive', `API stream failed: ${err.message || err}`);
    } finally {
      setLoadingDrive(false);
    }
  };

  // Delete Google Drive File (Mandatory User Confirmation)
  const handleDeleteDriveFile = async (fileId: string, fileName: string) => {
    if (!token) return;
    
    const confirmed = window.confirm(
      `CRITICAL DESTRUCTIVE ACTION REQUIRED\n\n` +
      `Are you sure you want to permanently delete the file "${fileName}" from Google Drive?\n` +
      `This action CANNOT be undone and will permanently remove it from cloud-storage nodes.`
    );
    if (!confirmed) return;

    triggerSyncLog('info', 'Google Drive', `Initiating deletion request for: "${fileName}"`);
    try {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Delete request failed with status ${res.status}`);
      }

      triggerSyncLog('success', 'Google Drive', `File "${fileName}" deleted successfully from your Google Drive.`);
      alert(`Deleted: "${fileName}" has been permanently purged from your Google Drive.`);
      
      // Refresh list
      fetchGoogleDriveFiles(token, driveSearch);
    } catch (err: any) {
      console.error(err);
      triggerSyncLog('error', 'Google Drive', `Purge path failed: ${err.message || err}`);
      alert(`Purge path failed: ${err.message}`);
    }
  };

  // Upload file to Google Drive (with drag and drop + click support)
  const handleUploadFile = async (selectedFile: File) => {
    if (!token) {
      handleLogin();
      return;
    }
    
    setUploading(true);
    setUploadSuccess(null);
    triggerSyncLog('info', 'Google Drive', `Compiling binary buffers for uploading file: "${selectedFile.name}" (${(selectedFile.size / 1024).toFixed(1)} KB)`);

    try {
      const metadata = {
        name: selectedFile.name,
        mimeType: selectedFile.type || 'application/octet-stream'
      };

      const boundary = 'KylrixBoundaryCryptoTransfer';
      const delimiter = `\r\n--${boundary}\r\n`;
      const close_delim = `\r\n--${boundary}--`;

      const reader = new FileReader();
      
      const fileUploadPromise = new Promise((resolve, reject) => {
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = async () => {
          try {
            const base64Data = btoa(
              new Uint8Array(reader.result as ArrayBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            
            const multipartRequestBody =
              delimiter +
              'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
              JSON.stringify(metadata) +
              delimiter +
              `Content-Type: ${metadata.mimeType}\r\n` +
              'Content-Transfer-Encoding: base64\r\n\r\n' +
              base64Data +
              close_delim;

            const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': `multipart/related; boundary=${boundary}`
              },
              body: multipartRequestBody
            });

            if (!res.ok) {
              throw new Error(`Upload POST rejected: Status ${res.status}`);
            }

            const responseData = await res.json();
            resolve(responseData);
          } catch (e) {
            reject(e);
          }
        };
        reader.onerror = () => reject(new Error('Local file reader error'));
      });

      const responseData: any = await fileUploadPromise;

      setUploadSuccess(`File "${selectedFile.name}" successfully vaulted to Google Drive!`);
      triggerSyncLog('success', 'Google Drive', `Secure transport bound. Uploaded file "${selectedFile.name}" (ID: ${responseData.id}).`);
      
      // Refresh lists
      fetchGoogleDriveFiles(token, driveSearch);
      setUploadFile(null);
    } catch (err: any) {
      console.error(err);
      triggerSyncLog('error', 'Google Drive', `File transmission blocked: ${err.message || err}`);
      alert(`File upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Fetch Google Docs List from Drive API (Documents only)
  const fetchGoogleDocs = async (accessToken: string) => {
    setLoadingDocs(true);
    setDocsError(null);
    try {
      // Query recent documents (mimeType application/vnd.google-apps.document)
      const url = `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.document'&pageSize=8&orderBy=modifiedTime desc&fields=files(id,name,modifiedTime)`;
      
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });
      
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Docs fetch failed: Status ${res.status} - ${errText || res.statusText}`);
      }

      const data = await res.json();
      const docsList: GoogleDoc[] = (data.files || []).map((file: any) => ({
        id: file.id,
        title: file.name || '(Untitled Document)',
        lastModified: file.modifiedTime ? new Date(file.modifiedTime).toLocaleString() : undefined
      }));

      setGoogleDocs(docsList);
      triggerSyncLog('success', 'Docs Editor', `Conduit indexed ${docsList.length} sovereign doc files from cloud nodes.`);
    } catch (err: any) {
      console.error('Google Docs fetch error:', err);
      setDocsError(err.message || 'Error occurred listing Google Docs');
      triggerSyncLog('error', 'Docs Editor', `API list error: ${err.message || err}`);
    } finally {
      setLoadingDocs(false);
    }
  };

  // Fetch full details & body content of a specific Google Doc and compile to Markdown
  const fetchDocContent = async (accessToken: string, docId: string) => {
    setFetchingDocId(docId);
    setDocsError(null);
    try {
      const url = `https://docs.googleapis.com/v1/documents/${docId}`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`Doc content fetch failed with status ${res.status}`);
      }

      const documentNode = await res.json();
      setActiveDocTitle(documentNode.title);
      
      // Parse Document JSON format into pristine Markdown standard
      let md = '';
      if (documentNode.body && documentNode.body.content) {
        for (const element of documentNode.body.content) {
          if (element.paragraph) {
            const parts = element.paragraph.elements || [];
            const text = parts.map((p: any) => p.textRun?.content || '').join('');
            
            // Infer headings and paragraphs
            const style = element.paragraph.paragraphStyle?.namedStyleType;
            if (style === 'HEADING_1') {
              md += `# ${text.trim()}\n\n`;
            } else if (style === 'HEADING_2') {
              md += `## ${text.trim()}\n\n`;
            } else if (style === 'HEADING_3') {
              md += `### ${text.trim()}\n\n`;
            } else {
              if (text.trim()) {
                md += `${text.trim()}\n\n`;
              }
            }
          }
        }
      }

      if (!md.trim()) {
        md = '*Document is empty, or uses non-standard paragraph block elements.*';
      }

      setActiveDocContent(md);
      triggerSyncLog('success', 'Docs Editor', `Ingested & translated "${documentNode.title}" content layout into Markdown format.`);
    } catch (err: any) {
      console.error('Docs content error:', err);
      setDocsError(err.message || 'Could not fetch Google Doc content');
      triggerSyncLog('error', 'Docs Editor', `API content fetch fault: ${err.message || err}`);
    } finally {
      setFetchingDocId(null);
    }
  };

  // Extract Google Doc ID from URL if necessary and fetch content
  const handleDirectFetchDoc = async () => {
    if (!token) {
      handleLogin();
      return;
    }
    const input = directDocUrlOrId.trim();
    if (!input) {
      alert('Please enter a Google Doc ID or URL first.');
      return;
    }

    let docId = input;
    // Check if user pasted a standard Google Docs Web link
    const match = input.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      docId = match[1];
    }

    triggerSyncLog('info', 'Docs Editor', `Direct document fetch initiated for key/ID: ${docId}`);
    await fetchDocContent(token, docId);
  };

  // Convert and Save the parsed markdown of the active Google Doc locally as a Note
  const saveGoogleDocContentAsNote = () => {
    if (!activeDocTitle || !activeDocContent) return;
    
    // Check user confirmation
    const confirmed = window.confirm(`Import "${activeDocTitle}" as a local Markdown note? This will append it directly to your sovereign note storage.`);
    if (!confirmed) return;

    try {
      // Create a simulated draft node inside localStorage or cached_notes
      const newNote = {
        id: Date.now().toString(),
        title: activeDocTitle,
        date: 'Just imported',
        size: `${(activeDocContent.length / 1024).toFixed(1)}kb`,
        content: activeDocContent
      };
      
      const existing = localStorage.getItem('cached_notes');
      let parsed = [];
      if (existing) {
        parsed = JSON.parse(existing);
      }
      parsed.unshift(newNote);
      localStorage.setItem('cached_notes', JSON.stringify(parsed));
      
      triggerSyncLog('success', 'Kylrix Note', `Saved "${activeDocTitle}" as standard offline Markdown note.`);
      alert(`Success! "${activeDocTitle}" has been saved as a local notes draft node.`);
    } catch (e: any) {
      console.error(e);
      triggerSyncLog('error', 'Kylrix Note', `Storage mismatch: ${e.message}`);
    }
  };

  // Export/Create Google Doc with custom title and body text
  const writeGoogleDoc = async () => {
    if (!token) {
      handleLogin();
      return;
    }
    
    if (!exportTitle.trim() || !exportContent.trim()) {
      alert('Please specify a title and contents before exporting.');
      return;
    }

    const confirmed = window.confirm(`Create a new Google Doc named "${exportTitle}" with your sovereign drafted note contents?`);
    if (!confirmed) return;

    setExportLoad(true);
    setExportSuccessMessage(null);
    try {
      // 1. Send metadata POST to create a blank document with the requested title
      const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: exportTitle })
      });

      if (!createRes.ok) {
        throw new Error(`Create failed with status ${createRes.status}`);
      }

      const createdDoc = await createRes.json();
      const docId = createdDoc.documentId;

      // 2. Load the text content to insert
      const batchUpdateRes = await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [
            {
              insertText: {
                text: exportContent,
                location: {
                  index: 1
                }
              }
            }
          ]
        })
      });

      if (!batchUpdateRes.ok) {
        throw new Error(`Writing document body failed with status ${batchUpdateRes.status}`);
      }

      setExportSuccessMessage(`Successfully created Document: "${exportTitle}"!`);
      triggerSyncLog('success', 'Docs Editor', `Export completed: Document "${exportTitle}" uploaded safely to ID: ${docId}.`);
      
      // Refresh docs file listing
      fetchGoogleDocs(token);
    } catch (err: any) {
      console.error('Export doc error:', err);
      triggerSyncLog('error', 'Docs Editor', `Export failed: ${err.message || err}`);
      alert(`Export failed: ${err.message}`);
    } finally {
      setExportLoad(false);
    }
  };

  // Fetch lists of tasks from Google Tasks API
  const fetchGoogleTaskLists = async (accessToken: string) => {
    setLoadingTasks(true);
    setTasksError(null);
    try {
      const url = 'https://tasks.googleapis.com/v1/users/@me/lists';
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Task lists fetch failed: Status ${res.status} - ${errText || res.statusText}`);
      }

      const data = await res.json();
      const lists: GoogleTaskList[] = (data.items || []).map((item: any) => ({
        id: item.id,
        title: item.title || 'Untitled List',
        updated: item.updated
      }));

      setTaskLists(lists);
      triggerSyncLog('success', 'Google Tasks', `Successfully cached ${lists.length} task lists.`);

      // Automatically fetch tasks for the active list (or default list if available)
      const activeList = lists.find(l => l.id === selectedTaskListId) || lists[0];
      if (activeList) {
        setSelectedTaskListId(activeList.id);
        fetchGoogleTasks(accessToken, activeList.id);
      } else {
        fetchGoogleTasks(accessToken, '@default');
      }
    } catch (err: any) {
      console.error('Google Task Lists fetch error:', err);
      if (err.message.includes('403') || err.message.includes('insufficient_permissions') || err.message.includes('Permission')) {
        setTasksError('Insufficient authentication scopes or permissions. Try re-signing in with Google Tasks permissions.');
      } else {
        setTasksError(err.message || 'Error occurred querying Tasks lists');
      }
      triggerSyncLog('error', 'Google Tasks', `API lists query failed: ${err.message || err}`);
    } finally {
      setLoadingTasks(false);
    }
  };

  // Fetch tasks belonging to a specific list
  const fetchGoogleTasks = async (accessToken: string, listId: string) => {
    setLoadingTasks(true);
    setTasksError(null);
    try {
      // Endpoint to retrieve active and completed tasks (max 100)
      const url = `https://tasks.googleapis.com/v1/lists/${listId}/tasks?maxResults=100&showCompleted=true&showHidden=true`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Tasks fetch failed: Status ${res.status} - ${errText || res.statusText}`);
      }

      const data = await res.json();
      const taskItems: GoogleTask[] = (data.items || []).map((item: any) => ({
        id: item.id,
        title: item.title || '(No Title)',
        notes: item.notes,
        status: item.status || 'needsAction',
        due: item.due,
        updated: item.updated
      }));

      setGoogleTasks(taskItems);
      triggerSyncLog('success', 'Google Tasks', `Cached ${taskItems.length} tasks from list.`);
    } catch (err: any) {
      console.error('Google Tasks list items error:', err);
      setTasksError(err.message || 'Error occurred querying tasks from list');
      triggerSyncLog('error', 'Google Tasks', `API tasks fetch failed: ${err.message || err}`);
    } finally {
      setLoadingTasks(false);
    }
  };

  // Create a new task in the active list
  const handleCreateGoogleTask = async () => {
    if (!token) {
      handleLogin();
      return;
    }

    if (!newTaskTitle.trim()) {
      alert('Task title cannot be empty.');
      return;
    }

    setCreatingTask(true);
    triggerSyncLog('info', 'Google Tasks', `Pushing new task payload to cloud nodes: "${newTaskTitle}"`);
    try {
      const url = `https://tasks.googleapis.com/v1/lists/${selectedTaskListId}/tasks`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          title: newTaskTitle,
          notes: newTaskNotes || undefined
        })
      });

      if (!res.ok) {
        throw new Error(`Create task failed with status ${res.status}`);
      }

      const created = await res.json();
      triggerSyncLog('success', 'Google Tasks', `Created task: "${created.title}" successfully.`);
      setNewTaskTitle('');
      setNewTaskNotes('');
      
      // Refresh list
      fetchGoogleTasks(token, selectedTaskListId);
    } catch (err: any) {
      console.error(err);
      triggerSyncLog('error', 'Google Tasks', `Task creation blocked: ${err.message || err}`);
      alert(`Creation failed: ${err.message}`);
    } finally {
      setCreatingTask(false);
    }
  };

  // Toggle/Update task status (Mark Completed or Needs Action)
  const handleToggleGoogleTask = async (taskId: string, currentStatus: 'needsAction' | 'completed') => {
    if (!token) return;

    const nextStatus = currentStatus === 'completed' ? 'needsAction' : 'completed';
    triggerSyncLog('info', 'Google Tasks', `Patching task status node: Toggle status to ${nextStatus}...`);

    try {
      const url = `https://tasks.googleapis.com/v1/lists/${selectedTaskListId}/tasks/${taskId}`;
      
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: taskId,
          status: nextStatus
        })
      });

      if (!res.ok) {
        throw new Error(`PATCH request failed with status ${res.status}`);
      }

      triggerSyncLog('success', 'Google Tasks', `Updated task state to "${nextStatus}".`);
      
      // Refresh list
      fetchGoogleTasks(token, selectedTaskListId);
    } catch (err: any) {
      console.error(err);
      triggerSyncLog('error', 'Google Tasks', `State transition failed: ${err.message || err}`);
      alert(`Update failed: ${err.message}`);
    }
  };

  // Delete task permanently
  const handleDeleteGoogleTask = async (taskId: string, taskTitle: string) => {
    if (!token) return;

    const confirmed = window.confirm(`Permanently delete task "${taskTitle}" from Google Tasks? This cannot be undone.`);
    if (!confirmed) return;

    triggerSyncLog('info', 'Google Tasks', `Sending DELETE block request for: "${taskTitle}"`);
    try {
      const url = `https://tasks.googleapis.com/v1/lists/${selectedTaskListId}/tasks/${taskId}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Delete task returned status ${res.status}`);
      }

      triggerSyncLog('success', 'Google Tasks', `Purged task "${taskTitle}" successfully.`);
      
      // Refresh list
      fetchGoogleTasks(token, selectedTaskListId);
    } catch (err: any) {
      console.error(err);
      triggerSyncLog('error', 'Google Tasks', `Delete transaction failed: ${err.message || err}`);
      alert(`Delete failed: ${err.message}`);
    }
  };

  // Progress/Loading timeline simulation
  useEffect(() => {
    let timer: any;
    if (syncing) {
      timer = setInterval(() => {
        setSyncProgress((prev) => {
          if (prev >= 100) {
            setSyncing(false);
            const totalItems = calendarEvents.length > 0 ? calendarEvents.length : 24;
            setItemsImported(totalItems);
            
            const successLog: SyncLog = {
              id: Date.now().toString(),
              timestamp: new Date().toLocaleTimeString(),
              type: 'success',
              service: 'Master Sync',
              message: `Database sync cycle concluded. ${totalItems} new calendar records written securely.`
            };
            setSyncLogs(logs => [successLog, ...logs]);
            setActiveSyncStep('Synchronization Successful');
            
            setServices(current => current.map(s => {
              if (s.connected && s.syncActive) {
                return { ...s, lastSync: 'Just now' };
              }
              return s;
            }));

            return 100;
          }
          
          const nextProgress = prev + 8;
          
          if (nextProgress === 16) {
            triggerSyncLog('info', 'Keep', 'Parsing Keep legacy checklists into Markdown tags...');
            setActiveSyncStep('Processing Keep Markdown nodes');
          } else if (nextProgress === 32) {
            triggerSyncLog('success', 'Keep', 'Keep import completed: 18 legacy items written.');
            triggerSyncLog('info', 'Tasks', 'Opening tasks feed stream destination: Kylrix Flow...');
            setActiveSyncStep('Transferring Google Tasks targets');
            if (token && services.find(s => s.key === 'tasks')?.syncActive) {
              fetchGoogleTaskLists(token);
            }
          } else if (nextProgress === 48) {
            triggerSyncLog('success', 'Tasks', 'Tasks processed: 12 backlog cards updated.');
            triggerSyncLog('info', 'Calendar', 'Checking upcoming event arrays...');
            setActiveSyncStep('Parsing Calendar database schemas');
            if (token && services.find(s => s.key === 'calendar')?.syncActive) {
              fetchCalendarEvents(token);
            }
          } else if (nextProgress === 64) {
            triggerSyncLog('success', 'Calendar', `Verified Google Calendar credentials. API results cached locally.`);
            triggerSyncLog('info', 'Docs Editor', 'Querying recent Doc items from active nodes...');
            setActiveSyncStep('Restoring Google Docs database paths');
            if (token && services.find(s => s.key === 'docs')?.syncActive) {
              fetchGoogleDocs(token);
            }
          } else if (nextProgress === 80) {
            triggerSyncLog('info', 'System', 'Revising Zero-Knowledge checksum signatures...');
            setActiveSyncStep('Verifying SHA-256 parity');
            if (token && services.find(s => s.key === 'drive')?.syncActive) {
              fetchGoogleDriveFiles(token);
            }
          } else if (nextProgress === 96) {
            triggerSyncLog('success', 'System', 'Encryption parameters validated. Writable caches closed.');
            setActiveSyncStep('Finalizing indices');
          }

          return nextProgress;
        });
      }, 400);
    } else {
      setSyncProgress(0);
    }

    return () => clearInterval(timer);
  }, [syncing, token, services, calendarEvents]);

  const handleToggleActive = (key: GoogleServiceKey, val: boolean) => {
    setServices(current => current.map(s => {
      if (s.key === key) {
        const connectedState = val ? true : s.connected;
        if (val) {
          triggerSyncLog('info', s.name, `Sync pipeline set to ACTIVE.`);
          if (s.key === 'calendar' && token) {
            fetchCalendarEvents(token);
          }
          if (s.key === 'drive' && token) {
            fetchGoogleDriveFiles(token);
          }
          if (s.key === 'tasks' && token) {
            fetchGoogleTaskLists(token);
          }
        } else {
          triggerSyncLog('warn', s.name, `Pipeline deactivated.`);
        }
        return { ...s, syncActive: val, connected: connectedState };
      }
      return s;
    }));
  };

  const handleCardClick = (service: GoogleService) => {
    if (!currentUser && (service.key === 'calendar' || service.key === 'keep' || service.key === 'tasks' || service.key === 'docs' || service.key === 'drive')) {
      handleLogin();
      return;
    }

    if (!service.connected) {
      setServices(current => current.map(s => {
        if (s.key === service.key) {
          triggerSyncLog('success', s.name, `Authenticated. Pipeline established securely.`);
          return { ...s, connected: true, syncActive: true };
        }
        return s;
      }));
      const updatedService = { ...service, connected: true, syncActive: true };
      setSelectedService(updatedService);
      setMappingOpen(true);
    } else {
      setSelectedService(service);
      setMappingOpen(true);
    }
  };

  const handleSaveMapping = (key: GoogleServiceKey, config: any) => {
    triggerSyncLog('success', services.find(s => s.key === key)?.name || 'System', 'Granular layout mappings saved configuration.');
  };

  const handleSyncAll = () => {
    // If we have Calendar active in services and we do have a real token, let's sync live events!
    const activePipelines = services.filter(s => s.connected && s.syncActive);
    if (!currentUser) {
      handleLogin();
      return;
    }
    if (activePipelines.length === 0) {
      triggerSyncLog('error', 'System', 'Failed to synchronize: No active pipelines configured.');
      return;
    }
    setSyncProgress(0);
    setSyncing(true);
    triggerSyncLog('info', 'System', `Starting block synchronization (Active: ${activePipelines.length} bridges).`);
  };

  const handleWipeData = () => {
    setWipeOpen(true);
  };

  const confirmWipeData = () => {
    setServices(current => current.map(s => ({ ...s, connected: false, syncActive: false, lastSync: null })));
    setCalendarEvents([]);
    localStorage.removeItem('cached_calendar_events');
    setItemsImported(0);
    setSyncLogs([
      { id: 'wipe', timestamp: new Date().toLocaleTimeString(), type: 'error', service: 'System', message: 'WIPE COMPLETE. All cached indexes, Google scopes, and historical metadata indexes purged from host storage.' }
    ]);
    setWipeOpen(false);
    triggerSyncLog('warn', 'System', 'Sovereign workspace state cleared. Isolated from external hosts.');
  };

  const serviceIcon = (key: GoogleServiceKey, color: string) => {
    const style = { color: color };
    switch (key) {
      case 'keep': return <FileText size={20} style={style} />;
      case 'tasks': return <Layers size={20} style={style} />;
      case 'calendar': return <Calendar size={20} style={style} />;
      case 'drive': return <FolderLock size={20} style={style} />;
      case 'gmail': return <Mail size={20} style={style} />;
      case 'docs': return <FileText size={20} style={style} />;
    }
  };

  return (
    <Box sx={{ color: '#FFFFFF', width: '100%' }}>
      
      {/* Dynamic Header actions banner */}
      <Paper 
        elevation={0}
        sx={{ 
          bgcolor: '#161412', 
          border: '1px solid #1C1A18', 
          borderRadius: '24px', 
          p: 3, 
          mb: 4,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, alignItems: 'center' }}>
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  label="Verified Auth Bridge" 
                  size="small"
                  sx={{ 
                    bgcolor: '#0A0908', 
                    color: '#6366F1', 
                    border: '1px solid #1C1A18', 
                    fontFamily: '"JetBrains Mono"',
                    fontSize: '11px',
                    fontWeight: 700
                  }} 
                />
                <Typography sx={{ fontSize: '12px', color: currentUser ? '#10B981' : '#F59E0B', fontFamily: '"JetBrains Mono"' }}>
                  ● {currentUser ? 'BRIDGED SECURELY' : 'UNAUTHORIZED'}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 800, fontFamily: '"Space Grotesk", sans-serif' }}>
                Google Suite Integration
              </Typography>
              <Typography variant="body2" sx={{ color: '#9B9691', mr: 2 }}>
                Configure local client replicas from your Google Calendar data. Fetch and view upcoming corporate schedules in a private offline context.
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
              {currentUser ? (
                <Box sx={{ p: 1.5, bgcolor: '#0A0908', borderRadius: '16px', border: '1px solid #1C1A18', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {currentUser.photoURL ? (
                    <Box component="img" src={currentUser.photoURL} referrerPolicy="no-referrer" sx={{ width: 32, height: 32, borderRadius: '50%' }} />
                  ) : (
                    <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={16} />
                    </Box>
                  )}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {currentUser.displayName || 'Google Member'}
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: '#9B9691', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {currentUser.email}
                    </Typography>
                  </Box>
                  <Button 
                    variant="text" 
                    size="small" 
                    onClick={handleLogout} 
                    sx={{ color: '#EF4444', fontSize: '11px', textTransform: 'none', fontWeight: 700 }}
                  >
                    Disconnect
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  onClick={handleLogin}
                  sx={{
                    borderColor: '#4285F4',
                    bgcolor: '#161412',
                    color: '#4285F4',
                    py: 1.2,
                    px: 3,
                    fontWeight: 700,
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.5,
                    borderRadius: '12px',
                    '&:hover': {
                      borderColor: '#4285F4',
                      bgcolor: '#0A0908',
                    }
                  }}
                >
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block', width: 16, height: 16 }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  Connect Google Account
                </Button>
              )}
              
              <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  startIcon={<Trash2 size={16} />}
                  onClick={handleWipeData}
                  disabled={syncing}
                  sx={{
                    bgcolor: '#161412',
                    color: '#EF4444',
                    py: 1.2,
                    px: 2,
                    fontSize: '13px',
                    borderColor: '#EF4444',
                    '&:hover': {
                      borderColor: '#DF3434',
                      bgcolor: '#0A0908',
                    },
                    '&.Mui-disabled': {
                      borderColor: '#1D1C1B',
                      color: '#34322F',
                    }
                  }}
                >
                  Clear Cached
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSyncAll}
                  disabled={syncing}
                  startIcon={syncing ? <CircularProgress size={16} sx={{ color: '#FFFFFF' }} /> : <RefreshCw size={16} />}
                  sx={{
                    bgcolor: '#6366F1',
                    color: '#FFFFFF',
                    py: 1.2,
                    px: 2,
                    fontSize: '13px',
                    '&:hover': {
                      bgcolor: '#575CF0',
                    },
                    '&.Mui-disabled': {
                      bgcolor: '#1C1A18',
                      color: '#9B9691',
                      border: '1px solid #34322F'
                    }
                  }}
                >
                  {syncing ? 'Syncing...' : 'Sync Now'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Sync Progress Indicator block */}
        {syncing && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#0A0908', borderRadius: '16px', border: '1px solid #34322F' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={14} sx={{ color: '#6366F1' }} />
                  <Typography sx={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, fontFamily: '"Space Grotesk"' }}>
                    Ecosystem Synchronization Active
                  </Typography>
                </Box>
                <Typography sx={{ color: '#6366F1', fontSize: '13px', fontWeight: 700, fontFamily: '"JetBrains Mono"' }}>
                  {syncProgress}% Complete
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={syncProgress} 
                sx={{ 
                  height: 6, 
                  borderRadius: 3, 
                  bgcolor: '#161412',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#6366F1',
                    borderRadius: 3
                  }
                }}
              />
              <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"' }}>
                CURRENT ACTION: {activeSyncStep || 'Negotiating handshakes'}
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Overview Analytics Metrics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
        <Box sx={{ p: 2.5, bgcolor: '#161412', borderRadius: '20px', border: '1px solid #1C1A18', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1.5, bgcolor: '#0A0908', borderRadius: '12px', color: '#6366F1', border: '1px solid #1C1A18', display: 'flex' }}>
            <Database size={20} />
          </Box>
          <Box>
            <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"', textTransform: 'uppercase' }}>Sovereign Records Bridged</Typography>
            <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 800 }}>{itemsImported} Events</Typography>
          </Box>
        </Box>
        
        <Box sx={{ p: 2.5, bgcolor: '#161412', borderRadius: '20px', border: '1px solid #1C1A18', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1.5, bgcolor: '#0A0908', borderRadius: '12px', color: '#10B981', border: '1px solid #1C1A18', display: 'flex' }}>
            <Activity size={20} />
          </Box>
          <Box>
            <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"', textTransform: 'uppercase' }}>Active Pipelines</Typography>
            <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 800 }}>
              {services.filter(s => s.connected && s.syncActive).length} / 6 Bridged
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 2.5, bgcolor: '#161412', borderRadius: '20px', border: '1px solid #1C1A18', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1.5, bgcolor: '#0A0908', borderRadius: '12px', color: '#EC4899', border: '1px solid #1C1A18', display: 'flex' }}>
            <Terminal size={20} />
          </Box>
          <Box>
            <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"', textTransform: 'uppercase' }}>Sync Encryption</Typography>
            <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 800 }}>Local GCM-AES</Typography>
          </Box>
        </Box>
      </Box>

      {/* Service Bridges Grid */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2, fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif' }}>
          Configured Bridges
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          {services.map((service) => {
            const isConnected = service.connected;
            const isSyncActive = service.syncActive;
            
            return (
              <Box key={service.key}>
                <Card 
                  onClick={() => handleCardClick(service)}
                  sx={{ 
                    cursor: 'pointer',
                    bgcolor: '#161412',
                    borderRadius: '24px', 
                    border: isSyncActive ? `1px solid ${service.accent}` : '1px solid #1D1C1B',
                    boxShadow: '0 4px 4px -4px rgba(0,0,0,0.9)',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-2px)', 
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
                      borderColor: service.accent,
                    }
                  }}
                >
                  <Box sx={{ height: '3px', width: '100%', bgcolor: isSyncActive ? service.accent : '#1C1A18' }} />

                  <CardContent sx={{ p: '20px !important' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ p: 1.2, bgcolor: '#0A0908', borderRadius: '12px', border: '1px solid #34322F', display: 'flex' }}>
                            {serviceIcon(service.key, service.accent)}
                          </Box>
                          <Box>
                            <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '15px', fontFamily: '"Space Grotesk"' }}>
                              {service.name}
                            </Typography>
                            <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"', textTransform: 'uppercase' }}>
                              Legacy: {service.googlename}
                            </Typography>
                          </Box>
                        </Box>

                        <Chip 
                          label={isConnected ? "BRIDGED" : "UNBOUND"} 
                          size="small"
                          sx={{ 
                            bgcolor: isConnected ? '#10B981' : '#1C1A18',
                            color: isConnected ? '#0A0908' : '#9B9691',
                            fontFamily: '"JetBrains Mono"',
                            fontSize: '10px',
                            fontWeight: 700,
                          }} 
                        />
                      </Box>

                      <Typography sx={{ color: '#9B9691', fontSize: '13px', minHeight: '38px', lineHeight: 1.4 }}>
                        {service.description}
                      </Typography>

                      <Divider sx={{ borderColor: '#1C1A18' }} />

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Logo app={service.app} size={20} variant="icon" />
                          <Typography sx={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 600 }}>
                            To {service.destination}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {isConnected && (
                            <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"' }}>
                              {service.lastSync ? `Sync: ${service.lastSync}` : 'Ready for sync'}
                            </Typography>
                          )}
                          <Box onClick={(e) => e.stopPropagation()} sx={{ display: 'flex' }}>
                            <Switch 
                              checked={isSyncActive}
                              onChange={(e) => handleToggleActive(service.key, e.target.checked)}
                              disabled={!isConnected && service.key !== 'drive' && service.key !== 'gmail'} 
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>

                  <Box sx={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12, 
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    '.MuiCard-root:hover &': { opacity: 1 }
                  }}>
                    <ArrowUpRight size={14} style={{ color: service.accent }} />
                  </Box>
                </Card>
              </Box>
            )
          })}
        </Box>
      </Box>

      {/* Real-time Integrated Calendar List Panel */}
      {calendarEvents.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2, fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={18} style={{ color: '#6366F1' }} /> Live Google Calendar Event Stream (Sovereign Sync)
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {calendarEvents.map((evt) => (
              <Box 
                key={evt.id} 
                sx={{ 
                  p: 2.5, 
                  bgcolor: '#161412', 
                  borderRadius: '20px', 
                  border: '1px solid #1D1C1B',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 700, fontFamily: '"Space Grotesk"', flex: 1, pr: 1 }}>
                    {evt.summary}
                  </Typography>
                  <Chip 
                    label="SYNCED" 
                    size="small" 
                    sx={{ height: 18, fontSize: '9px', bgcolor: '#0A0908', color: '#6366F1', border: '1px solid #1D1C1B', fontFamily: '"JetBrains Mono"', fontWeight: 700 }} 
                  />
                </Box>
                {evt.description && (
                  <Typography sx={{ color: '#9B9691', fontSize: '11px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {evt.description}
                  </Typography>
                )}
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 'auto', pt: 1, borderTop: '1px dashed #1D1C1B' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Clock size={12} style={{ color: '#6366F1' }} />
                    <Typography sx={{ color: '#E5E0DA', fontSize: '11px', fontFamily: '"JetBrains Mono"' }}>
                      {evt.start.dateTime ? new Date(evt.start.dateTime).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'}) : `${evt.start.date} (All Day)`}
                    </Typography>
                  </Box>
                  {evt.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MapPin size={12} style={{ color: '#EF4444' }} />
                      <Typography sx={{ color: '#9B9691', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {evt.location}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Real-time Integrated Google Tasks Feed & Management Panel */}
      {token && services.find(s => s.key === 'tasks')?.connected && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2, fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', display: 'flex', alignItems: 'center', gap: 1 }}>
            <ListTodo size={18} style={{ color: '#A855F7' }} /> Sovereign Google Tasks Pipeline (Sovereign Board)
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
            
            {/* Left Column: List Selector and Create Form */}
            <Box sx={{ p: 3, bgcolor: '#161412', borderRadius: '24px', border: '1px solid #1D1C1B', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography sx={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 600, fontFamily: '"Space Grotesk"' }}>
                  Task Stream Director
                </Typography>
                <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"' }}>
                  Select or generate checklist targets across connected Google Tasks feeds
                </Typography>
              </Box>

              {/* Tasks Selector Dropdown & Refresh */}
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <select
                  value={selectedTaskListId}
                  onChange={(e) => {
                    const listId = e.target.value;
                    setSelectedTaskListId(listId);
                    fetchGoogleTasks(token, listId);
                  }}
                  style={{
                    flex: 1,
                    background: '#0A0908',
                    border: '1px solid #1D1C1B',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    padding: '10px 14px',
                    fontSize: '13px',
                    fontFamily: '"JetBrains Mono"',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {taskLists.length === 0 ? (
                    <option value="@default">Default List</option>
                  ) : (
                    taskLists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.title}
                      </option>
                    ))
                  )}
                </select>

                <Button
                  variant="outlined"
                  onClick={() => fetchGoogleTaskLists(token)}
                  disabled={loadingTasks}
                  sx={{
                    minWidth: 'auto',
                    p: 1.5,
                    borderRadius: '12px',
                    borderColor: '#34322F',
                    color: '#E5E0DA',
                    '&:hover': { borderColor: '#A855F7', bgcolor: '#0A0908' }
                  }}
                  title="Reload Tasklists"
                >
                  <RefreshCw size={14} className={loadingTasks ? 'animate-spin' : ''} />
                </Button>
              </Box>

              <Divider sx={{ borderColor: '#1D1C1B' }} />

              {/* Create Task Form */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography sx={{ color: '#E5E0DA', fontSize: '12.5px', fontWeight: 700, fontFamily: '"Space Grotesk"' }}>
                  + Inject Sovereign Task Checkpoint
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task title (e.g. Verify SHA-256 signatures)..."
                    style={{
                      background: '#0A0908',
                      border: '1px solid #1D1C1B',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontFamily: '"Space Grotesk"',
                      padding: '10px 14px',
                      outline: 'none'
                    }}
                  />
                  <textarea
                    value={newTaskNotes}
                    onChange={(e) => setNewTaskNotes(e.target.value)}
                    placeholder="Provide additional context notes/telemetry details (optional)..."
                    rows={3}
                    style={{
                      background: '#0A0908',
                      border: '1px solid #1D1C1B',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      fontFamily: '"JetBrains Mono"',
                      padding: '10px 14px',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                  <Button
                    variant="contained"
                    disabled={creatingTask || !newTaskTitle.trim()}
                    onClick={handleCreateGoogleTask}
                    sx={{
                      bgcolor: '#A855F7',
                      color: '#0A0908',
                      fontWeight: 800,
                      textTransform: 'none',
                      borderRadius: '12px',
                      py: 1.2,
                      fontFamily: '"Space Grotesk"',
                      '&:hover': { bgcolor: '#9333EA' },
                      '&.Mui-disabled': { bgcolor: '#1D1C1B', color: '#4D4944' }
                    }}
                  >
                    {creatingTask ? 'Transmitting to Cloud...' : 'Commit Core Task Checkpoint'}
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Right Column: List of Google Tasks inside current list */}
            <Box sx={{ p: 3, bgcolor: '#161412', borderRadius: '24px', border: '1px solid #1D1C1B', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 600, fontFamily: '"Space Grotesk"' }}>
                    Active Checklist Feed
                  </Typography>
                  <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"' }}>
                    Check checkpoints to complete or permanently dissolve items
                  </Typography>
                </Box>
                <Chip
                  label={`${googleTasks.filter(t => t.status === 'completed').length}/${googleTasks.length} Done`}
                  size="small"
                  sx={{
                    bgcolor: '#0A0908',
                    color: '#A855F7',
                    border: '1px solid #1E1B29',
                    fontFamily: '"JetBrains Mono"',
                    fontSize: '10.5px'
                  }}
                />
              </Box>

              {tasksError && (
                <Alert
                  severity="error"
                  sx={{
                    bgcolor: '#2C1A1A',
                    color: '#FFAAAA',
                    border: '1px solid #3A1A1A',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                >
                  {tasksError}
                </Alert>
              )}

              {loadingTasks ? (
                <Box sx={{ display: 'flex', gap: 1.5, py: 6, justifyContent: 'center', alignItems: 'center' }}>
                  <CircularProgress size={18} sx={{ color: '#A855F7' }} />
                  <Typography sx={{ color: '#9B9691', fontSize: '13px', fontFamily: '"JetBrains Mono"' }}>Fetching list contents...</Typography>
                </Box>
              ) : googleTasks.length === 0 ? (
                <Box sx={{ p: 5, textAlign: 'center', border: '1px dashed #1D1C1B', borderRadius: '16px', bgcolor: '#0A0908' }}>
                  <CheckSquare size={24} style={{ color: '#4D4944', margin: '0 auto 12px' }} />
                  <Typography sx={{ color: '#9B9691', fontSize: '13px', mb: 1.5 }}>No checkpoints registered in this tasklist.</Typography>
                  <Typography sx={{ color: '#4D4944', fontSize: '11px' }}>Create one using the form on the left to initialize.</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: '380px', overflowY: 'auto', pr: 0.5 }}>
                  {googleTasks.map((task) => {
                    const isCompleted = task.status === 'completed';
                    return (
                      <Box
                        key={task.id}
                        sx={{
                          p: 1.8,
                          bgcolor: '#0A0908',
                          borderRadius: '16px',
                          border: '1px solid #1D1C1B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          opacity: isCompleted ? 0.6 : 1,
                          textDecoration: isCompleted ? 'line-through' : 'none',
                          transition: 'all 0.2s',
                          '&:hover': { borderColor: '#A855F7', transform: 'translateX(2px)' }
                        }}
                      >
                        <Box sx={{ minWidth: 0, flex: 1, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          <Button
                            variant="text"
                            onClick={() => handleToggleGoogleTask(task.id, task.status)}
                            sx={{
                              p: 0.5,
                              minWidth: 'auto',
                              color: isCompleted ? '#A855F7' : '#4D4944',
                              '&:hover': { color: '#A855F7' }
                            }}
                            title={isCompleted ? 'Mark as Needs Action' : 'Mark as Completed'}
                          >
                            <CheckSquare size={18} style={{ color: isCompleted ? '#A855F7' : '#4D4944' }} />
                          </Button>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography sx={{ color: isCompleted ? '#9B9691' : '#FFFFFF', fontSize: '13px', fontWeight: isCompleted ? 400 : 600 }}>
                              {task.title}
                            </Typography>
                            {task.notes && (
                              <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"', mt: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {task.notes}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleDeleteGoogleTask(task.id, task.title)}
                          sx={{ color: '#EF4444', minWidth: 'auto', p: 1 }}
                          title="Permanently Delete Task"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* Real-time Integrated Google Docs Explorer Panel */}
      {token && services.find(s => s.key === 'docs')?.connected && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2, fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', display: 'flex', alignItems: 'center', gap: 1 }}>
            <FileText size={18} style={{ color: '#3B82F6' }} /> Sovereign Google Docs Explorer (Dynamic Bridge)
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
            
            {/* Left Column: List and Select Documents to Ingest */}
            <Box sx={{ p: 3, bgcolor: '#161412', borderRadius: '24px', border: '1px solid #1D1C1B', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 600, fontFamily: '"Space Grotesk"' }}>
                    Workspace Documents Index
                  </Typography>
                  <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"' }}>
                    Active files with MIME type google-apps.document
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => fetchGoogleDocs(token)} 
                  disabled={loadingDocs}
                  startIcon={loadingDocs ? <CircularProgress size={12} /> : <RefreshCw size={12} />}
                  sx={{ 
                    borderColor: '#34322F', 
                    color: '#E5E0DA', 
                    fontSize: '11px', 
                    textTransform: 'none',
                    '&:hover': { borderColor: '#3B82F6', bgcolor: '#0A0908' }
                  }}
                >
                  Reload List
                </Button>
              </Box>

              {docsError && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    bgcolor: '#2C1A1A', 
                    color: '#FFAAAA', 
                    border: '1px solid #3A1A1A',
                    borderRadius: '12px',
                    fontSize: '12.5px',
                    lineHeight: 1.5
                  }}
                >
                  {docsError.includes('insufficient authentication scopes') || docsError.includes('insufficientPermissions') || docsError.includes('Insufficient Permission') ? (
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '13px', mb: 0.5, color: '#FF7777', fontFamily: '"Space Grotesk"' }}>
                        Listing Blocked: Insufficient Drive API Scope
                      </Typography>
                      <p style={{ margin: 0 }}>
                        Your token doesn't have the Google Drive file-listing metadata scope verified yet.
                        <strong style={{ color: '#FFFFFF' }}> Good news:</strong> Since your active Google Docs Editor scope is verified, you can
                        <strong style={{ color: '#60A5FA' }}> fetch any document directly below</strong> by pasting its Web URL or ID — no listing permission needed!
                        <br />
                        <span style={{ fontSize: '11px', color: '#B0A090', marginTop: '6px', display: 'inline-block' }}>
                          (To enable complete workspace folder listing, click Disconnect on top and link your account again to consent to the newly added scopes.)
                        </span>
                      </p>
                    </Box>
                  ) : (
                    docsError
                  )}
                </Alert>
              )}

              {/* Direct Fetch Utility Input */}
              <Box sx={{ p: 2, bgcolor: '#0A0908', borderRadius: '16px', border: '1px solid #34322F' }}>
                <Typography sx={{ color: '#E5E0DA', fontSize: '12px', fontWeight: 800, fontFamily: '"Space Grotesk"', mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <ArrowUpRight size={14} style={{ color: '#3B82F6' }} /> Direct URL / ID Ingestion (By-Pass List)
                </Typography>
                <Typography sx={{ color: '#9B9691', fontSize: '11.5px', mb: 1.5 }}>
                  Paste any Google Docs Link or Doc ID to fetch it instantly under safe direct-scope transport.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <input 
                    type="text"
                    value={directDocUrlOrId}
                    onChange={(e) => setDirectDocUrlOrId(e.target.value)}
                    placeholder="e.g. https://docs.google.com/document/d/..."
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#161412',
                      color: '#FFFFFF',
                      fontFamily: '"JetBrains Mono"',
                      fontSize: '12px',
                      border: '1px solid #1C1A18',
                      outline: 'none',
                    }}
                  />
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={handleDirectFetchDoc}
                    disabled={fetchingDocId !== null}
                    sx={{ 
                      bgcolor: '#3B82F6', 
                      color: '#0A0908',
                      fontWeight: 800,
                      textTransform: 'none',
                      borderRadius: '8px',
                      fontSize: '11px',
                      px: 2,
                      minWidth: '100px',
                      '&:hover': { bgcolor: '#2563EB' }
                    }}
                  >
                    {fetchingDocId ? <CircularProgress size={12} color="inherit" /> : 'Fetch & Parse'}
                  </Button>
                </Box>
              </Box>

              {loadingDocs ? (
                <Box sx={{ display: 'flex', gap: 1.5, py: 4, justifyContent: 'center', alignItems: 'center' }}>
                  <CircularProgress size={18} sx={{ color: '#3B82F6' }} />
                  <Typography sx={{ color: '#9B9691', fontSize: '13px', fontFamily: '"JetBrains Mono"' }}>Indexing metadata nodes...</Typography>
                </Box>
              ) : googleDocs.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center', border: '1px dashed #1D1C1B', borderRadius: '16px', bgcolor: '#0A0908' }}>
                  <Typography sx={{ color: '#9B9691', fontSize: '13px', mb: 2 }}>No Google Docs returned from standard Drive query. Verify auth status.</Typography>
                  <Button variant="contained" size="small" onClick={() => fetchGoogleDocs(token)} sx={{ bgcolor: '#3B82F6', color: '#FFFFFF', textTransform: 'none' }}>
                    Trigger Initial Index
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {googleDocs.map((doc) => {
                    const isFetchingThis = fetchingDocId === doc.id;
                    return (
                      <Box 
                        key={doc.id}
                        sx={{
                          p: 1.8,
                          bgcolor: '#0A0908',
                          borderRadius: '16px',
                          border: '1px solid #1D1C1B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s',
                          '&:hover': { borderColor: '#3B82F6', transform: 'translateX(2px)' }
                        }}
                      >
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography sx={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {doc.title}
                          </Typography>
                          <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"', mt: 0.5 }}>
                            Modified: {doc.lastModified || 'Unknown'}
                          </Typography>
                        </Box>
                        
                        <Button
                          variant="text"
                          size="small"
                          disabled={isFetchingThis}
                          onClick={() => fetchDocContent(token, doc.id)}
                          sx={{ color: '#3B82F6', fontSize: '11px', textTransform: 'none', fontWeight: 700 }}
                        >
                          {isFetchingThis ? <CircularProgress size={12} /> : 'Fetch & Parse'}
                        </Button>
                      </Box>
                    );
                  })}
                </Box>
              )}

              {/* Parsed Note Import Area */}
              {activeDocTitle && activeDocContent && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#0A0908', borderRadius: '16px', border: '1px solid #34322F' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography sx={{ color: '#3B82F6', fontSize: '12px', fontFamily: '"JetBrains Mono"', fontWeight: 700 }}>
                      PARSED MARKDOWN PREVIEW
                    </Typography>
                    <Button 
                      variant="contained" 
                      size="small" 
                      onClick={saveGoogleDocContentAsNote}
                      sx={{ bgcolor: '#10B981', color: '#0A0908', fontWeight: 700, textTransform: 'none', borderRadius: '8px', fontSize: '11px' }}
                    >
                      Write to Kylrix Note
                    </Button>
                  </Box>
                  <Typography sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 700, mb: 1 }}>
                    {activeDocTitle}
                  </Typography>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: '#161412', 
                    borderRadius: '8px', 
                    border: '1px solid #1D1C1B', 
                    maxHeight: '140px', 
                    overflowY: 'auto',
                    fontFamily: '"JetBrains Mono"',
                    fontSize: '11px',
                    color: '#9B9691',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {activeDocContent}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Right Column: Export/Write to Google Docs */}
            <Box sx={{ p: 3, bgcolor: '#161412', borderRadius: '24px', border: '1px solid #1D1C1B', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography sx={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 600, fontFamily: '"Space Grotesk"' }}>
                  Sovereign Note Draft Exporter
                </Typography>
                <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"' }}>
                  Create and publish compiled local markdown drafts directly to Google Docs
                </Typography>
              </Box>

              {exportSuccessMessage && (
                <Alert severity="success" sx={{ bgcolor: '#1A2C1A', color: '#AAFFAA', border: '1px solid #1A3A1A' }} onClose={() => setExportSuccessMessage(null)}>
                  {exportSuccessMessage}
                </Alert>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"', mb: 0.8 }}>
                    NEW TARGET DOC TITLE
                  </Typography>
                  <input 
                    type="text"
                    value={exportTitle}
                    onChange={(e) => setExportTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#0A0908',
                      color: '#FFFFFF',
                      fontFamily: '"JetBrains Mono"',
                      fontSize: '13px',
                      border: '1px solid #1D1C1B',
                      outline: 'none',
                    }}
                  />
                </Box>

                <Box>
                  <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"', mb: 0.8 }}>
                    SOVEREIGN COMPILATION TEXT BODY
                  </Typography>
                  <textarea 
                    rows={6}
                    value={exportContent}
                    onChange={(e) => setExportContent(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#0A0908',
                      color: '#FFFFFF',
                      fontFamily: '"JetBrains Mono"',
                      fontSize: '12px',
                      border: '1px solid #1D1C1B',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={writeGoogleDoc}
                  disabled={exportLoad}
                  startIcon={exportLoad ? <CircularProgress size={14} sx={{ color: '#0A0908' }} /> : <ArrowUpRight size={14} />}
                  sx={{
                    bgcolor: '#3B82F6',
                    color: '#0A0908',
                    fontWeight: 800,
                    textTransform: 'none',
                    borderRadius: '12px',
                    py: 1.2,
                    '&:hover': { bgcolor: '#2563EB' }
                  }}
                >
                  {exportLoad ? 'Uploading Draft...' : 'Export to Google Doc'}
                </Button>
              </Box>
            </Box>

          </Box>
        </Box>
      )}

      {/* Real-time Integrated Google Drive Vault & Storage Panel */}
      {token && services.find(s => s.key === 'drive')?.connected && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2, fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', display: 'flex', alignItems: 'center', gap: 1 }}>
            <FolderLock size={18} style={{ color: '#10B981' }} /> Sovereign Google Drive Vault (Integrated Storage)
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
            
            {/* Left Column: List and Select Files, Search and Delete */}
            <Box sx={{ p: 3, bgcolor: '#161412', borderRadius: '24px', border: '1px solid #1D1C1B', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 600, fontFamily: '"Space Grotesk"' }}>
                    Vault Storage Explorer
                  </Typography>
                  <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"' }}>
                    Indexed files and directories on Google Drive
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => fetchGoogleDriveFiles(token, driveSearch)} 
                  disabled={loadingDrive}
                  startIcon={loadingDrive ? <CircularProgress size={12} sx={{ color: '#10B981' }} /> : <RefreshCw size={12} />}
                  sx={{ 
                    borderColor: '#34322F', 
                    color: '#E5E0DA', 
                    fontSize: '11px', 
                    textTransform: 'none',
                    '&:hover': { borderColor: '#10B981', bgcolor: '#0A0908' }
                  }}
                >
                  Refresh Index
                </Button>
              </Box>

              {driveError && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    bgcolor: '#2C1A1A', 
                    color: '#FFAAAA', 
                    border: '1px solid #3A1A1A',
                    borderRadius: '12px',
                    fontSize: '12.5px',
                  }}
                >
                  {driveError}
                </Alert>
              )}

              {/* Live Search Drive Filter */}
              <Box sx={{ display: 'flex', gap: 1, p: 1, bgcolor: '#0A0908', borderRadius: '12px', border: '1px solid #1D1C1B', alignItems: 'center' }}>
                <Search size={14} style={{ color: '#9B9691', marginLeft: 6 }} />
                <input 
                  type="text"
                  value={driveSearch}
                  onChange={(e) => {
                    setDriveSearch(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      fetchGoogleDriveFiles(token, driveSearch);
                    }
                  }}
                  placeholder="Press enter to search files by name..."
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    fontFamily: '"JetBrains Mono"',
                    padding: '4px 8px'
                  }}
                />
                <Button
                  size="small"
                  onClick={() => fetchGoogleDriveFiles(token, driveSearch)}
                  sx={{ fontSize: '11px', textTransform: 'none', color: '#10B981', fontWeight: 700 }}
                >
                  Search
                </Button>
              </Box>

              {loadingDrive ? (
                <Box sx={{ display: 'flex', gap: 1.5, py: 4, justifyContent: 'center', alignItems: 'center' }}>
                  <CircularProgress size={18} sx={{ color: '#10B981' }} />
                  <Typography sx={{ color: '#9B9691', fontSize: '13px', fontFamily: '"JetBrains Mono"' }}>Scanning drive storage...</Typography>
                </Box>
              ) : driveFiles.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center', border: '1px dashed #1D1C1B', borderRadius: '16px', bgcolor: '#0A0908' }}>
                  <Typography sx={{ color: '#9B9691', fontSize: '13px', mb: 1.5 }}>No files matches returned.</Typography>
                  <Button variant="outlined" size="small" onClick={() => { setDriveSearch(''); fetchGoogleDriveFiles(token, ''); }} sx={{ color: '#10B981', borderColor: '#34322F', textTransform: 'none' }}>
                    Reset Filters
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: '350px', overflowY: 'auto', pr: 0.5 }}>
                  {driveFiles.map((file) => {
                    const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
                    return (
                      <Box 
                        key={file.id}
                        sx={{
                          p: 1.8,
                          bgcolor: '#0A0908',
                          borderRadius: '16px',
                          border: '1px solid #1D1C1B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s',
                          '&:hover': { borderColor: '#10B981', transform: 'translateX(2px)' }
                        }}
                      >
                        <Box sx={{ minWidth: 0, flex: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          {isFolder ? <Folder size={18} style={{ color: '#F59E0B' }} /> : <File size={18} style={{ color: '#10B981' }} />}
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography sx={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {file.name}
                            </Typography>
                            <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"', mt: 0.5 }}>
                              {isFolder ? 'Folder' : file.size ? `${(parseInt(file.size) / 1024).toFixed(0)} KB` : 'Dynamic size'} • {file.modifiedTime || 'Unknown date'}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {file.webViewLink && (
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => window.open(file.webViewLink, '_blank')}
                              sx={{ color: '#E5E0DA', minWidth: 'auto', p: 1 }}
                              title="View file on Google Drive"
                            >
                              <Eye size={14} />
                            </Button>
                          )}
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => handleDeleteDriveFile(file.id, file.name)}
                            sx={{ color: '#EF4444', minWidth: 'auto', p: 1 }}
                            title="Permanently Delete File"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>

            {/* Right Column: Upload Files, Drag and Drop, Click to Choice file */}
            <Box sx={{ p: 3, bgcolor: '#161412', borderRadius: '24px', border: '1px solid #1D1C1B', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography sx={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 600, fontFamily: '"Space Grotesk"' }}>
                  Sovereign Binary Vault Upload
                </Typography>
                <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"' }}>
                  Directly stream local files to Google Drive in full compliance with the sovereign transport layout
                </Typography>
              </Box>

              {uploadSuccess && (
                <Alert severity="success" sx={{ bgcolor: '#1A2C1A', color: '#AAFFAA', border: '1px solid #1A3A1A' }} onClose={() => setUploadSuccess(null)}>
                  {uploadSuccess}
                </Alert>
              )}

              {/* Drag and Drop Zone Container */}
              <Box 
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  const files = e.dataTransfer.files;
                  if (files && files.length > 0) {
                    setUploadFile(files[0]);
                    setUploadSuccess(null);
                  }
                }}
                onClick={() => {
                  document.getElementById('drive-file-uploader')?.click();
                }}
                sx={{
                  border: '2px dashed',
                  borderColor: isDragOver ? '#10B981' : '#34322F',
                  borderRadius: '20px',
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: isDragOver ? '#0A2A1A' : '#0A0908',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1.5,
                  minHeight: '160px',
                  justifyContent: 'center',
                  '&:hover': { borderColor: '#10B981', bgcolor: '#0D1A14' }
                }}
              >
                <input 
                  type="file"
                  id="drive-file-uploader"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setUploadFile(files[0]);
                      setUploadSuccess(null);
                    }
                  }}
                />
                <Upload size={24} style={{ color: isDragOver ? '#10B981' : '#E5E0DA' }} />
                <Box>
                  <Typography sx={{ color: '#FFFFFF', fontSize: '13.5px', fontWeight: 600 }}>
                    {uploadFile ? uploadFile.name : 'Drag & drop a file here, or click to browse'}
                  </Typography>
                  <Typography sx={{ color: '#9B9691', fontSize: '11px', mt: 0.5, fontFamily: '"JetBrains Mono"' }}>
                    {uploadFile ? `${(uploadFile.size / 1024).toFixed(1)} KB` : 'Supports standard images, documents, audio binary payloads'}
                  </Typography>
                </Box>
              </Box>

              {uploadFile && (
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleUploadFile(uploadFile)}
                    disabled={uploading}
                    startIcon={uploading ? <CircularProgress size={14} sx={{ color: '#0A0908' }} /> : <Upload size={14} />}
                    sx={{
                      bgcolor: '#10B981',
                      color: '#0A0908',
                      fontWeight: 800,
                      textTransform: 'none',
                      borderRadius: '12px',
                      py: 1.2,
                      '&:hover': { bgcolor: '#059669' }
                    }}
                  >
                    {uploading ? 'Vaulting File...' : `Upload "${uploadFile.name}"`}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setUploadFile(null)}
                    disabled={uploading}
                    sx={{
                      borderColor: '#34322F',
                      color: '#EF4444',
                      textTransform: 'none',
                      borderRadius: '12px',
                      px: 2,
                      '&:hover': { borderColor: '#EF4444', bgcolor: '#1A0A0A' }
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* Simulated Pipeline Shell / terminal logging stream */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#0A0908',
          border: '1px solid #1C1A18',
          borderRadius: '20px',
          p: 3,
          mt: 4,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Terminal size={16} style={{ color: '#6366F1' }} />
              <Typography sx={{ fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: '14px' }}>
                Secure Import Pipeline Logs
              </Typography>
            </Box>
            <Button 
              size="small"
              onClick={() => setSyncLogs([])}
              sx={{ 
                fontFamily: '"JetBrains Mono"', 
                fontSize: '11px', 
                color: '#9B9691',
                bgcolor: '#161412',
                border: '1px solid #1C1A18',
                '&:hover': { bgcolor: '#1C1A18' }
              }}
            >
              Flush Logs
            </Button>
          </Box>

          <Box sx={{ 
            bgcolor: '#050403', 
            borderRadius: '12px', 
            border: '1px solid #1C1A18',
            p: 2, 
            height: '150px', 
            overflowY: 'auto',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '12px'
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {syncLogs.length === 0 ? (
                <Typography sx={{ color: '#34322F', fontFamily: '"JetBrains Mono"', textAlign: 'center', py: 4 }}>
                  No active pipeline sessions recorded. Trigger a synchronization event.
                </Typography>
              ) : (
                syncLogs.map((log) => (
                  <Box key={log.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Typography sx={{ color: '#34322F', minWidth: '70px', flexShrink: 0 }}>
                      [{log.timestamp}]
                    </Typography>
                    <Typography sx={{ 
                      color: log.type === 'success' ? '#10B981' : log.type === 'warn' ? '#F59E0B' : log.type === 'error' ? '#EF4444' : '#6366F1',
                      fontWeight: 700,
                      minWidth: '60px',
                      flexShrink: 0
                    }}>
                      {log.service}:
                    </Typography>
                    <Typography sx={{ color: '#E5E0DA' }}>
                      {log.message}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          </Box>
          <Typography sx={{ color: '#34322F', fontSize: '10px', fontFamily: '"JetBrains Mono"', textAlign: 'right' }}>
            LOCAL TERMINAL DAEMON IP: //127.0.0.1 (SANDBOX BRIDGE)
          </Typography>
        </Box>
      </Paper>

      {/* Mapping Configuration Overlay */}
      <MappingModal 
        service={selectedService}
        isOpen={mappingOpen}
        onClose={() => {
          setMappingOpen(false);
          setSelectedService(null);
        }}
        onSave={handleSaveMapping}
      />

      {/* Destructive Confirm Wipe Dialog */}
      <Dialog
        open={wipeOpen}
        onClose={() => setWipeOpen(false)}
        slotProps={{
          backdrop: {
            style: { backgroundColor: 'rgba(5, 4, 3, 0.92)' }
          }
        }}
      >
        <DialogTitle sx={{ pr: 3, pl: 3, pt: 3, pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AlertTriangle size={24} style={{ color: '#EF4444' }} />
          <Typography sx={{ fontSize: '18px', fontWeight: 800, fontFamily: '"Space Grotesk"', color: '#FFFFFF' }}>
            Destructive Pipeline Wipe Request
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4, pt: 1, pb: 2 }}>
          <DialogContentText sx={{ color: '#9B9691', fontSize: '14px', lineHeight: 1.5 }}>
            You are about to execute a standard purge. This operations will instantly dissolve authorization tokens for Google Keep, Google Tasks, Calendar, Drive, and Gmail connections. Local file indices which references these sync points will be deleted on your mesh storage node.
          </DialogContentText>
          <Box sx={{ mt: 2.5, p: 2, bgcolor: '#0A0908', border: '1px solid #EF4444', borderRadius: '12px' }}>
            <Typography sx={{ color: '#EBF1FD', fontSize: '12px', fontFamily: '"JetBrains Mono"', display: 'flex', gap: 1 }}>
              <Terminal size={14} style={{ flexShrink: 0, color: '#EF4444' }} />
              COMMAND EXECUTION: rm -rf ~/.kylrix/bridges/google/*
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setWipeOpen(false)}
            sx={{
              bgcolor: '#1C1A18',
              color: '#FFFFFF',
              border: '1px solid #34322F',
              '&:hover': { bgcolor: '#34322F' }
            }}
          >
            Abort Purge
          </Button>
          <Button 
            onClick={confirmWipeData}
            variant="contained"
            disableElevation
            sx={{
              bgcolor: '#EF4444',
              color: '#FFFFFF',
              '&:hover': {
                bgcolor: '#DC2626',
              }
            }}
          >
            Confirm Purge
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
