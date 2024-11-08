// frontend/src/components/Execution/ExecutionStats.tsx

import React from 'react';
import { 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  LinearProgress,
  Box,
  Tooltip
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { executionService } from '../../services/executionService';
import { useSnackbar } from 'notistack';

interface StatCardProps {
  title: string;
  value: string | number;
  loading?: boolean;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, loading, subtitle }) => (
  <Card>
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ minHeight: '40px' }}>
        {loading ? (
          <LinearProgress />
        ) : (
          <Tooltip title={subtitle || ''} placement="bottom">
            <Typography variant="h5" component="div">
              {value}
            </Typography>
          </Tooltip>
        )}
      </Box>
      {subtitle && (
        <Typography variant="caption" color="textSecondary">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export const ExecutionStats: React.FC = () => {
  const { currentExecution } = useSelector((state: RootState) => state.execution);
  const [loading, setLoading] = React.useState(false);
  const [stats, setStats] = React.useState({
    totalSearches: 0,
    totalClicks: 0,
    totalLidery: 0,
  });
  const { enqueueSnackbar } = useSnackbar();

  const loadStats = async () => {
    if (!currentExecution?.id) return;
    
    try {
      setLoading(true);
      const status = await executionService.getExecutionStatus(currentExecution.id);
      setStats({
        totalSearches: status.total_searches,
        totalClicks: status.total_clicks,
        totalLidery: status.total_lidery_found,
      });
    } catch (error) {
      enqueueSnackbar('Erro ao carregar estatísticas', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadStats();
    
    // Atualizar stats a cada 5 segundos se houver uma execução ativa
    let interval: NodeJS.Timeout;
    if (currentExecution?.is_running) {
      interval = setInterval(loadStats, 5000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentExecution?.id, currentExecution?.is_running]);

  const getRunningTime = () => {
    if (!currentExecution?.start_time) return 'N/A';
    return formatDistanceToNow(new Date(currentExecution.start_time), {
      locale: ptBR,
      addSuffix: true
    });
  };

  const getLideryPercentage = () => {
    if (stats.totalSearches === 0) return '0%';
    return `${((stats.totalLidery / stats.totalSearches) * 100).toFixed(2)}%`;
  };

  const getClickRate = () => {
    if (stats.totalSearches === 0) return '0%';
    return `${((stats.totalClicks / stats.totalSearches) * 100).toFixed(2)}%`;
  };

  return (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom>
        Estatísticas da Execução Atual
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tempo de Execução"
            value={getRunningTime()}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Buscas"
            value={stats.totalSearches}
            loading={loading}
            subtitle={`Taxa de cliques: ${getClickRate()}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Cliques"
            value={stats.totalClicks}
            loading={loading}
            subtitle="Cliques em anúncios"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Lidery Encontrada"
            value={`${stats.totalLidery} (${getLideryPercentage()})`}
            loading={loading}
            subtitle="Vezes que a Lidery apareceu"
          />
        </Grid>
      </Grid>
    </Box>
  );
};