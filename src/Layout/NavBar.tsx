import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React from 'react';
import Profile from '../Auth/Profile';

const NavBar: React.FC = () => (
  <AppBar position="relative">
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Group Prayer Journal
      </Typography>
      <Profile />
    </Toolbar>
  </AppBar>
);

export default NavBar;
