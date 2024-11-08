// frontend/src/components/Execution/KeywordManager.tsx

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Box,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { useSnackbar } from 'notistack';
import { Keyword } from '../../types';
import { keywordService } from '../../services/keywordService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const KeywordManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  
  // Estados locais
  const [newKeywords, setNewKeywords] = React.useState('');
  const [openDialog, setOpenDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [keywords, setKeywords] = React.useState<Keyword[]>([]);

  // Função para carregar keywords
  const loadKeywords = async () => {
    try {
      setLoading(true);
      const data = await keywordService.listKeywords();
      setKeywords(data);
    } catch (error) {
      enqueueSnackbar('Erro ao carregar palavras-chave', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Carregar keywords ao montar o componente
  React.useEffect(() => {
    loadKeywords();
  }, []);

  const handleAddKeywords = async () => {
    const keywordArray = newKeywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
    
    if (keywordArray.length === 0) {
      enqueueSnackbar('Adicione pelo menos uma palavra-chave', { variant: 'warning' });
      return;
    }

    try {
      setLoading(true);
      await keywordService.addKeywords(keywordArray);
      await loadKeywords(); // Recarrega a lista
      setNewKeywords('');
      setOpenDialog(false);
      enqueueSnackbar('Palavras-chave adicionadas com sucesso', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erro ao adicionar palavras-chave', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKeyword = async (id: number) => {
    try {
      setLoading(true);
      await keywordService.deleteKeyword(id);
      await loadKeywords(); // Recarrega a lista
      enqueueSnackbar('Palavra-chave removida com sucesso', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erro ao remover palavra-chave', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleKeyword = async (id: number) => {
    try {
      setLoading(true);
      await keywordService.toggleKeyword(id);
      await loadKeywords(); // Recarrega a lista
      enqueueSnackbar('Status da palavra-chave atualizado', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erro ao atualizar status da palavra-chave', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getKeywordTooltip = (keyword: Keyword) => {
    return (
      <>
        <Typography variant="body2">
          Criada em: {format(new Date(keyword.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
        </Typography>
        {keyword.last_used && (
          <Typography variant="body2">
            Último uso: {format(new Date(keyword.last_used), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
          </Typography>
        )}
        <Typography variant="body2">
          Total de usos: {keyword.use_count}
        </Typography>
      </>
    );
  };

  return (
    <Box mt={3}>
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Palavras-chave
            </Typography>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
              onClick={() => setOpenDialog(true)}
              disabled={loading}
            >
              Adicionar
            </Button>
          </Stack>

          {keywords.length === 0 && !loading ? (
            <Alert severity="info">
              Nenhuma palavra-chave cadastrada. Adicione algumas para começar.
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {keywords.map((keyword) => (
                <Tooltip
                  key={keyword.id}
                  title={getKeywordTooltip(keyword)}
                  arrow
                >
                  <Chip
                    label={keyword.text}
                    onDelete={() => handleDeleteKeyword(keyword.id)}
                    onClick={() => handleToggleKeyword(keyword.id)}
                    color={keyword.is_active ? 'primary' : 'default'}
                    icon={keyword.is_active ? <CheckCircleIcon /> : <CancelIcon />}
                    disabled={loading}
                  />
                </Tooltip>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Adicionar Palavras-chave</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Digite as palavras-chave separadas por vírgula
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={newKeywords}
            onChange={(e) => setNewKeywords(e.target.value)}
            placeholder="Ex: dentista curitiba, odontologia emergência"
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleAddKeywords}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};