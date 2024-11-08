// frontend/src/pages/Competition/CompetitorDetails.tsx

import React from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography,
  Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { CompetitorKeywordChart } from '../../components/Competition/CompetitorKeywordChart';
import { CompetitorPositionHistory } from '../../components/Competition/CompetitorPositionHistory';
import { CompetitorAppearanceMap } from '../../components/Competition/CompetitorAppearanceMap';

const CompetitorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [competitor, setCompetitor] = React.useState(null);

  return (
    <Container maxWidth="xl">
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/competition')}
        sx={{ mb: 3 }}
      >
        Voltar
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Detalhes do Concorrente
              </Typography>
              {/* TODO: Adicionar informações gerais do competidor */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <CompetitorPositionHistory competitorId={Number(id)} />
        </Grid>
        <Grid item xs={12} md={4}>
          <CompetitorAppearanceMap competitorId={Number(id)} />
        </Grid>
        <Grid item xs={12}>
          <CompetitorKeywordChart competitorId={Number(id)} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CompetitorDetails;