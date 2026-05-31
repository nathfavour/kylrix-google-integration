import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  FormControlLabel, 
  Switch, 
  Stack, 
  Chip, 
  Divider,
  Alert
} from '@mui/material';
import { 
  FolderLock, 
  Layers, 
  Share2, 
  FileText, 
  Settings, 
  SlidersHorizontal, 
  Save, 
  X,
  Database,
  Terminal,
  ArrowRight,
  Video
} from 'lucide-react';
import { GoogleService, GoogleServiceKey } from '../types';
import Logo from './Logo';

interface MappingModalProps {
  service: GoogleService | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (serviceKey: GoogleServiceKey, mappingState: any) => void;
}

export const MappingModal: React.FC<MappingModalProps> = ({
  service,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!service) return null;

  // Active mapping settings local states
  const [keepConfig, setKeepConfig] = useState({
    importMode: 'all',
    markdownCategory: 'Imports/GoogleKeep',
    autoTag: true,
  });

  const [tasksConfig, setTasksConfig] = useState({
    flowBoard: 'Sprint backlog',
    priorityThreshold: 'all',
    targetColumn: 'Private Influx',
  });

  const [calendarConfig, setCalendarConfig] = useState({
    flowAgenda: 'Sovereign Calendar',
    syncRangeDays: 90,
    importDeclined: false,
  });

  const [driveConfig, setDriveConfig] = useState({
    vaultDirectory: '/imports/google-drive',
    encryptOnImport: true,
    zkIntegrity: true,
  });

  const [gmailConfig, setgmailConfig] = useState({
    connectChannel: '#google-bridge',
    filterKeyword: 'urgent',
    archiveAfterImport: false,
  });

  const [docsConfig, setDocsConfig] = useState({
    noteDirectory: 'Imports/GoogleDocs',
    importAsMarkdown: true,
  });

  const [meetConfig, setMeetConfig] = useState({
    autoCreateOnEvent: true,
    defaultAccessType: 'TRUSTED',
  });

  useEffect(() => {
    // Reset or load initial mocks depending on the selected service
  }, [service]);

  const handleSave = () => {
    let activeConfig = {};
    if (service.key === 'keep') activeConfig = keepConfig;
    else if (service.key === 'tasks') activeConfig = tasksConfig;
    else if (service.key === 'calendar') activeConfig = calendarConfig;
    else if (service.key === 'drive') activeConfig = driveConfig;
    else if (service.key === 'gmail') activeConfig = gmailConfig;
    else if (service.key === 'docs') activeConfig = docsConfig;
    else if (service.key === 'meet') activeConfig = meetConfig;

    onSave(service.key, activeConfig);
    onClose();
  };

  const getServiceColor = () => service.accent;

  const renderConfigSection = () => {
    switch (service.key) {
      case 'keep':
        return (
          <Stack spacing={3}>
            <Alert 
              severity="info" 
              sx={{ 
                bgcolor: '#1C1A18', 
                border: '1px solid #34322F', 
                color: '#FFFFFF',
                borderRadius: '12px',
                '& .MuiAlert-icon': { color: '#EC4899' }
              }}
              icon={<FileText size={20} />}
            >
              Google Keep items are automatically translated into Markdown note-structures inside the private Kylrix Note directory. Images and attachments will be written locally as raw blobs.
            </Alert>

            <Box sx={{ p: 2, bgcolor: '#0A0908', borderRadius: '16px', border: '1px solid #1C1A18' }}>
              <Typography sx={{ color: '#9B9691', fontSize: '12px', fontFamily: '"JetBrains Mono"', mb: 1.5, letterSpacing: '0.05em' }}>
                LOCAL TARGET FOLDER PATH
              </Typography>
              <TextField 
                fullWidth
                size="small"
                value={keepConfig.markdownCategory}
                onChange={(e) => setKeepConfig({ ...keepConfig, markdownCategory: e.target.value })}
                slotProps={{
                  input: {
                    style: { fontFamily: '"JetBrains Mono"', color: '#FFFFFF', fontSize: '14px' }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#161412',
                    borderRadius: '8px',
                    borderColor: '#1C1A18',
                    '& fieldset': { border: '1px solid #1C1A18' },
                    '&:hover fieldset': { borderColor: '#34322F' },
                    '&.Mui-focused fieldset': { borderColor: '#EC4899' },
                  }
                }}
              />
            </Box>

            <FormControl fullWidth size="small">
              <Typography sx={{ color: '#9B9691', fontSize: '12px', fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
                Import Scope Filter
              </Typography>
              <Select
                value={keepConfig.importMode}
                onChange={(e) => setKeepConfig({ ...keepConfig, importMode: e.target.value as 'all' | 'filtered' })}
                sx={{
                  bgcolor: '#0A0908',
                  borderRadius: '12px',
                  border: '1px solid #1C1A18',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover': { border: '1px solid #34322F' },
                  '&.Mui-focused': { border: '1px solid #EC4899' },
                }}
              >
                <MenuItem value="all">Sovereign Batch Import (All Notes, Labels & Archives)</MenuItem>
                <MenuItem value="filtered">Pinned Only (Import only highlighted thoughts)</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: '#161412', borderRadius: '12px', border: '1px solid #1C1A18' }}>
              <Box>
                <Typography sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 600 }}>Auto-tag Imported Notes</Typography>
                <Typography sx={{ color: '#9B9691', fontSize: '12px' }}>Apply "imports/google-keep" metadata tags to identify legacy items</Typography>
              </Box>
              <Switch 
                checked={keepConfig.autoTag} 
                onChange={(e) => setKeepConfig({ ...keepConfig, autoTag: e.target.checked })}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#EC4899 !important'
                  }
                }}
              />
            </Box>
          </Stack>
        );

      case 'tasks':
        return (
          <Stack spacing={3}>
            <Alert 
              severity="info" 
              sx={{ 
                bgcolor: '#1C1A18', 
                border: '1px solid #34322F', 
                color: '#FFFFFF',
                borderRadius: '12px',
                '& .MuiAlert-icon': { color: '#A855F7' }
              }}
              icon={<Layers size={20} />}
            >
              Tasks pipeline connects directly to Kylrix Flow. Unfinished legacy checklist items are mapped natively to a designated secure Kanban board.
            </Alert>

            <FormControl fullWidth size="small">
              <Typography sx={{ color: '#9B9691', fontSize: '12px', fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
                Kylrix Flow Kanban Destination Board
              </Typography>
              <Select
                value={tasksConfig.flowBoard}
                onChange={(e) => setTasksConfig({ ...tasksConfig, flowBoard: e.target.value })}
                sx={{
                  bgcolor: '#0A0908',
                  borderRadius: '12px',
                  border: '1px solid #1C1A18',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover': { border: '1px solid #34322F' },
                  '&.Mui-focused': { border: '1px solid #A855F7' },
                }}
              >
                <MenuItem value="Sprint backlog">Core System Engineering Backlog</MenuItem>
                <MenuItem value="Personal todo">Personal Private Flow</MenuItem>
                <MenuItem value="Agent Task Stream">Autonomous Agent Assignments</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ p: 2, bgcolor: '#0A0908', borderRadius: '16px', border: '1px solid #1C1A18' }}>
              <Typography sx={{ color: '#9B9691', fontSize: '12px', fontFamily: '"JetBrains Mono"', mb: 1.5, letterSpacing: '0.05em' }}>
                TARGET BOARD INTAKE COLUMN
              </Typography>
              <TextField 
                fullWidth
                size="small"
                value={tasksConfig.targetColumn}
                onChange={(e) => setTasksConfig({ ...tasksConfig, targetColumn: e.target.value })}
                slotProps={{
                  input: {
                    style: { fontFamily: '"JetBrains Mono"', color: '#FFFFFF', fontSize: '13px' }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#161412',
                    borderRadius: '8px',
                    '& fieldset': { border: '1px solid #1C1A18' },
                    '&:hover fieldset': { borderColor: '#34322F' },
                    '&.Mui-focused fieldset': { borderColor: '#A855F7' },
                  }
                }}
              />
            </Box>

            <FormControl fullWidth size="small">
              <Typography sx={{ color: '#9B9691', fontSize: '12px', fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
                Priority Sync Focus
              </Typography>
              <Select
                value={tasksConfig.priorityThreshold}
                onChange={(e) => setTasksConfig({ ...tasksConfig, priorityThreshold: e.target.value as 'all' | 'high' })}
                sx={{
                  bgcolor: '#0A0908',
                  borderRadius: '12px',
                  border: '1px solid #1C1A18',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover': { border: '1px solid #34322F' },
                  '&.Mui-focused': { border: '1px solid #A855F7' },
                }}
              >
                <MenuItem value="all">Sovereign Multi-sync (Import all Tasks)</MenuItem>
                <MenuItem value="high">High priority tasks only (Filter junk items)</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        );

      case 'calendar':
        return (
          <Stack spacing={3}>
            <Alert 
              severity="info" 
              sx={{ 
                bgcolor: '#1C1A18', 
                border: '1px solid #34322F', 
                color: '#FFFFFF',
                borderRadius: '12px',
                '& .MuiAlert-icon': { color: '#A855F7' }
              }}
              icon={<Settings size={20} />}
            >
              Calendars are pulled locally into Kylrix Flow. Real-time encryption hashes are verified per event before entering your local offline scheduler database.
            </Alert>

            <FormControl fullWidth size="small">
              <Typography sx={{ color: '#9B9691', fontSize: '12px', fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
                Target Kylrix Scheduler stream
              </Typography>
              <Select
                value={calendarConfig.flowAgenda}
                onChange={(e) => setCalendarConfig({ ...calendarConfig, flowAgenda: e.target.value })}
                sx={{
                  bgcolor: '#0A0908',
                  borderRadius: '12px',
                  border: '1px solid #1C1A18',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover': { border: '1px solid #34322F' },
                  '&.Mui-focused': { border: '1px solid #A855F7' },
                }}
              >
                <MenuItem value="Sovereign Calendar">Sovereign Direct Master Agenda</MenuItem>
                <MenuItem value="Work Events">Internal System Calendars</MenuItem>
                <MenuItem value="Sandbox events">Local Playground Schedule</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ p: 2, bgcolor: '#0A0908', borderRadius: '16px', border: '1px solid #1C1A18' }}>
              <Typography sx={{ color: '#9B9691', fontSize: '12px', fontFamily: '"JetBrains Mono"', mb: 1, letterSpacing: '0.05em' }}>
                HISTORICAL SYNC RANGE (DAYS)
              </Typography>
              <Select
                fullWidth
                size="small"
                value={calendarConfig.syncRangeDays}
                onChange={(e) => setCalendarConfig({ ...calendarConfig, syncRangeDays: Number(e.target.value) })}
                sx={{
                  bgcolor: '#161412',
                  borderRadius: '8px',
                  border: '1px solid #1C1A18',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  fontFamily: '"JetBrains Mono"',
                }}
              >
                <MenuItem value={30}>Pull 30 days history into Vault</MenuItem>
                <MenuItem value={90}>Pull 90 days history into Vault</MenuItem>
                <MenuItem value={180}>Full 6 month legacy sync</MenuItem>
              </Select>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: '#161412', borderRadius: '12px', border: '1px solid #1C1A18' }}>
              <Box>
                <Typography sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 600 }}>Exclude Declined Invitations</Typography>
                <Typography sx={{ color: '#9B9691', fontSize: '12px' }}>Prevent deleted or declined corporate meetings from bloating schedule</Typography>
              </Box>
              <Switch 
                checked={calendarConfig.importDeclined} 
                onChange={(e) => setCalendarConfig({ ...calendarConfig, importDeclined: e.target.checked })}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#A855F7 !important'
                  }
                }}
              />
            </Box>
          </Stack>
        );

      case 'drive':
        return (
          <Stack spacing={3}>
            <Alert 
              severity="info" 
              sx={{ 
                bgcolor: '#1C1A18', 
                border: '1px solid #34322F', 
                color: '#FFFFFF',
                borderRadius: '12px',
                '& .MuiAlert-icon': { color: '#10B981' }
              }}
              icon={<FolderLock size={20} />}
            >
              Google Drive files map directly to Kylrix Vault. Legacy assets are parsed, encrypted utilizing Zero-Knowledge mechanics locally on clients before storage.
            </Alert>

            <Box sx={{ p: 2, bgcolor: '#0A0908', borderRadius: '16px', border: '1px solid #1C1A18' }}>
              <Typography sx={{ color: '#9B9691', fontSize: '12px', fontFamily: '"JetBrains Mono"', mb: 1.5, letterSpacing: '0.05em' }}>
                KYLRIX VAULT PATH TARGET
              </Typography>
              <TextField 
                fullWidth
                size="small"
                value={driveConfig.vaultDirectory}
                onChange={(e) => setDriveConfig({ ...driveConfig, vaultDirectory: e.target.value })}
                slotProps={{
                  input: {
                    style: { fontFamily: '"JetBrains Mono"', color: '#FFFFFF', fontSize: '14px' }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#161412',
                    borderRadius: '8px',
                    '& fieldset': { border: '1px solid #1C1A18' },
                    '&:hover fieldset': { borderColor: '#34322F' },
                    '&.Mui-focused fieldset': { borderColor: '#10B981' },
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: '#161412', borderRadius: '12px', border: '1px solid #1C1A18' }}>
              <Box>
                <Typography sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 600 }}>Zero-Knowledge Local Encryption</Typography>
                <Typography sx={{ color: '#9B9691', fontSize: '12px' }}>Encrypt legacy static documents with AES-256-GCM before filesystem write</Typography>
              </Box>
              <Switch 
                checked={driveConfig.encryptOnImport} 
                onChange={(e) => setDriveConfig({ ...driveConfig, encryptOnImport: e.target.checked })}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#10B981 !important'
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: '#161412', borderRadius: '12px', border: '1px solid #1C1A18' }}>
              <Box>
                <Typography sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 600 }}>Validate SHA-256 Signatures</Typography>
                <Typography sx={{ color: '#9B9691', fontSize: '12px' }}>Perform mathematical checks ensuring direct bit-parity matches source archives</Typography>
              </Box>
              <Switch 
                checked={driveConfig.zkIntegrity} 
                onChange={(e) => setDriveConfig({ ...driveConfig, zkIntegrity: e.target.checked })}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#10B981 !important'
                  }
                }}
              />
            </Box>
          </Stack>
        );

      case 'gmail':
        return (
          <Stack spacing={3}>
            <Alert 
              severity="info" 
              sx={{ 
                bgcolor: '#1C1A18', 
                border: '1px solid #34322F', 
                color: '#FFFFFF',
                borderRadius: '12px',
                '& .MuiAlert-icon': { color: '#F59E0B' }
              }}
              icon={<Share2 size={20} />}
            >
              Emails are translated into asynchronous feeds inside Kylrix Connect. Bypasses third-party corporate analytical scanning.
            </Alert>

            <Box sx={{ p: 2, bgcolor: '#0A0908', borderRadius: '16px', border: '1px solid #1C1A18' }}>
              <Typography sx={{ color: '#9B9691', fontSize: '12px', fontFamily: '"JetBrains Mono"', mb: 1.5, letterSpacing: '0.05em' }}>
                CONNECT CHANNEL TARGET
              </Typography>
              <TextField 
                fullWidth
                size="small"
                value={gmailConfig.connectChannel}
                onChange={(e) => setgmailConfig({ ...gmailConfig, connectChannel: e.target.value })}
                slotProps={{
                  input: {
                    style: { fontFamily: '"JetBrains Mono"', color: '#FFFFFF', fontSize: '14px' }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#161412',
                    borderRadius: '8px',
                    borderColor: '#1C1A18',
                    '& fieldset': { border: '1px solid #1C1A18' },
                    '&:hover fieldset': { borderColor: '#34322F' },
                    '&.Mui-focused fieldset': { borderColor: '#F59E0B' },
                  }
                }}
              />
            </Box>

            <Box sx={{ p: 2, bgcolor: '#0A0908', borderRadius: '16px', border: '1px solid #1C1A18' }}>
              <Typography sx={{ color: '#9B9691', fontSize: '12px', fontFamily: '"JetBrains Mono"', mb: 1.5, letterSpacing: '0.05em' }}>
                FILTER CRITERIA (KEYWORD OR SENDER)
              </Typography>
              <TextField 
                fullWidth
                size="small"
                value={gmailConfig.filterKeyword}
                onChange={(e) => setgmailConfig({ ...gmailConfig, filterKeyword: e.target.value })}
                placeholder="e.g. key:important or client-security"
                slotProps={{
                  input: {
                    style: { fontFamily: '"JetBrains Mono"', color: '#FFFFFF', fontSize: '13px' }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#161412',
                    borderRadius: '8px',
                    '& fieldset': { border: '1px solid #1C1A18' },
                    '&:hover fieldset': { borderColor: '#34322F' },
                    '&.Mui-focused fieldset': { borderColor: '#F59E0B' },
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: '#161412', borderRadius: '12px', border: '1px solid #1C1A18' }}>
              <Box>
                <Typography sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 600 }}>Local archival tag mapping</Typography>
                <Typography sx={{ color: '#9B9691', fontSize: '12px' }}>Flag ingested threads securely for indexing engine reference</Typography>
              </Box>
              <Switch 
                checked={gmailConfig.archiveAfterImport} 
                onChange={(e) => setgmailConfig({ ...gmailConfig, archiveAfterImport: e.target.checked })}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#F59E0B !important'
                  }
                }}
              />
            </Box>
          </Stack>
        );

      case 'docs':
        return (
          <Stack spacing={3}>
            <Alert 
              severity="info" 
              sx={{ 
                bgcolor: '#1C1A18', 
                border: '1px solid #34322F', 
                color: '#FFFFFF',
                borderRadius: '12px',
                '& .MuiAlert-icon': { color: '#3B82F6' }
              }}
              icon={<FileText size={20} />}
            >
              Google Docs items represent individual structured workspace texts. Ingest docs directly as Markdown note structures into Kylrix Note, preserving headers and bullets offline.
            </Alert>

            <Box sx={{ p: 2, bgcolor: '#0A0908', borderRadius: '16px', border: '1px solid #1C1A18' }}>
              <Typography sx={{ color: '#9B9691', fontSize: '12px', fontFamily: '"JetBrains Mono"', mb: 1.5, letterSpacing: '0.05em' }}>
                LOCAL TARGET NOTE PATH
              </Typography>
              <TextField 
                fullWidth
                size="small"
                value={docsConfig.noteDirectory}
                onChange={(e) => setDocsConfig({ ...docsConfig, noteDirectory: e.target.value })}
                slotProps={{
                  input: {
                    style: { fontFamily: '"JetBrains Mono"', color: '#FFFFFF', fontSize: '14px' }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#161412',
                    borderRadius: '8px',
                    borderColor: '#1C1A18',
                    '& fieldset': { border: '1px solid #1C1A18' },
                    '&:hover fieldset': { borderColor: '#34322F' },
                    '&.Mui-focused fieldset': { borderColor: '#3B82F6' },
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: '#161412', borderRadius: '12px', border: '1px solid #1C1A18' }}>
              <Box>
                <Typography sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 600 }}>Convert structure to Markdown</Typography>
                <Typography sx={{ color: '#9B9691', fontSize: '12px' }}>Translate paragraphs, headers, and bullet structures to strict markdown files</Typography>
              </Box>
              <Switch 
                checked={docsConfig.importAsMarkdown} 
                onChange={(e) => setDocsConfig({ ...docsConfig, importAsMarkdown: e.target.checked })}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#3B82F6 !important'
                  }
                }}
              />
            </Box>
          </Stack>
        );

      case 'meet':
        return (
          <Stack spacing={3}>
            <Alert 
              severity="info" 
              sx={{ 
                bgcolor: '#1C1A18', 
                border: '1px solid #34322F', 
                color: '#FFFFFF',
                borderRadius: '12px',
                '& .MuiAlert-icon': { color: '#00AC47' }
              }}
              icon={<Video size={20} />}
            >
              Google Meet API enables instantiating and managing virtual call space loops across connected team networks. Meet coordinates will persist in Connect channels.
            </Alert>

            <FormControl fullWidth size="small">
              <Typography sx={{ color: '#9B9691', fontSize: '12px', fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
                Default Space Access Type
              </Typography>
              <Select
                value={meetConfig.defaultAccessType}
                onChange={(e) => setMeetConfig({ ...meetConfig, defaultAccessType: e.target.value as 'OPEN' | 'TRUSTED' | 'RESTRICTED' })}
                sx={{
                  bgcolor: '#0A0908',
                  borderRadius: '12px',
                  border: '1px solid #1C1A18',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover': { border: '1px solid #34322F' },
                  '&.Mui-focused': { border: '1px solid #00AC47' },
                }}
              >
                <MenuItem value="OPEN">Open (Anyone with the link can join directly)</MenuItem>
                <MenuItem value="TRUSTED">Trusted (Users from organization or guests can join)</MenuItem>
                <MenuItem value="RESTRICTED">Restricted (Only direct invitees can join)</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: '#161412', borderRadius: '12px', border: '1px solid #1C1A18' }}>
              <Box>
                <Typography sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 600 }}>Auto-Create on Calendar Event</Typography>
                <Typography sx={{ color: '#9B9691', fontSize: '12px' }}>Instantly link Meet rooms when creating calendars</Typography>
              </Box>
              <Switch 
                checked={meetConfig.autoCreateOnEvent} 
                onChange={(e) => setMeetConfig({ ...meetConfig, autoCreateOnEvent: e.target.checked })}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#00AC47 !important'
                  }
                }}
              />
            </Box>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: 'rgba(5, 4, 3, 0.85)',
          }
        }
      }}
    >
      {/* Visual top border aligned to the active Kylrix app color */}
      <Box sx={{ height: '4px', bgcolor: getServiceColor() }} />
      
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Logo app={service.app} size={28} variant="icon" />
          <Box>
            <Typography sx={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif' }}>
              Bridge System Mapping
            </Typography>
            <Typography sx={{ color: '#9B9691', fontSize: '12px', fontFamily: '"JetBrains Mono"', textTransform: 'uppercase' }}>
              {service.googlename} <ArrowRight size={10} style={{ display: 'inline', margin: '0 4px' }} /> {service.destination}
            </Typography>
          </Box>
        </Box>
        
        <Button 
          onClick={onClose}
          sx={{ 
            p: 1, 
            minWidth: 0, 
            borderRadius: '50%', 
            color: '#9B9691',
            bgcolor: '#1C1A18',
            border: '1px solid #34322F',
            '&:hover': {
              bgcolor: '#34322F',
              color: '#FFFFFF'
            }
          }}
        >
          <X size={16} />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 1, borderTop: '1px solid #1C1A18', borderBottom: '1px solid #1C1A18', bgcolor: '#161412' }}>
        <Box sx={{ mt: 2, mb: 2 }}>
          {renderConfigSection()}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#161412', display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Terminal size={14} style={{ color: '#9B9691' }} />
          <Typography sx={{ color: '#9B9691', fontSize: '11px', fontFamily: '"JetBrains Mono"' }}>
            Pipeline configuration synchronized locally.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button 
            onClick={onClose}
            sx={{
              bgcolor: '#1C1A18',
              color: '#FFFFFF',
              border: '1px solid #34322F',
              '&:hover': {
                bgcolor: '#34322F'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            disableElevation
            startIcon={<Save size={16} />}
            sx={{
              bgcolor: getServiceColor(),
              color: '#FFFFFF',
              border: `1px solid ${getServiceColor()}`,
              '&:hover': {
                bgcolor: getServiceColor(),
                filter: 'brightness(1.1)'
              }
            }}
          >
            Save Pipeline
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
