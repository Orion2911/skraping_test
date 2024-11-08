// frontend/src/components/Competition/TopCompetitorsList.tsx

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  InfoOutlined as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Competitor {
  id: number;
  domain: string;
  totalAppearances: number;
  averagePosition: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

export const TopCompetitorsList: React.FC = () => {
  const navigate = useNavigate();
  const [competitors, setCompetitors] = React.useState<Competitor[]>([]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon color="success" />;
      case 'down':
        return <TrendingDownIcon color="error" />;
      default:
        return null;
    }
  };

  const getPositionColor = (position: number) => {
    if (position <= 2) return 'success';
    if (position <= 3) return 'warning';
    return 'error';
  };

  return (
    <Card>
      <CardHeader 
        title="Top 10 Concorrentes" 
        subheader="Baseado no número de aparições"
      />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Domínio</TableCell>
                <TableCell align="center">Aparições</TableCell>
                <TableCell align="center">Posição Média</TableCell>
                <TableCell align="center">Tendência</TableCell>
                <TableCell align="right">Detalhes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {competitors.map((competitor) => (
                <TableRow key={competitor.id}>
                  <TableCell>
                    <Typography variant="body2">{competitor.domain}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {competitor.totalAppearances}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={competitor.averagePosition.toFixed(1)}
                      size="small"
                      color={getPositionColor(competitor.averagePosition)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      {getTrendIcon(competitor.trend)}
                      <Typography
                        variant="caption"
                        color={competitor.trend === 'up' ? 'success.main' : 'error.main'}
                        sx={{ ml: 0.5 }}
                      >
                        {competitor.trendValue}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Ver detalhes">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/competition/${competitor.id}`)}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};