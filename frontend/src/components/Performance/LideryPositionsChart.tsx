// frontend/src/components/Performance/LideryPositionsChart.tsx

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  useTheme,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Stack,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { performanceService } from '../../services/performanceService';
import { useSnackbar } from 'notistack';

interface ChartData {
  position: number;
  count: number;
  percentage: number;
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

  const data = payload[0].payload;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        p: 1.5,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
      }}
    >
      <Typography variant="subtitle2">Posição {label}</Typography>
      <Typography variant="body2" color="textSecondary">
        Quantidade: {data.count}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Porcentagem: {data.percentage.toFixed(2)}%
      </Typography>
    </Box>
  );
};

export const LideryPositionsChart: React.FC = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<ChartData[]>([]);
  const [timeRange, setTimeRange] = React.useState<string>('30');

  const handleTimeRangeChange = (event: SelectChangeEvent<string>) => {
    setTimeRange(event.target.value);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await performanceService.getLideryPositions(Number(timeRange));
      setData(response);
    } catch (error) {
      enqueueSnackbar('Erro ao carregar dados de posicionamento', { 
        variant: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, [timeRange]);

  return (
    <Card>
      <CardHeader
        title="Posições da Lidery nos Anúncios"
        action={
          <FormControl size="small" sx={{ minWidth: 120 }}>
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
              <BarChart data={data}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme.palette.divider}
                />
                <XAxis 
                  dataKey="position"
                  label={{ 
                    value: 'Posição', 
                    position: 'insideBottom', 
                    offset: -5,
                    fill: theme.palette.text.primary
                  }}
                  stroke={theme.palette.text.primary}
                />
                <YAxis
                  label={{ 
                    value: 'Quantidade', 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: theme.palette.text.primary
                  }}
                  stroke={theme.palette.text.primary}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  name="Ocorrências"
                  dataKey="count"
                  fill={theme.palette.primary.main}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>
        {!loading && data.length > 0 && (
          <Stack spacing={1} mt={2}>
            <Typography variant="caption" color="textSecondary" textAlign="center">
              Total de ocorrências: {data.reduce((sum, item) => sum + item.count, 0)}
            </Typography>
            <Typography variant="caption" color="textSecondary" textAlign="center">
              Posição mais frequente: {
                data.reduce((prev, current) => 
                  prev.count > current.count ? prev : current
                ).position
              }
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default LideryPositionsChart;