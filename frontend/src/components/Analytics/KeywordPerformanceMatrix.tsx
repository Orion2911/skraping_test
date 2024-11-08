// frontend/src/components/Analytics/KeywordPerformanceMatrix.tsx

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  useTheme,
  Typography,
} from '@mui/material';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';

interface KeywordData {
  keyword: string;
  impressions: number;
  averagePosition: number;
  totalClicks: number;
}

export const KeywordPerformanceMatrix: React.FC = () => {
  const theme = useTheme();
  const [data, setData] = React.useState<KeywordData[]>([]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
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
          <Typography variant="subtitle2">{data.keyword}</Typography>
          <Typography variant="body2" color="textSecondary">
            Impressões: {data.impressions}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Posição Média: {data.averagePosition.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Cliques: {data.totalClicks}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader title="Matriz de Desempenho de Palavras-chave" />
      <CardContent>
        <Box sx={{ width: '100%', height: 500 }}>
          <ResponsiveContainer>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis
                type="number"
                dataKey="impressions"
                name="Impressões"
                unit=""
              />
              <YAxis
                type="number"
                dataKey="averagePosition"
                name="Posição Média"
                reversed
              />
              <ZAxis
                type="number"
                dataKey="totalClicks"
                range={[50, 400]}
                name="Cliques"
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter
                name="Keywords"
                data={data}
                fill={theme.palette.primary.main}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};