import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ mt: 6, py: 2, bgcolor: '#222', color: '#fff', textAlign: 'center' }}>
      <Typography variant="body2">
        Desarrollado por <b>ZonaTech</b> &copy; Todos los derechos reservados | Tel: 3515168272
      </Typography>
    </Box>
  );
}
