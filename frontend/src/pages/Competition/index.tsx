// frontend/src/pages/Competition/index.tsx

import React from 'react';
import { Container, Grid } from '@mui/material';
import { TopCompetitorsList } from '../../components/Competition/TopCompetitorsList';
import { CompetitorKeywordChart } from '../../components/Competition/CompetitorKeywordChart';
import { CompetitorAppearanceMap } from '../../components/Competition/CompetitorAppearanceMap';

const Competition: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TopCompetitorsList />
        </Grid>
        <Grid item xs={12} md={8}>
          <CompetitorKeywordChart />
        </Grid>
        <Grid item xs={12} md={4}>
          <CompetitorAppearanceMap />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Competition;