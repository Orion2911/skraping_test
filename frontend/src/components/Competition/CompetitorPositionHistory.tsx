// frontend/src/components/Competition/CompetitorPositionHistory.tsx

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PositionData {
  date: string;
  position: number;
}

export const CompetitorPositionHistory: React.FC<{ competitorId?: number }> = ({ competitorId }) => {
  const theme = useTheme();
  const [data, setData] = React.useState<PositionData[]>([]);

  // TODO: Implementar chamada à API para buscar dados

  return (
    <Card>
      <CardHeader title="Histórico de Posições" />
      <CardContent>
        <Box sx={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis
                reversed
                domain={[1, 4]}
                ticks={[1, 2, 3, 4]}
                label={{ 
                  value: 'Posição', 
                  angle: -90, 
                  position: 'insideLeft' 
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  borderColor: theme.palette.divider,
                }}
                formatter={(value: number) => [`Posição ${value}`, 'Posição']}
              />
              <Line
                type="monotone"
                dataKey="position"
                stroke={theme.palette.primary.main}
                dot={{ fill: theme.palette.primary.main }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};