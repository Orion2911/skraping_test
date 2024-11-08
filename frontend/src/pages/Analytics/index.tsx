// frontend/src/pages/Analytics/index.tsx

import React from 'react';
import { Container, Grid } from '@mui/material';
import { TrendAnalysis } from '../../components/Analytics/TrendAnalysis';
import { KeywordPerformanceMatrix } from '../../components/Analytics/KeywordPerformanceMatrix';
import { CompetitorShareAnalysis } from '../../components/Analytics/CompetitorShareAnalysis';

const Analytics: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TrendAnalysis />
        </Grid>
        <Grid item xs={12} md={8}>
          <KeywordPerformanceMatrix />
        </Grid>
        <Grid item xs={12} md={4}>
          <CompetitorShareAnalysis />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics;