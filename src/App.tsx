import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
  ThemeProvider, 
  Typography, 
  Button, 
  IconButton, 
  Divider,
  Paper,
  Tabs,
  Tab,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  BookOpen, 
  CheckSquare, 
  ShieldAlert, 
  MessageSquare, 
  Settings, 
  Activity, 
  Sparkles,
  Terminal,
  HelpCircle,
  FileCode,
  FolderOpen,
  ArrowRight,
  User,
  ExternalLink,
  Info,
  Calendar,
  Trash2,
  Plus,
  RefreshCw,
  LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { kylrixTheme } from './theme';
import Logo from './components/Logo';
import { FocusDrawer } from './components/FocusDrawer';
import { GoogleIntegrationDashboard } from './components/GoogleIntegrationDashboard';
import { GitHubIntegrationDashboard } from './components/GitHubIntegrationDashboard';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, googleSignIn, logout } from './googleAuth';
import { 
  testFirestoreConnection, 
  syncUserRecord, 
  subscribeNotes, 
  addNoteCloud, 
  deleteNoteCloud, 
  subscribeTasks, 
  addTaskCloud, 
  updateTaskCloud, 
  deleteTaskCloud 
} from './firebaseInit';

type ActivePage = 'note' | 'flow' | 'vault' | 'connect' | 'settings';

export default function App() {
  // Simulator navigation state
  const [activePage, setActivePage] = useState<ActivePage>('settings');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [settingsTab, setSettingsTab] = useState<number>(2); // Default to Google pipeline tab
  
  // GitHub task transfer state
  const [githubTaskPayload, setGithubTaskPayload] = useState<{ id: string; task: string; priority: string } | null>(null);

  // Firebase User & Subscription States
  const [user, setUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Form input states for note quick adding (Openbricks 2.0 aesthetics)
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Form input states for task quick adding
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');
  const [newTaskStatus, setNewTaskStatus] = useState('In Progress');

  // Simulated active drafting stats for Note & Flow
  const [activeNotes, setActiveNotes] = useState([
    { id: '1', title: 'Local mesh synchronization specs', date: '5 mins ago', size: '2.4kb' },
    { id: '2', title: 'Zero-knowledge password cryptosystem', date: '2 hours ago', size: '15.2kb' },
    { id: '3', title: 'Legacy imports list (Keep translations)', date: 'Draft', size: '0.8kb' }
  ]);

  const [activeTasks, setActiveTasks] = useState([
    { id: '1', task: 'Review Rust storage daemon bindings', priority: 'CRITICAL', status: 'In Progress' },
    { id: '2', task: 'Establish local agent communication logs', priority: 'MEDIUM', status: 'Backlog' }
  ]);

  // Sync Firebase Auth states, user doc and real-time database snapshot pipelines on mount
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        await syncUserRecord(firebaseUser);

        // real-time notes pipeline
        const unsubNotes = subscribeNotes(
          firebaseUser.uid,
          (notesList) => {
            if (notesList.length > 0) {
              const formatted = notesList.map(n => ({
                id: n.id,
                title: n.title,
                date: n.updatedAt ? new Date(n.updatedAt).toLocaleDateString() : 'Just now',
                size: n.content ? `${(n.content.length / 1024).toFixed(1)}kb` : '0kb'
              }));
              setActiveNotes(formatted);
            }
          },
          (err) => console.error(err)
        );

        // real-time tasks pipeline
        const unsubTasks = subscribeTasks(
          firebaseUser.uid,
          (tasksList) => {
            if (tasksList.length > 0) {
              const formatted = tasksList.map(t => ({
                id: t.id,
                task: t.task,
                priority: t.priority,
                status: t.status
              }));
              setActiveTasks(formatted);
            }
          },
          (err) => console.error(err)
        );

        setAuthLoading(false);
        return () => {
          unsubNotes();
          unsubTasks();
        };
      } else {
        setUser(null);
        setAuthLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (e) {
      console.error(e);
    }
  };

  const handleGoogleSignOut = async () => {
    const confirmSignOut = window.confirm("Disconnect security key and signs out from passive Cloud syncing?");
    if (confirmSignOut) {
      await logout();
      setUser(null);
    }
  };

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim()) return;
    const noteId = 'note_' + Math.random().toString(36).substring(2, 9);
    
    if (user) {
      await addNoteCloud(user.uid, noteId, newNoteTitle, newNoteContent);
    } else {
      setActiveNotes(prev => [
        { 
          id: noteId, 
          title: newNoteTitle, 
          date: 'Just now', 
          size: `${(newNoteContent.length / 1024).toFixed(1)}kb` 
        },
        ...prev
      ]);
    }
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  const handleDeleteNote = async (id: string) => {
    if (user) {
      await deleteNoteCloud(user.uid, id);
    } else {
      setActiveNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskText.trim()) return;
    const taskId = 'task_' + Math.random().toString(36).substring(2, 9);

    if (user) {
      await addTaskCloud(user.uid, taskId, newTaskText, newTaskPriority, newTaskStatus);
    } else {
      setActiveTasks(prev => [
        { id: taskId, task: newTaskText, priority: newTaskPriority, status: newTaskStatus },
        ...prev
      ]);
    }
    setNewTaskText('');
  };

  const handleDeleteTask = async (id: string) => {
    if (user) {
      await deleteTaskCloud(user.uid, id);
    } else {
      setActiveTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleUpdateTaskStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'In Progress' ? 'Completed' : 'In Progress';
    if (user) {
      const existingTask = activeTasks.find(t => t.id === id);
      if (existingTask) {
        await updateTaskCloud(user.uid, id, existingTask.task, existingTask.priority, nextStatus);
      }
    } else {
      setActiveTasks(prev => prev.map(t => t.id === id ? { ...t, status: nextStatus } : t));
    }
  };

  const getAppFromPage = (page: ActivePage): any => {
    if (page === 'settings') return 'root';
    return page;
  };

  const handlePortTaskToGitHub = (task: typeof activeTasks[0]) => {
    setGithubTaskPayload({
      id: task.id,
      task: task.task,
      priority: task.priority
    });
    setActivePage('settings');
    setSettingsTab(3); // GitHub integration settingTab
  };

  return (
    <ThemeProvider theme={kylrixTheme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: '100vh', 
          bgcolor: '#0A0908', // Outer canvas
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: '"Inter", sans-serif',
          overflowX: 'hidden'
        }}
      >
        {/* Top Command Desktop Rail */}
        <Box 
          sx={{ 
            bgcolor: '#0E0C0B', 
            borderBottom: '1px solid #1C1A18', 
            px: 3, 
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Logo size={24} app={getAppFromPage(activePage)} variant="full" />
            
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <Chip 
                label="SOVEREIGN NODE OS v3.9.4" 
                size="small" 
                sx={{ 
                  bgcolor: '#161412', 
                  color: '#9B9691', 
                  fontSize: '10px', 
                  fontFamily: '"JetBrains Mono"',
                  border: '1px solid #1C1A18',
                  borderRadius: '4px'
                }} 
              />
              <Chip 
                label="MESH SYNC: ENCRYPTED" 
                size="small" 
                sx={{ 
                  bgcolor: '#161412', 
                  color: '#10B981', 
                  fontSize: '10px', 
                  fontFamily: '"JetBrains Mono"',
                  border: '1px solid #1C1A18',
                  borderRadius: '4px'
                }} 
              />
            </Box>
          </Box>

          {/* Topbar Command controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '12px', color: '#9B9691', fontFamily: '"JetBrains Mono"', display: { xs: 'none', sm: 'block' } }}>
              LOC: 127.0.0.1 // DEV-STILL-ACTIVE
            </Typography>
            <Divider orientation="vertical" variant="middle" flexItem sx={{ borderColor: '#1C1A18', display: { xs: 'none', sm: 'block' } }} />
            
            <Button
              size="small"
              onClick={() => setDrawerOpen((prev) => !prev)}
              variant="outlined"
              color="primary"
              startIcon={<Sparkles size={12} />}
              sx={{
                bgcolor: '#161412',
                color: '#6366F1',
                borderColor: '#1D1C1B',
                fontFamily: '"JetBrains Mono"',
                fontSize: '11px',
                px: 2,
                borderRadius: '8px',
                '&:hover': {
                  borderColor: '#6366F1',
                  bgcolor: '#0A0908'
                }
              }}
            >
              Trigger Bottom Drawer UI
            </Button>

            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: 1 }}>
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'Sovereign'} 
                    referrerPolicy="no-referrer"
                    style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #23211F' }} 
                  />
                ) : (
                  <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: '#161412', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #23211F' }}>
                    <User size={13} style={{ color: '#6366F1' }} />
                  </Box>
                )}
                <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#EBF1FD', lineHeight: 1.2 }}>
                    {user.displayName || 'Authorized'}
                  </Typography>
                  <Typography sx={{ fontSize: '9px', color: '#10B981', fontFamily: '"JetBrains Mono"' }}>
                    CLOUD SYNC ACTIVE
                  </Typography>
                </Box>
                <Button
                  onClick={handleGoogleSignOut}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    px: 1.2, 
                    py: 0.5,
                    minWidth: 0,
                    borderRadius: '6px',
                    borderColor: '#23211F',
                    color: '#EF4444',
                    fontFamily: '"Space Grotesk"',
                    fontSize: '11px',
                    '&:hover': { borderColor: '#EF4444', bgcolor: 'transparent' }
                  }}
                >
                  Disconnect
                </Button>
              </Box>
            ) : (
              <Button
                onClick={handleGoogleSignIn}
                size="small"
                variant="outlined"
                startIcon={<LogIn size={11} />}
                sx={{
                  borderColor: '#23211F',
                  color: '#6366F1',
                  bgcolor: '#141211',
                  fontFamily: '"Space Grotesk"',
                  fontSize: '11px',
                  borderRadius: '8px',
                  px: 2,
                  '&:hover': {
                    borderColor: '#6366F1',
                    bgcolor: '#1D1C1B'
                  }
                }}
              >
                Connect Firebase Auth
              </Button>
            )}
          </Box>
        </Box>

        {/* Global Main Body Layout Container */}
        <Box sx={{ flex: 1, display: 'flex', width: '100%' }}>
          
          {/* Main Desktop Sidebar */}
          <Box 
            sx={{ 
              width: { md: '230px', lg: '260px' }, 
              bgcolor: '#0A0908', 
              borderRight: '1px solid #23211F', 
              p: 2,
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'stretch'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Note tab */}
              <Button
                onClick={() => setActivePage('note')}
                sx={{
                  justifyContent: 'flex-start',
                  px: 2,
                  py: 1.5,
                  borderRadius: '16px',
                  bgcolor: activePage === 'note' ? '#161412' : 'transparent',
                  color: activePage === 'note' ? '#EC4899' : '#9B9691',
                  border: activePage === 'note' ? '1px solid #23211F' : '1px solid transparent',
                  '&:hover': {
                    bgcolor: '#161412',
                    color: '#EC4899'
                  }
                }}
              >
                <BookOpen size={18} />
                <Typography sx={{ ml: 2, fontWeight: 700, fontSize: '13px', fontFamily: '"Space Grotesk", sans-serif' }}>
                  Kylrix Note
                </Typography>
              </Button>

              {/* Flow tab */}
              <Button
                onClick={() => setActivePage('flow')}
                sx={{
                  justifyContent: 'flex-start',
                  px: 2,
                  py: 1.5,
                  borderRadius: '16px',
                  bgcolor: activePage === 'flow' ? '#161412' : 'transparent',
                  color: activePage === 'flow' ? '#A855F7' : '#9B9691',
                  border: activePage === 'flow' ? '1px solid #23211F' : '1px solid transparent',
                  '&:hover': {
                    bgcolor: '#161412',
                    color: '#A855F7'
                  }
                }}
              >
                <CheckSquare size={18} />
                <Typography sx={{ ml: 2, fontWeight: 700, fontSize: '13px', fontFamily: '"Space Grotesk", sans-serif' }}>
                  Kylrix Flow
                </Typography>
              </Button>

              {/* Vault tab */}
              <Button
                onClick={() => setActivePage('vault')}
                sx={{
                  justifyContent: 'flex-start',
                  px: 2,
                  py: 1.5,
                  borderRadius: '16px',
                  bgcolor: activePage === 'vault' ? '#161412' : 'transparent',
                  color: activePage === 'vault' ? '#10B981' : '#9B9691',
                  border: activePage === 'vault' ? '1px solid #23211F' : '1px solid transparent',
                  '&:hover': {
                    bgcolor: '#161412',
                    color: '#10B981'
                  }
                }}
              >
                <ShieldAlert size={18} />
                <Typography sx={{ ml: 2, fontWeight: 700, fontSize: '13px', fontFamily: '"Space Grotesk", sans-serif' }}>
                  Kylrix Vault
                </Typography>
              </Button>

              {/* Connect tab */}
              <Button
                onClick={() => setActivePage('connect')}
                sx={{
                  justifyContent: 'flex-start',
                  px: 2,
                  py: 1.5,
                  borderRadius: '16px',
                  bgcolor: activePage === 'connect' ? '#161412' : 'transparent',
                  color: activePage === 'connect' ? '#F59E0B' : '#9B9691',
                  border: activePage === 'connect' ? '1px solid #23211F' : '1px solid transparent',
                  '&:hover': {
                    bgcolor: '#161412',
                    color: '#F59E0B'
                  }
                }}
              >
                <MessageSquare size={18} />
                <Typography sx={{ ml: 2, fontWeight: 700, fontSize: '13px', fontFamily: '"Space Grotesk", sans-serif' }}>
                  Kylrix Connect
                </Typography>
              </Button>

              <Divider sx={{ my: 2, borderColor: '#23211F' }} />

              {/* Settings Tab */}
              <Button
                onClick={() => setActivePage('settings')}
                sx={{
                  justifyContent: 'flex-start',
                  px: 2,
                  py: 1.5,
                  borderRadius: '16px',
                  bgcolor: activePage === 'settings' ? '#161412' : 'transparent',
                  color: activePage === 'settings' ? '#6366F1' : '#9B9691',
                  border: activePage === 'settings' ? '1px solid #23211F' : '1px solid transparent',
                  '&:hover': {
                    bgcolor: '#161412',
                    color: '#6366F1'
                  }
                }}
              >
                <Settings size={18} />
                <Typography sx={{ ml: 2, fontWeight: 700, fontSize: '13px', fontFamily: '"Space Grotesk", sans-serif' }}>
                  System Settings
                </Typography>
              </Button>
            </Box>

            {/* Bottom Support context */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', gap: 1 }}>
              <Box sx={{ p: 2, bgcolor: '#161412', borderRadius: '16px', border: '1px solid #23211F' }}>
                <Typography sx={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, fontFamily: '"Space Grotesk", sans-serif' }}>
                  <Info size={12} style={{ color: '#6366F1' }} /> UI Versatility
                </Typography>
                <Typography sx={{ color: '#9B9691', fontSize: '11px', mt: 0.5 }}>
                  Toggle workspace apps or explore unified imports directly. Dual rendering configurations enabled.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Core Content Presentation pane */}
          <Box sx={{ flex: 1, p: { xs: 2, md: 5 }, pb: { xs: 12, md: 5 }, bgcolor: '#000000', overflowY: 'auto' }}>
            
            <AnimatePresence mode="wait">
              
              {/* Simulated Note editor panel */}
              {activePage === 'note' && (
                <motion.div
                  key="note-page"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
                    
                    {/* Workspace Header */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Space Grotesk"', color: '#EC4899' }}>
                          Kylrix Note Canvas
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: '#9B9691' }}>
                          Private, markdown-enabled mental database. Offline sync enabled.
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setDrawerOpen(true)}
                        startIcon={<Sparkles size={12} />}
                        sx={{
                          borderColor: '#EC4899',
                          color: '#EC4899',
                          bgcolor: '#161412',
                          fontFamily: '"JetBrains Mono"',
                          fontSize: '11px',
                          width: { xs: '100%', sm: 'auto' },
                          '&:hover': { bgcolor: '#0A0908', borderColor: '#EC4899' }
                        }}
                      >
                        Launch Imports Portal
                      </Button>
                    </Box>

                    {/* Integrated Quick-Sync Suggestion Banner */}
                    <Paper 
                      elevation={0}
                      sx={{ p: 2.5, bgcolor: '#161412', border: '1px solid #EC4899', borderRadius: '20px', mb: 3 }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
                          <Box sx={{ p: 1, bgcolor: '#0A0908', borderRadius: '10px', color: '#EC4899', display: 'flex' }}>
                            <BookOpen size={20} />
                          </Box>
                          <Typography sx={{ display: { xs: 'block', sm: 'none' }, fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                            Migrating from Keep?
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ display: { xs: 'none', sm: 'block' }, fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                            Migranking from Google Keep?
                          </Typography>
                          <Typography sx={{ fontSize: '12px', color: '#9B9691' }}>
                            Pull your Google Keep checklists and voice-to-text clips directly into this Markdown space.
                          </Typography>
                        </Box>
                        <Button 
                          onClick={() => setDrawerOpen(true)} 
                          variant="contained" 
                          size="small"
                          sx={{ 
                            bgcolor: '#EC4899', 
                            color: '#FFFFFF',
                            width: { xs: '100%', sm: 'auto' },
                            '&:hover': { bgcolor: '#D03B84' }
                          }}
                        >
                          Pull Keep Archive
                        </Button>
                      </Box>
                    </Paper>

                    {/* Sovereign Note Composer */}
                    <Box sx={{ mb: 3 }}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 3, 
                          bgcolor: '#141211', 
                          border: '1px solid #23211F', 
                          borderRadius: '24px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2
                        }}
                      >
                        <Typography sx={{ color: '#EBF1FD', fontSize: '13px', fontWeight: 800, fontFamily: '"Space Grotesk"', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BookOpen size={14} style={{ color: '#EC4899' }} />
                          DRAFT SECURE NOTE NODE
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 2 }}>
                          <TextField
                            size="small"
                            placeholder="Enter Note title..."
                            value={newNoteTitle}
                            onChange={(e) => setNewNoteTitle(e.target.value)}
                            sx={{
                              flex: 1,
                              '& .MuiOutlinedInput-root': {
                                bgcolor: '#0A0908',
                                borderRadius: '12px',
                                border: '1px solid #23211F',
                                fontFamily: '"Space Grotesk"',
                                fontSize: '13px',
                                color: '#FFFFFF',
                                '& fieldset': { border: 'none' },
                                '&:hover': { border: '1px solid #EC4899' },
                                '&.Mui-focused': { border: '1px solid #EC4899' }
                              }
                            }}
                          />
                          
                          <Button
                            onClick={handleCreateNote}
                            variant="contained"
                            disabled={!newNoteTitle.trim()}
                            startIcon={<Plus size={14} />}
                            sx={{
                              bgcolor: '#EC4899',
                              color: '#FFFFFF',
                              borderRadius: '12px',
                              fontFamily: '"Space Grotesk"',
                              fontWeight: 700,
                              fontSize: '12px',
                              px: 3,
                              '&:hover': { bgcolor: '#D33B85' },
                              '&.Mui-disabled': { bgcolor: '#161412', color: '#9B9691', border: '1px solid #23211F' }
                            }}
                          >
                            Deploy Node
                          </Button>
                        </Box>

                        <TextField
                          multiline
                          rows={3}
                          placeholder="Node content or secret payloads go here..."
                          value={newNoteContent}
                          onChange={(e) => setNewNoteContent(e.target.value)}
                          sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                              bgcolor: '#0A0908',
                              borderRadius: '14px',
                              border: '1px solid #23211F',
                              fontFamily: '"Satoshi"',
                              fontSize: '13px',
                              color: '#FFFFFF',
                              p: 2,
                              '& fieldset': { border: 'none' },
                              '&:hover': { border: '1px solid #EC4899' },
                              '&.Mui-focused': { border: '1px solid #EC4899' }
                            }
                          }}
                        />

                        {user ? (
                          <Typography sx={{ fontSize: '10px', color: '#10B981', fontFamily: '"JetBrains Mono"' }}>
                            ● DEPLOYING SECURELY TO CLOUD FIRESTORE SUITE
                          </Typography>
                        ) : (
                          <Typography sx={{ fontSize: '10px', color: '#F59E0B', fontFamily: '"JetBrains Mono"' }}>
                            ▲ DEMO / DEPLOYING OFFLINE-ONLY. CONNECT FIREBASE AUTH FOR SECURE REAL-TIME CLOUD STORAGE.
                          </Typography>
                        )}
                      </Paper>
                    </Box>

                    {/* Editor Mock */}
                    <Paper 
                      elevation={0}
                      sx={{ p: 3, bgcolor: '#161412', border: '1px solid #23211F', borderRadius: '24px', minHeight: '300px' }}
                    >
                      <Typography sx={{ color: '#EBF1FD', fontSize: '18px', fontWeight: 800, fontFamily: '"Space Grotesk"', mb: 2 }}>
                        # Sovereign Knowledge Engineering Strategy
                      </Typography>
                      <Typography sx={{ color: '#9B9691', fontSize: '14px', lineHeight: 1.8, mb: 3 }}>
                        Private systems cannot depend on remote server indexes. All files are written dynamically into user-authenticated nodes using local Markdown formats. This ensures direct readable access to raw note files at any time, bypassing SaaS traps.
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                      <Typography sx={{ color: '#FFFFFF', fontSize: '12px', fontFamily: '"JetBrains Mono"', mb: 2 }}>
                        SECURE LOGICAL INDEX:
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {activeNotes.map(n => (
                          <Box key={n.id} sx={{ p: 1.5, bgcolor: '#0A0908', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #23211F' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <FileCode size={14} style={{ color: '#EC4899' }} />
                              <Typography sx={{ fontSize: '13px', color: '#FFFFFF', fontFamily: '"Space Grotesk"', fontWeight: 700 }}>{n.title}</Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip label={n.size} size="small" sx={{ height: '20px', fontSize: '10px', bgcolor: '#161412', color: '#9B9691' }} />
                                <Typography sx={{ fontSize: '11px', color: '#9B9691', fontFamily: '"JetBrains Mono"' }}>{n.date}</Typography>
                              </Box>
                              
                              <IconButton 
                                onClick={() => handleDeleteNote(n.id)}
                                size="small"
                                sx={{ color: '#EF4444', p: 0.5, '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}
                              >
                                <Trash2 size={13} />
                              </IconButton>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </Box>
                </motion.div>
              )}

              {/* Simulated Flow Kanban Board */}
              {activePage === 'flow' && (
                <motion.div
                  key="flow-page"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Space Grotesk"', color: '#A855F7' }}>
                          Kylrix Flow Workspace
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: '#9B9691' }}>
                          Autonomous project schedules and task tracking nodes. Keep operations local.
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setDrawerOpen(true)}
                        startIcon={<Sparkles size={12} />}
                        sx={{
                          borderColor: '#A855F7',
                          color: '#A855F7',
                          bgcolor: '#161412',
                          fontFamily: '"JetBrains Mono"',
                          fontSize: '11px',
                          width: { xs: '100%', sm: 'auto' },
                          '&:hover': { bgcolor: '#0A0908', borderColor: '#A855F7' }
                        }}
                      >
                        Configure Tasks Sync
                      </Button>
                    </Box>

                    {/* Integrated Synchronized Google Calendar Timelines */}
                    {(() => {
                      try {
                        const data = localStorage.getItem('cached_calendar_events');
                        if (data) {
                          const parsed = JSON.parse(data);
                          if (parsed && parsed.length > 0) {
                            return (
                              <Box sx={{ mb: 3 }}>
                                <Paper 
                                  elevation={0}
                                  sx={{ 
                                    p: 3, 
                                    bgcolor: '#161412', 
                                    border: '1px solid #6366F1', 
                                    borderRadius: '24px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                    <Box sx={{ p: 1, bgcolor: '#0A0908', borderRadius: '10px', color: '#6366F1', display: 'flex' }}>
                                      <Calendar size={18} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                      <Typography sx={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', fontFamily: '"Space Grotesk"' }}>
                                        Synchronized Google Calendar Timelines
                                      </Typography>
                                      <Typography sx={{ fontSize: '11px', color: '#9B9691', fontFamily: '"JetBrains Mono"' }}>
                                        SECURE REPLICA CACHE (OFFLINE CONTEXT)
                                      </Typography>
                                    </Box>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      onClick={() => setDrawerOpen(true)}
                                      sx={{ 
                                        borderColor: '#34322F', 
                                        color: '#9B9691', 
                                        fontFamily: '"JetBrains Mono"', 
                                        fontSize: '10px',
                                        '&:hover': { borderColor: '#6366F1', color: '#FFFFFF' }
                                      }}
                                    >
                                      Sync Hub
                                    </Button>
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {parsed.slice(0, 4).map((evt: any) => (
                                      <Box 
                                        key={evt.id} 
                                        sx={{ 
                                          p: 2, 
                                          bgcolor: '#0A0908', 
                                          borderRadius: '14px', 
                                          border: '1px solid #1C1A18',
                                          display: 'flex', 
                                          justifyContent: 'space-between', 
                                          alignItems: 'center' 
                                        }}
                                      >
                                        <Box sx={{ pr: 2 }}>
                                          <Typography sx={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700 }}>
                                            {evt.summary}
                                          </Typography>
                                          {evt.location && (
                                            <Typography sx={{ color: '#9B9691', fontSize: '11px', mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                              Location: {evt.location}
                                            </Typography>
                                          )}
                                        </Box>
                                        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                                          <Typography sx={{ color: '#6366F1', fontSize: '11px', fontFamily: '"JetBrains Mono"', fontWeight: 700 }}>
                                            {evt.start.dateTime ? new Date(evt.start.dateTime).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'}) : `${evt.start.date} (All Day)`}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    ))}
                                  </Box>
                                </Paper>
                              </Box>
                            );
                          }
                        }
                      } catch (e) {
                        return null;
                      }
                      return null;
                    })()}

                    {/* Integrated Tasks Bridge Suggestion Banner */}
                    <Paper 
                      elevation={0}
                      sx={{ p: 2.5, bgcolor: '#161412', border: '1px solid #A855F7', borderRadius: '20px', mb: 3 }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
                          <Box sx={{ p: 1, bgcolor: '#0A0908', borderRadius: '10px', color: '#A855F7', display: 'flex' }}>
                            <CheckSquare size={20} />
                          </Box>
                          <Typography sx={{ display: { xs: 'block', sm: 'none' }, fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                            Tasks & Schedules
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ display: { xs: 'none', sm: 'block' }, fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                            Historical Tasks & Schedules detected
                          </Typography>
                          <Typography sx={{ fontSize: '12px', color: '#9B9691' }}>
                            Securely link Google Tasks lists and Calendar timelines straight into passive pipelines.
                          </Typography>
                        </Box>
                        <Button 
                          onClick={() => setDrawerOpen(true)} 
                          variant="contained" 
                          size="small"
                          sx={{ 
                            bgcolor: '#A855F7', 
                            color: '#FFFFFF',
                            width: { xs: '100%', sm: 'auto' },
                            '&:hover': { bgcolor: '#8F3FD0' }
                          }}
                        >
                          Trigger Bridge Drawer
                        </Button>
                      </Box>
                    </Paper>

                    {/* Sovereign Flow Task Creator */}
                    <Box sx={{ mb: 3 }}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 3, 
                          bgcolor: '#141211', 
                          border: '1px solid #23211F', 
                          borderRadius: '24px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2
                        }}
                      >
                        <Typography sx={{ color: '#EBF1FD', fontSize: '13px', fontWeight: 800, fontFamily: '"Space Grotesk"', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckSquare size={14} style={{ color: '#A855F7' }} />
                          DRAFT FLOW PIPELINE NODE
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 2, alignItems: 'center' }}>
                          <TextField
                            size="small"
                            placeholder="Draft key operational directive / task..."
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            sx={{
                              flex: 3,
                              width: '100%',
                              '& .MuiOutlinedInput-root': {
                                bgcolor: '#0A0908',
                                borderRadius: '12px',
                                border: '1px solid #23211F',
                                fontFamily: '"Space Grotesk"',
                                fontSize: '13px',
                                color: '#FFFFFF',
                                '& fieldset': { border: 'none' },
                                '&:hover': { border: '1px solid #A855F7' },
                                '&.Mui-focused': { border: '1px solid #A855F7' }
                              }
                            }}
                          />

                          <FormControl size="small" sx={{ flex: 1, width: '100%' }}>
                            <Select
                              value={newTaskPriority}
                              onChange={(e) => setNewTaskPriority(e.target.value)}
                              sx={{
                                bgcolor: '#0A0908',
                                borderRadius: '12px',
                                border: '1px solid #23211F',
                                fontFamily: '"JetBrains Mono"',
                                fontSize: '12px',
                                color: '#FFFFFF',
                                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                '&:hover': { border: '1.5px solid #A855F7' }
                              }}
                            >
                              <MenuItem value="CRITICAL" sx={{ fontFamily: '"JetBrains Mono"', fontSize: '12px', color: '#EF4444' }}>CRITICAL</MenuItem>
                              <MenuItem value="HIGH" sx={{ fontFamily: '"JetBrains Mono"', fontSize: '12px', color: '#F59E0B' }}>HIGH</MenuItem>
                              <MenuItem value="MEDIUM" sx={{ fontFamily: '"JetBrains Mono"', fontSize: '12px', color: '#EBF1FD' }}>MEDIUM</MenuItem>
                              <MenuItem value="LOW" sx={{ fontFamily: '"JetBrains Mono"', fontSize: '12px', color: '#9B9691' }}>LOW</MenuItem>
                            </Select>
                          </FormControl>

                          <FormControl size="small" sx={{ flex: 1.2, width: '100%' }}>
                            <Select
                              value={newTaskStatus}
                              onChange={(e) => setNewTaskStatus(e.target.value)}
                              sx={{
                                bgcolor: '#0A0908',
                                borderRadius: '12px',
                                border: '1px solid #23211F',
                                fontFamily: '"Space Grotesk"',
                                fontSize: '12px',
                                color: '#FFFFFF',
                                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                '&:hover': { border: '1.5px solid #A855F7' }
                              }}
                            >
                              <MenuItem value="Backlog" sx={{ fontFamily: '"Space Grotesk"', fontSize: '12px' }}>Backlog</MenuItem>
                              <MenuItem value="In Progress" sx={{ fontFamily: '"Space Grotesk"', fontSize: '12px' }}>In Progress</MenuItem>
                              <MenuItem value="Completed" sx={{ fontFamily: '"Space Grotesk"', fontSize: '12px' }}>Completed</MenuItem>
                            </Select>
                          </FormControl>

                          <Button
                            onClick={handleCreateTask}
                            variant="contained"
                            disabled={!newTaskText.trim()}
                            startIcon={<Plus size={14} />}
                            sx={{
                              bgcolor: '#A855F7',
                              color: '#FFFFFF',
                              borderRadius: '12px',
                              fontFamily: '"Space Grotesk"',
                              fontWeight: 700,
                              fontSize: '11px',
                              px: 3.5,
                              py: 1.2,
                              whiteSpace: 'nowrap',
                              height: '40px',
                              '&:hover': { bgcolor: '#8F3FD0' },
                              '&.Mui-disabled': { bgcolor: '#161412', color: '#9B9691', border: '1px solid #23211F' }
                            }}
                          >
                            Add Directive
                          </Button>
                        </Box>

                        {user ? (
                          <Typography sx={{ fontSize: '10px', color: '#10B981', fontFamily: '"JetBrains Mono"' }}>
                            ● DEPLOYING SECURELY TO CLOUD FIRESTORE SUITE
                          </Typography>
                        ) : (
                          <Typography sx={{ fontSize: '10px', color: '#F59E0B', fontFamily: '"JetBrains Mono"' }}>
                            ▲ DEMO / DEPLOYING OFFLINE-ONLY. CONNECT FIREBASE AUTH FOR SECURE REAL-TIME CLOUD STORAGE.
                          </Typography>
                        )}
                      </Paper>
                    </Box>

                    {/* Task Kanban mockup */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                      <Box>
                        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#161412', borderRadius: '20px', border: '1px solid #23211F', minHeight: '260px' }}>
                          <Typography sx={{ color: '#A855F7', fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: '14px', mb: 2 }}>
                            ● INTAKE BACKLOG
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {activeTasks.map(t => (
                              <Box key={t.id} sx={{ p: 2, bgcolor: '#0A0908', borderRadius: '14px', border: '1px solid #23211F' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', flex: 1, pr: 1 }}>{t.task}</Typography>
                                  <IconButton 
                                    onClick={() => handleDeleteTask(t.id)}
                                    size="small"
                                    sx={{ color: '#EF4444', p: 0.5, mt: -0.5, '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}
                                  >
                                    <Trash2 size={13} />
                                  </IconButton>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Chip label={t.priority} size="small" sx={{ fontSize: '9px', bgcolor: t.priority === 'CRITICAL' ? '#EF4444' : '#1C1A18', color: '#FFFFFF', height: '18px', fontWeight: 700 }} />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5, pt: 1, borderTop: '1px solid #23211F' }}>
                                  <Button
                                    size="small"
                                    onClick={() => handleUpdateTaskStatus(t.id, t.status)}
                                    sx={{
                                      p: 0,
                                      color: t.status === 'Completed' ? '#10B981' : '#9B9691',
                                      fontSize: '11px',
                                      fontFamily: '"JetBrains Mono"',
                                      fontWeight: 700,
                                      '&:hover': { color: '#EBF1FD', bgcolor: 'transparent' }
                                    }}
                                  >
                                    [{t.status === 'Completed' ? '✓ DONE' : '☐ IN WORK'}]
                                  </Button>
                                  <Button
                                    size="small"
                                    onClick={() => handlePortTaskToGitHub(t)}
                                    sx={{ 
                                      color: '#A855F7', 
                                      fontSize: '11px', 
                                      fontWeight: 700, 
                                      textTransform: 'none',
                                      p: 0,
                                      minWidth: 0,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      '&:hover': { color: '#B975FF', bgcolor: 'transparent' }
                                    }}
                                  >
                                    Meld to GitHub <ArrowRight size={10} />
                                  </Button>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </Paper>
                      </Box>

                      <Box>
                        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#161412', borderRadius: '20px', border: '1px solid #23211F', minHeight: '260px' }}>
                          <Typography sx={{ color: '#10B981', fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: '14px', mb: 2 }}>
                            ● DEEP WORK SESSION (SECURE)
                          </Typography>
                          <Box sx={{ border: '2px dashed #23211F', borderRadius: '14px', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
                            <Activity size={24} style={{ color: '#23211F', marginBottom: '8px' }} />
                            <Typography sx={{ color: '#9B9691', fontSize: '12px', textAlign: 'center', fontFamily: '"Satoshi"' }}>
                              Drag blocks here to commit active mental bandwidth threads. Offline timers will start automatically.
                            </Typography>
                          </Box>
                        </Paper>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              )}

              {/* Secure Vault Mock Canvas */}
              {activePage === 'vault' && (
                <motion.div
                  key="vault-page"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Space Grotesk"', color: '#10B981' }}>
                        Kylrix Zero-Knowledge Vault
                      </Typography>
                      <Typography sx={{ fontSize: '13px', color: '#9B9691' }}>
                        Mathematical offline safe-indexes. Cryptographic credential management.
                      </Typography>
                    </Box>

                    <Paper elevation={0} sx={{ p: 4, bgcolor: '#161412', border: '1px solid #1C1A18', borderRadius: '24px', textAlign: 'center', py: 8 }}>
                      <FolderOpen size={48} style={{ color: '#10B981', margin: '0 auto 16px' }} />
                      <Typography sx={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, mb: 1 }}>
                        Vault Database Locked
                      </Typography>
                      <Typography sx={{ color: '#9B9691', fontSize: '13px', maxWidth: '400px', mx: 'auto', mb: 3 }}>
                        Unlock via local client key hashes. Google Drive static document sync targets will run as encrypted containers.
                      </Typography>
                      <Button 
                        variant="contained" 
                        sx={{ bgcolor: '#10B981', color: '#0A0908', fontWeight: 700, px: 4, '&:hover': { bgcolor: '#0D9E6E' } }}
                        onClick={() => setDrawerOpen(true)}
                      >
                        Authenticate Local Sync
                      </Button>
                    </Paper>
                  </Box>
                </motion.div>
              )}

              {/* Secure Connect Mock Canvas */}
              {activePage === 'connect' && (
                <motion.div
                  key="connect-page"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Space Grotesk"', color: '#F59E0B' }}>
                        Kylrix Decoupled Connect
                      </Typography>
                      <Typography sx={{ fontSize: '13px', color: '#9B9691' }}>
                        Decentralized p2p chat conduits. Real-time encryption logs.
                      </Typography>
                    </Box>

                    <Paper elevation={0} sx={{ p: 4, bgcolor: '#161412', border: '1px solid #1C1A18', borderRadius: '24px', py: 8, textAlign: 'center' }}>
                      <MessageSquare size={48} style={{ color: '#F59E0B', margin: '0 auto 16px' }} />
                      <Typography sx={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, mb: 1 }}>
                        P2P Signal Online
                      </Typography>
                      <Typography sx={{ color: '#9B9691', fontSize: '13px', maxWidth: '400px', mx: 'auto', mb: 3 }}>
                        Active mesh channels linked. Set up Gmail bridge to route transactional summaries automatically into client streams.
                      </Typography>
                      <Button 
                        variant="contained" 
                        sx={{ bgcolor: '#F59E0B', color: '#0A0908', fontWeight: 700, px: 4, '&:hover': { bgcolor: '#D97706' } }}
                        onClick={() => setDrawerOpen(true)}
                      >
                        Launch Direct Bridges
                      </Button>
                    </Paper>
                  </Box>
                </motion.div>
              )}

              {/* Simulated Native Settings Route (/settings/integrations/google) */}
              {activePage === 'settings' && (
                <motion.div
                  key="settings-page"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box sx={{ width: '100%' }}>
                    
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h5" sx={{ fontWeight: 900, fontFamily: '"Space Grotesk"', color: '#6366F1' }}>
                        Sovereign Workspace Settings
                      </Typography>
                      <Typography sx={{ fontSize: '13px', color: '#9B9691' }}>
                        Modify private node configurations, passkey databases, and external cloud import conduits.
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 9fr' }, gap: 4 }}>
                      
                      {/* Sub-settings vertical tabs sidebar representation */}
                      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Paper 
                          elevation={0}
                          sx={{ 
                            p: 2, 
                            bgcolor: '#161412', 
                            border: '1px solid #23211F', 
                            borderRadius: '20px',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"', fontWeight: 700, mb: 1.5, px: 1 }}>
                            SECURITY & ACCESS
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Button
                              onClick={() => setSettingsTab(0)}
                              sx={{
                                justifyContent: 'flex-start',
                                px: 1.5,
                                py: 1.2,
                                borderRadius: '10px',
                                color: settingsTab === 0 ? '#FFFFFF' : '#9B9691',
                                bgcolor: settingsTab === 0 ? '#0A0908' : 'transparent',
                                border: settingsTab === 0 ? '1px solid #23211F' : '1px solid transparent',
                                textTransform: 'none',
                                fontSize: '13px',
                                fontWeight: 700,
                                '&:hover': { bgcolor: '#0A0908', color: '#FFFFFF' }
                              }}
                            >
                              Workspace Key-ring
                            </Button>
                            <Button
                              onClick={() => setSettingsTab(1)}
                              sx={{
                                justifyContent: 'flex-start',
                                px: 1.5,
                                py: 1.2,
                                borderRadius: '10px',
                                color: settingsTab === 1 ? '#FFFFFF' : '#9B9691',
                                bgcolor: settingsTab === 1 ? '#0A0908' : 'transparent',
                                border: settingsTab === 1 ? '1px solid #23211F' : '1px solid transparent',
                                textTransform: 'none',
                                fontSize: '13px',
                                fontWeight: 700,
                                '&:hover': { bgcolor: '#0A0908', color: '#FFFFFF' }
                              }}
                            >
                              Peer Encryption Mesh
                            </Button>
                            
                            <Divider sx={{ my: 1.5, borderColor: '#23211F' }} />
                            
                            <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"', fontWeight: 700, mb: 1, px: 1 }}>
                              EXTERNAL BRIDGE
                            </Typography>
                            
                            <Button
                              onClick={() => setSettingsTab(2)}
                              sx={{
                                justifyContent: 'flex-start',
                                px: 1.5,
                                py: 1.2,
                                borderRadius: '10px',
                                color: settingsTab === 2 ? '#6366F1' : '#9B9691',
                                bgcolor: settingsTab === 2 ? '#0A0908' : 'transparent',
                                border: settingsTab === 2 ? '1px solid #23211F' : '1px solid transparent',
                                textTransform: 'none',
                                fontSize: '13px',
                                fontWeight: 700,
                                '&:hover': { bgcolor: '#0A0908', color: '#6366F1' }
                              }}
                            >
                              Google Suite (Conduit)
                            </Button>
                            
                            <Button
                              onClick={() => setSettingsTab(3)}
                              sx={{
                                justifyContent: 'flex-start',
                                px: 1.5,
                                py: 1.2,
                                borderRadius: '10px',
                                color: settingsTab === 3 ? '#A855F7' : '#9B9691',
                                bgcolor: settingsTab === 3 ? '#0A0908' : 'transparent',
                                border: settingsTab === 3 ? '1px solid #23211F' : '1px solid transparent',
                                textTransform: 'none',
                                fontSize: '13px',
                                fontWeight: 700,
                                '&:hover': { bgcolor: '#0A0908', color: '#A855F7' }
                              }}
                            >
                              GitHub Bridge (Conduit)
                            </Button>
                          </Box>
                        </Paper>
                      </Box>

                      {/* Sub-settings horizontal tabs - Mobile only */}
                      <Box sx={{ display: { xs: 'flex', md: 'none' }, overflowX: 'auto', gap: 1, pb: 1, mb: 2, '&::-webkit-scrollbar': { display: 'none' } }}>
                        {[
                          { id: 0, label: 'Key-ring', color: '#575CF0' },
                          { id: 1, label: 'Mesh', color: '#575CF0' },
                          { id: 2, label: 'Google Suite', color: '#6366F1' },
                          { id: 3, label: 'GitHub Bridge', color: '#A855F7' }
                        ].map((subtab) => {
                          const isActive = settingsTab === subtab.id;
                          return (
                            <Button
                              key={subtab.id}
                              onClick={() => setSettingsTab(subtab.id)}
                              sx={{
                                flexShrink: 0,
                                px: 2,
                                py: 1,
                                borderRadius: '12px',
                                color: isActive ? '#FFFFFF' : '#9B9691',
                                bgcolor: isActive ? '#1E1B19' : '#141211',
                                border: '1px solid',
                                borderColor: isActive ? subtab.color : '#23211F',
                                fontSize: '12px',
                                fontWeight: 700,
                                fontFamily: '"Space Grotesk"',
                                '&:hover': { bgcolor: '#1E1B19' }
                              }}
                            >
                              {subtab.label}
                            </Button>
                          );
                        })}
                      </Box>

                      {/* Settings tab content viewport */}
                      <Box>
                        <AnimatePresence mode="wait">
                          
                          {settingsTab === 0 && (
                            <motion.div
                              key="tab-keyboard"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <Paper elevation={0} sx={{ p: 4, bgcolor: '#161412', border: '1px solid #1C1A18', borderRadius: '24px', minHeight: '350px' }}>
                                <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800, fontFamily: '"Space Grotesk"', mb: 1 }}>
                                  Workspace Key-ring
                                </Typography>
                                <Typography sx={{ color: '#9B9691', fontSize: '13px', mb: 3 }}>
                                  Lock your local files and documents under high-entropy client keys. This prevents hardware breaches.
                                </Typography>
                                <Divider sx={{ mb: 3 }} />
                                <Box sx={{ p: 3, bgcolor: '#0A0908', borderRadius: '16px', border: '1px solid #1D1C1B' }}>
                                  <Typography sx={{ color: '#10B981', fontSize: '13px', fontWeight: 700, fontFamily: '"JetBrains Mono"', mb: 1 }}>
                                    ✓ PASSKEY HARDWARE BINDINGS CONFIGURED
                                  </Typography>
                                  <Typography sx={{ color: '#9B9691', fontSize: '12px' }}>
                                    Key-pair authentication is handled strictly via your local system's secure element (TPM/FIDO2).
                                  </Typography>
                                </Box>
                              </Paper>
                            </motion.div>
                          )}

                          {settingsTab === 1 && (
                            <motion.div
                              key="tab-mesh"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <Paper elevation={0} sx={{ p: 4, bgcolor: '#161412', border: '1px solid #1C1A18', borderRadius: '24px', minHeight: '350px' }}>
                                <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800, fontFamily: '"Space Grotesk"', mb: 1 }}>
                                  Peer Encryption Mesh
                                </Typography>
                                <Typography sx={{ color: '#9B9691', fontSize: '13px', mb: 3 }}>
                                  Discover and peer directly with other sovereign nodes in your workspace LAN or encrypted overlays.
                                </Typography>
                                <Divider sx={{ mb: 3 }} />
                                <Box sx={{ p: 3, bgcolor: '#0A0908', borderRadius: '16px', border: '1px solid #1D1C1B', textAlign: 'center' }}>
                                  <Terminal size={24} style={{ color: '#6366F1', margin: '0 auto 8px' }} />
                                  <Typography sx={{ color: '#9B9691', fontSize: '12px', fontFamily: '"JetBrains Mono"' }}>
                                    LISTENING FOR LAN MULTICAST ANNOUNCEMENTS ON PORT 3000
                                  </Typography>
                                </Box>
                              </Paper>
                            </motion.div>
                          )}

                          {/* Render Native Dashboard Route view directly `/settings/integrations/google` */}
                          {settingsTab === 2 && (
                            <motion.div
                              key="tab-google"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              {/* Renders exactly inside the Settings router viewport natively! */}
                              <GoogleIntegrationDashboard />
                            </motion.div>
                          )}

                          {/* Render Native GitHub Dashboard view directly `/settings/integrations/github` */}
                          {settingsTab === 3 && (
                            <motion.div
                              key="tab-github"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <GitHubIntegrationDashboard 
                                prepopulatedTask={githubTaskPayload} 
                                onClearPrepopulatedTask={() => setGithubTaskPayload(null)}
                              />
                            </motion.div>
                          )}

                        </AnimatePresence>
                      </Box>

                    </Box>
                  </Box>
                </motion.div>
              )}

            </AnimatePresence>
          </Box>
        </Box>

        {/* Global Bottom-triggered Focus Drawer */}
        <FocusDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Google Suite Migration Portal"
          description="A shared cryptographic conduit bridge mapping Google SaaS data into client-encrypted offline categories."
        >
          {/* Renders the EXACT same GoogleImportDashboard natively inside the global drawer overlay */}
          <GoogleIntegrationDashboard />
        </FocusDrawer>

        {/* Mobile Bottom Navbar - Sticks strictly to the bottom viewport on small devices */}
        <Box 
          sx={{ 
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: '#0A0908',
            borderTop: '1.5px solid #23211F', // Openbricks 2.0 Perfect Carbon Hairline
            px: 2,
            py: 1,
            display: { xs: 'flex', md: 'none' },
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 999,
            boxShadow: '0 -8px 24px rgba(0,0,0,0.9)'
          }}
        >
          {[
            { page: 'note', label: 'Note', icon: BookOpen, color: '#EC4899' },
            { page: 'flow', label: 'Flow', icon: CheckSquare, color: '#A855F7' },
            { page: 'vault', label: 'Vault', icon: ShieldAlert, color: '#10B981' },
            { page: 'connect', label: 'Connect', icon: MessageSquare, color: '#F59E0B' },
            { page: 'settings', label: 'Settings', icon: Settings, color: '#6366F1' }
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activePage === item.page;
            return (
              <Button
                key={item.page}
                onClick={() => setActivePage(item.page as ActivePage)}
                disableRipple
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 1,
                  px: 0.5,
                  minWidth: 0,
                  bgcolor: 'transparent',
                  color: isSelected ? item.color : '#9B9691',
                  transition: 'all 0.15s ease-in-out',
                  textTransform: 'none',
                  '&:hover': { bgcolor: 'transparent' }
                }}
              >
                <Box 
                  sx={{ 
                    p: 0.8, 
                    borderRadius: '12px',
                    bgcolor: isSelected ? '#161412' : 'transparent',
                    border: '1px solid',
                    borderColor: isSelected ? '#23211F' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 0.5,
                    color: isSelected ? item.color : '#9B9691'
                  }}
                >
                  <Icon size={18} />
                </Box>
                <Typography sx={{ fontSize: '10px', fontWeight: isSelected ? 800 : 500, fontFamily: '"Space Grotesk"', color: isSelected ? '#EBF1FD' : '#9B9691' }}>
                  {item.label}
                </Typography>
              </Button>
            );
          })}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
