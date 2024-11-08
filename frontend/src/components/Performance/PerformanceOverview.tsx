// frontend/src/components/Performance/PerformanceOverview.tsx

import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Box,
  Stack,
  Tooltip,
} from '@mui/material';
import { 
  TrendingUp,
  TouchApp,
  Search,
  CheckCircle,
} from '@mui/icons-material';
import { performanceService } from '../../services/performanceService';
import { useSnackbar } from 'notistack';

interface Trend {
  value: number;
  isPositive: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: Trend;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  loading 
}) => (
  <Card>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="start">
        <Box flex={1}>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Box height={40} display="flex" alignItems="center">
            {loading ? (
              <LinearProgress sx={{ width: '100%' }} />
            ) : (
              <Typography variant="h4" component="div">
                {value}
              </Typography>
            )}
          </Box>
          {trend && !loading && (
            <Stack direction="row" alignItems="center" spacing={1} mt={1}>
              <Typography
                variant="caption"
                color={trend.isPositive ? 'success.main' : 'error.main'}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </Typography>
              <Typography variant="caption" color="textSecondary">
                em relação ao período anterior
              </Typography>
            </Stack>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: 'primary.main',
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

interface Stats {
  executions: {
    value: number;
    trend: Trend;
  };
  searches: {
    value: number;
    trend: Trend;
  };
  clicks: {
    value: number;
    trend: Trend;
  };
  lideryFound: {
    value: number;
    trend: Trend;
  };
}

export const PerformanceOverview: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [stats, setStats] = React.useState<Stats>({
    executions: {
      value: 0,
      trend: { value: 0, isPositive: true }
    },
    searches: {
      value: 0,
      trend: { value: 0, isPositive: true }
    },
    clicks: {
      value: 0,
      trend: { value: 0, isPositive: true }
    },
    lideryFound: {
      value: 0,
      trend: { value: 0, isPositive: true }
    },
  });
  const { enqueueSnackbar } = useSnackbar();

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await performanceService.getDailyStats();
      
      const current = data[data.length - 1] || { total_executions: 0, total_searches: 0, total_clicks: 0, total_lidery: 0 };
      const previous = data[data.length - 2] || current;

      const calculateTrend = (current: number, previous: number): Trend => {
        if (previous === 0) return { value: 0, isPositive: true };
        const trendValue = ((current - previous) / previous) * 100;
        return {
          value: Number(Math.abs(trendValue).toFixed(1)),
          isPositive: trendValue >= 0
        };
      };

      setStats({
        executions: {
          value: current.total_executions,
          trend: calculateTrend(current.total_executions, previous.total_executions)
        },
        searches: {
          value: current.total_searches,
          trend: calculateTrend(current.total_searches, previous.total_searches)
        },
        clicks: {
          value: current.total_clicks,
          trend: calculateTrend(current.total_clicks, previous.total_clicks)
        },
        lideryFound: {
          value: current.total_lidery,
          trend: calculateTrend(current.total_lidery, previous.total_lidery)
        },
      });
    } catch (error) {
      enqueueSnackbar('Erro ao carregar estatísticas', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadStats();
    // Atualizar a cada 5 minutos
    const interval = setInterval(loadStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total de Execuções"
          value={stats.executions.value}
          icon={<TrendingUp />}
          trend={stats.executions.trend}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Pesquisas Realizadas"
          value={stats.searches.value}
          icon={<Search />}
          trend={stats.searches.trend}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Cliques em Anúncios"
          value={stats.clicks.value}
          icon={<TouchApp />}
          trend={stats.clicks.trend}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Lidery Encontrada"
          value={stats.lideryFound.value}
          icon={<CheckCircle />}
          trend={stats.lideryFound.trend}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default PerformanceOverview;