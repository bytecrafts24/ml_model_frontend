
import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Button, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LoginModal from './loginModal';

const Navbar = ({ toggleDrawer }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleLoginClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: 1300, backgroundColor: '#ffffff' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" noWrap style={{ color: '#000000' }}>
              Bytecrafts
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexGrow: 0 }}>
            <Button 
              color="inherit" 
              startIcon={<AccountCircle />} 
              style={{ color: '#000000' }}
              onClick={handleLoginClick}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <LoginModal open={modalOpen} handleClose={handleCloseModal} />  
    </>
  );
};

export default Navbar;
