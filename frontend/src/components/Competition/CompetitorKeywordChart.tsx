// frontend/src/components/Competition/CompetitorKeywordChart.tsx

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface KeywordData {
  keyword: string;
  appearances: number;
  averagePosition: number;
}

export const CompetitorKeywordChart: React.FC<{ competitorId?: number }> = ({ competitorId }) => {
  const theme = useTheme();
  const [data, setData] = React.useState<KeywordData[]>([]);

  // TODO: Implementar chamada à API para buscar dados

  return (
    <Card>
      <CardHeader title="Distribuição por Palavra-chave" />
      <CardContent>
        <Box sx={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 150 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="keyword" 
                type="category"
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  borderColor: theme.palette.divider,
                }}
              />
              <Bar 
                dataKey="appearances" 
                fill={theme.palette.primary.main} 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};