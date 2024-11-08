// frontend/src/pages/Contacts/index.tsx

import React from 'react';
import { Container } from '@mui/material';
import { ContactStats } from '../../components/Contacts/ContactStats';
import { ContactsTable } from '../../components/Contacts/ContactsTable';

const Contacts: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <ContactStats />
      <Box sx={{ mt: 3 }}>
        <ContactsTable />
      </Box>
    </Container>
  );
};

export default Contacts;