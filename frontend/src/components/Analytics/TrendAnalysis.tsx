// frontend/src/components/Analytics/TrendAnalysis.tsx

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  useTheme,
  ButtonGroup,
  Button,
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

interface TrendData {
  date: string;
  positionAverage: number;
  appearanceRate: number;
  clickRate: number;
}

export const TrendAnalysis: React.FC = () => {
  const theme = useTheme();
  const [data, setData] = React.useState<TrendData[]>([]);
  const [timeRange, setTimeRange] = React.useState<'week' | 'month' | 'quarter'>('week');

  const timeRanges = [
    { value: 'week', label: '7 dias' },
    { value: 'month', label: '30 dias' },
    { value: 'quarter', label: '90 dias' },
  ];

  return (
    <Card>
      <CardHeader
        title="Análise de Tendências"
        action={
          <ButtonGroup size="small">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={timeRange === range.value ? 'contained' : 'outlined'}
                onClick={() => setTimeRange(range.value as any)}
              >
                {range.label}
              </Button>
            ))}
          </ButtonGroup>
        }
      />
      <CardContent>
        <Box sx={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  borderColor: theme.palette.divider,
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="positionAverage"
                name="Posição Média"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="appearanceRate"
                name="Taxa de Aparições"
                stroke={theme.palette.secondary.main}
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="clickRate"
                name="Taxa de Cliques"
                stroke={theme.palette.success.main}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};