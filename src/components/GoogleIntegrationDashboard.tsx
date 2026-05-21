import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Switch, 
  Chip, 
  Button, 
  LinearProgress, 
  CircularProgress,
  Stack, 
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
  CloudRain, 
  FileText, 
  Calendar, 
  FolderLock, 
  Mail, 
  ArrowUpRight, 
  Layers,
  Terminal,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Database
} from 'lucide-react';
import { GoogleService, GoogleServiceKey, SyncLog } from '../types';
import { MappingModal } from './MappingModal';
import Logo from './Logo';

export const GoogleIntegrationDashboard: React.FC = () => {
  // Initial states representing the sovereign Google import conduits
  const [services, setServices] = useState<GoogleService[]>([
    {
      key: 'keep',
      name: 'Google Keep',
      googlename: 'Keep Archive',
      description: 'Import checklists, legacy ideas, and voice logs into Markdown-supported structures.',
      connected: true,
      syncActive: true,
      destination: 'Kylrix Note',
      app: 'note',
      lastSync: '2026-05-21 11:30',
      accent: '#EC4899' // Note brand color
    },
    {
      key: 'tasks',
      name: 'Google Tasks',
      googlename: 'Tasks Feed',
      description: 'Transfer unfinished items, checklists, and pipelines directly into active Kanban boards.',
      connected: true,
      syncActive: true,
      destination: 'Kylrix Flow',
      app: 'flow',
      lastSync: '2026-05-21 11:30',
      accent: '#A855F7' // Flow brand color
    },
    {
      key: 'calendar',
      name: 'Google Calendar',
      googlename: 'Calendar API',
      description: 'Verify and map upcoming private schedules into offline analytical workspace agendas.',
      connected: true,
      syncActive: false,
      destination: 'Kylrix Flow',
      app: 'flow',
      lastSync: '2026-05-20 09:15',
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
    }
  ]);

  // Global states for simulated sync orchestration
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([
    { id: '1', timestamp: '13:40:02', type: 'info', service: 'System', message: 'Client bridge initialized.' },
    { id: '2', timestamp: '13:40:15', type: 'success', service: 'Keep', message: 'Read 24 notes; hashes match local records.' }
  ]);
  const [activeSyncStep, setActiveSyncStep] = useState<string>('');

  // Mapping Modal controls
  const [selectedService, setSelectedService] = useState<GoogleService | null>(null);
  const [mappingOpen, setMappingOpen] = useState<boolean>(false);

  // Destructive wipe Dialog controls
  const [wipeOpen, setWipeOpen] = useState<boolean>(false);

  // Stats Counters
  const [itemsImported, setItemsImported] = useState<number>(142);

  // Progress/Loading timeline sim
  useEffect(() => {
    let timer: any;
    if (syncing) {
      timer = setInterval(() => {
        setSyncProgress((prev) => {
          if (prev >= 100) {
            setSyncing(false);
            setItemsImported(prev => prev + 54);
            const successLog: SyncLog = {
              id: Date.now().toString(),
              timestamp: new Date().toLocaleTimeString(),
              type: 'success',
              service: 'Master Sync',
              message: 'Database sync cycle concluded. 54 new records written securely.'
            };
            setSyncLogs(logs => [successLog, ...logs]);
            setActiveSyncStep('Synchronization Successful');
            
            // Mark last sync timestamps
            setServices(current => current.map(s => {
              if (s.connected && s.syncActive) {
                return { ...s, lastSync: 'Just now' };
              }
              return s;
            }));

            return 100;
          }
          
          const nextProgress = prev + 8;
          
          // Inject sequential log timelines to feel absolute high-fidelity
          if (nextProgress === 16) {
            triggerSyncLog('info', 'Keep', 'Parsing Keep legacy checklists into Markdown tags...');
            setActiveSyncStep('Processing Keep Markdown nodes');
          } else if (nextProgress === 32) {
            triggerSyncLog('success', 'Keep', 'Keep import completed: 18 legacy items written.');
            triggerSyncLog('info', 'Tasks', 'Opening tasks feed stream destination: Kylrix Flow...');
            setActiveSyncStep('Transferring Google Tasks targets');
          } else if (nextProgress === 48) {
            triggerSyncLog('success', 'Tasks', 'Tasks processed: 12 backlog cards updated.');
            triggerSyncLog('info', 'Calendar', 'Checking upcoming event arrays...');
            setActiveSyncStep('Parsing Calendar database schemas');
          } else if (nextProgress === 64) {
            triggerSyncLog('warn', 'Calendar', 'Skipped 3 corporate meetings flagged as declined.');
            triggerSyncLog('success', 'Calendar', 'Calendar schedules indexed: 24 agenda items written.');
            setActiveSyncStep('Encrypting local bridge nodes');
          } else if (nextProgress === 80) {
            triggerSyncLog('info', 'System', 'Revising Zero-Knowledge checksum signatures...');
            setActiveSyncStep('Verifying SHA-256 parity');
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
  }, [syncing]);

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

  const handleToggleActive = (key: GoogleServiceKey, val: boolean) => {
    setServices(current => current.map(s => {
      if (s.key === key) {
        // Automatically connected if toggle turned on
        const connectedState = val ? true : s.connected;
        
        // Log user action
        if (val) {
          triggerSyncLog('info', s.name, `Sync pipeline set to ACTIVE.`);
        } else {
          triggerSyncLog('warn', s.name, `Pipeline deactivated.`);
        }

        return { ...s, syncActive: val, connected: connectedState };
      }
      return s;
    }));
  };

  const handleCardClick = (service: GoogleService) => {
    // Cannot configure destinations for disconnected pipelines easily, but we allow connecting it first
    if (!service.connected) {
      // Connect it first with default settings
      setServices(current => current.map(s => {
        if (s.key === service.key) {
          triggerSyncLog('success', s.name, `Authenticated. Pipeline established securely.`);
          return { ...s, connected: true, syncActive: true };
        }
        return s;
      }));
      // Select it and open mapping dialog to guide configuration
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
    const activePipelines = services.filter(s => s.connected && s.syncActive);
    if (activePipelines.length === 0) {
      triggerSyncLog('error', 'System', 'Failed to synchronize: All active pipelines are disconnected.');
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
                  label="Private Data Bridge" 
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
                <Typography sx={{ fontSize: '12px', color: '#10B981', fontFamily: '"JetBrains Mono"' }}>
                  ● SYSTEM REPLICATED
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 800, fontFamily: '"Space Grotesk", sans-serif' }}>
                Google Suite Integration
              </Typography>
              <Typography variant="body2" sx={{ color: '#9B9691' }}>
                Migrate legacy profiles selectively. Ingested payloads are processed, hashed, and decentralized directly into client filesystems. No information remains external.
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: { xs: '100%', sm: 'auto' } }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Trash2 size={16} />}
                onClick={handleWipeData}
                disabled={syncing}
                sx={{
                  borderColor: '#34322F',
                  bgcolor: '#161412',
                  color: '#EF4444',
                  py: 1.5,
                  px: 2.5,
                  '&:hover': {
                    borderColor: '#EF4444',
                    bgcolor: '#0A0908',
                  },
                  '&.Mui-disabled': {
                    borderColor: '#1D1C1B',
                    color: '#34322F',
                  }
                }}
              >
                Clear All External Data
              </Button>
              <Button
                variant="contained"
                onClick={handleSyncAll}
                disabled={syncing}
                startIcon={syncing ? <CircularProgress size={16} sx={{ color: '#FFFFFF' }} /> : <RefreshCw size={16} />}
                sx={{
                  bgcolor: '#6366F1',
                  color: '#FFFFFF',
                  py: 1.5,
                  px: 3,
                  '&:hover': {
                    bgcolor: '#575CF0',
                    filter: 'brightness(1.1)'
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#1C1A18',
                    color: '#9B9691',
                    border: '1px solid #34322F'
                  }
                }}
              >
                {syncing ? 'Syncing Ecosystem...' : 'Sync All Data'}
              </Button>
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
            <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"', textTransform: 'uppercase' }}>Legacy Blocks Bridged</Typography>
            <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 800 }}>{itemsImported} Files</Typography>
          </Box>
        </Box>
        
        <Box sx={{ p: 2.5, bgcolor: '#161412', borderRadius: '20px', border: '1px solid #1C1A18', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1.5, bgcolor: '#0A0908', borderRadius: '12px', color: '#10B981', border: '1px solid #1C1A18', display: 'flex' }}>
            <Activity size={20} />
          </Box>
          <Box>
            <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"', textTransform: 'uppercase' }}>Active Pipelines</Typography>
            <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 800 }}>
              {services.filter(s => s.connected && s.syncActive).length} / 5 Running
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 2.5, bgcolor: '#161412', borderRadius: '20px', border: '1px solid #1C1A18', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1.5, bgcolor: '#0A0908', borderRadius: '12px', color: '#EC4899', border: '1px solid #1C1A18', display: 'flex' }}>
            <Terminal size={20} />
          </Box>
          <Box>
            <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"', textTransform: 'uppercase' }}>Cryptographic Mode</Typography>
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
                    borderRadius: '24px', // Standard design schema
                    border: isSyncActive ? `1px solid ${service.accent}` : '1px solid #1D1C1B',
                    boxShadow: '0 4px 4px -4px rgba(0,0,0,0.9)',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-2px)', // Openbricks kinetic hover
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
                      borderColor: service.accent,
                    }
                  }}
                >
                  {/* Subtle rim color line */}
                  <Box sx={{ height: '3px', width: '100%', bgcolor: isSyncActive ? service.accent : '#1C1A18' }} />

                  {/* Standard card rhythm: padding vertical 2.5 (20px) */}
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

                        {/* Connection status badge */}
                        <Chip 
                          label={isConnected ? "BRIDGED" : "UNBOUND"} 
                          size="small"
                          sx={{ 
                            bgcolor: isConnected ? '#10B981' : '#1C1A18',
                            color: isConnected ? '#0A0908' : '#9B9691',
                            fontFamily: '"JetBrains Mono"',
                            fontSize: '10px',
                            fontWeight: 700,
                            border: '1px solid transparent'
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
                              disabled={!isConnected && service.key !== 'drive' && service.key !== 'gmail'} // clicking disabled allows binds
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>

                  {/* Settings Hover hint overlay */}
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
            Abort Purification
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
