// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Rule Engine
        </Typography>
        <Button color="inherit" component={Link} to="/">Rules</Button>
        <Button color="inherit" component={Link} to="/create">Create Rule</Button>
        <Button color="inherit" component={Link} to="/evaluate">Evaluate Rule</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;