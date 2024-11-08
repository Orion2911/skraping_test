// frontend/src/pages/Performance/index.tsx

import React from 'react';
import { Container, Grid } from '@mui/material';
import { PerformanceOverview } from '../../components/Performance/PerformanceOverview';
import { LideryPositionsChart } from '../../components/Performance/LideryPositionsChart';
import { PerformanceTimeline } from '../../components/Performance/PerformanceTimeline';
import { ExecutionCalendar } from '../../components/Performance/ExecutionCalendar';

const Performance: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <PerformanceOverview />
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <PerformanceTimeline />
        </Grid>
        <Grid item xs={12} md={4}>
          <LideryPositionsChart />
        </Grid>
        <Grid item xs={12}>
          <ExecutionCalendar />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Performance;