// frontend/src/components/Competition/CompetitorAppearanceMap.tsx

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Box,
  useTheme,
} from '@mui/material';

interface AppearanceData {
  position: number;
  count: number;
  percentage: number;
}

export const CompetitorAppearanceMap: React.FC<{ competitorId?: number }> = ({ competitorId }) => {
  const theme = useTheme();
  const [data, setData] = React.useState<AppearanceData[]>([]);

  const getIntensityColor = (percentage: number) => {
    const hue = theme.palette.primary.main;
    return `${hue}${Math.round((percentage / 100) * 255).toString(16).padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader title="Mapa de Aparições por Posição" />
      <CardContent>
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((position) => {
            const posData = data.find(d => d.position === position) || {
              count: 0,
              percentage: 0
            };
            
            return (
              <Grid item xs={3} key={position}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    backgroundColor: getIntensityColor(posData.percentage),
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h4">
                    {posData.count}
                  </Typography>
                  <Typography variant="body2">
                    Posição {position}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {posData.percentage.toFixed(1)}%
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};