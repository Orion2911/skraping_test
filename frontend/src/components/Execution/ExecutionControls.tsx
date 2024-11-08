// frontend/src/components/Execution/ExecutionControls.tsx

import React from 'react';
import { 
  Card, 
  CardContent, 
  Button, 
  Stack, 
  FormControlLabel, 
  Switch,
  Typography,
  CircularProgress
} from '@mui/material';
import { 
  PlayArrow as PlayIcon, 
  Stop as StopIcon 
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { startExecution, stopExecution } from '../../store/slices/executionSlice';
import { executionService } from '../../services/executionService';
import { useSnackbar } from 'notistack';

export const ExecutionControls: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const [headless, setHeadless] = React.useState(false);
  
  const { currentExecution, loading } = useSelector(
    (state: RootState) => state.execution
  );

  const handleStart = async () => {
    try {
      await dispatch(startExecution(headless)).unwrap();
      enqueueSnackbar('Execução iniciada com sucesso', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erro ao iniciar execução', { variant: 'error' });
    }
  };

  const handleStop = async () => {
    if (!currentExecution) return;
    
    try {
      await dispatch(stopExecution(currentExecution.id)).unwrap();
      enqueueSnackbar('Execução parada com sucesso', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erro ao parar execução', { variant: 'error' });
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Controles de Execução
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayIcon />}
            onClick={handleStart}
            disabled={loading || !!currentExecution}
          >
            {loading ? 'Iniciando...' : 'Iniciar'}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <StopIcon />}
            onClick={handleStop}
            disabled={loading || !currentExecution}
          >
            {loading ? 'Parando...' : 'Parar'}
          </Button>
          <FormControlLabel
            control={
              <Switch
                checked={headless}
                onChange={(e) => setHeadless(e.target.checked)}
                disabled={loading || !!currentExecution}
              />
            }
            label="Modo Headless"
          />
        </Stack>
      </CardContent>
    </Card>
  );
};