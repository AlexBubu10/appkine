import Pacientes from './Pacientes';
import Footer from './Footer';
import Header from './Header';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' }, // azul profesional
    secondary: { main: '#00bfae' }, // verde agua moderno
    background: { default: '#f4f6f8' }, // fondo suave
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: theme.palette.background.default, width: '100vw' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%' }}>
          <Pacientes />
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
