import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

export default function Header() {
  return (
    <AppBar
      position="static"
      color="primary"
      sx={{
        mb: 4,
        backgroundImage: 'url(/fondo.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: { xs: 120, sm: 180 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 3,
      }}
    >
      <Toolbar sx={{ background: 'rgba(0,0,0,0.45)', borderRadius: 2, width: '100%', minHeight: { xs: 80, sm: 120 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            flexGrow: 1,
            textAlign: 'center',
            color: '#fff',
            fontWeight: 700,
            textShadow: '0 2px 8px rgba(0,0,0,0.25)',
            fontSize: { xs: '1.3rem', sm: '2.2rem' },
            letterSpacing: 1,
          }}
        >
          Control de Pacientes
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
