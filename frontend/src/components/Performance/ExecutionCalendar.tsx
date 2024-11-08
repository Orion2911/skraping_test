// frontend/src/components/Performance/ExecutionCalendar.tsx

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
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ExecutionDay {
  date: string;
  executions: number;
}

export const ExecutionCalendar: React.FC = () => {
  const theme = useTheme();
  const [data, setData] = React.useState<ExecutionDay[]>([]);
  const today = new Date();

  const days = eachDayOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today),
  });

  const getColor = (executions: number) => {
    if (executions === 0) return theme.palette.action.disabled;
    if (executions < 3) return theme.palette.primary.light;
    if (executions < 5) return theme.palette.primary.main;
    return theme.palette.primary.dark;
  };

  return (
    <Card>
      <CardHeader 
        title="Calendário de Execuções" 
        subheader={format(today, 'MMMM yyyy', { locale: ptBR })}
      />
      <CardContent>
        <Grid container spacing={1}>
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <Grid item xs={12/7} key={day}>
              <Typography
                variant="caption"
                align="center"
                display="block"
                color="textSecondary"
              >
                {day}
              </Typography>
            </Grid>
          ))}
          {days.map(day => (
            <Grid item xs={12/7} key={day.toISOString()}>
              <Box
                sx={{
                  aspectRatio: '1/1',
                  backgroundColor: getColor(
                    data.find(d => d.date === format(day, 'yyyy-MM-dd'))?.executions || 0
                  ),
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              >
                <Typography variant="caption">
                  {format(day, 'd')}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};