// frontend/src/components/Analytics/CompetitorShareAnalysis.tsx

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  useTheme,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface CompetitorShare {
  domain: string;
  appearances: number;
  percentage: number;
}

export const CompetitorShareAnalysis: React.FC = () => {
  const theme = useTheme();
  const [data, setData] = React.useState<CompetitorShare[]>([]);

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    // Adicione mais cores se necessário
  ];

  return (
    <Card>
      <CardHeader title="Participação dos Concorrentes" />
      <CardContent>
        <Box sx={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="appearances"
                nameKey="domain"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  value,
                  index
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = 25 + innerRadius + (outerRadius - innerRadius);
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill={theme.palette.text.primary}
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                    >
                      {`${data[index].domain} (${data[index].percentage}%)`}
                    </text>
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  borderColor: theme.palette.divider,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};