import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import StorageIcon from '@mui/icons-material/Storage';
import TuneIcon from '@mui/icons-material/Tune';
import TrainingCenterContainer from '../features/ai/containers/TrainingCenterContainer';
import DatasetManagerContainer from '../features/ai/containers/DatasetManagerContainer';
import AISettingsContainer from '../features/settings/containers/AISettingsContainer';

export default function AI() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ bgcolor: '#020617', minHeight: '100vh' }}>
      <Box sx={{ px: { xs: 2, md: 4 }, pt: 2, borderBottom: '1px solid #1E293B' }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            '& .MuiTab-root': { color: '#94A3B8', textTransform: 'none', fontWeight: 600 },
            '& .Mui-selected': { color: '#38BDF8' },
            '& .MuiTabs-indicator': { backgroundColor: '#38BDF8' },
          }}
        >
          <Tab icon={<PsychologyIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Centro de Treinamento & Model Registry" />
          <Tab icon={<StorageIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Dataset Manager Supervisionado" />
          <Tab icon={<TuneIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Thresholds & Inferência" />
        </Tabs>
      </Box>

      {activeTab === 0 && <TrainingCenterContainer />}
      {activeTab === 1 && <DatasetManagerContainer />}
      {activeTab === 2 && <AISettingsContainer />}
    </Box>
  );
}