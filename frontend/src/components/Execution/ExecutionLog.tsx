// frontend/src/components/Execution/ExecutionLog.tsx

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Paper
} from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export const ExecutionLog: React.FC = () => {
  const [logs, setLogs] = React.useState<string[]>([]);
  const logContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Simular recebimento de logs (substituir por WebSocket ou polling real)
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => [
        ...prev,
        `[${new Date().toISOString()}] Ação executada...`
      ].slice(-100)); // Manter apenas os últimos 100 logs
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Box mt={3}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Log de Execução
            </Typography>
            <IconButton onClick={() => setLogs([])}>
              <ClearIcon />
            </IconButton>
          </Box>
          
          <Paper
            ref={logContainerRef}
            sx={{
              height: 300,
              overflowY: 'auto',
              bgcolor: 'background.default',
              p: 2,
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          >
            {logs.map((log, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                {log}
              </Box>
            ))}
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
};