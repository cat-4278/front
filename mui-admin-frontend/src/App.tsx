import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { TabProvider } from '@/contexts/TabContext';
import Login from '@/pages/Login';
import MainLayout from '@/components/MainLayout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Noto Sans KR',
      '-apple-system',
      'sans-serif',
    ].join(','),
  },
});

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <TabProvider>
      <MainLayout />
    </TabProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
