// frontend/src/App.tsx

import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { theme } from './theme';
import { store } from './store';
import { AppLayout } from './components/Layout/AppLayout';
import CompetitorDetails from './pages/Competition/CompetitorDetails';

// Importar páginas (vamos criar em seguida)
import Execution from './pages/Execution';
import Performance from './pages/Performance';
import Competition from './pages/Competition';
import Contacts from './pages/Contacts';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <Router>
            <AppLayout>
                <Routes>
                    <Route path="/" element={<Execution />} />
                    <Route path="/performance" element={<Performance />} />
                    <Route path="/competition" element={<Competition />} />
                    <Route path="/competition/:id" element={<CompetitorDetails />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/analytics" element={<Analytics />} />
                </Routes>
            </AppLayout>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;