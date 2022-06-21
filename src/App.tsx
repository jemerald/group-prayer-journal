import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React from 'react';

const theme = createTheme();

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <main>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Home
          </Typography>
        </Container>
      </Box>
    </main>
  </ThemeProvider>
);

export default App;
