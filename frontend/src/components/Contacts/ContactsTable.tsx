// frontend/src/components/Contacts/ContactsTable.tsx

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
  Chip,
  Tooltip,
  TextField,
  InputAdornment,
  Box,
  Button,
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Phone as PhoneIcon,
  Search as SearchIcon,
  ContentCopy as CopyIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSnackbar } from 'notistack';

interface Contact {
  id: number;
  competitor_id: number;
  competitor_domain: string;
  type: 'whatsapp' | 'phone';
  value: string;
  first_seen: string;
  last_seen: string;
  times_found: number;
}

export const ContactsTable: React.FC = () => {
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    enqueueSnackbar('Contato copiado para a área de transferência', {
      variant: 'success',
    });
  };

  const formatPhoneNumber = (value: string) => {
    // Implementar formatação de número de telefone
    return value;
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <WhatsAppIcon color="success" />;
      case 'phone':
        return <PhoneIcon color="primary" />;
      default:
        return null;
    }
  };

  const openWhatsApp = (number: string) => {
    const formattedNumber = number.replace(/\D/g, '');
    window.open(`https://wa.me/${formattedNumber}`, '_blank');
  };

  const filteredContacts = contacts.filter(contact => 
    contact.competitor_domain.toLowerCase().includes(search.toLowerCase()) ||
    contact.value.includes(search)
  );

  return (
    <Card>
      <CardHeader 
        title="Contatos Capturados"
        action={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Buscar contatos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={() => {/* Implementar exportação */}}
            >
              Exportar
            </Button>
          </Box>
        }
      />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Domínio</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Contato</TableCell>
                <TableCell align="center">Encontrado</TableCell>
                <TableCell>Primeira vez</TableCell>
                <TableCell>Última vez</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Typography variant="body2">
                      {contact.competitor_domain}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getContactIcon(contact.type)}
                      label={contact.type.toUpperCase()}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatPhoneNumber(contact.value)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={contact.times_found}
                      size="small"
                      color={contact.times_found > 1 ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {format(new Date(contact.first_seen), 'dd/MM/yyyy HH:mm', {
                        locale: ptBR,
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {format(new Date(contact.last_seen), 'dd/MM/yyyy HH:mm', {
                        locale: ptBR,
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title="Copiar">
                        <IconButton
                          size="small"
                          onClick={() => handleCopy(contact.value)}
                        >
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {contact.type === 'whatsapp' && (
                        <Tooltip title="Abrir WhatsApp">
                          <IconButton
                            size="small"
                            onClick={() => openWhatsApp(contact.value)}
                          >
                            <LaunchIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
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