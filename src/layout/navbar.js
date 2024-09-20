import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="fixed" style={{ backgroundColor: '#ffffff', color: '#000000', zIndex: 1201 }}>
      <Toolbar>
        
        <Link to="/" style={{ flexGrow: 1 }}>
          <img 
            src="/images/logo.png" 
            alt="Bytecrafts Logo" 
            style={{ height: '50px' }} 
          />
        </Link>

       <div style={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 0 }}>
          <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
            LOGIN
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
