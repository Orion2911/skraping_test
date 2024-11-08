// frontend/src/pages/Execution/index.tsx

import React from 'react';
import { Container } from '@mui/material';
import { ExecutionControls } from '../../components/Execution/ExecutionControls';
import { ExecutionStats } from '../../components/Execution/ExecutionStats';
import { KeywordManager } from '../../components/Execution/KeywordManager';
import { ExecutionLog } from '../../components/Execution/ExecutionLog';

const Execution: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <ExecutionControls />
      <ExecutionStats />
      <KeywordManager />
      <ExecutionLog />
    </Container>
  );
};

export default Execution;