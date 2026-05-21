import React, { useState } from 'react';
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
  Chip
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
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { kylrixTheme } from './theme';
import Logo from './components/Logo';
import { FocusDrawer } from './components/FocusDrawer';
import { GoogleIntegrationDashboard } from './components/GoogleIntegrationDashboard';

type ActivePage = 'note' | 'flow' | 'vault' | 'connect' | 'settings';

export default function App() {
  // Simulator navigation state
  const [activePage, setActivePage] = useState<ActivePage>('settings');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [settingsTab, setSettingsTab] = useState<number>(2); // Default to Google pipeline tab

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

  const getAppFromPage = (page: ActivePage): any => {
    if (page === 'settings') return 'root';
    return page;
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

            <IconButton 
              sx={{ color: '#9B9691', bgcolor: '#161412', border: '1px solid #1D1C1B', borderRadius: '8px' }}
              title="Identity config"
            >
              <User size={14} />
            </IconButton>
          </Box>
        </Box>

        {/* Global Main Body Layout Container */}
        <Box sx={{ flex: 1, display: 'flex', width: '100%' }}>
          
          {/* Main Desktop Sidebar */}
          <Box 
            sx={{ 
              width: { xs: '70px', lg: '240px' }, 
              bgcolor: '#0A0908', 
              borderRight: '1px solid #1C1A18', 
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: { xs: 'center', lg: 'stretch' }
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Note tab */}
              <Button
                onClick={() => setActivePage('note')}
                sx={{
                  justifyContent: { xs: 'center', lg: 'flex-start' },
                  px: 2,
                  py: 1.5,
                  borderRadius: '16px',
                  bgcolor: activePage === 'note' ? '#161412' : 'transparent',
                  color: activePage === 'note' ? '#EC4899' : '#9B9691',
                  border: activePage === 'note' ? '1px solid #1C1A18' : '1px solid transparent',
                  '&:hover': {
                    bgcolor: '#161412',
                    color: '#EC4899'
                  }
                }}
              >
                <BookOpen size={18} />
                <Typography sx={{ display: { xs: 'none', lg: 'block' }, ml: 2, fontWeight: 700, fontSize: '13px' }}>
                  Kylrix Note
                </Typography>
              </Button>

              {/* Flow tab */}
              <Button
                onClick={() => setActivePage('flow')}
                sx={{
                  justifyContent: { xs: 'center', lg: 'flex-start' },
                  px: 2,
                  py: 1.5,
                  borderRadius: '16px',
                  bgcolor: activePage === 'flow' ? '#161412' : 'transparent',
                  color: activePage === 'flow' ? '#A855F7' : '#9B9691',
                  border: activePage === 'flow' ? '1px solid #1C1A18' : '1px solid transparent',
                  '&:hover': {
                    bgcolor: '#161412',
                    color: '#A855F7'
                  }
                }}
              >
                <CheckSquare size={18} />
                <Typography sx={{ display: { xs: 'none', lg: 'block' }, ml: 2, fontWeight: 700, fontSize: '13px' }}>
                  Kylrix Flow
                </Typography>
              </Button>

              {/* Vault tab */}
              <Button
                onClick={() => setActivePage('vault')}
                sx={{
                  justifyContent: { xs: 'center', lg: 'flex-start' },
                  px: 2,
                  py: 1.5,
                  borderRadius: '16px',
                  bgcolor: activePage === 'vault' ? '#161412' : 'transparent',
                  color: activePage === 'vault' ? '#10B981' : '#9B9691',
                  border: activePage === 'vault' ? '1px solid #1C1A18' : '1px solid transparent',
                  '&:hover': {
                    bgcolor: '#161412',
                    color: '#10B981'
                  }
                }}
              >
                <ShieldAlert size={18} />
                <Typography sx={{ display: { xs: 'none', lg: 'block' }, ml: 2, fontWeight: 700, fontSize: '13px' }}>
                  Kylrix Vault
                </Typography>
              </Button>

              {/* Connect tab */}
              <Button
                onClick={() => setActivePage('connect')}
                sx={{
                  justifyContent: { xs: 'center', lg: 'flex-start' },
                  px: 2,
                  py: 1.5,
                  borderRadius: '16px',
                  bgcolor: activePage === 'connect' ? '#161412' : 'transparent',
                  color: activePage === 'connect' ? '#F59E0B' : '#9B9691',
                  border: activePage === 'connect' ? '1px solid #1C1A18' : '1px solid transparent',
                  '&:hover': {
                    bgcolor: '#161412',
                    color: '#F59E0B'
                  }
                }}
              >
                <MessageSquare size={18} />
                <Typography sx={{ display: { xs: 'none', lg: 'block' }, ml: 2, fontWeight: 700, fontSize: '13px' }}>
                  Kylrix Connect
                </Typography>
              </Button>

              <Divider sx={{ my: 2, borderColor: '#1C1A18' }} />

              {/* Settings Tab */}
              <Button
                onClick={() => setActivePage('settings')}
                sx={{
                  justifyContent: { xs: 'center', lg: 'flex-start' },
                  px: 2,
                  py: 1.5,
                  borderRadius: '16px',
                  bgcolor: activePage === 'settings' ? '#161412' : 'transparent',
                  color: activePage === 'settings' ? '#6366F1' : '#9B9691',
                  border: activePage === 'settings' ? '1px solid #1D1C1B' : '1px solid transparent',
                  '&:hover': {
                    bgcolor: '#161412',
                    color: '#6366F1'
                  }
                }}
              >
                <Settings size={18} />
                <Typography sx={{ display: { xs: 'none', lg: 'block' }, ml: 2, fontWeight: 700, fontSize: '13px' }}>
                  System Settings
                </Typography>
              </Button>
            </Box>

            {/* Bottom Support context */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', gap: 1 }}>
              <Box sx={{ p: 2, bgcolor: '#161412', borderRadius: '16px', border: '1px solid #1C1A18' }}>
                <Typography sx={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Info size={12} style={{ color: '#6366F1' }} /> UI Versatility
                </Typography>
                <Typography sx={{ color: '#9B9691', fontSize: '11px', mt: 0.5 }}>
                  Toggle workspace apps or explore unified imports directly. Dual rendering configurations enabled.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Core Content Presentation pane */}
          <Box sx={{ flex: 1, p: { xs: 2.5, md: 5 }, bgcolor: '#000000', overflowY: 'auto' }}>
            
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1, bgcolor: '#0A0908', borderRadius: '10px', color: '#EC4899' }}>
                          <BookOpen size={20} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
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
                            '&:hover': { bgcolor: '#D03B84' }
                          }}
                        >
                          Pull Keep Archive
                        </Button>
                      </Box>
                    </Paper>

                    {/* Editor Mock */}
                    <Paper 
                      elevation={0}
                      sx={{ p: 3, bgcolor: '#161412', border: '1px solid #1C1A18', borderRadius: '24px', minHeight: '300px' }}
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
                          <Box key={n.id} sx={{ p: 1.5, bgcolor: '#0A0908', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #1C1A18' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <FileCode size={14} style={{ color: '#EC4899' }} />
                              <Typography sx={{ fontSize: '13px', color: '#FFFFFF' }}>{n.title}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip label={n.size} size="small" sx={{ height: '20px', fontSize: '10px', bgcolor: '#161412', color: '#9B9691' }} />
                              <Typography sx={{ fontSize: '11px', color: '#9B9691', fontFamily: '"JetBrains Mono"' }}>{n.date}</Typography>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1, bgcolor: '#0A0908', borderRadius: '10px', color: '#A855F7' }}>
                          <CheckSquare size={20} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
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
                            '&:hover': { bgcolor: '#8F3FD0' }
                          }}
                        >
                          Trigger Bridge Drawer
                        </Button>
                      </Box>
                    </Paper>

                    {/* Task Kanban mockup */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                      <Box>
                        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#161412', borderRadius: '20px', border: '1px solid #1C1A18', minHeight: '260px' }}>
                          <Typography sx={{ color: '#A855F7', fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: '14px', mb: 2 }}>
                            ● INTAKE BACKLOG
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {activeTasks.map(t => (
                              <Box key={t.id} sx={{ p: 2, bgcolor: '#0A0908', borderRadius: '14px', border: '1px solid #1C1A18' }}>
                                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', mb: 1 }}>{t.task}</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Chip label={t.priority} size="small" sx={{ fontSize: '9px', bgcolor: t.priority === 'CRITICAL' ? '#EF4444' : '#1C1A18', color: '#FFFFFF', height: '18px', fontWeight: 700 }} />
                                  <Typography sx={{ fontSize: '11px', color: '#9B9691', fontFamily: '"JetBrains Mono"' }}>{t.status}</Typography>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </Paper>
                      </Box>

                      <Box>
                        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#161412', borderRadius: '20px', border: '1px solid #1C1A18', minHeight: '260px' }}>
                          <Typography sx={{ color: '#10B981', fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: '14px', mb: 2 }}>
                            ● DEEP WORK SESSION (SECURE)
                          </Typography>
                          <Box sx={{ border: '2px dashed #1C1A18', borderRadius: '14px', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
                            <Activity size={24} style={{ color: '#34322F', marginBottom: '8px' }} />
                            <Typography sx={{ color: '#9B9691', fontSize: '12px', textAlign: 'center' }}>
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
                      <Box>
                        <Paper 
                          elevation={0}
                          sx={{ 
                            p: 2, 
                            bgcolor: '#161412', 
                            border: '1px solid #1C1A18', 
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
                                border: settingsTab === 0 ? '1px solid #1D1C1B' : '1px solid transparent',
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
                                border: settingsTab === 1 ? '1px solid #1D1C1B' : '1px solid transparent',
                                textTransform: 'none',
                                fontSize: '13px',
                                fontWeight: 700,
                                '&:hover': { bgcolor: '#0A0908', color: '#FFFFFF' }
                              }}
                            >
                              Peer Encryption Mesh
                            </Button>
                            
                            <Divider sx={{ my: 1.5, borderColor: '#1C1A18' }} />
                            
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
                                border: settingsTab === 2 ? '1px solid #1D1C1B' : '1px solid transparent',
                                textTransform: 'none',
                                fontSize: '13px',
                                fontWeight: 700,
                                '&:hover': { bgcolor: '#0A0908', color: '#6366F1' }
                              }}
                            >
                              Google Suite (Conduit)
                            </Button>
                          </Box>
                        </Paper>
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
      </Box>
    </ThemeProvider>
  );
}
