// frontend/src/components/Performance/PerformanceTimeline.tsx

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  useTheme,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Stack,
  Typography,
  CircularProgress,
  SelectChangeEvent,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { performanceService } from '../../services/performanceService';
import { useSnackbar } from 'notistack';
import { format, subDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TimelineData {
  date: string;
  searches: number;
  clicks: number;
  lideryFound: number;
  clickRate: number;
  lideryRate: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  const theme = useTheme();

  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        p: 1.5,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
      }}
    >
      <Typography variant="subtitle2">
        {format(new Date(label), 'dd/MM/yyyy', { locale: ptBR })}
      </Typography>
      {payload.map((entry: any, index: number) => (
        <Typography
          key={`item-${index}`}
          variant="body2"
          color={entry.color}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Box
            component="span"
            sx={{
              width: 10,
              height: 10,
              backgroundColor: entry.color,
              borderRadius: '50%',
            }}
          />
          {entry.name}: {entry.value}
          {entry.name.includes('Taxa') ? '%' : ''}
        </Typography>
      ))}
    </Box>
  );
};

export const PerformanceTimeline: React.FC = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<TimelineData[]>([]);
  const [timeRange, setTimeRange] = React.useState<string>('30');
  const [viewMode, setViewMode] = React.useState<string>('absolute');

  const handleTimeRangeChange = (event: SelectChangeEvent<string>) => {
    setTimeRange(event.target.value);
  };

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: string
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const endDate = startOfDay(new Date());
      const startDate = startOfDay(subDays(endDate, parseInt(timeRange)));
      
      const response = await performanceService.getDailyStats(
        startDate.toISOString(),
        endDate.toISOString()
      );

      const processedData = response.map(day => ({
        date: day.date,
        searches: day.total_searches,
        clicks: day.total_clicks,
        lideryFound: day.total_lidery,
        clickRate: (day.total_clicks / day.total_searches * 100) || 0,
        lideryRate: (day.total_lidery / day.total_searches * 100) || 0,
      }));

      setData(processedData);
    } catch (error) {
      enqueueSnackbar('Erro ao carregar dados de desempenho', { 
        variant: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, [timeRange]);

  const getMetricsToShow = () => {
    if (viewMode === 'absolute') {
      return [
        { key: 'searches', name: 'Pesquisas', color: theme.palette.primary.main },
        { key: 'clicks', name: 'Cliques', color: theme.palette.secondary.main },
        { key: 'lideryFound', name: 'Lidery', color: theme.palette.success.main },
      ];
    }
    return [
      { key: 'clickRate', name: 'Taxa de Cliques', color: theme.palette.secondary.main },
      { key: 'lideryRate', name: 'Taxa de Lidery', color: theme.palette.success.main },
    ];
  };

  return (
    <Card>
      <CardHeader
        title="Desempenho ao Longo do Tempo"
        action={
          <Stack direction="row" spacing={2}>
            <FormControl size="small">
              <InputLabel>Período</InputLabel>
              <Select
                value={timeRange}
                label="Período"
                onChange={handleTimeRangeChange}
                disabled={loading}
              >
                <MenuItem value="7">7 dias</MenuItem>
                <MenuItem value="30">30 dias</MenuItem>
                <MenuItem value="60">60 dias</MenuItem>
                <MenuItem value="90">90 dias</MenuItem>
              </Select>
            </FormControl>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
            >
              <ToggleButton value="absolute">
                Absoluto
              </ToggleButton>
              <ToggleButton value="percentage">
                Percentual
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        }
      />
      <CardContent>
        <Box 
          sx={{ 
            width: '100%', 
            height: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : data.length === 0 ? (
            <Typography color="textSecondary">
              Nenhum dado disponível para o período selecionado
            </Typography>
          ) : (
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme.palette.divider}
                />
                <XAxis
                  dataKey="date"
                  stroke={theme.palette.text.primary}
                  tick={{ fill: theme.palette.text.primary }}
                  tickFormatter={(value) => format(new Date(value), 'dd/MM', { locale: ptBR })}
                />
                <YAxis 
                  stroke={theme.palette.text.primary}
                  tick={{ fill: theme.palette.text.primary }}
                  unit={viewMode === 'percentage' ? '%' : ''}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {getMetricsToShow().map((metric) => (
                  <Line
                    key={metric.key}
                    type="monotone"
                    dataKey={metric.key}
                    name={metric.name}
                    stroke={metric.color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </Box>
        {!loading && data.length > 0 && (
          <Stack spacing={1} mt={2}>
            <Typography variant="caption" color="textSecondary" textAlign="center">
              Total de pesquisas: {data.reduce((sum, item) => sum + item.searches, 0)}
            </Typography>
            <Typography variant="caption" color="textSecondary" textAlign="center">
              Média diária: {Math.round(data.reduce((sum, item) => sum + item.searches, 0) / data.length)}
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceTimeline;